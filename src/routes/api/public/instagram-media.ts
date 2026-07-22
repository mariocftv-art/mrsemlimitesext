import { createFileRoute } from '@tanstack/react-router'

// Faz upload da mídia (data URL base64) para um host público persistente (catbox.moe)
// e retorna a URL pública direta. A API do Instagram exige URL HTTPS pública acessível
// externamente — armazenar em memória do Worker não funciona porque o pedido da Meta
// pode cair em outro isolate. catbox.moe é anônimo, sem chave e persiste os arquivos.
export async function putMedia(dataUrl: string, filenameHint?: string): Promise<string> {
  // Aceita "data:<mime>[;param=...];base64,<b64>" — MediaRecorder gera mimes tipo
  // "video/mp4;codecs=avc1.42E01E" que quebravam o regex antigo ([^;]+).
  const m = /^data:([^,]+);base64,(.+)$/.exec(dataUrl)
  if (!m) throw new Error('data URL inválida')
  const fullMime = m[1]
  const mime = fullMime.split(';')[0].trim().toLowerCase()
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

  const blob = new Blob([bytes as BlobPart], { type: mime })


  // Tenta múltiplos hosts públicos até um funcionar.
  const errors: string[] = []

  // 1) tmpfiles.org — JSON, sem chave, persistente
  try {
    const fd = new FormData()
    fd.append('file', blob, filename)
    const r = await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: fd })
    const j: any = await r.json().catch(() => ({}))
    const url: string | undefined = j?.data?.url
    if (r.ok && url) {
      // converte /dl/ para download direto
      return url.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
    }
    errors.push(`tmpfiles: ${r.status} ${JSON.stringify(j).slice(0,200)}`)
  } catch (e: any) { errors.push(`tmpfiles: ${e?.message || e}`) }

  // 2) 0x0.st — retorna URL em texto
  try {
    const fd = new FormData()
    fd.append('file', blob, filename)
    const r = await fetch('https://0x0.st', { method: 'POST', body: fd, headers: { 'User-Agent': 'MR-Sem-Limites/1.0' } })
    const text = (await r.text()).trim()
    if (r.ok && /^https?:\/\//i.test(text)) return text
    errors.push(`0x0: ${r.status} ${text.slice(0,200)}`)
  } catch (e: any) { errors.push(`0x0: ${e?.message || e}`) }

  // 3) catbox.moe — fallback final
  try {
    const fd = new FormData()
    fd.append('reqtype', 'fileupload')
    fd.append('fileToUpload', blob, filename)
    const r = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: fd })
    const text = (await r.text()).trim()
    if (r.ok && /^https?:\/\//i.test(text)) return text
    errors.push(`catbox: ${r.status} ${text.slice(0,200)}`)
  } catch (e: any) { errors.push(`catbox: ${e?.message || e}`) }

  throw new Error(`Todos os hosts falharam. ${errors.join(' | ')}`)

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
