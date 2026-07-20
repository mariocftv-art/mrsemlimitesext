import { createFileRoute } from '@tanstack/react-router'

async function j(url: string, init?: RequestInit) {
  const r = await fetch(url, init)
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error((d as any)?.error?.message || `HTTP ${r.status}`)
  return d as any
}
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

export const Route = createFileRoute('/api/public/instagram-publish')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            access_token: string
            ig_user_id: string
            type: 'post' | 'reel' | 'carousel'
            media_url: string
            caption?: string
          }
          const { access_token, ig_user_id, type, media_url, caption = '' } = body
          if (!access_token || !ig_user_id || !media_url) {
            return new Response(JSON.stringify({ error: 'Parâmetros incompletos' }), { status: 400, headers: cors })
          }
          const base = `https://graph.facebook.com/v20.0/${ig_user_id}`
          let containerId: string

          if (type === 'reel') {
            const c = await j(
              `${base}/media?media_type=REELS&video_url=${encodeURIComponent(media_url)}&caption=${encodeURIComponent(caption)}&access_token=${access_token}`,
              { method: 'POST' },
            )
            containerId = c.id
          } else if (type === 'carousel') {
            // media_url = URLs separadas por vírgula
            const urls = media_url.split(',').map((u) => u.trim()).filter(Boolean)
            const children: string[] = []
            for (const u of urls) {
              const child = await j(
                `${base}/media?image_url=${encodeURIComponent(u)}&is_carousel_item=true&access_token=${access_token}`,
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
              `${base}/media?image_url=${encodeURIComponent(media_url)}&caption=${encodeURIComponent(caption)}&access_token=${access_token}`,
              { method: 'POST' },
            )
            containerId = c.id
          }

          // Aguardar processamento (reels/carrossel podem demorar)
          for (let i = 0; i < 10; i++) {
            const st = await j(`https://graph.facebook.com/v20.0/${containerId}?fields=status_code&access_token=${access_token}`)
            if (st.status_code === 'FINISHED') break
            if (st.status_code === 'ERROR') throw new Error('Falha ao processar mídia')
            await new Promise((r) => setTimeout(r, 2000))
          }

          const pub = await j(
            `${base}/media_publish?creation_id=${containerId}&access_token=${access_token}`,
            { method: 'POST' },
          )
          return new Response(JSON.stringify({ id: pub.id }), { status: 200, headers: cors })
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || 'Erro' }), { status: 500, headers: cors })
        }
      },
    },
  },
})
