import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/public/instagram-webhook')({
  server: {
    handlers: {
      // Meta envia GET com hub.mode/hub.verify_token/hub.challenge no handshake
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const mode = url.searchParams.get('hub.mode')
        const token = url.searchParams.get('hub.verify_token')
        const challenge = url.searchParams.get('hub.challenge')

        const expected = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN

        if (mode === 'subscribe' && token && token === expected && challenge) {
          return new Response(challenge, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
          })
        }
        return new Response('Forbidden', { status: 403 })
      },

      // Meta envia POST com os eventos (comentários, mensagens, etc.)
      POST: async ({ request }) => {
        try {
          const body = await request.text()
          console.log('[instagram-webhook] event:', body)
          // TODO: processar eventos conforme necessidade
          return new Response('EVENT_RECEIVED', { status: 200 })
        } catch (e) {
          return new Response('Bad Request', { status: 400 })
        }
      },
    },
  },
})
