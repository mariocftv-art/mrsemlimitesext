import { createFileRoute } from '@tanstack/react-router'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}
const API = 'https://graph.instagram.com/v20.0'

export const Route = createFileRoute('/api/public/instagram-status')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async () => {
        const token = process.env.INSTAGRAM_ACCESS_TOKEN
        if (!token) {
          return new Response(JSON.stringify({ connected: false, error: 'Token não configurado no servidor' }), { status: 200, headers: cors })
        }
        try {
          const r = await fetch(`${API}/me?fields=id,username,account_type&access_token=${token}`)
          const d = await r.json()
          if (!r.ok) {
            return new Response(JSON.stringify({ connected: false, error: (d as any)?.error?.message || `HTTP ${r.status}` }), { status: 200, headers: cors })
          }
          return new Response(JSON.stringify({ connected: true, ...d }), { status: 200, headers: cors })
        } catch (e: any) {
          return new Response(JSON.stringify({ connected: false, error: e?.message || 'Erro' }), { status: 200, headers: cors })
        }
      },
    },
  },
})
