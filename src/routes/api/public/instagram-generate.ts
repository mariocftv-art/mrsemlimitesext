import { createFileRoute } from '@tanstack/react-router'
import { putMedia } from './instagram-media'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

type CreativeCopy = {
  title: string
  caption: string
  videoScript: string
  voiceover: string
  soundtrackSuggestion: string
}

const nicheHashtags: Record<string, string> = {
  seguranca: '#MRSemLimites #MRSegurançaMáxima #SegurançaEletrônica #CFTV #CâmerasDeSegurança #Monitoramento24h #CasaSegura #EmpresaSegura #AlarmeResidencial #ProteçãoFamiliar #Tecnologia #InstalaçãoProfissional #SegurançaPrivada #Brasil #LinkMRStore #ProteçãoReal #SegurançaMáxima #Consultoria #WhatsApp #ReelsBrasil',
  empreendedor: '#MRSemLimites #Empreendedorismo #NegóciosDigitais #MarketingDigital #VendasOnline #AltaPerformance #Produtividade #EmpreendedorBrasil #LinkMRStore #AutoridadeDigital #ConteúdoPremium #Estratégia #Crescimento #ReelsBrasil #InstagramBrasil #GestãoDeNegócios #Sucesso #Mentoria #Empresa #Resultados',
  automotivo: '#MRSemLimites #CarroEsportivo #Automotivo #CarrosDeLuxo #Performance #Motor #Velocidade #DesignAutomotivo #Lifestyle #Premium #Brasil #ReelsBrasil #InstagramBrasil #Detalhamento #Supercarros #PaixãoPorCarros #GaragemDosSonhos #Luxo #ConteúdoPremium #Marketing',
  beleza: '#MRSemLimites #Beleza #Autoestima #Transformação #SalãoDeBeleza #Estética #CuidadosPessoais #ResultadoReal #MulheresEmpreendedoras #MakeupBrasil #CabeloPerfeito #AntesEDepois #AtendimentoPremium #AgendeSeuHorário #Brasil #InstagramBrasil #ReelsBrasil #ConteúdoPremium #Confiança #Luxo',
  gastronomia: '#MRSemLimites #Gastronomia #ComidaBoa #FoodBrasil #Delivery #Restaurante #Sabor #ExperiênciaGastronômica #CozinhaArtesanal #FoodLovers #Brasil #ReelsBrasil #InstagramBrasil #AtendimentoPremium #PeçaAgora #WhatsApp #Qualidade #ConteúdoPremium #NegócioLocal #Marketing',
  imoveis: '#MRSemLimites #Imóveis #CasaDosSonhos #InvestimentoImobiliário #CorretorDeImóveis #Apartamento #CasaNova #Financiamento #TourImobiliário #MercadoImobiliário #Brasil #ReelsBrasil #InstagramBrasil #Oportunidade #VisitaAgendada #WhatsApp #AltoPadrão #Localização #Patrimônio #Negócios',
  oferta: '#MRSemLimites #OfertaEspecial #ConteúdoPremium #MarketingDigital #InstagramBrasil #ReelsBrasil #Empreendedorismo #Vendas #Negócios #Autoridade #Resultado #Qualidade #Premium #Brasil #WhatsApp #LinkNaBio #Promoção #ClienteSatisfeito #Confiança #Sucesso',
}

function detectNiche(prompt: string) {
  const p = prompt.toLowerCase()
  if (/seguran|cftv|c[âa]mera|alarme|monitoramento|portaria|cerca el[eé]trica/.test(p)) return 'seguranca'
  if (/empreendedor|notebook|neg[oó]cio|empresa|venda|marketing|digital|curso|ebook|infoproduto|loja|cliente/.test(p)) return 'empreendedor'
  if (/carro|autom[oó]vel|ve[ií]culo|esportivo|motor|garagem|porsche|ferrari|bmw|mercedes/.test(p)) return 'automotivo'
  if (/beleza|cabelo|corte|maqui|est[eé]tica|sal[aã]o|barbearia|unha/.test(p)) return 'beleza'
  if (/caf[eé]|comida|pizza|hamb[uú]rguer|restaurante|drink|confeit|bolo|delivery/.test(p)) return 'gastronomia'
  if (/im[oó]vel|casa|apartamento|corretor|condom[ií]nio|terreno/.test(p)) return 'imoveis'
  return 'oferta'
}

