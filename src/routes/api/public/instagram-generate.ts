import { createFileRoute } from '@tanstack/react-router'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

// Gera mídia (imagem) + legenda viral para o Instagram, a partir de um tema em PT-BR.
export const Route = createFileRoute('/api/public/instagram-generate')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        const KEY = process.env.LOVABLE_API_KEY
        if (!KEY) {
          return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY não configurada' }), { status: 500, headers: cors })
        }
        let body: any = {}
        try { body = await request.json() } catch {}
        const theme = (body?.theme || '').toString().trim()
        const type = (body?.type || 'post').toString()
        const wantMedia = body?.media !== false
        if (!theme) {
          return new Response(JSON.stringify({ error: 'Informe o tema' }), { status: 400, headers: cors })
        }

        try {
          // 1) Legenda viral em PT-BR via Gemini Flash Lite (rápido)
          const capRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                { role: 'system', content: 'Você é um copywriter viral de Instagram brasileiro. Escreva legendas curtas (máx 8 linhas), com gancho forte na 1ª linha, storytelling, CTA e 15-20 hashtags relevantes no final. Sempre em PT-BR.' },
                { role: 'user', content: `Tema: ${theme}\nTipo: ${type === 'reel' ? 'Reel de vídeo' : type === 'carousel' ? 'Carrossel de imagens' : 'Post de imagem'}\n\nGere APENAS a legenda pronta para publicar (sem explicações, sem "aqui está", direto ao ponto).` },
              ],
              temperature: 0.9,
            }),
          })
          const capData: any = await capRes.json().catch(() => ({}))
          if (!capRes.ok) {
            const msg = capData?.error?.message || capData?.error || `HTTP ${capRes.status}`
            return new Response(JSON.stringify({ error: `Falha ao gerar legenda: ${msg}` }), { status: capRes.status, headers: cors })
          }
          const caption = capData?.choices?.[0]?.message?.content?.trim() || ''

          let mediaUrl = ''
          if (wantMedia) {
            // 2) Imagem via Gemini 2.5 Flash Image (Nano Banana) — retorna base64
            const imgPrompt = `Instagram-ready ${type === 'reel' ? 'vertical 9:16' : 'square 1:1'} photo. ${theme}. Ultra realistic, cinematic lighting, vibrant colors, professional composition, high engagement social media aesthetic.`
            const imgRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
              method: 'POST',
              headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'google/gemini-2.5-flash-image',
                messages: [{ role: 'user', content: imgPrompt }],
                modalities: ['image', 'text'],
              }),
            })
            const imgData: any = await imgRes.json().catch(() => ({}))
            if (imgRes.ok) {
              const b64 = imgData?.choices?.[0]?.message?.images?.[0]?.image_url?.url
                || imgData?.choices?.[0]?.message?.content?.match?.(/data:image[^\s"')]+/)?.[0]
              if (b64) mediaUrl = b64
            }
          }

          return new Response(JSON.stringify({ caption, media_url: mediaUrl, theme, type }), { status: 200, headers: cors })
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || 'Erro' }), { status: 500, headers: cors })
        }
      },
    },
  },
})
