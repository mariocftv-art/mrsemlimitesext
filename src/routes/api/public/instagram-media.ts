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

  // Instagram é bem mais confiável com JPEG em posts/feed. A IA costuma retornar PNG;
  // convertemos no servidor antes de hospedar para evitar "The image format is not supported".
  let uploadBytes: Uint8Array = bytes
  let uploadMime = mime
  let ext = mime.includes('mp4') ? 'mp4'
    : mime.includes('webm') ? 'webm'
    : mime.includes('mov') || mime.includes('quicktime') ? 'mov'
    : mime.includes('gif') ? 'gif'
    : mime.includes('png') ? 'png'
    : 'jpg'

  if (mime.includes('png')) {
    try {
      const { PNG } = await import('pngjs')
      const jpeg = await import('jpeg-js')
      const png = PNG.sync.read(Buffer.from(bytes))
      const rgba = new Uint8Array(png.width * png.height * 4)
      for (let i = 0; i < png.width * png.height; i++) {
        const a = png.data[i * 4 + 3] / 255
        rgba[i * 4] = Math.round(png.data[i * 4] * a + 255 * (1 - a))
        rgba[i * 4 + 1] = Math.round(png.data[i * 4 + 1] * a + 255 * (1 - a))
        rgba[i * 4 + 2] = Math.round(png.data[i * 4 + 2] * a + 255 * (1 - a))
        rgba[i * 4 + 3] = 255
      }
      const jpg = jpeg.encode({ data: Buffer.from(rgba), width: png.width, height: png.height }, 92)
      uploadBytes = jpg.data
      uploadMime = 'image/jpeg'
      ext = 'jpg'
    } catch (e: any) {
      throw new Error(`Falha ao converter PNG para JPEG: ${e?.message || e}`)
    }
  }

  const filename = (filenameHint || `ig-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`).replace(/\.[^.]+$/, '') + '.' + ext

  const blob = new Blob([uploadBytes as BlobPart], { type: uploadMime })


  // catbox.moe primeiro: retorna URL DIRETA (https://files.catbox.moe/xxx.jpg) que
  // carrega inline no <img>. tmpfiles.org devolve HTML wrapper em /dl/ e às vezes
  // instabilidade 5xx, então cai para fallback.
  const errors: string[] = []

  // 1) catbox.moe — link direto, o mais estável para <img> e Instagram Graph
  try {
    const fd = new FormData()
    fd.append('reqtype', 'fileupload')
    fd.append('fileToUpload', blob, filename)
    const r = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: fd })
    const text = (await r.text()).trim()
    if (r.ok && /^https?:\/\//i.test(text)) return text
    errors.push(`catbox: ${r.status} ${text.slice(0,200)}`)
  } catch (e: any) { errors.push(`catbox: ${e?.message || e}`) }

  // 2) 0x0.st — retorna URL em texto
  try {
    const fd = new FormData()
    fd.append('file', blob, filename)
    const r = await fetch('https://0x0.st', { method: 'POST', body: fd, headers: { 'User-Agent': 'MR-Sem-Limites/1.0' } })
    const text = (await r.text()).trim()
    if (r.ok && /^https?:\/\//i.test(text)) return text
    errors.push(`0x0: ${r.status} ${text.slice(0,200)}`)
  } catch (e: any) { errors.push(`0x0: ${e?.message || e}`) }

  // 3) tmpfiles.org — fallback final (link com wrapper /dl/)
  try {
    const fd = new FormData()
    fd.append('file', blob, filename)
    const r = await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: fd })
    const j: any = await r.json().catch(() => ({}))
    const url: string | undefined = j?.data?.url
    if (r.ok && url) return url.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
    errors.push(`tmpfiles: ${r.status} ${JSON.stringify(j).slice(0,200)}`)
  } catch (e: any) { errors.push(`tmpfiles: ${e?.message || e}`) }

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
