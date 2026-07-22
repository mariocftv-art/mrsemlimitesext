/**
 * MR Sem Limites EXT5 — Instagram Publisher V2
 * Fluxo: usuário descreve → IA gera prévia + legenda → confirma → publica.
 * Conta @linkmrstore usa token do servidor (Lovable Cloud).
 */
(function () {
  const BASE = 'https://mrsemlimitesext.lovable.app';
  const STATUS_URL = BASE + '/api/public/instagram-status';
  const MEDIA_URL = BASE + '/api/public/instagram-media';
  const PUBLISH_URL = BASE + '/api/public/instagram-publish';

  const $ = (id) => document.getElementById(id);
  const log = (m, ok) => {
    const el = $('igPublishLog'); if (!el) return;
    const c = ok === true ? '#4ade80' : ok === false ? '#f87171' : '#e8faff';
    el.innerHTML = `<div style="color:${c}">• ${m}</div>` + el.innerHTML;
  };

  let currentType = 'post';
  let lastGeneratedMime = '';
  let lastPreviewObjectUrl = '';
  const REEL_MIN_DURATION_SEC = 20;

  function setBusy(btn, busy, text) {
    if (!btn) return;
    if (busy) {
      btn.dataset.origText = btn.textContent || '';
      btn.disabled = true;
      btn.textContent = text;
    } else {
      btn.disabled = false;
      btn.textContent = btn.dataset.origText || btn.textContent || '';
    }
  }

  function updateModeCopy() {
    const label = document.querySelector('label[for="igPrompt"]') || $('igPromptLabel');
    const prompt = $('igPrompt');
    const btn = $('igGenerateBtn');
    const stWrap = $('igSoundtrackWrap');
    const hint = $('igAiModeHint');
    if (stWrap) stWrap.style.display = currentType === 'reel' ? 'block' : 'none';
    if (hint) hint.textContent = 'IA ativa: ' + aiModeLabel() + ' • todos os Reels saem com no mínimo 20s, fala e trilha.';
    if (currentType === 'reel') {
      if (label) label.textContent = 'Descreva o Reel que você quer (mín. 20s, com roteiro, personagem falando, voz, trilha, título, legenda e hashtags)';
      if (prompt) prompt.placeholder = 'Ex: um Reel cinematográfico da minha loja Link MR Store, pessoa falando para câmera, cenas de tecnologia/luxo/confiança, trilha premium e CTA final…';
      if (btn) btn.textContent = '🎬 Gerar Reel 20s + fala + trilha';
    } else {
      if (label) label.textContent = 'Descreva o que você quer (a IA gera a prévia, título, legenda e hashtags)';
      if (prompt) prompt.placeholder = 'Ex: um café expresso fumegante em mesa de mármore, luz de manhã, estética minimalista para minha cafeteria…';
      if (btn) btn.textContent = currentType === 'carousel' ? '🖼 Gerar carrossel + legenda' : '🎨 Gerar imagem + legenda';
    }
  }

  function getAiPick() {
    try { return JSON.parse(localStorage.getItem('mr_ia_pick_v1') || 'null'); }
    catch (_) { return null; }
  }

  function aiModeLabel() {
    const pick = getAiPick();
    return pick && pick.title ? `${pick.emoji || '🤖'} ${pick.title}` : '🎬 Veo 3 / IA de vídeo premium';
  }

  function setType(type) {
    currentType = type;
    document.querySelectorAll('.igTypeBtn').forEach((b) => {
      const active = b.dataset.type === type;
      b.classList.toggle('active', active);
      b.style.background = active ? 'rgba(225,48,108,.15)' : 'transparent';
      b.style.border = active ? '1px solid rgba(225,48,108,.4)' : '1px solid rgba(255,255,255,.1)';
    });
    updateModeCopy();
  }

  // ============ Trilha sonora sintetizada (Web Audio) ============
  function buildSoundtrack(audioCtx, destination, durationSec, style) {
    const now = audioCtx.currentTime;
    const end = now + durationSec;
    const master = audioCtx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.55, now + 0.6);
    master.gain.setValueAtTime(0.55, end - 0.8);
    master.gain.exponentialRampToValueAtTime(0.0001, end);
    master.connect(destination);

    const presets = {
      cinematic: { root: 55, chord: [0, 7, 12, 16], wave: 'sawtooth', bpm: 80, kick: true, lead: [0, 7, 10, 12] },
      upbeat:    { root: 65, chord: [0, 4, 7, 12], wave: 'square',   bpm: 124, kick: true, lead: [0, 4, 7, 12, 7, 4] },
      chill:     { root: 49, chord: [0, 3, 7, 10], wave: 'sine',     bpm: 70,  kick: false, lead: [0, 7, 3, 10] },
      luxury:    { root: 58, chord: [0, 4, 7, 11], wave: 'triangle', bpm: 78,  kick: false, lead: [12, 11, 7, 4, 0] },
    };
    const p = presets[style] || presets.cinematic;
    const freq = (semi) => p.root * Math.pow(2, semi / 12);

    // Pad harmônico
    p.chord.forEach((semi) => {
      const osc = audioCtx.createOscillator();
      osc.type = p.wave;
      osc.frequency.value = freq(semi);
      const g = audioCtx.createGain();
      g.gain.value = 0.08;
      const lp = audioCtx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 1400;
      osc.connect(lp).connect(g).connect(master);
      osc.start(now); osc.stop(end + 0.1);
    });

    // Lead melódico
    const stepDur = 60 / p.bpm / 2;
    let t = now + 0.4;
    let i = 0;
    while (t < end - 0.2) {
      const semi = p.lead[i % p.lead.length] + 12;
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq(semi);
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + stepDur * 0.9);
      osc.connect(g).connect(master);
      osc.start(t); osc.stop(t + stepDur);
      t += stepDur; i++;
    }

    // Kick simples
    if (p.kick) {
      const beat = 60 / p.bpm;
      for (let k = now + 0.2; k < end - 0.1; k += beat) {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, k);
        osc.frequency.exponentialRampToValueAtTime(40, k + 0.15);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.5, k);
        g.gain.exponentialRampToValueAtTime(0.0001, k + 0.2);
        osc.connect(g).connect(master);
        osc.start(k); osc.stop(k + 0.22);
      }
    }
  }


  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      if (!String(src).startsWith('data:')) img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Não consegui carregar a imagem da prévia'));
      img.src = src;
    });
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result || ''));
      fr.onerror = () => reject(new Error('Falha ao preparar o vídeo gerado'));
      fr.readAsDataURL(blob);
    });
  }

  function bestVideoMime() {
    const types = [
      'video/mp4;codecs=avc1.42E01E',
      'video/mp4;codecs=h264',
      'video/mp4',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    return types.find((t) => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || '';
  }

  async function loadVoiceoverBuffer() {
    // Regra MR: não usar créditos de IA do workspace para TTS.
    // A prévia local sai com trilha/áudio sintético; locução premium deve ser feita pela IA escolhida (ex.: ElevenLabs) com a conta do usuário.
    return null;
  }

  function detectNiche(prompt) {
    const p = String(prompt || '').toLowerCase();
    if (/seguran|cftv|c[âa]mera|alarme|monitoramento|portaria|cerca el[eé]trica/.test(p)) return 'seguranca';
    if (/pax|funer|plano|assist[eê]ncia/.test(p)) return 'pax';
    if (/curso|ebook|infoproduto|lan[çc]amento|fanpage|vsl|landing|funil/.test(p)) return 'infoproduto';
    if (/caf[eé]|comida|pizza|hamb[uú]rguer|restaurante|drink|confeit/.test(p)) return 'gastronomia';
    if (/beleza|cabelo|corte|maqui|est[eé]tica|sal[aã]o/.test(p)) return 'beleza';
    if (/im[oó]vel|casa|apartamento|corretor/.test(p)) return 'imoveis';
    if (/moda|look|roupa|editorial/.test(p)) return 'moda';
    return 'oferta';
  }

  function titleFromPrompt(prompt, isReel) {
    const clean = String(prompt || '').replace(/\s+/g, ' ').trim();
    const niche = detectNiche(prompt);
    const hooksReel = {
      seguranca: ['🚨 A verdade que ninguém te contou sobre proteger sua casa', '🔒 Se você tem família, precisa VER isso', '📹 O detalhe que separa uma casa segura de uma casa vulnerável'],
      pax: ['🕊 O que ninguém quer pensar — mas TODO mundo precisa', '💙 Proteja quem você ama antes que seja tarde', '⚠️ 90% das famílias descobrem isso tarde demais'],
      infoproduto: ['🚀 O método que mudou minha vida em 30 dias', '💰 Ninguém te contou isso sobre ganhar dinheiro online', '🔥 Fiz isso e mudou TUDO — assista até o fim'],
      gastronomia: ['🤤 Isso aqui é PROIBIDO pra quem tá de dieta', '🔥 O segredo por trás do sabor perfeito', '✨ Você precisa provar isso pelo menos uma vez'],
      beleza: ['💇 A transformação que travou o Instagram inteiro', '✨ Antes x depois que ninguém acreditou', '💄 O segredo das mulheres mais admiradas'],
      imoveis: ['🏠 Por dentro do imóvel dos sonhos', '💎 Você não vai acreditar no preço deste imóvel', '🔑 A oportunidade que some em 24h'],
      moda: ['👗 O look que virou meta de todo mundo', '✨ Estilo que impõe respeito na primeira vista'],
      oferta: ['🔥 Você precisa ver isso agora', '⚡ Isso vai mudar o jogo pra você', '✨ A novidade que todo mundo quer'],
    };
    const hooksPost = {
      seguranca: ['🛡 Proteção real começa aqui', '📸 Segurança 24h que você merece', '🔒 Sua família merece o máximo em proteção'],
      pax: ['💙 Amor também é cuidar do amanhã', '🕊 Tranquilidade pra quem você ama'],
      infoproduto: ['🚀 O próximo nível está a um clique', '💡 Método comprovado, resultado real'],
      gastronomia: ['🤤 Sabor que vicia', '✨ Feito com amor, servido com arte'],
      beleza: ['💇 Autoestima em cada detalhe', '✨ Você mais bonita a cada dia'],
      imoveis: ['🏠 O lar dos seus sonhos existe', '🔑 Realize esse desejo hoje'],
      moda: ['👗 Estilo que fala por você', '✨ Look que impressiona'],
      oferta: ['✨ Premium em cada detalhe', '🔥 A escolha certa está aqui'],
    };
    const pool = isReel ? hooksReel[niche] : hooksPost[niche];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const short = clean.split(/[.!?]/)[0].slice(0, 70).trim();
    return short ? `${pick} — ${short}` : pick;
  }

  function buildLocalCaption(prompt, type) {
    const isReel = type === 'reel';
    const title = titleFromPrompt(prompt, isReel);
    const niche = detectNiche(prompt);
    const bulletsMap = {
      seguranca: ['🛡 Câmeras 4K premium com visão noturna real', '📡 Monitoramento profissional 24h todos os dias', '⚡ Instalação rápida por equipe uniformizada', '📱 Acesso ao vivo direto no seu celular', '✅ Garantia total e suporte imediato'],
      pax: ['💙 Proteção completa pra toda a família', '🕊 Assistência funeral 24h em qualquer lugar', '✅ Planos que cabem no seu orçamento', '📞 Atendimento humano quando você mais precisa'],
      infoproduto: ['🚀 Método passo a passo comprovado', '🎁 Bônus exclusivos por tempo limitado', '💎 Comunidade fechada de alto nível', '🛡 Garantia incondicional de 7 dias', '⭐ Depoimentos reais de alunos transformados'],
      gastronomia: ['🍽 Ingredientes selecionados', '🔥 Preparo artesanal do início ao fim', '✨ Apresentação impecável', '📍 Peça já pelo WhatsApp'],
      beleza: ['💇 Técnica exclusiva com resultado real', '✨ Produtos premium importados', '💆 Atendimento personalizado', '📅 Agende seu horário agora'],
      imoveis: ['🏠 Imóvel selecionado a dedo pra você', '💰 Condições especiais de financiamento', '📍 Localização estratégica', '📞 Fale com um especialista'],
      moda: ['👗 Peça exclusiva, poucas unidades', '✨ Caimento perfeito', '💳 Parcele sem juros', '🚚 Entrega pra todo Brasil'],
      oferta: ['✅ Qualidade premium em cada detalhe', '🎯 Feito pra quem exige o melhor', '🚀 Resultado que fala por si', '💎 Diferencial que ninguém oferece'],
    };
    const bullets = bulletsMap[niche] || bulletsMap.oferta;
    const ctaMap = {
      seguranca: '👉 Chama no WhatsApp e blinde sua casa hoje mesmo. Sua família merece o MÁXIMO em proteção.',
      pax: '👉 Fale com a nossa equipe e conheça o plano ideal pra sua família. Amanhã pode ser tarde.',
      infoproduto: '👉 Clica no link da bio e garanta sua vaga com desconto. As vagas somem RÁPIDO.',
      gastronomia: '👉 Peça agora pelo WhatsApp e receba no conforto de casa 🔥',
      beleza: '👉 Agende seu horário no direct. Sua transformação começa hoje ✨',
      imoveis: '👉 Chama no WhatsApp pra visitar. Imóvel assim não espera.',
      moda: '👉 Toca no link da bio e garanta o seu. Últimas peças!',
      oferta: '👉 Chama no direct ou toca no link da bio pra saber mais 💬',
    };
    const cta = ctaMap[niche] || ctaMap.oferta;
    const hashtagsMap = {
      seguranca: '#MRSemLimites #MRSecurity #SegurançaMáxima #CFTV #Câmeras4K #Monitoramento24h #Proteção #CasaSegura #EmpresaSegura #AlarmeResidencial #PAX #LinkMRStore',
      pax: '#MRSemLimites #PAX #AssistênciaFamiliar #FamíliaProtegida #Tranquilidade #CuidadoQueTransforma #PlanoFamiliar #MRSegurançaMáxima',
      infoproduto: '#MRSemLimites #InfoProduto #MarketingDigital #Empreendedorismo #NegócioOnline #RendaExtra #MétodoComprovado #Lançamento #Escala #Resultado',
      gastronomia: '#MRSemLimites #Gastronomia #ComidaBoa #FoodPorn #SaboresQueMarcam #DeliveryBrasil #PedeAgora',
      beleza: '#MRSemLimites #Beleza #Autoestima #Transformação #Cabelo #Estética #SalãoPremium #BelezaFeminina',
      imoveis: '#MRSemLimites #Imóveis #ImóvelDosSonhos #Investimento #Corretor #ComprarCasa #FinanciamentoImobiliário',
      moda: '#MRSemLimites #Moda #Estilo #Look #Fashion #TendênciaBrasil #ModaFeminina',
      oferta: '#MRSemLimites #Premium #Qualidade #Autoridade #MarketingDigital #InstagramBrasil #ConteúdoPremium #ReelsBrasil #Empreendedorismo',
    };
    const hashtags = hashtagsMap[niche] || hashtagsMap.oferta;
    const bulletBlock = bullets.map((b) => b).join('\n');
    const emojiBar = isReel ? '🎬✨🔥💎🚀' : '✨💎🔥🚀💫';
    return `${title}\n\n${emojiBar}\n\n💡 O que ninguém te disse:\n${bulletBlock}\n\n📌 Salve esse post pra não perder\n📤 Compartilha com quem precisa ver isso\n💬 Comenta aqui embaixo o que achou\n\n${cta}\n\n━━━━━━━━━━━━━━\n${hashtags}`;
  }

  function buildLocalScript(prompt, duration) {
    const title = titleFromPrompt(prompt, true);
    const d = Math.max(20, Number(duration) || 20);
    const seg = d / 5;
    const t = (n) => Math.round(seg * n);
    return [
      `0-${t(1)}s: ABERTURA IMPACTANTE — gancho forte "${title}", texto entrando com zoom cinematográfico.`,
      `${t(1)}-${t(2)}s: CONTEXTO — mostre o problema que o público sente todo dia, close nos detalhes.`,
      `${t(2)}-${t(3)}s: SOLUÇÃO — apresente o produto/serviço em movimento suave, luz premium.`,
      `${t(3)}-${t(4)}s: PROVA — depoimento visual, número, resultado real, transição rítmica com a trilha.`,
      `${t(4)}-${d}s: CTA FINAL — chamada direta pro WhatsApp/link da bio, logo MR Sem Limites em destaque.`,
    ].join('\n');
  }


  function makeLocalPosterDataUrl(prompt, type) {
    const isReel = type === 'reel';
    const canvas = document.createElement('canvas');
    canvas.width = isReel ? 1080 : 1080;
    canvas.height = isReel ? 1920 : 1080;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, '#07070b');
    grd.addColorStop(0.45, '#19100a');
    grd.addColorStop(1, '#030303');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.arc((i * 173) % w, (i * 271) % h, 90 + (i % 5) * 36, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 ? 'rgba(212,175,55,.08)' : 'rgba(255,255,255,.035)';
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(212,175,55,.78)';
    ctx.lineWidth = 8;
    ctx.strokeRect(44, 44, w - 88, h - 88);
    ctx.strokeStyle = 'rgba(255,255,255,.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(72, 72, w - 144, h - 144);
    ctx.fillStyle = '#d4af37';
    ctx.font = '900 44px system-ui, -apple-system, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MR SEM LIMITES', w / 2, h - 90);
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = `600 ${isReel ? 26 : 22}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillText('Prévia local • gere na IA da aba para arte final', w / 2, h - 50);
    return canvas.toDataURL('image/png');
  }

  function createLocalCreative(prompt, type, duration, aiPick) {
    const isReel = type === 'reel';
    const title = titleFromPrompt(prompt, isReel);
    const videoScript = isReel ? buildLocalScript(prompt, duration) : '';
    return {
      title,
      caption: buildLocalCaption(prompt, type),
      media_url: makeLocalPosterDataUrl(prompt, type),
      media_b64: '',
      video_script: videoScript,
      voiceover: isReel ? `Roteiro para locução premium (${aiPick?.title || 'AUTO'}): ${title}. Mostre confiança, clareza e chamada para ação.` : '',
      soundtrack_suggestion: isReel ? 'Trilha sintética cinematográfica local já incluída na prévia. Para voz humana, use ElevenLabs com sua conta.' : '',
    };
  }

  function cleanSceneLine(raw) {
    let s = String(raw || '').trim();
    s = s.replace(/^\s*\d+\s*[-–—]\s*\d+\s*s?\s*:?\s*/i, '');
    s = s.replace(/^\s*\d+\s*s\s*:?\s*/i, '');
    s = s.replace(/^\s*[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 ]{3,40}\s*[-–—]\s*/, '');
    s = s.replace(/^["“”'`]+|["“”'`]+$/g, '').trim();
    const cut = s.split(/(?<=[.!?])\s+/)[0] || s;
    return cut.length > 70 ? cut.slice(0, 67).trim() + '…' : cut;
  }

  function makeSceneTexts(title, script) {
    const lines = String(script || '')
      .split(/\n+/)
      .map(cleanSceneLine)
      .filter((l) => l && l.length > 3);
    const fallback = [
      title || 'A transformação começa agora',
      'Veja como muda o jogo',
      'Mais confiança e resultado',
      'Detalhes premium que prendem',
      'Chama no WhatsApp e vem',
    ];
    return (lines.length ? lines : fallback).slice(0, 5);
  }

  async function makeReelPreviewFromImage(imageUrl, title, soundtrack, voiceover, script, durationSec) {
    if (!HTMLCanvasElement.prototype.captureStream || !window.MediaRecorder) {
      throw new Error('Seu navegador não liberou gravação de vídeo no painel. Atualize o Chrome e tente de novo.');
    }
    const img = await loadImage(imageUrl);
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 1280;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas indisponível para gerar vídeo');

    const safeDuration = Math.max(REEL_MIN_DURATION_SEC, Number(durationSec || REEL_MIN_DURATION_SEC) || REEL_MIN_DURATION_SEC);
    const durationMs = safeDuration * 1000;
    const fps = 30;
    const mimeType = bestVideoMime();
    if (!mimeType) throw new Error('Seu Chrome não suporta geração de vídeo no painel.');

    const chunks = [];
    const videoStream = canvas.captureStream(fps);
    const stream = new MediaStream();
    videoStream.getVideoTracks().forEach((t) => stream.addTrack(t));

    let audioCtx = null;
    let voiceBuffer = null;
    const wantsAudio = soundtrack && soundtrack !== 'none';
    const stylePreset = soundtrack === 'auto' ? 'cinematic' : soundtrack;
    const bpm = ({ cinematic: 80, upbeat: 124, chill: 70, luxury: 78 })[stylePreset] || 90;
    if (wantsAudio || voiceover) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AC();
        const dest = audioCtx.createMediaStreamDestination();
        if (wantsAudio) buildSoundtrack(audioCtx, dest, durationMs / 1000, stylePreset);
        voiceBuffer = await loadVoiceoverBuffer(audioCtx, voiceover);
        if (voiceBuffer) {
          const src = audioCtx.createBufferSource();
          src.buffer = voiceBuffer;
          const gain = audioCtx.createGain();
          gain.gain.value = wantsAudio ? 1.15 : 1.35;
          src.connect(gain).connect(dest);
          src.start(audioCtx.currentTime + 0.35);
          src.stop(audioCtx.currentTime + Math.min(durationMs / 1000 - 0.25, voiceBuffer.duration + 0.35));
        }
        dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
      } catch (e) {
        console.warn('Áudio do Reel indisponível:', e);
      }
    }

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5_500_000, audioBitsPerSecond: 160_000 });
    recorder.ondataavailable = (ev) => { if (ev.data && ev.data.size) chunks.push(ev.data); };

    const done = new Promise((resolve, reject) => {
      recorder.onerror = () => reject(new Error('Falha ao gravar a prévia do Reel'));
      recorder.onstop = async () => {
        try {
          stream.getTracks().forEach((t) => t.stop());
          if (audioCtx) { try { await audioCtx.close(); } catch(_){} }
          const blob = new Blob(chunks, { type: mimeType });
          const dataUrl = await blobToDataUrl(blob);
          resolve({ blob, dataUrl, mimeType });
        } catch (e) { reject(e); }
      };
    });

    const sceneTexts = makeSceneTexts(title, script);
    // Distribui as cenas uniformemente pela duração real (>= 20s)
    const sceneCount = sceneTexts.length;
    const beatSec = 60 / bpm; // 1 beat da trilha
    const W = canvas.width, H = canvas.height;
    const drawCover = (elapsedMs, progress) => {
      const sceneIndex = Math.min(sceneCount - 1, Math.floor(progress * sceneCount));
      const sceneProgress = (progress * sceneCount) % 1;
      // Ken Burns por cena — recomeça o zoom a cada cena pra sensação de corte
      const zoom = 1.05 + sceneProgress * 0.22;
      const scale = Math.max(W / img.width, H / img.height) * zoom;
      const w = img.width * scale;
      const h = img.height * scale;
      const driftX = Math.sin(sceneProgress * Math.PI) * 40 * (sceneIndex % 2 ? 1 : -1);
      const driftY = -sceneProgress * 60;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, (W - w) / 2 + driftX, (H - h) / 2 + driftY, w, h);
      // Vinheta cinematográfica
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, 'rgba(0,0,0,.55)');
      g.addColorStop(0.35, 'rgba(0,0,0,.05)');
      g.addColorStop(0.7, 'rgba(0,0,0,.15)');
      g.addColorStop(1, 'rgba(0,0,0,.75)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      // Flash sincronizado com o beat da trilha
      const beatPhase = (elapsedMs / 1000) % beatSec;
      const flashAlpha = Math.max(0, 0.18 - beatPhase * 1.6);
      if (flashAlpha > 0.001) {
        ctx.fillStyle = `rgba(255,255,255,${flashAlpha.toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      }
      // Badge REEL IA
      ctx.fillStyle = 'rgba(212,175,55,.95)';
      ctx.fillRect(38, 60, 150, 40);
      ctx.fillStyle = '#0a0a0a';
      ctx.font = '900 22px system-ui, -apple-system, Segoe UI, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('★ REEL IA', 52, 88);
      // Progress bar top
      ctx.fillStyle = 'rgba(255,255,255,.15)';
      ctx.fillRect(38, 38, W - 76, 6);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(38, 38, (W - 76) * progress, 6);
      // Contador de cena
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.font = '700 18px system-ui, -apple-system, Segoe UI, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${sceneIndex + 1} / ${sceneCount}`, W - 40, 88);
      // Texto principal (aparece com bounce sincronizado)
      const enterProg = Math.min(1, sceneProgress * 3);
      const easeOut = 1 - Math.pow(1 - enterProg, 3);
      const textOpacity = enterProg;
      const textY = H * 0.55 + (1 - easeOut) * 40;
      const safeText = sceneTexts[sceneIndex] || title || 'MR Sem Limites';
      // Caixa
      ctx.fillStyle = `rgba(0,0,0,${(0.55 * textOpacity).toFixed(3)})`;
      ctx.fillRect(40, textY - 100, W - 80, 200);
      ctx.strokeStyle = `rgba(212,175,55,${(0.75 * textOpacity).toFixed(3)})`;
      ctx.lineWidth = 3;
      ctx.strokeRect(40, textY - 100, W - 80, 200);
      ctx.fillStyle = `rgba(255,255,255,${textOpacity.toFixed(3)})`;
      ctx.font = '900 44px system-ui, -apple-system, Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      wrapCanvasText(ctx, safeText, W / 2, textY - 40, W - 120, 52, 3);
      // Rodapé fixo
      ctx.fillStyle = 'rgba(0,0,0,.7)';
      ctx.fillRect(0, H - 110, W, 110);
      ctx.fillStyle = '#d4af37';
      ctx.font = '900 26px system-ui, -apple-system, Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MR SEM LIMITES', W / 2, H - 70);
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.font = '600 20px system-ui, -apple-system, Segoe UI, sans-serif';
      ctx.fillText('🎙 fala + trilha • @linkmrstore', W / 2, H - 38);
    };

    recorder.start(250);
    const started = performance.now();
    await new Promise((resolve) => {
      const tick = (now) => {
        const elapsed = now - started;
        const p = Math.min(1, elapsed / durationMs);
        drawCover(elapsed, p);
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    recorder.stop();
    return done;
  }



  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
    const words = String(text || '').split(/\s+/);
    const lines = [];
    let line = '';
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    lines.slice(0, maxLines).forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  }

  async function publishGeneratedMedia(dataUrl) {
    const r = await fetch(MEDIA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data_url: dataUrl }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || `Falha ao preparar URL pública da mídia (${r.status})`);
    return d.media_url;
  }

  // ============ 20 PROMPTS DE IMAGEM ============
  const IMG_PROMPTS = [
    { t: '☕ Café aesthetic', p: 'Café expresso fumegante em mesa de mármore branco, luz natural da manhã, folhagens desfocadas ao fundo, estética minimalista clean' },
    { t: '🍕 Food styling', p: 'Pizza artesanal recém-saída do forno, queijo derretendo, vapor visível, mesa rústica de madeira, luz cinematográfica dramática' },
    { t: '💇 Antes/depois beleza', p: 'Split screen antes e depois de um corte de cabelo feminino moderno, iluminação de estúdio profissional, fundo neutro elegante' },
    { t: '💪 Fitness motivacional', p: 'Atleta suando durante treino intenso, iluminação lateral dramática, academia moderna ao fundo desfocado, sensação de superação' },
    { t: '🏠 Imóvel de luxo', p: 'Sala de estar de casa de luxo, pé direito duplo, luz dourada do fim de tarde entrando pelas janelas, decoração minimalista chique' },
    { t: '👗 Moda editorial', p: 'Modelo feminina com look casual chique, pose confiante, fundo urbano desfocado, luz golden hour, estética editorial de revista' },
    { t: '💄 Produto cosmético', p: 'Batom vermelho premium em fundo bege pastel, sombras suaves, composição minimalista com pétalas de rosa espalhadas' },
    { t: '🌱 Empreendedor', p: 'Jovem empreendedor no notebook em café moderno, sorriso confiante, ambiente aconchegante com plantas, tom quente e inspirador' },
    { t: '🚗 Carro esportivo', p: 'Carro esportivo preto brilhante em rua molhada à noite, reflexos de neon roxo e azul, ângulo baixo dramático, estética cyberpunk' },
    { t: '✈️ Viagem paradisíaca', p: 'Praia caribenha com água cristalina turquesa, coqueiros balançando, drone view aérea, céu azul intenso, paradisíaco' },
    { t: '🎂 Confeitaria', p: 'Bolo de aniversário decorado com flores comestíveis, iluminação suave, mesa posta com detalhes rosa e dourado, elegante e delicado' },
    { t: '💍 Joia luxo', p: 'Anel de diamante em veludo preto, iluminação dramática pontual, reflexos brilhantes, macro fotografia, sensação premium' },
    { t: '🐕 Pet fofo', p: 'Golden retriever filhote brincando em jardim ensolarado, olhos expressivos, foco no rosto, luz natural quente, extremamente fofo' },
    { t: '📱 Tech gadget', p: 'Smartphone premium em superfície de vidro escuro, reflexos coloridos LED, ângulo 3/4, estética hi-tech moderna, fundo gradient neon' },
    { t: '🏋️ Antes/depois emagrecimento', p: 'Split screen transformação corporal, iluminação profissional idêntica, roupa esportiva, resultado real motivacional' },
    { t: '🍹 Drink bar', p: 'Coquetel tropical colorido com fumaça de gelo seco, gotas escorrendo pela taça, bar sofisticado ao fundo desfocado, luz âmbar' },
    { t: '🎨 Arte digital', p: 'Ilustração digital vibrante estilo cyberpunk, personagem feminina neon, cidade futurista ao fundo, cores roxo e ciano' },
    { t: '📚 Curso online', p: 'Setup home office aesthetic com notebook, caneca de café, caderno aberto, luz natural, planta na mesa, minimalista e produtivo' },
    { t: '🌸 Floricultura', p: 'Buquê de peônias rosa em vaso de vidro, mesa branca, luz difusa suave, estética pinterest romântica e delicada' },
    { t: '💰 Finanças/investimento', p: 'Gráficos de investimento subindo em tela de notebook, mãos digitando, ambiente executivo, tom azul confiança e crescimento' },
    { t: '🛡 MR Segurança Máxima', p: 'Câmera de segurança 4K premium instalada em fachada elegante de residência de alto padrão, luz noturna azul suave, foco no equipamento discreto, sensação de proteção total 24h, aesthetic profissional MR Segurança Máxima' },
    { t: '🚔 PAX Monitoramento', p: 'Central de monitoramento PAX 24 horas, múltiplas telas HD mostrando câmeras ao vivo, operador uniformizado atento, luz azul tecnológica, ambiente sério e confiável' },
    { t: '🚨 Alarme residencial', p: 'Kit de alarme residencial moderno com sensores, sirene e central digital, mesa branca minimalista, iluminação clean de produto, chamada para proteção da família' },
    { t: '👨‍🔧 Instalação técnica', p: 'Técnico uniformizado da MR Segurança instalando câmera CFTV em parede externa, capacete e cinto de ferramentas, dia ensolarado, aparência profissional e confiável' },
    { t: '🏢 Portaria remota', p: 'Portão automático de condomínio se abrindo remotamente com portaria virtual, moradores tranquilos, tecnologia PAX visível, tom azul confiança' },
    { t: '🔒 Cerca elétrica', p: 'Cerca elétrica industrial instalada em muro alto, isoladores brancos alinhados, céu ao entardecer, foco na proteção perimetral, aesthetic Link MR Store' },
    { t: '💻 Produto digital ebook', p: 'Mockup 3D de ebook premium flutuando com capa dourada e preta, fundo gradiente escuro com partículas douradas, iluminação cinematográfica, aesthetic infoproduto high ticket, sensação de valor e transformação' },
    { t: '🎓 Curso online mockup', p: 'Mockup de curso online exibido em notebook, tablet e celular flutuando, tela mostrando módulos de aula, fundo dark premium com detalhes dourados, chamada visual "Método comprovado"' },
    { t: '📦 Combo infoproduto', p: 'Combo de produtos digitais mockup (ebook + curso + bônus), composição em pilha 3D, badges "BÔNUS EXCLUSIVO" e "GARANTIA 7 DIAS", fundo preto com halo dourado, super oferta' },
    { t: '🚀 Fanpage lançamento', p: 'Capa de fanpage Instagram/Facebook estilo lançamento, tipografia bold impactante "TRANSFORME SUA VIDA", fotos do produto em destaque, cores da marca vibrantes, CTA visual "Link na bio"' },
    { t: '💥 Post fanpage carrossel', p: 'Slide de carrossel Instagram estilo fanpage viral, headline grande "VOCÊ ESTÁ PERDENDO DINHEIRO ASSIM", fundo colorido chamativo, emoji estratégico, tipografia sans-serif bold, alto engajamento' },
    { t: '📈 Página de vendas hero', p: 'Hero de landing page de vendas, headline poderosa "O método que mudou minha vida", mockup do produto ao lado, botão CTA laranja "QUERO AGORA", provas sociais visíveis, layout conversão' },
    { t: '⭐ Depoimento cliente VSL', p: 'Print de depoimento real de cliente satisfeita com resultado, foto antes/depois ao lado, estrelas 5/5, texto autêntico em destaque, fundo neutro credibilidade, prova social para página de vendas' },
    { t: '💰 Oferta irresistível', p: 'Banner de oferta com preço riscado "De R$ 1997 por R$ 297", countdown regressivo "OFERTA ACABA EM", selo de garantia dourado, fundo vermelho urgência, alta conversão' },
    { t: '🎁 Bônus exclusivos', p: 'Composição visual de bônus empilhados (ebooks, planilhas, checklists), etiqueta "GRÁTIS AO COMPRAR HOJE", valor total em destaque "+R$ 3.500 em bônus", fundo dourado luxo' },
    { t: '🔥 Post viral fanpage', p: 'Post fanpage estilo viral com pergunta impactante "Você faria isso pelos seus filhos?", imagem emocional ao fundo, tipografia branca com sombra, CTA "Comenta SIM", máximo engajamento' },
  ];

  // ============ 20 PROMPTS DE VÍDEO (Reels) ============
  const VID_PROMPTS = [
    { t: '🎬 Transição cinematográfica', p: 'Reel vertical 9:16 com transição cinematográfica suave, câmera aproximando lentamente, iluminação golden hour, movimento fluido' },
    { t: '⚡ Reel dinâmico produto', p: 'Vídeo vertical de produto girando 360°, fundo colorido gradiente, câmera orbital, luz de estúdio, música energética implícita' },
    { t: '🍔 Food porn slow motion', p: 'Slow motion de hambúrguer sendo montado, queijo derretendo em câmera lenta, close-up macro, iluminação apetitosa dramática' },
    { t: '💪 Treino motivacional', p: 'Sequência rápida de atleta treinando, cortes rítmicos, câmera dinâmica, suor visível, ambiente de academia, energia intensa' },
    { t: '🏠 Tour imóvel', p: 'Tour aéreo suave por sala de luxo, câmera deslizando pelos ambientes, luz natural entrando, sensação de espaço e sofisticação' },
    { t: '🎨 Timelapse artístico', p: 'Timelapse de pintura sendo criada, mãos do artista visíveis, cores vibrantes surgindo, câmera fixa top-down, satisfying' },
    { t: '💇 Transformação beleza', p: 'Reel de transformação capilar com cortes rápidos, antes/durante/depois, close-ups de detalhes, iluminação profissional' },
    { t: '☕ ASMR café', p: 'ASMR de preparação de café expresso, close-up do vapor, latte art sendo desenhada, sons implícitos suaves, estética cozy' },
    { t: '🚗 Test drive', p: 'Carro esportivo acelerando em estrada cênica, câmera drone acompanhando, pôr do sol, sensação de velocidade e liberdade' },
    { t: '✈️ Aventura viagem', p: 'Montagem rápida de destinos paradisíacos, cortes com música, drone shots, praias, montanhas, cidades icônicas' },
    { t: '💃 Dança viral', p: 'Reel de dança com coreografia viral trending, movimento sincronizado, iluminação colorida LED, energia jovem e divertida' },
    { t: '📱 Unboxing tech', p: 'Unboxing satisfying de gadget premium, close-ups macro, mãos abrindo com cuidado, revelação dramática do produto' },
    { t: '🎂 Confeitaria processo', p: 'Timelapse de decoração de bolo, cobertura sendo aplicada, flores comestíveis posicionadas, câmera fixa top-down' },
    { t: '🌊 Natureza calming', p: 'Ondas do mar batendo em câmera lenta ao pôr do sol, movimento hipnótico, cores douradas e roxas, calmante e estético' },
    { t: '🎯 Antes/depois design', p: 'Split screen de reforma de ambiente, transformação total, mesma câmera antes e depois, revelação impactante' },
    { t: '🐕 Pet trick', p: 'Cachorro executando truque fofo, câmera lenta na hora do salto, close no rosto expressivo, jardim ensolarado' },
    { t: '💼 Rotina empreendedor', p: 'Day in the life de empreendedor, cortes rápidos de reuniões, notebook, café, ambiente moderno, motivacional' },
    { t: '💄 Tutorial makeup', p: 'Tutorial de maquiagem em cortes rápidos, close no olho, aplicação de produtos, resultado final glamoroso' },
    { t: '🏋️ Progresso fitness', p: 'Reel de progresso mensal de treino, split screen semanal, mesma pose e iluminação, transformação real motivacional' },
    { t: '🎁 Reveal produto', p: 'Reveal dramático de produto novo, caixa abrindo em slow motion, iluminação teatral, música building implícita, expectativa' },
    { t: '🛡 Tour MR Segurança', p: 'Reel vertical 9:16 apresentando serviços da MR Segurança Máxima, cortes rápidos de câmeras 4K, sensores, alarmes e equipe técnica em ação, tom cinematográfico azul confiança, CTA final "Proteja sua família"' },
    { t: '🚔 PAX 24h operação', p: 'Reel mostrando central PAX em operação 24 horas, câmera aproximando das telas ao vivo, operadores atentos, transição para viatura em ronda noturna, energia séria e profissional' },
    { t: '🚨 Antes/depois alarme', p: 'Reel split screen residência sem proteção vs residência com alarme MR ativo, transição impactante, texto na tela "Sua casa protegida em 24h", CTA WhatsApp' },
    { t: '👨‍🔧 Instalação em 1 dia', p: 'Timelapse vertical de instalação completa de CFTV em residência, técnicos MR trabalhando, sequência montagem/teste/entrega ao cliente sorrindo, música motivacional implícita' },
    { t: '💻 VSL produto digital', p: 'Reel vertical 9:16 estilo VSL (video sales letter), abertura com pergunta impactante em texto grande "E se em 30 dias você pudesse...", cortes rápidos mostrando ebook/curso mockup, depoimentos flutuando, CTA final "Link na bio, corre!"' },
    { t: '🚀 Lançamento infoproduto', p: 'Reel de lançamento de produto digital, countdown 3-2-1, reveal do mockup com efeito de brilho dourado, cortes rítmicos, tipografia bold pulsando, música building implícita, aesthetic high ticket' },
    { t: '📱 Fanpage post viral', p: 'Reel formato fanpage viral, headline provocativa aparecendo em texto grande frame a frame, imagens de apoio em cortes rápidos, ritmo alucinante 30fps, CTA "Salva esse Reel", máximo alcance orgânico' },
    { t: '📈 Antes/depois método', p: 'Reel split screen antes/depois usando o método/produto digital, transformação real com prints de resultado, texto na tela "Em 7 dias eu consegui isso", credibilidade máxima, conversão' },
    { t: '⭐ Depoimento em vídeo', p: 'Reel de depoimento de cliente falando resultado real do infoproduto, câmera selfie natural, legendas grandes na tela destacando trechos, autenticidade total, prova social poderosa' },
    { t: '💰 Oferta relâmpago', p: 'Reel de oferta relâmpago com countdown gigante na tela, animação de preço caindo "R$ 1997 → R$ 297", zoom no botão "COMPRAR AGORA", urgência máxima, CTA final "Link na bio ANTES QUE ACABE"' },
    { t: '🎁 Reveal bônus curso', p: 'Reel revelando bônus exclusivos do curso um a um, cada bônus surge com efeito de brilho e valor "+R$ 497", contador acumulando "VOCÊ RECEBE +R$ 3.500", CTA "Garante o seu"' },
    { t: '🔥 Story de venda direta', p: 'Reel formato story de vendas, host aparecendo na tela falando direto para câmera, cortes com prints do produto, prova social piscando, energia alta, encerramento "Bora mudar sua vida? Link na bio"' },
    { t: '📄 Página de vendas walkthrough', p: 'Reel scrollando por landing page de vendas real, mostrando headline, prova social, bônus e botão CTA, tipografia em destaque, aesthetic profissional, ensinando o funil de conversão' },
  ];

  const IG_ACCOUNT_KEY = 'mrsl_ig_account';
  function loadAccount() {
    return new Promise((r) => {
      try { chrome.storage.local.get([IG_ACCOUNT_KEY], (d) => r(d[IG_ACCOUNT_KEY] || null)); }
      catch (_) { r(null); }
    });
  }
  function saveAccount(a) {
    return new Promise((r) => { try { chrome.storage.local.set({ [IG_ACCOUNT_KEY]: a }, r); } catch(_){ r(); } });
  }
  function clearAccount() {
    return new Promise((r) => { try { chrome.storage.local.remove([IG_ACCOUNT_KEY], r); } catch(_){ r(); } });
  }

  async function refreshStatus() {
    const st = $('igStatusText'), info = $('igAccountInfo'), pub = $('igPublishCard');
    const bc = $('igConnectBtn'), bd = $('igDisconnectBtn');
    const acc = await loadAccount();
    if (acc && acc.access_token) {
      if (st) st.textContent = '🟢 Conectado';
      if (info) { info.style.display = 'block'; info.innerHTML = `<b>@${acc.username || '-'}</b><br><span style="opacity:.6">ID ${acc.ig_user_id || '-'}</span>`; }
      if (pub) pub.style.display = 'block';
      if (bc) { bc.textContent = '🔄 Reconectar Instagram'; bc.disabled = false; bc.style.opacity = '1'; bc.style.cursor = 'pointer'; }
      if (bd) bd.style.display = 'block';
    } else {
      if (st) st.textContent = '🔴 Não conectado';
      if (info) { info.style.display = 'block'; info.textContent = 'Faça login com sua conta do Instagram para publicar.'; }
      if (pub) pub.style.display = 'none';
      if (bc) { bc.textContent = '📸 Conectar Instagram'; bc.disabled = false; bc.style.opacity = '1'; bc.style.cursor = 'pointer'; }
      if (bd) bd.style.display = 'none';
    }
  }

  async function startOAuth() {
    try {
      const returnUrl = chrome.runtime.getURL('sidepanel.html');
      const url = `${BASE}/api/public/instagram-oauth-start?ext_return=${encodeURIComponent(returnUrl)}`;
      const w = window.open(url, 'ig_oauth', 'width=560,height=720');
      const handler = async (ev) => {
        if (!ev.data || ev.data.type !== 'MRSL_IG_CONNECTED') return;
        window.removeEventListener('message', handler);
        await saveAccount(ev.data.account);
        await refreshStatus();
        try { w && w.close(); } catch(_){}
        log('✅ Instagram conectado', true);
      };
      window.addEventListener('message', handler);
    } catch (e) {
      log('❌ ' + (e?.message || e), false);
    }
  }

  async function disconnect() {
    await clearAccount();
    await refreshStatus();
    log('🔌 Desconectado do Instagram');
  }

  async function generate() {
    const prompt = ($('igPrompt')?.value || '').trim();
    if (!prompt) return log('❌ Descreva o que você quer gerar', false);
    const btn = $('igGenerateBtn');
    const isReel = currentType === 'reel';
    const duration = Math.max(REEL_MIN_DURATION_SEC, Number($('igDuration')?.value || REEL_MIN_DURATION_SEC) || REEL_MIN_DURATION_SEC);
    const soundtrack = ($('igSoundtrack')?.value) || 'auto';
    const voiceMode = ($('igVoiceMode')?.value) || 'male_consultant';
    const aiPick = getAiPick();
    setBusy(btn, true, isReel ? '⏳ Gerando Reel 20s com fala…' : '⏳ Gerando imagem + legenda…');
    log(isReel ? `⏳ Gerando roteiro, fala, trilha e vídeo de ${duration}s com ${aiModeLabel()}…` : '⏳ Gerando com IA (pode levar ~15s)…');
    try {
      const apiType = currentType === 'viral' ? 'post' : currentType;
      const finalPrompt = currentType === 'viral' ? `[Foco em máximo engajamento viral] ${prompt}` : prompt;
      const d = createLocalCreative(finalPrompt, apiType, duration, aiPick);
      const img = $('igPreviewImg');
      const vid = $('igPreviewVideo');
      const wrap = $('igPreviewImgWrap');
      const plan = $('igVideoPlan');
      lastGeneratedMime = '';
      $('igMediaUrl').value = '';
      if (lastPreviewObjectUrl) { URL.revokeObjectURL(lastPreviewObjectUrl); lastPreviewObjectUrl = ''; }
      if (vid) { try { vid.pause(); } catch(_){} vid.style.display = 'none'; vid.removeAttribute('src'); }
      if (img) { img.style.display = 'none'; img.removeAttribute('src'); }
      if (wrap) wrap.style.minHeight = '100px';
      if (plan) { plan.style.display = 'none'; plan.textContent = ''; }

      if (d.media_url) {
        if (currentType === 'reel') {
          // Reel: gera um vídeo vertical de no mínimo 20s com fala/voz + trilha, usando a capa IA como frame base.
          if (img) { img.src = d.media_url; img.style.display = 'block'; }
          log(`🎬 Montando Reel de ${duration}s com roteiro, fala e trilha…`);
          try {
            // Usa base64 direto (sem CORS) pra carregar no canvas sem taint
            const canvasSrc = d.media_b64 ? `data:image/png;base64,${d.media_b64}` : d.media_url;
            const rec = await makeReelPreviewFromImage(canvasSrc, d.title || '', soundtrack === 'auto' ? 'cinematic' : soundtrack, d.voiceover || d.caption || '', d.video_script || '', duration);
            if (!/^video\/(mp4|quicktime)/i.test(rec.mimeType)) {
              throw new Error('Seu Chrome gerou vídeo WebM, mas o Instagram só aceita MP4/MOV para Reel. Atualize o Chrome e tente de novo.');
            }
            const publicUrl = await publishGeneratedMedia(rec.dataUrl);
            lastGeneratedMime = rec.mimeType;
            $('igMediaUrl').value = publicUrl;
            if (img) { img.style.display = 'none'; img.removeAttribute('src'); }
            if (vid) {
              lastPreviewObjectUrl = URL.createObjectURL(rec.blob);
              vid.src = lastPreviewObjectUrl;
              vid.style.display = 'block';
              try { vid.play(); } catch(_){}
            }
            if (plan && d.video_script) {
              plan.textContent = '🎬 Roteiro sugerido para o Reel:\n' + d.video_script
                + (d.voiceover ? '\n\n🎙️ Fala/locução:\n' + d.voiceover : '')
                + (d.soundtrack_suggestion ? '\n\n🎵 Trilha sugerida:\n' + d.soundtrack_suggestion : '');
              plan.style.display = 'block';
            }
          } catch (err) {
            if (img) { img.src = d.media_url; img.style.display = 'block'; }
            if (plan) {
              plan.textContent = '⚠️ A capa e o roteiro foram gerados, mas o navegador bloqueou a montagem do vídeo completo.\n\n' + (d.video_script || '') + (d.voiceover ? '\n\n🎙️ Fala/locução:\n' + d.voiceover : '');
              plan.style.display = 'block';
            }
            $('igMediaUrl').value = '';
            throw new Error('Não consegui finalizar o vídeo de 20s neste navegador. Gere novamente ou selecione Veo 3 na aba IAs antes de publicar. ' + (err?.message || ''));
          }
        } else {
          // Instagram só aceita JPEG para imagens. Converte PNG->JPEG no canvas e re-envia.
          if (img) { img.src = d.media_url; img.style.display = 'block'; }
          try {
            const srcData = d.media_b64 ? `data:image/png;base64,${d.media_b64}` : d.media_url;
            const im = new Image();
            im.crossOrigin = 'anonymous';
            await new Promise((res, rej) => { im.onload = res; im.onerror = rej; im.src = srcData; });
            const cv = document.createElement('canvas');
            cv.width = im.naturalWidth || 1080;
            cv.height = im.naturalHeight || 1080;
            const cx = cv.getContext('2d');
            cx.fillStyle = '#ffffff';
            cx.fillRect(0, 0, cv.width, cv.height);
            cx.drawImage(im, 0, 0);
            const jpegDataUrl = cv.toDataURL('image/jpeg', 0.92);
            const jpegUrl = await publishGeneratedMedia(jpegDataUrl);
            $('igMediaUrl').value = jpegUrl;
          } catch (err) {
            log('⚠️ Falha ao converter para JPEG, usando URL original. ' + (err?.message || ''), false);
            throw new Error('A imagem precisa ser convertida para JPEG antes de publicar. Gere novamente para evitar “formato não suportado”.');
          }
        }
      } else {
        throw new Error('A IA não retornou uma imagem. Tente um prompt mais simples.');
      }
      $('igCaption').value = d.caption || '';
      $('igPreview').style.display = 'block';
      log('✅ Prévia pronta. Confira, edite a legenda e clique em Publicar.', true);
    } catch (e) {
      log('❌ ' + (e?.message || e), false);
    } finally {
      setBusy(btn, false);
    }
  }

  function openBigPreview() {
    const media_url = ($('igMediaUrl')?.value || '').trim();
    if (!media_url) {
      log('❌ Gere a mídia primeiro para abrir a prévia grande', false);
      return;
    }
    const caption = ($('igCaption')?.value || '').trim();
    // Extrai título (primeira linha) se estiver no formato título + \n\n + resto
    const parts = caption.split(/\n\n+/);
    const title = parts.length > 1 ? parts[0] : '';
    const body = parts.length > 1 ? parts.slice(1).join('\n\n') : caption;
    const base = 'https://mrsemlimitesext.lovable.app/instagram-preview';
    const url = base
      + '?media=' + encodeURIComponent(media_url)
      + '&type=' + encodeURIComponent(currentType === 'viral' ? 'post' : currentType)
      + '&title=' + encodeURIComponent(title)
      + '&caption=' + encodeURIComponent(body);
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
      log('🔍 Prévia aberta em nova aba do painel', true);
    } catch (e) {
      log('❌ Não foi possível abrir a prévia: ' + (e?.message || e), false);
    }
  }


  async function publish() {
    const media_url = ($('igMediaUrl')?.value || '').trim();
    const caption = ($('igCaption')?.value || '').trim();
    if (!media_url) return log('❌ Gere a mídia antes de publicar', false);
    const acc = await loadAccount();
    if (!acc || !acc.access_token) {
      return log('❌ Conecte sua conta do Instagram primeiro', false);
    }
    const btn = $('igPublishBtn');
    setBusy(btn, true, '⏳ Publicando…');
    log('⏳ Enviando ao Instagram…');
    try {
      const apiType = currentType === 'viral' ? 'post' : currentType;
      const r = await fetch(PUBLISH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: acc.access_token,
          ig_user_id: acc.ig_user_id,
          type: apiType,
          media_url,
          caption,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      log(`✅ Publicado! ID ${d.id}`, true);
      $('igPrompt').value = ''; $('igCaption').value = ''; $('igMediaUrl').value = '';
      $('igPreview').style.display = 'none';
    } catch (e) {
      log('❌ ' + (e?.message || e), false);
    } finally {
      setBusy(btn, false);
    }
  }

  function renderPromptGrid(gridId, items) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach((it) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.style.cssText = 'text-align:left;padding:10px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#fff;cursor:pointer;transition:.15s';
      card.innerHTML = `<div style="font-weight:600;font-size:13px;margin-bottom:4px">${it.t}</div><div style="font-size:11px;opacity:.7;line-height:1.4">${it.p}</div>`;
      card.addEventListener('mouseenter', () => { card.style.background = 'rgba(225,48,108,.12)'; card.style.borderColor = 'rgba(225,48,108,.4)'; });
      card.addEventListener('mouseleave', () => { card.style.background = 'rgba(255,255,255,.03)'; card.style.borderColor = 'rgba(255,255,255,.1)'; });
      card.addEventListener('click', () => {
        $('igPrompt').value = it.p;
        // Auto-seleciona o tipo: vídeo → Reel; imagem → Post
        setType(gridId === 'igVidPromptGrid' ? 'reel' : 'post');
        // Volta pra sub-aba Criar
        switchSub('create');
        $('igPrompt').focus();
      });
      grid.appendChild(card);
    });
  }

  function switchSub(sub) {
    document.querySelectorAll('.igSubTab').forEach((b) => {
      const active = b.dataset.sub === sub;
      b.classList.toggle('active', active);
      b.style.background = active ? 'rgba(225,48,108,.25)' : 'transparent';
      b.style.fontWeight = active ? '600' : '400';
    });
    document.querySelectorAll('.igSubPanel').forEach((p) => {
      p.style.display = p.dataset.sub === sub ? 'block' : 'none';
    });
  }

  function wire() {
    if (!$('igConnectBtn')) return false;
    $('igConnectBtn').addEventListener('click', startOAuth);
    const bd = $('igDisconnectBtn');
    if (bd) bd.addEventListener('click', disconnect);
    document.querySelectorAll('.igTypeBtn').forEach((b) => {
      b.addEventListener('click', () => setType(b.dataset.type));
    });
    document.querySelectorAll('.igSubTab').forEach((b) => {
      b.addEventListener('click', () => switchSub(b.dataset.sub));
    });
    $('igGenerateBtn')?.addEventListener('click', generate);
    $('igRegenBtn')?.addEventListener('click', generate);
    $('igPublishBtn')?.addEventListener('click', publish);
    $('igOpenPreviewBtn')?.addEventListener('click', openBigPreview);


    renderPromptGrid('igImgPromptGrid', IMG_PROMPTS);
    renderPromptGrid('igVidPromptGrid', VID_PROMPTS);

    updateModeCopy();
    refreshStatus();
    return true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { if (!wire()) setTimeout(wire, 500); });
  } else {
    if (!wire()) setTimeout(wire, 500);
  }
})();
