import { createFileRoute } from '@tanstack/react-router'

const CANONICAL_ORIGIN = 'https://mrsemlimitesext.lovable.app'

async function jj(url: string, init?: RequestInit) {
  const r = await fetch(url, init)
  const text = await r.text()
  let d: any = {}
  try { d = text ? JSON.parse(text) : {} } catch { d = { raw: text } }
  if (!r.ok) throw new Error(d?.error?.message || d?.error_message || d?.error || `HTTP ${r.status}: ${text.slice(0,200)}`)
  return d
}

// Instagram Business Login (novo fluxo) — callback
export const Route = createFileRoute('/api/public/instagram-oauth-callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const APP_ID = process.env.INSTAGRAM_APP_ID_NEW || process.env.INSTAGRAM_APP_ID
        const APP_SECRET = process.env.INSTAGRAM_APP_SECRET_NEW || process.env.INSTAGRAM_APP_SECRET
        const url = new URL(request.url)
        const code = url.searchParams.get('code')
        const errorParam = url.searchParams.get('error_description') || url.searchParams.get('error')
        const redirectUri = `${CANONICAL_ORIGIN}/api/public/instagram-oauth-callback`

        const html = (payload: any, err?: string) => `<!doctype html>
<html><head><meta charset="utf-8"><title>Instagram — MR Sem Limites</title>
<style>body{font-family:system-ui;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:20px}
.box{max-width:460px}.ok{color:#7CFFB2}.err{color:#ff6b6b;white-space:pre-wrap;text-align:left;background:rgba(255,0,0,.08);padding:10px;border-radius:8px}
h1{background:linear-gradient(135deg,#f58529,#dd2a7b,#8134af);-webkit-background-clip:text;color:transparent;margin:0 0 12px}
.acc{margin:14px 0;padding:12px;background:rgba(255,255,255,.05);border-radius:10px}</style></head>
<body><div class="box">
<h1>${err ? '❌ Falha' : '✅ Conectado!'}</h1>
${err ? `<div class="err">${err}</div>` : `<div class="acc"><strong>@${payload?.username||'—'}</strong><br><small style="opacity:.7">IG User ID: ${payload?.ig_user_id||'—'}</small></div><p class="ok">Conta vinculada. Pode fechar esta janela.</p>`}
<script>
  try {
    const msg = ${err ? `{ type: 'MRSL_IG_ERROR', error: ${JSON.stringify(err)} }` : `{ type: 'MRSL_IG_CONNECTED', account: ${JSON.stringify(payload || {})} }`};
    if (window.opener) window.opener.postMessage(msg, '*');
  } catch(e){}
  setTimeout(()=>{ try{window.close()}catch(_){} }, 2000);
</script>
</div></body></html>`

        if (errorParam || !code) {
          return new Response(html(null, errorParam || 'Sem código de autorização'), {
            status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' },
          })
        }
        if (!APP_ID || !APP_SECRET) {
          return new Response(html(null, 'INSTAGRAM_APP_ID_NEW/SECRET não configurados'), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          })
        }

        try {
          // 1) trocar code por short-lived token (Instagram Business Login usa api.instagram.com)
          const form = new URLSearchParams()
          form.set('client_id', APP_ID)
          form.set('client_secret', APP_SECRET)
          form.set('grant_type', 'authorization_code')
          form.set('redirect_uri', redirectUri)
          form.set('code', code)
          const t1 = await jj('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: form.toString(),
          })
          const shortToken = t1.access_token as string
          const igUserId = String(t1.user_id || t1.data?.[0]?.user_id || '')

          // 2) trocar por long-lived (60 dias)
          const t2 = await jj(
            `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=${shortToken}`,
          )
          const longToken = t2.access_token as string

          // 3) buscar dados do usuário
          const me = await jj(
            `https://graph.instagram.com/v20.0/me?fields=user_id,username,account_type,name&access_token=${longToken}`,
          )

          const account = {
            access_token: longToken,
            ig_user_id: me.user_id || igUserId,
            username: me.username,
            account_type: me.account_type,
            name: me.name,
            expires_in: t2.expires_in || 5184000,
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
