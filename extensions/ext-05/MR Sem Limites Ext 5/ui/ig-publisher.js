/**
 * MR Sem Limites EXT5 — Instagram Publisher V2
 * Fluxo: usuário descreve → IA gera prévia + legenda → confirma → publica.
 * Conta @linkmrstore usa token do servidor (Lovable Cloud).
 */
(function () {
  const BASE = 'https://mrsemlimitesext.lovable.app';
  const STATUS_URL = BASE + '/api/public/instagram-status';
  const GEN_URL = BASE + '/api/public/instagram-generate';
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
    if (currentType === 'reel') {
      if (label) label.textContent = 'Descreva o Reel que você quer (a IA gera capa, prévia animada, título, legenda e hashtags)';
      if (prompt) prompt.placeholder = 'Ex: um Reel cinematográfico da minha loja Link MR Store, mostrando tecnologia, luxo e confiança, com movimento de câmera e final chamando para seguir…';
      if (btn) btn.textContent = '🎬 Gerar vídeo + legenda';
    } else {
      if (label) label.textContent = 'Descreva o que você quer (a IA gera a prévia, título, legenda e hashtags)';
      if (prompt) prompt.placeholder = 'Ex: um café expresso fumegante em mesa de mármore, luz de manhã, estética minimalista para minha cafeteria…';
      if (btn) btn.textContent = currentType === 'carousel' ? '🖼 Gerar carrossel + legenda' : '🎨 Gerar imagem + legenda';
    }
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
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

  async function makeReelPreviewFromImage(imageUrl, title) {
    if (!HTMLCanvasElement.prototype.captureStream || !window.MediaRecorder) {
      throw new Error('Seu navegador não liberou gravação de vídeo no painel. Atualize o Chrome e tente de novo.');
    }
    const img = await loadImage(imageUrl);
    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas indisponível para gerar vídeo');

    const durationMs = 6200;
    const fps = 30;
    const mimeType = bestVideoMime();
    if (!mimeType) throw new Error('Seu Chrome não suporta geração de vídeo no painel.');

    const chunks = [];
    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3_200_000 });
    recorder.ondataavailable = (ev) => { if (ev.data && ev.data.size) chunks.push(ev.data); };

    const done = new Promise((resolve, reject) => {
      recorder.onerror = () => reject(new Error('Falha ao gravar a prévia do Reel'));
      recorder.onstop = async () => {
        try {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: mimeType });
          const dataUrl = await blobToDataUrl(blob);
          resolve({ blob, dataUrl, mimeType });
        } catch (e) { reject(e); }
      };
    });

    const drawCover = (progress) => {
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * (1 + progress * 0.12);
      const w = img.width * scale;
      const h = img.height * scale;
      const driftX = Math.sin(progress * Math.PI * 2) * 18;
      const driftY = -progress * 24;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - w) / 2 + driftX, (canvas.height - h) / 2 + driftY, w, h);
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, 'rgba(0,0,0,.18)');
      g.addColorStop(0.62, 'rgba(0,0,0,.05)');
      g.addColorStop(1, 'rgba(0,0,0,.55)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,.96)';
      ctx.font = '700 28px system-ui, -apple-system, Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      const safeTitle = (title || 'MR Sem Limites').slice(0, 44);
      wrapCanvasText(ctx, safeTitle, canvas.width / 2, canvas.height - 112, canvas.width - 80, 34);
      ctx.font = '600 20px system-ui, -apple-system, Segoe UI, sans-serif';
      ctx.fillStyle = 'rgba(255,219,232,.95)';
      ctx.fillText('@linkmrstore', canvas.width / 2, canvas.height - 48);
    };

    recorder.start(250);
    const started = performance.now();
    await new Promise((resolve) => {
      const tick = (now) => {
        const p = Math.min(1, (now - started) / durationMs);
        drawCover(p);
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    recorder.stop();
    return done;
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
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
    lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
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
    setBusy(btn, true, '⏳ Gerando imagem + legenda…');
    log('⏳ Gerando com IA (pode levar ~15s)…');
    try {
      const apiType = currentType === 'viral' ? 'post' : currentType;
      const finalPrompt = currentType === 'viral' ? `[Foco em máximo engajamento viral] ${prompt}` : prompt;
      const r = await fetch(GEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, type: apiType, media: true }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
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
        if (img) { img.src = d.media_url; img.style.display = 'block'; }
        $('igMediaUrl').value = d.media_url;
        if (currentType === 'reel' && plan && d.video_script) {
          plan.textContent = '🎬 Roteiro sugerido para o Reel:\n' + d.video_script;
          plan.style.display = 'block';
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
        // Se for prompt de vídeo, marca Reel
        if (gridId === 'igVidPromptGrid') {
          document.querySelectorAll('.igTypeBtn').forEach((b) => {
            const isReel = b.dataset.type === 'reel';
            b.classList.toggle('active', isReel);
            b.style.background = isReel ? 'rgba(225,48,108,.15)' : 'transparent';
            b.style.border = isReel ? '1px solid rgba(225,48,108,.4)' : '1px solid rgba(255,255,255,.1)';
          });
          currentType = 'reel';
        }
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
    $('igConnectBtn').addEventListener('click', refreshStatus);
    const bd = $('igDisconnectBtn'); if (bd) bd.style.display = 'none';
    document.querySelectorAll('.igTypeBtn').forEach((b) => {
      b.addEventListener('click', () => {
        currentType = b.dataset.type;
        updateModeCopy();
        document.querySelectorAll('.igTypeBtn').forEach((x) => {
          x.classList.remove('active');
          x.style.background = 'transparent';
          x.style.border = '1px solid rgba(255,255,255,.1)';
        });
        b.classList.add('active');
        b.style.background = 'rgba(225,48,108,.15)';
        b.style.border = '1px solid rgba(225,48,108,.4)';
      });
    });
    document.querySelectorAll('.igSubTab').forEach((b) => {
      b.addEventListener('click', () => switchSub(b.dataset.sub));
    });
    $('igGenerateBtn')?.addEventListener('click', generate);
    $('igRegenBtn')?.addEventListener('click', generate);
    $('igPublishBtn')?.addEventListener('click', publish);

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
