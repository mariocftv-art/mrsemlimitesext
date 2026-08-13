import { createFileRoute } from '@tanstack/react-router'
import { createHmac, timingSafeEqual } from 'crypto'
import { createLicense } from '@/lib/reseller-api.functions'

export const Route = createFileRoute('/api/public/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get('x-webhook-signature')
        const body = await request.text()

        // Verificação de assinatura (exemplo Kiwify/MercadoPago)
        const secret = process.env['WEBHOOK_SECRET']
        if (secret) {
          const expected = createHmac('sha256', secret)
            .update(body).digest('hex')
          if (!signature || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
            return new Response('Invalid signature', { status: 401 })
          }
        }

        try {
          const payload = JSON.parse(body)
          
          // Lógica simplificada: se o status for aprovado, gera licença via Reseller API
          if (payload.status === 'approved' || payload.status === 'paid') {
            const result = await createLicense({
              data: {
                email: payload.customer?.email || payload.email,
                name: payload.customer?.name || payload.name || 'Cliente Webhook',
                duration_days: 30,
                type: 'premium'
              }
            })
            
            console.log('Licença gerada via webhook:', result)
            return new Response(JSON.stringify({ success: true, license: result.license }), {
              headers: { 'Content-Type': 'application/json' }
            })
          }

          return new Response('Status ignored')
        } catch (err: any) {
          return new Response(err.message, { status: 500 })
        }
      }
    }
  }
})
