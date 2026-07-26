import { createFileRoute } from '@tanstack/react-router'

// Lovable Security PRO — coleta de eventos de segurança (best-effort).
// Não persiste em DB nesta fase; envia para o log do servidor para
// futura ingestão. Falha silenciosamente para nunca quebrar a extensão.

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-MR-Ext',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}

type Event = {
  type: string
  extCode?: string
  version?: string
  detail?: unknown
  ts?: number
}

export const Route = createFileRoute('/api/public/security-logs')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { events?: Event[] }
          const events = Array.isArray(body?.events) ? body.events.slice(0, 50) : []
          if (events.length) {
            console.log(
              '[security-logs]',
              events
                .map((e) => `${e.extCode || '-'}/${e.type}${e.detail ? ' ' + JSON.stringify(e.detail).slice(0, 200) : ''}`)
                .join(' | '),
            )
          }
        } catch {
          // ignora — best-effort
        }
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors })
      },
    },
  },
})
