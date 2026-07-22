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
        const duration = Math.max(20, Math.min(90, Number(body?.duration || 20) || 20))
        const aiMode = (body?.ai_mode || body?.aiMode || '').toString().trim()
        const soundtrack = (body?.soundtrack || '').toString().trim()
        const voiceMode = (body?.voice_mode || body?.voiceMode || 'male').toString().trim()
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
                { role: 'system', content: 'Você é consultor premium de Instagram brasileiro, diretor de vídeo e copywriter viral. Responda APENAS em JSON válido: {"title":"...","caption":"...","hashtags":["#.."],"video_script":"...","voiceover":"...","soundtrack_suggestion":"..."}. REGRAS OBRIGATÓRIAS da legenda: (1) comece com emoji forte + gancho em CAIXA ALTA parcial. (2) use MUITOS emojis coloridos, mínimo 1 por linha — 🔥✨💎🚀💰🎯👑⚡🏆🎁📲💫🌟❤️‍🔥. (3) blocos curtos separados por linha em branco: gancho → história → prova → oferta → CTA. (4) bullets com ✅ ou ➡️. (5) termine com CTA forte + 👉 + "Link na bio 🔗" ou "Chama no WhatsApp 📲". (6) nunca parágrafo corrido sem emoji. Título curto, máx. 60 caracteres, com 1 emoji. 15–20 hashtags PT-BR sem repetição. Para Reel: video_script deve ter 5 cenas numeradas para no mínimo 20 segundos, com movimento de câmera, ação visual, texto na tela e fala/personagem falando em cada cena; voiceover deve ser uma narração/falas pronta para locução masculina natural em PT-BR, com duração compatível; soundtrack_suggestion deve dizer estilo de música/trilha. Para Post/Carrossel, deixe video_script, voiceover e soundtrack_suggestion vazios.' },
                { role: 'user', content: `Prompt: ${prompt}\nTipo: ${type === 'reel' ? 'Reel de vídeo vertical 9:16' : type === 'carousel' ? 'Carrossel de imagens' : 'Post de imagem'}\nDuração mínima do Reel: ${duration}s\nIA de vídeo/imagem escolhida no painel: ${aiMode || 'padrão premium'}\nTrilha escolhida: ${soundtrack || 'cinematográfica'}\nVoz/fala: ${voiceMode}` },
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
          const voiceover = (parsed.voiceover || '').toString().trim()
          const soundtrackSuggestion = (parsed.soundtrack_suggestion || '').toString().trim()

          let mediaUrl = ''
          let mediaB64 = ''
          if (wantMedia) {
            // 2) Imagem/capa via Gateway de imagens (Nano Banana 2)
            const imgPrompt = `Instagram ${type === 'reel' ? `vertical 9:16 first frame for a ${duration}s AI video/Reel with speaking characters, cinematic scene, clear subject, no text overlays` : 'square 1:1 high-quality post image'}. ${prompt}. Ultra realistic, cinematic lighting, vibrant colors, professional composition, high engagement social media aesthetic.`
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
            mediaB64 = b64
            try {
              mediaUrl = await putMedia(`data:image/png;base64,${b64}`, `ig-${type}-${Date.now()}.png`)
            } catch (e: any) {
              return new Response(JSON.stringify({ error: `Falha ao publicar prévia: ${e?.message || e}` }), { status: 500, headers: cors })
            }
          }

          return new Response(JSON.stringify({ title, caption, media_url: mediaUrl, media_b64: mediaB64 || null, prompt, type, video_script: videoScript, voiceover, soundtrack_suggestion: soundtrackSuggestion, duration }), { status: 200, headers: cors })
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || 'Erro' }), { status: 500, headers: cors })
        }
      },
    },
  },
})
