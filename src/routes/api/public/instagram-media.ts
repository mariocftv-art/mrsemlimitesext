import { createFileRoute } from '@tanstack/react-router'

// Armazenamento em memória (por isolate) — suficiente para publicar logo após gerar.
const STORE = new Map<string, { data: Uint8Array; mime: string; createdAt: number }>()

// Limpa items com mais de 30 minutos
function gc() {
  const now = Date.now()
  for (const [k, v] of STORE) if (now - v.createdAt > 30 * 60 * 1000) STORE.delete(k)
}

export function putMedia(dataUrl: string): string {
  gc()
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl)
  if (!m) throw new Error('data URL inválida')
  const mime = m[1]
  const bin = atob(m[2])
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  const id = crypto.randomUUID().replace(/-/g, '')
  STORE.set(id, { data: bytes, mime, createdAt: Date.now() })
  return id
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export const Route = createFileRoute('/api/public/instagram-media')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const id = url.searchParams.get('id') || ''
        const item = STORE.get(id)
        if (!item) return new Response('Not found', { status: 404, headers: cors })
        return new Response(item.data as BodyInit, {
          status: 200,
          headers: {
            ...cors,
            'Content-Type': item.mime,
            'Cache-Control': 'public, max-age=1800',
          },
        })
      },
    },
  },
})
