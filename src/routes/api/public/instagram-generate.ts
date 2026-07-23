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

          // Helper: gera uma imagem fotorrealista de altíssima qualidade DO ASSUNTO pedido.
          async function genImage(scenePrompt: string, aspect: 'vertical' | 'square'): Promise<string> {
            const orient = aspect === 'vertical'
              ? 'Vertical 9:16 portrait composition, full-bleed cinematic Reel frame'
              : 'Square 1:1 Instagram post composition, full-bleed'
            // Prompt LITERAL ao assunto — nada de estética abstrata dourada/preta forçada.
            // Deixamos o modelo escolher paleta e luz naturais adequadas ao tema.
            const full = [
              `HYPERREALISTIC EDITORIAL PHOTOGRAPH — the image MUST show exactly this subject as a real photo, not an abstract pattern, not a graphic, not a decorative background:`,
              `SUBJECT: ${scenePrompt}.`,
              orient + '.',
              `Shot like a top-tier commercial ad / magazine cover: professional DSLR/medium-format camera (Hasselblad H6D or Phase One), 50mm or 85mm lens, natural cinematic lighting appropriate to the scene, shallow depth of field, tack-sharp focus on the main subject, hyper-realistic skin tones and material textures, film-like color grading with rich contrast, 8K microdetail, award-winning composition following rule of thirds, leave clean negative space at top for headline overlay.`,
              `HARD RULES: photograph the SUBJECT literally and recognizably. Show real people/objects/environments described in the subject. Do NOT invent generic abstract shapes. Do NOT generate bubbles, dots, particles, gradients, geometric patterns, or decorative wallpaper backgrounds unless the subject explicitly asks for it. Do NOT default to a gold-and-black color scheme — use colors that fit the subject naturally. NO text, NO letters, NO logos, NO watermarks, NO captions anywhere in the image. No cartoon, no illustration, no 3D render style, no AI-looking artifacts, no plastic skin, no oversaturation.`,
            ].join(' ')
            const r = await fetch('https://ai.gateway.lovable.dev/v1/images/generations', {
              method: 'POST',
              headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'google/gemini-3-pro-image',
                messages: [{ role: 'user', content: full }],
                modalities: ['image', 'text'],
              }),
            })
            const d: any = await r.json().catch(() => ({}))
            if (!r.ok) {
              const msg = d?.error?.message || d?.error || `HTTP ${r.status}`
              throw new Error(msg)
            }
            const b64 = d?.data?.[0]?.b64_json
              || d?.choices?.[0]?.message?.images?.[0]?.image_url?.url?.replace(/^data:[^;]+;base64,/, '')
            if (!b64) throw new Error('A IA não retornou imagem para esta cena.')
            return b64
          }

          // Parse cenas do roteiro (para Reels)
          function parseScenes(script: string, max: number): string[] {
            if (!script) return []
            const parts = script
              .split(/\n+|(?:cena\s*\d+[:\-\.\)])/gi)
              .map(s => s.replace(/^\s*\d+[\.\)\-:]\s*/, '').replace(/^cena\s*\d*[:\-]?\s*/i, '').trim())
              .filter(s => s.length > 8)
            return parts.slice(0, max)
          }

          let mediaUrl = ''
          let mediaB64 = ''
          let scenes: Array<{ b64: string; url: string; text: string }> = []

          if (wantMedia) {
            try {
              if (type === 'reel') {
                // Reel: gera 5 cenas ÚNICAS em paralelo, cada uma com sua própria imagem HD.
                const sceneDescs = parseScenes(videoScript, 5)
                const finalScenes = sceneDescs.length >= 3 ? sceneDescs : [
                  `${prompt} — plano de abertura impactante, gancho visual`,
                  `${prompt} — detalhe/close cinematográfico`,
                  `${prompt} — ação principal, movimento`,
                  `${prompt} — prova/benefício, atmosfera premium`,
                  `${prompt} — plano final com espaço para CTA`,
                ]
                const imgs = await Promise.all(
                  finalScenes.slice(0, 5).map(async (desc) => {
                    try { return await genImage(desc, 'vertical') } catch { return '' }
                  })
                )
                for (let i = 0; i < finalScenes.length && i < imgs.length; i++) {
                  const b64 = imgs[i]
                  if (!b64) continue
                  const url = await putMedia(`data:image/png;base64,${b64}`, `ig-reel-scene${i+1}-${Date.now()}.png`)
                  scenes.push({ b64, url, text: finalScenes[i] })
                }
                if (!scenes.length) throw new Error('Nenhuma cena de vídeo pôde ser gerada. Tente um prompt mais claro.')
                mediaB64 = scenes[0].b64
                mediaUrl = scenes[0].url
              } else {
                // Post/carrossel: uma única imagem premium
                const b64 = await genImage(prompt, 'square')
                mediaB64 = b64
                mediaUrl = await putMedia(`data:image/png;base64,${b64}`, `ig-${type}-${Date.now()}.png`)
              }
            } catch (e: any) {
              return new Response(JSON.stringify({ error: `Falha ao gerar mídia: ${e?.message || e}` }), { status: 502, headers: cors })
            }
          }

          return new Response(JSON.stringify({
            title, caption,
            media_url: mediaUrl,
            media_b64: mediaB64 || null,
            scenes: scenes.map(s => ({ url: s.url, b64: s.b64, text: s.text })),
            prompt, type,
            video_script: videoScript,
            voiceover,
            soundtrack_suggestion: soundtrackSuggestion,
            duration,
          }), { status: 200, headers: cors })
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || 'Erro' }), { status: 500, headers: cors })
        }
      },
    },
  },
})
