import { createFileRoute } from '@tanstack/react-router'
import { createHmac, timingSafeEqual } from 'node:crypto'

// Lovable Security PRO — validação de licença server-side.
// Camada aditiva: se o backend não puder validar, retorna { ok: true, mode: 'passthrough' }
// para não quebrar as extensões existentes. Isso NÃO afeta a UI atual.

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-MR-Signature, X-MR-Ts, X-MR-Ext',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}

function sign(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('hex')
}

function verify(sig: string, expected: string): boolean {
  const a = Buffer.from(sig || '', 'hex')
  const b = Buffer.from(expected, 'hex')
  if (a.length !== b.length || a.length === 0) return false
  return timingSafeEqual(a, b)
}

type Body = {
  licenseKey?: string
  hwid?: string
  extCode?: string
  version?: string
  nonce?: string
}

export const Route = createFileRoute('/api/public/security-validate-license')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        const secret = process.env.SECURITY_SIGNING_SECRET || ''
        const raw = await request.text()
        let body: Body = {}
        try { body = JSON.parse(raw) } catch { /* passthrough */ }

        const sig = request.headers.get('x-mr-signature') || ''
        const ts = request.headers.get('x-mr-ts') || ''
        const ext = request.headers.get('x-mr-ext') || body.extCode || ''

        // Assinatura opcional (não bloqueia se ausente — modo aditivo)
        const signatureOk =
          !sig || (secret && verify(sig, sign(`${ts}.${raw}`, secret)))

        const now = Date.now()
        const responseBody = {
          ok: true,
          mode: 'passthrough' as const,
          extCode: ext,
          signatureOk: !!signatureOk,
          serverTime: now,
          // Placeholder — quando houver tabela de licenças ativa,
          // esta rota consultará e devolverá plano/expiração reais.
          license: {
            valid: true,
            plan: 'standard',
            source: 'mr-sem-limites-backend',
          },
        }

        const responseText = JSON.stringify(responseBody)
        const responseSig = secret ? sign(responseText, secret) : ''

        return new Response(responseText, {
          status: 200,
          headers: {
            ...cors,
            'X-MR-Response-Sig': responseSig,
            'X-MR-Server-Time': String(now),
          },
        })
      },
    },
  },
})
