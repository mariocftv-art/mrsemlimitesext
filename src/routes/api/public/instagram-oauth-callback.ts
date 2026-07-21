import { createFileRoute } from '@tanstack/react-router'

const CANONICAL_ORIGIN = 'https://mrsemlimitesext.lovable.app'

async function j(url: string, init?: RequestInit) {
  const r = await fetch(url, init)
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error((d as any)?.error?.message || `HTTP ${r.status}`)
  return d as any
}

export const Route = createFileRoute('/api/public/instagram-oauth-callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const APP_ID = process.env.INSTAGRAM_APP_ID
        const APP_SECRET = process.env.INSTAGRAM_APP_SECRET
        const url = new URL(request.url)
        const code = url.searchParams.get('code')
        const error = url.searchParams.get('error_description') || url.searchParams.get('error')
        const redirectUri = `${CANONICAL_ORIGIN}/api/public/instagram-oauth-callback`

        const html = (payload: any, err?: string) => `<!doctype html>
<html><head><meta charset="utf-8"><title>Instagram — MR Sem Limites</title>
<style>body{font-family:system-ui;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:20px}
.box{max-width:420px}.ok{color:#7CFFB2}.err{color:#ff6b6b}
h1{background:linear-gradient(135deg,#f58529,#dd2a7b,#8134af);-webkit-background-clip:text;color:transparent}</style></head>
<body><div class="box">
<h1>${err ? '❌ Falha' : '✅ Conectado!'}</h1>
<p class="${err ? 'err' : 'ok'}">${err || 'Sua conta Instagram foi vinculada. Você pode fechar esta janela.'}</p>
<script>
  try { window.opener && window.opener.postMessage({ type: 'MRSL_IG_${err ? 'ERROR' : 'CONNECTED'}', ${err ? `error: ${JSON.stringify(err)}` : `account: ${JSON.stringify(payload)}`} }, '*'); } catch(e){}
  setTimeout(()=>{ try{window.close()}catch(_){} }, 1500);
</script>
</div></body></html>`

        if (error || !code) {
          return new Response(html(null, error || 'Sem código de autorização'), {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          })
        }
        if (!APP_ID || !APP_SECRET) {
          return new Response(html(null, 'INSTAGRAM_APP_ID/SECRET não configurados'), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          })
        }

        try {
          // 1) short-lived token
          const t1 = await j(
            `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`,
          )
          // 2) long-lived (60d)
          const t2 = await j(
            `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${t1.access_token}`,
          )
          const access_token = t2.access_token as string
          // 3) find first page + ig business account
          const pages = await j(`https://graph.facebook.com/v20.0/me/accounts?access_token=${access_token}`)
          const page = pages.data?.[0]
          if (!page) throw new Error('Nenhuma Página do Facebook encontrada nesta conta')
          const pageDetail = await j(
            `https://graph.facebook.com/v20.0/${page.id}?fields=instagram_business_account,name&access_token=${page.access_token}`,
          )
          const igId = pageDetail.instagram_business_account?.id
          if (!igId) throw new Error('Nenhuma conta Instagram Business vinculada à Página')
          const igInfo = await j(
            `https://graph.facebook.com/v20.0/${igId}?fields=username,name&access_token=${page.access_token}`,
          )
          const account = {
            access_token: page.access_token,
            ig_user_id: igId,
            username: igInfo.username,
            page_id: page.id,
            page_name: pageDetail.name,
            connected_at: Date.now(),
          }
          return new Response(html(account), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          })
        } catch (e: any) {
          return new Response(html(null, e?.message || 'Falha no OAuth'), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          })
        }
      },
    },
  },
})