function plainSubject(prompt: string) {
  return prompt
    .replace(/VARIAÇÃO OBRIGATÓRIA[\s\S]*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180)
}

function localCopy(prompt: string, type: string, duration: number): CreativeCopy {
  const subject = plainSubject(prompt) || 'conteúdo premium para Instagram'
  const niche = detectNiche(subject)
  const titleHooks: Record<string, string[]> = {
    seguranca: ['🚨 Sua segurança não pode esperar', '🔒 Proteção real para sua família', '📹 O detalhe que deixa sua casa segura'],
    empreendedor: ['🚀 O passo que separa amador de profissional', '💼 Empreender com clareza muda tudo', '⚡ A rotina que constrói resultado'],
    automotivo: ['🏎 Potência, presença e desejo', '🔥 Esse carro chama atenção de longe', '💎 Design que impõe respeito'],
    beleza: ['✨ A transformação começa no detalhe', '💄 Beleza com padrão premium', '💇 Autoestima em outro nível'],
    gastronomia: ['🤤 Sabor que faz parar o feed', '🔥 Uma experiência impossível de ignorar', '🍽 Detalhe, aroma e desejo'],
    imoveis: ['🏠 O imóvel que muda seus planos', '🔑 Alto padrão em cada detalhe', '💎 Seu próximo endereço começa aqui'],
    oferta: ['🔥 Você precisa ver isso hoje', '✨ A escolha certa está aqui', '💎 Premium em cada detalhe'],
  }
  const hooks = titleHooks[niche] || titleHooks.oferta
  const title = `${hooks[Math.floor(Math.random() * hooks.length)]} — ${subject}`.slice(0, 92)
  const hashtags = nicheHashtags[niche] || nicheHashtags.oferta
  const bullets: Record<string, string[]> = {
    seguranca: ['🛡 Monitoramento pensado para proteger o que mais importa', '📱 Controle e acompanhamento direto pelo celular', '⚙️ Instalação profissional com acabamento limpo', '✅ Mais presença, confiança e tranquilidade todos os dias'],
    empreendedor: ['💻 Ambiente profissional que transmite autoridade', '📈 Processo claro para transformar atenção em oportunidade', '🎯 Comunicação visual feita para gerar confiança', '🚀 Conteúdo pronto para posicionar sua marca no próximo nível'],
    automotivo: ['🏁 Visual forte para capturar desejo imediatamente', '✨ Detalhes de pintura, rodas e linhas com aparência real', '📸 Enquadramento de anúncio premium', '🔥 Perfeito para vender, divulgar ou gerar engajamento'],
    beleza: ['✨ Resultado visual elegante e desejável', '💎 Sensação premium sem parecer artificial', '📸 Imagem pronta para atrair clientes', '📲 Chamada direta para agendamento no WhatsApp/direct'],
    gastronomia: ['🤤 Close realista para despertar vontade', '🔥 Luz e textura que valorizam o produto', '📍 Ideal para atrair pedidos locais', '📲 CTA direto para pedido pelo WhatsApp'],
    imoveis: ['🏠 Ambientes valorizados com sensação real de espaço', '💰 Comunicação focada em oportunidade e desejo', '📍 Destaque para localização, conforto e investimento', '📞 CTA direto para visita ou atendimento'],
    oferta: ['✅ Visual profissional para gerar confiança', '💎 Diferencial claro desde o primeiro segundo', '📌 Texto pronto para salvar, compartilhar e chamar no direct', '🚀 Comunicação com foco em conversão'],
  }
  const b = bullets[niche] || bullets.oferta
  const caption = [
    title,
    '',
    '🔥 ATENÇÃO: isso aqui foi criado para parar o dedo e gerar ação.',
    '',
    `✨ ${subject}`,
    '',
    '💡 O ponto principal é simples: quando a apresentação é profissional, a percepção de valor sobe na hora.',
    '',
    ...b,
    '',
    '👉 SEGUE a página @ pra não perder nada 🔔',
    '',
    '💬 Se você quer algo nesse padrão para seu negócio, produto ou serviço, chama no direct agora. Conteúdo bonito chama atenção; conteúdo estratégico vende.',
    '',
    'SEGUE + salva esse post 💾 e chama no direct 📲',
    '',
    hashtags,
  ].join('\n')
  const d = Math.max(10, Math.min(600, duration || 20))
  const cut = Math.max(2, Math.round(d / 5))
  const videoScript = type === 'reel' ? [
    `Cena 1 — 0-${cut}s: abertura forte mostrando ${subject} com movimento de câmera suave e impacto visual imediato.`,
    `Cena 2 — ${cut}-${cut * 2}s: close nos detalhes mais importantes, com luz realista e texto curto na tela.`,
    `Cena 3 — ${cut * 2}-${cut * 3}s: demonstração do benefício principal em ritmo cinematográfico.`,
    `Cena 4 — ${cut * 3}-${cut * 4}s: prova visual, ambiente premium e sensação de confiança.`,
    `Cena 5 — ${cut * 4}-${d}s: encerramento com CTA claro: seguir, salvar e chamar no direct/WhatsApp.`,
  ].join('\n') : ''
  const voiceover = type === 'reel'
    ? `Olha isso, Mr. ${subject}. Quando a imagem é profissional, a confiança sobe na hora. Repara nos detalhes, no acabamento e na presença. Se você quer esse padrão no seu negócio, segue a página, salva esse conteúdo e chama no direct agora.`
    : ''
  return {
    title,
    caption,
    videoScript,
    voiceover,
    soundtrackSuggestion: type === 'reel' ? 'Trilha cinematográfica moderna, 80–100 BPM, energia premium e cortes suaves sincronizados.' : '',
  }
}

