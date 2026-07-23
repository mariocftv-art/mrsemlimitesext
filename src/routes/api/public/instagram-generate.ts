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
                { role: 'system', content: 'Você é consultor premium de Instagram brasileiro, diretor de vídeo profissional e copywriter viral de alto nível. Responda APENAS em JSON válido: {"title":"...","caption":"...","hashtags":["#.."],"video_script":"...","voiceover":"...","soundtrack_suggestion":"..."}. REGRAS OBRIGATÓRIAS: (A) TÍTULO: máx. 70 caracteres, 1–2 emojis, gancho MAGNÉTICO que gera curiosidade/engajamento imediato (pergunta polêmica, número forte, promessa clara, revelação de segredo, urgência). Nada genérico — precisa fazer parar o dedo. (B) LEGENDA COMPLETA E PROFISSIONAL, mínimo 900 caracteres, estrutura: 1) gancho em CAIXA ALTA parcial com emoji forte; 2) contexto/história curta; 3) 3–5 bullets com ✅ ou ➡️ mostrando benefícios/passos; 4) prova social ou dado; 5) oferta/valor; 6) CTA final. Use MUITOS emojis coloridos (mín. 1 por linha) — 🔥✨💎🚀💰🎯👑⚡🏆🎁📲💫🌟❤️‍🔥. Blocos curtos separados por linha em branco, jamais parágrafo corrido sem emoji. (C) OBRIGATÓRIO: incluir DUAS chamadas explícitas pedindo para SEGUIR a página, uma no meio ("👉 SEGUE a página @ pra não perder nada 🔔") e outra no fim junto do CTA principal ("SEGUE + salva esse post 💾 e chama no direct 📲"). (D) 18–25 hashtags PT-BR relevantes, sem repetir, misturando nicho + amplas + locais. (E) REEL: video_script com 5–7 cenas numeradas cobrindo a duração pedida, cada cena descrevendo enquadramento, movimento de câmera, ação visual, texto na tela e fala do personagem; voiceover = roteiro pronto de locução masculina natural em PT-BR sincronizado com as cenas; soundtrack_suggestion = estilo de música/BPM/mood. Para Post/Carrossel deixe video_script, voiceover e soundtrack_suggestion vazios.' },
                { role: 'user', content: `Prompt do usuário: ${prompt}\nTipo: ${type === 'reel' ? 'Reel de vídeo vertical 9:16' : type === 'carousel' ? 'Carrossel de imagens' : 'Post de imagem'}\nDuração do Reel: ${duration}s\nIA de vídeo/imagem escolhida no painel: ${aiMode || 'padrão premium'}\nTrilha escolhida: ${soundtrack || 'cinematográfica'}\nVoz/fala: ${voiceMode}\n\nGere conteúdo de altíssimo padrão profissional pronto para engajar e converter, com pedido claro para seguir a página.` },
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
            const imgPrompt = `${type === 'reel' ? `Vertical 9:16 ultra high quality cinematic first frame for a ${duration}s Instagram Reel` : type === 'carousel' ? 'Square 1:1 ultra high quality Instagram carousel cover' : 'Square 1:1 ultra high quality Instagram post image'}. Subject: ${prompt}. ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO TYPOGRAPHY, NO CAPTIONS, NO SUBTITLES, NO LOGOS, NO WATERMARKS anywhere — pure photographic scene only. Leave clean empty space at top and bottom for future text overlay. Award-winning professional photography, 8K detail, sharp focus, ultra realistic skin/texture, cinematic lighting with soft rim light and volumetric shadows, shallow depth of field f/1.8, vibrant natural colors with rich contrast, magazine-quality composition following rule of thirds, premium Brazilian social media aesthetic, editorial magazine grade, hyper-detailed, photorealistic, shot on Hasselblad medium format.`
            const imgRes = await fetch('https://ai.gateway.lovable.dev/v1/images/generations', {
              method: 'POST',
              headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'google/gemini-3-pro-image',
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
