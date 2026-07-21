import { createFileRoute } from '@tanstack/react-router'

const CANONICAL_ORIGIN = 'https://mrsemlimitesext.lovable.app'

export const Route = createFileRoute('/api/public/instagram-oauth-start')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const APP_ID = process.env.INSTAGRAM_APP_ID
        if (!APP_ID) {
          return new Response(
            '<h2>Instagram não configurado</h2><p>Adicione INSTAGRAM_APP_ID e INSTAGRAM_APP_SECRET nas Secrets do Lovable Cloud.</p>',
            { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
          )
        }
        const url = new URL(request.url)
        const extReturn = url.searchParams.get('ext_return') || ''
        const redirectUri = `${CANONICAL_ORIGIN}/api/public/instagram-oauth-callback`
        const state = Buffer.from(JSON.stringify({ ext_return: extReturn })).toString('base64url')
        const scope = [
          'instagram_basic',
          'instagram_content_publish',
          'pages_show_list',
          'pages_read_engagement',
          'business_management',
        ].join(',')
        const authUrl =
          `https://www.facebook.com/v20.0/dialog/oauth` +
          `?client_id=${APP_ID}` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&state=${state}` +
          `&scope=${encodeURIComponent(scope)}` +
          `&response_type=code`
        return new Response(null, { status: 302, headers: { Location: authUrl } })
      },
    },
  },
})
