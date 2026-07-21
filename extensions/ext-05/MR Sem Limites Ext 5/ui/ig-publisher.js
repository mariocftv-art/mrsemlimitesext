/**
 * MR Sem Limites EXT5 — Instagram Publisher V2
 * Fluxo: usuário descreve → IA gera imagem + legenda → prévia → publica.
 * Conta @linkmrstore usa token do servidor (Lovable Cloud).
 */
(function () {
  const BASE = 'https://mrsemlimitesext.lovable.app';
  const STATUS_URL = BASE + '/api/public/instagram-status';
  const GEN_URL = BASE + '/api/public/instagram-generate';
  const PUBLISH_URL = BASE + '/api/public/instagram-publish';

  const $ = (id) => document.getElementById(id);
  const log = (m, ok) => {
    const el = $('igPublishLog'); if (!el) return;
    const c = ok === true ? '#4ade80' : ok === false ? '#f87171' : '#e8faff';
    el.innerHTML = `<div style="color:${c}">• ${m}</div>` + el.innerHTML;
  };

  let currentType = 'post';

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
  ];

  async function refreshStatus() {
    const st = $('igStatusText'), info = $('igAccountInfo'), pub = $('igPublishCard');
    const bc = $('igConnectBtn'), bd = $('igDisconnectBtn');
    try {
      const r = await fetch(STATUS_URL, { cache: 'no-store' });
      const d = await r.json();
      if (d.connected) {
        st.textContent = '🟢 Conectado';
        info.style.display = 'block';
        info.innerHTML = `<b>@${d.username || '-'}</b> · ${d.account_type || 'IG'}<br><span style="opacity:.6">ID ${d.id}</span>`;
        if (pub) pub.style.display = 'block';
        if (bc) { bc.textContent = '✓ Conectado via servidor'; bc.disabled = true; bc.style.opacity = '.6'; bc.style.cursor = 'default'; }
        if (bd) bd.style.display = 'none';
      } else {
        st.textContent = '🔴 Não conectado';
        info.style.display = 'block';
        info.textContent = d.error || 'Token não configurado';
        if (pub) pub.style.display = 'none';
      }
    } catch (e) {
      st.textContent = '⚠️ Erro ao verificar';
      info.style.display = 'block';
      info.textContent = String(e?.message || e);
    }
  }

  async function generate() {
    const prompt = ($('igPrompt')?.value || '').trim();
    if (!prompt) return log('❌ Descreva o que você quer gerar', false);
    const btn = $('igGenerateBtn');
    const orig = btn.textContent;
    btn.disabled = true; btn.textContent = '⏳ Gerando imagem + legenda…';
    log('⏳ Gerando com IA (pode levar ~15s)…');
    try {
      // Viral é tratado como post com prompt mais chamativo
      const apiType = currentType === 'viral' ? 'post' : currentType;
      const finalPrompt = currentType === 'viral' ? `[Foco em máximo engajamento viral] ${prompt}` : prompt;
      const r = await fetch(GEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, type: apiType, media: currentType !== 'reel' }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      // Preencher preview
      if (d.media_url) {
        $('igPreviewImg').src = d.media_url;
        $('igPreviewImgWrap').style.display = 'flex';
        $('igMediaUrl').value = d.media_url;
      } else if (currentType === 'reel') {
        $('igPreviewImg').removeAttribute('src');
        $('igPreviewImgWrap').innerHTML = '<div style="padding:20px;text-align:center;opacity:.7;font-size:12px">🎬 Reel: cole a URL do vídeo MP4 no campo abaixo para publicar</div>';
        // Para Reel, mostrar campo de URL manual
        if (!document.getElementById('igReelUrl')) {
          const inp = document.createElement('input');
          inp.id = 'igReelUrl'; inp.type = 'url'; inp.placeholder = 'https://…vídeo.mp4';
          inp.style.cssText = 'width:100%;padding:10px;margin:8px 0;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff';
          inp.addEventListener('input', () => { $('igMediaUrl').value = inp.value.trim(); });
          $('igPreview').insertBefore(inp, $('igPreview').querySelector('label'));
        }
      }
      $('igCaption').value = d.caption || '';
      $('igPreview').style.display = 'block';
      log('✅ Prévia pronta. Edite se quiser e clique em Publicar.', true);
    } catch (e) {
      log('❌ ' + (e?.message || e), false);
    } finally {
      btn.disabled = false; btn.textContent = orig;
    }
  }

  async function publish() {
    const media_url = ($('igMediaUrl')?.value || '').trim();
    const caption = ($('igCaption')?.value || '').trim();
    if (!media_url) return log('❌ Gere a mídia antes de publicar', false);
    const btn = $('igPublishBtn');
    const orig = btn.textContent;
    btn.disabled = true; btn.textContent = '⏳ Publicando…';
    log('⏳ Enviando ao Instagram…');
    try {
      const apiType = currentType === 'viral' ? 'post' : currentType;
      const r = await fetch(PUBLISH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ use_server_token: true, type: apiType, media_url, caption }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      log(`✅ Publicado! ID ${d.id}`, true);
      // reset
      $('igPrompt').value = ''; $('igCaption').value = ''; $('igMediaUrl').value = '';
      $('igPreview').style.display = 'none';
    } catch (e) {
      log('❌ ' + (e?.message || e), false);
    } finally {
      btn.disabled = false; btn.textContent = orig;
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

    refreshStatus();
    return true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { if (!wire()) setTimeout(wire, 500); });
  } else {
    if (!wire()) setTimeout(wire, 500);
  }
})();