function imagePrompt(scenePrompt: string, aspect: 'vertical' | 'square') {
  const subject = plainSubject(scenePrompt) || scenePrompt
  const orient = aspect === 'vertical'
    ? 'vertical 9:16 composition, Instagram Reel frame'
    : 'square 1:1 Instagram post composition'
  return [
    'hyperrealistic professional editorial photograph, literal real-world subject, not abstract art',
    `subject: ${subject}`,
    orient,
    'commercial photography, natural cinematic lighting, realistic materials, sharp focus, premium DSLR look, high detail, magazine ad composition',
    'no text, no letters, no logos, no watermark, no bubbles, no gold abstract background, no geometric wallpaper, no generic decorative pattern, no cartoon, no 3d render',
  ].join(', ')
}

async function fetchAsB64(url: string): Promise<string> {
  const r = await fetch(url, { headers: { 'User-Agent': 'MR-Sem-Limites/1.0' } })
  if (!r.ok) throw new Error(`fallback imagem HTTP ${r.status}`)
  const buf = Buffer.from(await r.arrayBuffer())
  if (buf.length < 5000) throw new Error('fallback retornou imagem vazia')
  return buf.toString('base64')
}

// Lovable AI Gateway — usa os créditos do workspace (assinatura do usuário)
const AIG_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions'
const IMAGE_MODELS = ['google/gemini-3-pro-image', 'google/gemini-3.5-flash-image', 'google/gemini-2.5-flash-image']
const TEXT_MODEL = 'google/gemini-3.6-flash'

async function aigImage(fullPrompt: string): Promise<{ b64: string; mime: 'image/png' | 'image/jpeg' } | null> {
  const key = process.env.LOVABLE_API_KEY
  if (!key) return null
  for (const model of IMAGE_MODELS) {
    try {
      const r = await fetch(AIG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: fullPrompt }],
          modalities: ['image', 'text'],
        }),
      })
      if (!r.ok) { if (r.status === 402 || r.status === 429) return null; continue }
      const data: any = await r.json()
      const img = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url
      if (!img || !img.startsWith('data:')) continue
      const [meta, b64] = img.split(';base64,')
      if (!b64) continue
      const mime = meta.slice(5) as 'image/png' | 'image/jpeg'
      return { b64, mime: mime === 'image/jpeg' ? 'image/jpeg' : 'image/png' }
    } catch { /* try next */ }
  }
  return null
}

