import { createFileRoute } from '@tanstack/react-router'

// Lovable Security PRO — versão mínima autorizada por extensão.
// A extensão consulta esta rota; se sua versão local for menor que
// minVersion, apenas as funções PROTEGIDAS são desativadas.
// A UI/fluxo do usuário continua funcionando normalmente.

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}

const AUTHORIZED: Record<string, { minVersion: string; latestVersion: string }> = {
  ext1: { minVersion: '1.0.0', latestVersion: '1.0.0' },
  ext2: { minVersion: '2.0.0', latestVersion: '2.0.0' },
  ext3: { minVersion: '3.2.5', latestVersion: '3.2.6' },
  ext4: { minVersion: '4.0.0', latestVersion: '4.0.0' },
  ext6: { minVersion: '6.0.0', latestVersion: '6.1.0' },
  ext7: { minVersion: '7.2.5', latestVersion: '7.2.8' },
}

export const Route = createFileRoute('/api/public/security-version')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const ext = (url.searchParams.get('ext') || '').toLowerCase()
        const entry = AUTHORIZED[ext] || { minVersion: '0.0.0', latestVersion: '0.0.0' }
        return new Response(
          JSON.stringify({ ok: true, ext, ...entry, serverTime: Date.now() }),
          { status: 200, headers: cors },
        )
      },
    },
  },
})
