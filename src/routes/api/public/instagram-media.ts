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
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const Route = createFileRoute('/api/public/instagram-media')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: any = {}
        try { body = await request.json() } catch {}
        const dataUrl = (body?.data_url || body?.dataUrl || '').toString()
        if (!dataUrl) return new Response(JSON.stringify({ error: 'data_url obrigatório' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
        try {
          const id = putMedia(dataUrl)
          const origin = new URL(request.url).origin
          return new Response(JSON.stringify({ id, media_url: `${origin}/api/public/instagram-media?id=${id}` }), { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } })
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || 'Falha ao salvar mídia' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
        }
      },
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
      HEAD: async ({ request }) => {
        const url = new URL(request.url)
        const id = url.searchParams.get('id') || ''
        const item = STORE.get(id)
        if (!item) return new Response(null, { status: 404, headers: cors })
        return new Response(null, {
          status: 200,
          headers: {
            ...cors,
            'Content-Type': item.mime,
            'Cache-Control': 'public, max-age=1800',
            'Content-Length': String(item.data.byteLength),
          },
        })
      },
    },
  },
})