async function aigText(system: string, user: string): Promise<string | null> {
  const key = process.env.LOVABLE_API_KEY
  if (!key) return null
  try {
    const r = await fetch(AIG_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
    })
    if (!r.ok) return null
    const data: any = await r.json()
    return data?.choices?.[0]?.message?.content?.toString() || null
  } catch { return null }
}

async function aiCopy(prompt: string, type: string, duration: number, fallback: CreativeCopy): Promise<CreativeCopy> {
  const system = 'Você é um copywriter viral especialista em Instagram brasileiro. Escreve legendas longas, envolventes, com storytelling, gatilhos mentais, hashtags relevantes e CTA forte. Sempre responde APENAS com JSON válido puro (sem markdown, sem crases).'
  const isReel = type === 'reel'
  const user = `Crie um conteúdo profissional para Instagram sobre: "${prompt}"

Tipo: ${type}${isReel ? ` | Duração: ${duration}s` : ''}
Responda em JSON com estas chaves exatas:
{
  "title": "título curto e impactante (máx 90 chars, com 1-2 emojis)",
  "caption": "legenda LONGA e completa em português-BR (mín 800 chars, máx 2100): hook forte na 1ª linha, storytelling, 4-6 bullets com emojis, prova social, CTA claro (seguir + salvar + direct/WhatsApp), assinatura da marca, e no final 18-25 hashtags relevantes em português misturadas com internacionais"${isReel ? `,
  "videoScript": "roteiro cinematográfico com EXATAMENTE 5 cenas numeradas (Cena 1 até Cena 5), cada cena descrita fisicamente (o que a câmera mostra, ângulo, movimento, iluminação, texto na tela), com timings somando ${duration}s",
  "voiceover": "narração em português-BR sincronizada com o vídeo (voz masculina consultor), começando com 'Olha isso, Mr.' e terminando com CTA claro para o direct/WhatsApp",
  "soundtrackSuggestion": "descrição da trilha ideal (estilo, BPM, energia)"` : ''}
}`
  const raw = await aigText(system, user)
  if (!raw) return fallback
  try {
    const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
    const j = JSON.parse(clean)
    return {
      title: (j.title || fallback.title).toString().slice(0, 120),
      caption: (j.caption || fallback.caption).toString(),
      videoScript: (j.videoScript || fallback.videoScript || '').toString(),
      voiceover: (j.voiceover || fallback.voiceover || '').toString(),
      soundtrackSuggestion: (j.soundtrackSuggestion || fallback.soundtrackSuggestion || '').toString(),
    }
  } catch { return fallback }
}

