import { createFileRoute } from '@tanstack/react-router'
import { putMedia } from './instagram-media'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

// Gera imagem + legenda viral (título, corpo e hashtags) a partir de um prompt em PT-BR.
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
        const prompt = (body?.prompt || body?.theme || '').toString().trim()
        const type = (body?.type || 'post').toString() // post | reel | carousel
        const wantMedia = body?.media !== false
        if (!prompt) {
          return new Response(JSON.stringify({ error: 'Informe o prompt' }), { status: 400, headers: cors })
        }

        const origin = new URL(request.url).origin

        try {
          // 1) Copy viral (título + legenda + hashtags) em JSON
          const capRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                { role: 'system', content: 'Você é copywriter viral de Instagram brasileiro. Responda APENAS em JSON válido: {"title":"...","caption":"...","hashtags":["#..","#.."],"video_script":"..."}. Título curto (máx 60 chars) com gancho. Legenda 4–8 linhas com storytelling e CTA. 15–20 hashtags relevantes em PT-BR sem repetição. Se for Reel, preencha video_script com 4 cenas curtas numeradas, movimento de câmera e texto na tela; se não for Reel, pode deixar vazio.' },
                { role: 'user', content: `Prompt: ${prompt}\nTipo: ${type === 'reel' ? 'Reel de vídeo' : type === 'carousel' ? 'Carrossel de imagens' : 'Post de imagem'}` },
              ],
              temperature: 0.85,
              response_format: { type: 'json_object' },
            }),
          })
          const capData: any = await capRes.json().catch(() => ({}))
          if (!capRes.ok) {
            const msg = capData?.error?.message || capData?.error || `HTTP ${capRes.status}`
            return new Response(JSON.stringify({ error: `Falha ao gerar legenda: ${msg}` }), { status: capRes.status, headers: cors })
          }
          const raw = capData?.choices?.[0]?.message?.content?.trim() || '{}'
          let parsed: any = {}
          try { parsed = JSON.parse(raw) } catch { parsed = { caption: raw } }
          const title = (parsed.title || '').toString().trim()
          const captionBody = (parsed.caption || '').toString().trim()
          const hashtags = Array.isArray(parsed.hashtags) ? parsed.hashtags.join(' ') : ''
          const caption = [title, captionBody, hashtags].filter(Boolean).join('\n\n').trim()
          const videoScript = (parsed.video_script || '').toString().trim()

          let mediaUrl = ''
          if (wantMedia) {
            // 2) Imagem/capa via Gateway de imagens (Nano Banana 2)
            const imgPrompt = `Instagram ${type === 'reel' ? 'vertical 9:16 cover frame for an animated Reel preview' : 'square 1:1'} image. ${prompt}. Ultra realistic, cinematic lighting, vibrant colors, professional composition, high engagement social media aesthetic.`
            const imgRes = await fetch('https://ai.gateway.lovable.dev/v1/images/generations', {
              method: 'POST',
              headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'google/gemini-3.1-flash-image',
                messages: [{ role: 'user', content: imgPrompt }],
                modalities: ['image', 'text'],
              }),
            })
            const imgData: any = await imgRes.json().catch(() => ({}))
            if (!imgRes.ok) {
              const msg = imgData?.error?.message || imgData?.error || `HTTP ${imgRes.status}`
              return new Response(JSON.stringify({ error: `Falha ao gerar imagem: ${msg}` }), { status: imgRes.status, headers: cors })
            }
            const b64 = imgData?.data?.[0]?.b64_json
              || imgData?.choices?.[0]?.message?.images?.[0]?.image_url?.url?.replace(/^data:[^;]+;base64,/, '')
            if (!b64) {
              return new Response(JSON.stringify({ error: 'A IA não retornou uma imagem. Tente um prompt mais direto (evite marcas ou pessoas reais).' }), { status: 502, headers: cors })
            }
            try {
              mediaUrl = await putMedia(`data:image/png;base64,${b64}`, `ig-${type}-${Date.now()}.png`)
            } catch (e: any) {
              return new Response(JSON.stringify({ error: `Falha ao publicar prévia: ${e?.message || e}` }), { status: 500, headers: cors })
            }
          }

          return new Response(JSON.stringify({ title, caption, media_url: mediaUrl, media_b64: media ? (imgB64 || null) : null, prompt, type, video_script: videoScript }), { status: 200, headers: cors })
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || 'Erro' }), { status: 500, headers: cors })
        }
      },
    },
  },
})
