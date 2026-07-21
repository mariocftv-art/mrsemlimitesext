import { createFileRoute } from '@tanstack/react-router'

// Faz upload da mídia (data URL base64) para um host público persistente (catbox.moe)
// e retorna a URL pública direta. A API do Instagram exige URL HTTPS pública acessível
// externamente — armazenar em memória do Worker não funciona porque o pedido da Meta
// pode cair em outro isolate. catbox.moe é anônimo, sem chave e persiste os arquivos.
export async function putMedia(dataUrl: string, filenameHint?: string): Promise<string> {
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl)
  if (!m) throw new Error('data URL inválida')
  const mime = m[1]
  const b64 = m[2]

  // Decodifica base64 -> bytes
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)

  // Extensão inferida do MIME
  const ext = mime.includes('mp4') ? 'mp4'
    : mime.includes('webm') ? 'webm'
    : mime.includes('mov') || mime.includes('quicktime') ? 'mov'
    : mime.includes('png') ? 'png'
    : mime.includes('gif') ? 'gif'
    : 'jpg'
  const filename = (filenameHint || `ig-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`).replace(/\.[^.]+$/, '') + '.' + ext

  const fd = new FormData()
  fd.append('reqtype', 'fileupload')
  fd.append('fileToUpload', new Blob([bytes as BlobPart], { type: mime }), filename)

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: fd,
  })
  const text = (await res.text()).trim()
  if (!res.ok || !/^https?:\/\//i.test(text)) {
    throw new Error(`Upload público falhou: ${text || res.status}`)
  }
  return text
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
        const filename = (body?.filename || '').toString() || undefined
        if (!dataUrl) {
          return new Response(JSON.stringify({ error: 'data_url obrigatório' }), {
            status: 400,
            headers: { ...cors, 'Content-Type': 'application/json' },
          })
        }
        try {
          const publicUrl = await putMedia(dataUrl, filename)
          return new Response(JSON.stringify({ media_url: publicUrl }), {
            status: 200,
            headers: { ...cors, 'Content-Type': 'application/json' },
          })
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || 'Falha ao salvar mídia' }), {
            status: 500,
            headers: { ...cors, 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