async function genImage(scenePrompt: string, aspect: 'vertical' | 'square', seedSalt: string): Promise<{ b64: string; mime: 'image/png' | 'image/jpeg' }> {
  const full = imagePrompt(scenePrompt, aspect)
  // 1) tenta Lovable AI Gateway (Gemini 3 Pro Image — máxima qualidade)
  const aig = await aigImage(full)
  if (aig?.b64) return aig
  // 2) fallback Pollinations
  const w = aspect === 'vertical' ? 720 : 1080
  const h = aspect === 'vertical' ? 1280 : 1080
  const seed = Math.abs(Array.from(`${scenePrompt}-${seedSalt}`).reduce((a, c) => ((a * 31) + c.charCodeAt(0)) | 0, 7))
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?width=${w}&height=${h}&nologo=true&enhance=true&model=flux&seed=${seed}`
  return { b64: await fetchAsB64(url), mime: 'image/jpeg' }
}

function parseScenes(script: string, max: number): string[] {
  if (!script) return []
  const parts = script
    .split(/\n+|(?:cena\s*\d+[:\-\.\)])/gi)
    .map(s => s.replace(/^\s*\d+[\.\)\-:]\s*/, '').replace(/^cena\s*\d*[:\-]?\s*/i, '').trim())
    .filter(s => s.length > 8)
  return parts.slice(0, max)
}

// Gera imagem + legenda viral sem usar créditos do workspace Lovable.
export const Route = createFileRoute('/api/public/instagram-generate')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: any = {}
        try { body = await request.json() } catch {}
        const prompt = (body?.prompt || body?.theme || '').toString().trim()
        const type = (body?.type || 'post').toString()
        const duration = Math.max(10, Math.min(600, Number(body?.duration || 20) || 20))
        const wantMedia = body?.media !== false
        const seedSalt = `${Date.now()}-${Math.random()}`
        if (!prompt) {
          return new Response(JSON.stringify({ error: 'Informe o prompt' }), { status: 400, headers: cors })
        }

        try {
          const baseCopy = localCopy(prompt, type, duration)
          const copy = await aiCopy(prompt, type, duration, baseCopy)
          let mediaUrl = ''
          let mediaB64 = ''
          let mediaMime: 'image/png' | 'image/jpeg' = 'image/jpeg'
          const scenes: Array<{ b64: string; url: string; text: string; mime: string }> = []

          if (wantMedia) {
            try {
              if (type === 'reel') {
                const sceneDescs = parseScenes(copy.videoScript, 5)
                const baseSubject = plainSubject(prompt)
                const finalScenes = sceneDescs.length >= 3 ? sceneDescs : [
                  `${baseSubject} — opening scene, professional cinematic establishing shot`,
                  `${baseSubject} — close-up of the most important realistic details`,
                  `${baseSubject} — main action or benefit shown clearly`,
                  `${baseSubject} — trust, proof and premium atmosphere`,
                  `${baseSubject} — final CTA frame with clean negative space and real subject visible`,
                ]
                const imgs = await Promise.all(
                  finalScenes.slice(0, 5).map(async (desc, idx) => {
                    try { return await genImage(desc, 'vertical', `${seedSalt}-${idx}`) } catch { return null }
                  })
                )
                for (let i = 0; i < finalScenes.length && i < imgs.length; i++) {
                  const img = imgs[i]
                  if (!img?.b64) continue
                  const ext = img.mime === 'image/jpeg' ? 'jpg' : 'png'
                  const url = await putMedia(`data:${img.mime};base64,${img.b64}`, `ig-reel-scene${i + 1}-${Date.now()}.${ext}`)
                  scenes.push({ b64: img.b64, url, text: finalScenes[i], mime: img.mime })
                }
                if (!scenes.length) throw new Error('Nenhuma cena pôde ser gerada. Tente um prompt mais claro.')
                mediaB64 = scenes[0].b64
                mediaMime = scenes[0].mime === 'image/png' ? 'image/png' : 'image/jpeg'
                mediaUrl = scenes[0].url
              } else {
                const img = await genImage(prompt, 'square', seedSalt)
                mediaB64 = img.b64
                mediaMime = img.mime
                const ext = img.mime === 'image/jpeg' ? 'jpg' : 'png'
                mediaUrl = await putMedia(`data:${img.mime};base64,${img.b64}`, `ig-${type}-${Date.now()}.${ext}`)
              }
            } catch (e: any) {
              return new Response(JSON.stringify({ error: `Falha ao gerar mídia: ${e?.message || e}` }), { status: 502, headers: cors })
            }
          }

          return new Response(JSON.stringify({
            title: copy.title,
            caption: copy.caption,
            media_url: mediaUrl,
            media_b64: mediaB64 || null,
            media_mime: mediaMime,
            scenes: scenes.map(s => ({ url: s.url, b64: s.b64, text: s.text, mime: s.mime })),
            prompt,
            type,
            video_script: copy.videoScript,
            voiceover: copy.voiceover,
            soundtrack_suggestion: copy.soundtrackSuggestion,
            duration,
            fallback: true,
          }), { status: 200, headers: cors })
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || 'Erro' }), { status: 500, headers: cors })
        }
      },
    },
  },
})