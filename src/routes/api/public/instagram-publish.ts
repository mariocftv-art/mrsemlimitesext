import { createFileRoute } from '@tanstack/react-router'

async function j(url: string, init?: RequestInit) {
  const r = await fetch(url, init)
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error((d as any)?.error?.message || (d as any)?.error || `HTTP ${r.status}`)
  return d as any
}
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

// Instagram Login API (tokens IGAA...) usa graph.instagram.com
const API = 'https://graph.instagram.com/v20.0'

export const Route = createFileRoute('/api/public/instagram-publish')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async ({ request }) => {
        // Descobrir ig_user_id a partir do access_token
        const url = new URL(request.url)
        const token = url.searchParams.get('access_token')
        if (!token) return new Response(JSON.stringify({ error: 'access_token requerido' }), { status: 400, headers: cors })
        try {
          const me = await j(`${API}/me?fields=id,username,account_type&access_token=${token}`)
          return new Response(JSON.stringify(me), { status: 200, headers: cors })
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || 'Erro' }), { status: 500, headers: cors })
        }
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            access_token?: string
            use_server_token?: boolean
            ig_user_id?: string
            type: 'post' | 'reel' | 'carousel'
            media_url: string
            caption?: string
          }
          let { access_token, ig_user_id, type, media_url, caption = '' } = body
          if (body.use_server_token && !access_token) {
            access_token = process.env.INSTAGRAM_ACCESS_TOKEN
          }
          if (!access_token || !media_url) {
            return new Response(JSON.stringify({ error: 'Parâmetros incompletos', media_url }), { status: 400, headers: cors })
          }
          // Preflight: garante que a URL é pública, HTTPS e acessível
          if (!/^https:\/\//i.test(media_url)) {
            return new Response(JSON.stringify({ error: `URL da mídia não é HTTPS pública. Recebi: ${media_url || '(vazia)'}`, media_url }), { status: 400, headers: cors })
          }
          try {
            const head = await fetch(media_url, { method: 'GET', headers: { Range: 'bytes=0-1' } })
            if (!head.ok) throw new Error(`HTTP ${head.status}`)
          } catch (e: any) {
            return new Response(JSON.stringify({ error: `A URL gerada não abriu no servidor da Meta: ${media_url} (${e?.message || 'sem resposta'}). Gere a mídia novamente.`, media_url }), { status: 400, headers: cors })
          }
          if (!ig_user_id) {
            const me = await j(`${API}/me?fields=id&access_token=${access_token}`)
            ig_user_id = me.id
          }
          const base = `${API}/${ig_user_id}`
          let containerId: string

          if (type === 'reel') {
            if (!/\.(mp4|mov)(\?|$)/i.test(media_url)) {
              return new Response(JSON.stringify({ error: `Reel precisa ser vídeo MP4/MOV público. URL atual: ${media_url}`, media_url }), { status: 400, headers: cors })
            }

            const c = await j(
              `${base}/media?media_type=REELS&video_url=${encodeURIComponent(media_url)}&caption=${encodeURIComponent(caption)}&access_token=${access_token}`,
              { method: 'POST' },
            )
            containerId = c.id
          } else if (type === 'carousel') {
            const urls = media_url.split(',').map((u) => u.trim()).filter(Boolean)
            const children: string[] = []
            for (const u of urls) {
              const child = await j(
                `${base}/media?media_type=IMAGE&image_url=${encodeURIComponent(u)}&is_carousel_item=true&access_token=${access_token}`,
                { method: 'POST' },
              )
              children.push(child.id)
            }
            const c = await j(
              `${base}/media?media_type=CAROUSEL&children=${children.join(',')}&caption=${encodeURIComponent(caption)}&access_token=${access_token}`,
              { method: 'POST' },
            )
            containerId = c.id
          } else {
            const c = await j(
              `${base}/media?media_type=IMAGE&image_url=${encodeURIComponent(media_url)}&caption=${encodeURIComponent(caption)}&access_token=${access_token}`,
              { method: 'POST' },
            )
            containerId = c.id
          }

          // Aguardar processamento (reels podem demorar)
          for (let i = 0; i < 20; i++) {
            const st = await j(`${API}/${containerId}?fields=status_code&access_token=${access_token}`)
            if (st.status_code === 'FINISHED') break
            if (st.status_code === 'ERROR') throw new Error(`A Meta rejeitou a mídia. Isso NÃO tem relação com a análise/aprovação do app — em modo de teste o publish funciona pra contas de teste normalmente. O motivo real é o LINK público (${media_url}): a Meta baixa a mídia dos servidores dela e a URL precisa (1) abrir DIRETO no navegador anônimo sem redirecionar pra HTML, (2) ser HTTPS, (3) MP4 H.264 + AAC pra Reel, JPEG pra Post, (4) menos de 100MB e menor que 90s pra Reel. Tente clicar em "Regerar" — o app troca de host (catbox → 0x0 → tmpfiles) automaticamente.`)
            await new Promise((r) => setTimeout(r, 2000))
          }

          const pub = await j(
            `${base}/media_publish?creation_id=${containerId}&access_token=${access_token}`,
            { method: 'POST' },
          )
          return new Response(JSON.stringify({ id: pub.id, ig_user_id, media_url }), { status: 200, headers: cors })
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || 'Erro' }), { status: 500, headers: cors })
        }
      },
    },
  },
})

