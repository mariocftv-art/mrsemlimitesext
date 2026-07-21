import { createFileRoute } from '@tanstack/react-router'

const CANONICAL_ORIGIN = 'https://mrsemlimitesext.lovable.app'

// Instagram Business Login (novo fluxo, direto no IG — não passa pelo Facebook)
export const Route = createFileRoute('/api/public/instagram-oauth-start')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const APP_ID = process.env.INSTAGRAM_APP_ID_NEW || process.env.INSTAGRAM_APP_ID
        if (!APP_ID) {
          return new Response(
            '<h2>Instagram não configurado</h2><p>Faltam as secrets INSTAGRAM_APP_ID_NEW e INSTAGRAM_APP_SECRET_NEW.</p>',
            { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
          )
        }
        const url = new URL(request.url)
        const extReturn = url.searchParams.get('ext_return') || ''
        const extId = url.searchParams.get('ext_id') || ''
        const redirectUri = `${CANONICAL_ORIGIN}/api/public/instagram-oauth-callback`
        const state = Buffer.from(JSON.stringify({ ext_return: extReturn, ext_id: extId })).toString('base64url')
        // Instagram Business Login scopes (novos, começam com instagram_business_*)
        const scope = [
          'instagram_business_basic',
          'instagram_business_content_publish',
          'instagram_business_manage_comments',
          'instagram_business_manage_messages',
        ].join(',')
        const authUrl =
          `https://www.instagram.com/oauth/authorize` +
          `?enable_fb_login=0&force_authentication=1` +
          `&client_id=${APP_ID}` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&response_type=code` +
          `&scope=${encodeURIComponent(scope)}` +
          `&state=${state}`
        return new Response(null, { status: 302, headers: { Location: authUrl } })
      },
    },
  },
})
