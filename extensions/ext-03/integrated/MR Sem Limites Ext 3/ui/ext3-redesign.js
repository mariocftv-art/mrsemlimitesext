/*
 * MR Sem Limites Ext 3 — Redesign (Home + Componentes)
 * ────────────────────────────────────────────────────
 * - Home: orbe grande centralizada, badges ATIVA / dias no header,
 *   card "Modo conversa ativo", relógio/timer/menu movidos para dropdown do ⋮.
 * - Aba Componentes: grid 2×4 de botões neon (Corrigir/Refatorar/Melhorar/
 *   Otimizar/Segurança/Responsivo/Analisar/Debug) + histórico de prompts.
 * - Não altera licença, backend, envio nativo, mic bridge nem outras abas.
 * - Executa somente após #ext3-home existir (script adicionado ao fim do body).
 */
(() => {
  'use strict';

  /* ==============================
   *  CSS
   * ============================== */
  const CSS = `
    /* ============ HEADER BADGES ============ */
    .nc-header-badges { display:flex; flex-direction:column; gap:6px; align-items:flex-end; margin-right:4px; }
    .nc-badge-active { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px;
      background:rgba(61,255,176,.12); border:1px solid rgba(61,255,176,.5);
      color:#8affc9; font-size:11px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }
    .nc-badge-active .nc-badge-dot { width:6px; height:6px; border-radius:50%;
      background:#3dffb0; box-shadow:0 0 8px #3dffb0; animation:ncPulseDot 1.6s ease-in-out infinite; }
    .nc-badge-days { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:999px;
      background:rgba(75,214,255,.08); border:1px solid rgba(75,214,255,.32);
      color:#c8e8ff; font-size:10.5px; font-weight:700; }
    @keyframes ncPulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.55} }

    /* ============ HOME COMPACTA ============ */
    #ext3-home .nc-clock-card,
    #ext3-home .nc-timer-card,
    #ext3-home > .nc-menu { display:none !important; }

    #ext3-home .nc-work {
      border:none !important; background:transparent !important; box-shadow:none !important;
      padding:24px 0 12px !important; margin-bottom:14px;
      align-items:center; text-align:center;
    }
    #ext3-home .nc-work-title { display:none; }
    #ext3-home .nc-orb {
      width:clamp(200px, 62vw, 260px) !important;
      height:clamp(200px, 62vw, 260px) !important;
      pointer-events:auto !important; cursor:pointer !important;
    }
    #ext3-home .nc-work-caption h3 { font-size:32px !important; letter-spacing:.06em; }

    /* Card "Modo conversa ativo. Pode falar." */
    .nc-conv-card { margin:16px auto 0; display:inline-flex; align-items:center; gap:12px;
      padding:10px 16px; border-radius:14px;
      background:rgba(75,214,255,.06); border:1px solid rgba(75,214,255,.32);
      color:#e8f4ff; }
    .nc-conv-card .nc-conv-icon { width:34px; height:34px; display:grid; place-items:center;
      border-radius:10px; background:rgba(75,214,255,.14); border:1px solid rgba(75,214,255,.4);
      font-size:16px; }
    .nc-conv-body { display:flex; flex-direction:column; text-align:left; }
    .nc-conv-title { font-size:13px; font-weight:600; color:#fff; }
    .nc-conv-sub { font-size:12.5px; color:#4bd6ff; font-weight:800; }

    /* ============ DROPDOWN DO ⋮  ============ */
    #ncMenuPanel { position:fixed; top:70px; right:14px; z-index:1001;
      width:min(300px, calc(100vw - 28px));
      max-height:calc(100vh - 100px); overflow-y:auto; padding:12px; border-radius:16px;
      background:linear-gradient(180deg,rgba(8,14,36,.98),rgba(4,8,22,.98));
      border:1px solid rgba(75,214,255,.4);
      box-shadow:0 20px 50px rgba(0,0,0,.6), 0 0 30px rgba(75,214,255,.22);
      backdrop-filter:blur(16px); }
    #ncMenuPanel.hidden { display:none; }
    #ncMenuPanel .nc-clock-card,
    #ncMenuPanel .nc-timer-card { display:block !important; margin:0 0 10px 0; }
    #ncMenuPanel .nc-menu { display:flex !important; margin-top:6px; }
    #ncMenuPanel .nc-clock-digits { font-size:34px !important; }

    /* ============ ABA COMPONENTES REDESIGN ============ */
    .mr-comp-subtabs { display:flex; gap:0; border-bottom:1px solid rgba(75,214,255,.25);
      padding:0 4px; margin:0 0 18px; }
    .mr-comp-subtab { flex:1; padding:12px 8px; background:transparent; border:none;
      color:rgba(200,220,255,.55); font-size:12px; font-weight:800; letter-spacing:.1em;
      text-transform:uppercase; cursor:pointer; border-bottom:2px solid transparent; transition:.22s; }
    .mr-comp-subtab:hover { color:#c8e8ff; }
    .mr-comp-subtab.active { color:#4bd6ff; border-bottom-color:#4bd6ff;
      text-shadow:0 0 10px rgba(75,214,255,.7); }

    .mr-neon-grid { display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; padding:0 4px; }
    .mr-neon-btn { display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:10px; padding:22px 12px; border-radius:16px;
      background:linear-gradient(180deg, rgba(10,16,40,.92), rgba(4,8,22,.92));
      border:1px solid var(--nb-border, rgba(75,214,255,.4));
      color:#fff; cursor:pointer; transition:.22s; position:relative; overflow:hidden;
      min-height:120px; }
    .mr-neon-btn:hover { transform:translateY(-2px);
      box-shadow:0 0 0 1px var(--nb-c1,#4bd6ff), 0 10px 24px -6px var(--nb-glow, rgba(75,214,255,.5));
      border-color:var(--nb-c1,#4bd6ff); }
    .mr-neon-btn:active { transform:scale(.96); }
    .mr-neon-btn svg { width:40px; height:40px; color:var(--nb-c1,#4bd6ff);
      filter:drop-shadow(0 0 10px var(--nb-glow,rgba(75,214,255,.6))); }
    .mr-neon-btn span { font-size:14px; font-weight:700; letter-spacing:.02em; color:#fff; }
    .mr-neon-btn.cyan   { --nb-c1:#4bd6ff; --nb-border:rgba(75,214,255,.45);  --nb-glow:rgba(75,214,255,.5); }
    .mr-neon-btn.pink   { --nb-c1:#ff3df6; --nb-border:rgba(255,61,246,.5);   --nb-glow:rgba(255,61,246,.55); }
    .mr-neon-btn.violet { --nb-c1:#a78bfa; --nb-border:rgba(167,139,250,.55); --nb-glow:rgba(167,139,250,.55); }
    .mr-neon-btn.green  { --nb-c1:#3dffb0; --nb-border:rgba(61,255,176,.5);   --nb-glow:rgba(61,255,176,.55); }
    .mr-neon-btn.orange { --nb-c1:#ffb347; --nb-border:rgba(255,179,71,.5);   --nb-glow:rgba(255,179,71,.55); }

    .mr-neon-history { margin-top:22px; padding:0 4px 20px; }
    .mr-neon-hist-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
    .mr-neon-hist-title { display:inline-flex; align-items:center; gap:8px;
      font-size:11px; font-weight:800; letter-spacing:.22em; color:#4bd6ff; text-transform:uppercase; }
    .mr-neon-hist-title .mr-neon-hist-dot { width:6px; height:6px; border-radius:50%;
      background:#4bd6ff; box-shadow:0 0 8px #4bd6ff; }
    .mr-neon-hist-all { padding:4px 12px; background:transparent; border:1px solid rgba(75,214,255,.3);
      color:#c8e8ff; font-size:11px; border-radius:999px; cursor:pointer; transition:.2s;
      display:inline-flex; align-items:center; gap:5px; }
    .mr-neon-hist-all:hover { background:rgba(75,214,255,.1); border-color:#4bd6ff; color:#fff; }
    .mr-neon-hist-list { display:flex; flex-direction:column; gap:8px; }
    .mr-neon-hist-empty { padding:22px 12px; text-align:center; color:rgba(200,220,255,.4);
      font-size:12px; border:1px dashed rgba(255,255,255,.08); border-radius:12px; }
    .mr-neon-hist-item { display:flex; align-items:flex-start; justify-content:space-between; gap:10px;
      padding:11px 14px; border-radius:12px; background:rgba(10,16,40,.55);
      border:1px solid rgba(75,214,255,.2); transition:.18s; }
    .mr-neon-hist-item:hover { border-color:rgba(75,214,255,.45); background:rgba(10,16,40,.75); }
    .mr-neon-hist-item .txt { flex:1; font-size:12.5px; color:#e8ecff; line-height:1.4;
      max-height:38px; overflow:hidden; }
    .mr-neon-hist-item .time { font-size:10.5px; color:rgba(200,220,255,.55); flex-shrink:0;
      display:inline-flex; align-items:center; gap:6px; font-weight:600; }
    .mr-neon-hist-item .time::after { content:""; width:6px; height:6px; border-radius:50%;
      background:#4bd6ff; box-shadow:0 0 6px #4bd6ff; }

    /* Remove os ícones antigos/colunas laterais do vídeo antigo */
    #mainApp .mr-tabs { display:none !important; }
    #mainApp .mr-body { display:flex !important; }
    #mainApp .mr-panel.active { flex:1 1 auto !important; min-width:0 !important; }
    #mainApp .mr-panel[data-mrpanel="chat"] { flex-direction:column !important; }
    #mainApp .mr-left-tree { display:none !important; }
    #mainApp .mr-chat-right { flex:1 1 auto !important; height:100% !important; }
  `;

  const style = document.createElement('style');
  style.id = 'ext3-redesign-css';
  style.textContent = CSS;
  document.head.appendChild(style);

  /* ==============================
   *  HOME — badges + card + menu dropdown
   * ============================== */
  const home = document.getElementById('ext3-home');
  if (!home) return;

  // Header badges (ATIVA + dias)
  const header = home.querySelector('.nc-header');
  if (header && !header.querySelector('.nc-header-badges')) {
    const badges = document.createElement('div');
    badges.className = 'nc-header-badges';
    badges.innerHTML = `
      <span class="nc-badge-active"><span class="nc-badge-dot"></span>ATIVA</span>
      <span class="nc-badge-days" id="ncBadgeDays">📅 -- dias</span>
    `;
    const topActions = header.querySelector('.nc-topbar-actions');
    if (topActions) header.insertBefore(badges, topActions);
    else header.appendChild(badges);
  }

  // Card "Modo conversa ativo. Pode falar." (abaixo da orbe/caption)
  const caption = document.getElementById('ncOrbCaption');
  if (caption && !document.getElementById('ncConvCard')) {
    const card = document.createElement('div');
    card.id = 'ncConvCard';
    card.className = 'nc-conv-card';
    card.innerHTML = `
      <span class="nc-conv-icon">💬</span>
      <div class="nc-conv-body">
        <span class="nc-conv-title">Modo conversa ativo.</span>
        <span class="nc-conv-sub">Pode falar.</span>
      </div>
    `;
    caption.after(card);
  }

  // Dropdown do ⋮ contendo relógio + timer + menu de abas
  if (!document.getElementById('ncMenuPanel')) {
    const clock = home.querySelector('.nc-clock-card');
    const timer = home.querySelector('.nc-timer-card');
    const menu  = home.querySelector('.nc-menu');
    const panel = document.createElement('div');
    panel.id = 'ncMenuPanel';
    panel.className = 'hidden';
    if (clock) panel.appendChild(clock);
    if (timer) panel.appendChild(timer);
    if (menu)  panel.appendChild(menu);
    home.appendChild(panel);
  }

  // Wire ⋮ toggle
  const menuBtn = document.getElementById('ext3MenuBtn');
  const menuPanel = document.getElementById('ncMenuPanel');
  if (menuBtn && menuPanel) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuPanel.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (menuPanel.classList.contains('hidden')) return;
      if (menuPanel.contains(e.target) || menuBtn.contains(e.target)) return;
      menuPanel.classList.add('hidden');
    });
    // Fechar após clicar em item de navegação
    menuPanel.addEventListener('click', (e) => {
      if (e.target.closest('.nc-item')) menuPanel.classList.add('hidden');
    });
  }

  // Sync badge "dias" a partir do #licenseInfo
  const syncBadges = () => {
    const el = document.getElementById('ncBadgeDays');
    if (!el) return;
    const info = document.getElementById('licenseInfo')?.textContent?.trim() || '';
    if (!info || info === '--') return;
    const m = info.match(/\d+/);
    el.textContent = m ? `📅 ${m[0]} dias` : `📅 ${info}`;
  };
  syncBadges();
  try {
    const li = document.getElementById('licenseInfo');
    if (li) new MutationObserver(syncBadges).observe(li, { childList:true, characterData:true, subtree:true });
  } catch (_) {}
  setInterval(syncBadges, 3000);

  /* ==============================
   *  Fix STANDBY: sem getUserMedia assíncrono antes do reconhecimento.
   *  O neocore inicia SpeechRecognition direto no clique do usuário.
   * ============================== */
  const orb = document.getElementById('ncOrb');
  if (orb) {
    orb.style.pointerEvents = 'auto';
  }

  /* ==============================
   *  ABA COMPONENTES — grid 2x4 + histórico
   * ============================== */
  const NEON_PROMPTS = {
    corrigir: 'Analise TODOS os erros do build, TypeScript, imports quebrados e runtime errors do projeto atual. Corrija cada um SEM silenciar com any nem @ts-ignore. Explique cada correção em uma linha e valide o build no final.',
    refatorar: 'Refatore o código atual mantendo 100% do comportamento: extraia componentes duplicados/longos, migre cores hardcoded para tokens semânticos do design system, melhore nomes, remova código morto e adicione comentários apenas onde agregam. Mostre antes/depois dos pontos críticos.',
    melhorar: 'Melhore o código atual: extraia lógica repetida em hooks/utils, adote nomes claros, aplique convenções consistentes, cubra edge cases e remova código morto. Não mude o comportamento visível ao usuário.',
    otimizar: 'Otimize performance do projeto: identifique re-renders desnecessários (React.memo/useMemo/useCallback quando ajudar de fato), aplique lazy loading em rotas pesadas e imagens abaixo da dobra, reduza bundle size e meça antes/depois.',
    seguranca: 'Faça uma auditoria de segurança completa: exposição de secrets, RLS/policies e GRANTs do banco, roles em tabela separada (has_role SECURITY DEFINER), validação de input com Zod, autorização em cada endpoint e headers de segurança. Liste findings por severidade e proponha correções.',
    responsivo: 'Torne todo o projeto totalmente responsivo (mobile-first). Use grid/flex, breakpoints do Tailwind (sm/md/lg/xl), respeite safe-areas, evite overflow horizontal e teste em 360px, 768px, 1024px e 1440px.',
    analisar: 'Faça uma análise completa do projeto atual: arquitetura, rotas, componentes, banco, segurança (RLS/roles/exposição de secrets), performance, acessibilidade e SEO. Liste findings por severidade (crítico/alto/médio/baixo) SEM alterar código ainda.',
    debug: 'Modo debug: leia o console e as network requests, reproduza o bug em passos claros, isole a causa raiz, corrija de forma cirúrgica e adicione um teste ou log de verificação. Explique o diagnóstico em uma frase.',
  };

  function renderCompPanel() {
    const compPanel = document.querySelector('[data-mrpanel="comp"]');
    if (!compPanel || compPanel.dataset.mrRedesigned === '1') return;
    compPanel.dataset.mrRedesigned = '1';
    const scroll = compPanel.querySelector('.mr-panel-scroll') || compPanel;

    scroll.innerHTML = `
      <div class="mr-comp-subtabs" id="mrCompSubtabs">
        <button class="mr-comp-subtab" data-subtab="chat" type="button">💬 Chat</button>
        <button class="mr-comp-subtab active" data-subtab="components" type="button">🧩 Componentes</button>
        <button class="mr-comp-subtab" data-subtab="models" type="button">📦 Modelos</button>
      </div>

      <div class="mr-neon-grid" id="mrNeonGrid">
        <button class="mr-neon-btn cyan" data-neon="corrigir" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
          <span>Corrigir</span>
        </button>
        <button class="mr-neon-btn pink" data-neon="refatorar" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>
          <span>Refatorar</span>
        </button>
        <button class="mr-neon-btn violet" data-neon="melhorar" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          <span>Melhorar</span>
        </button>
        <button class="mr-neon-btn cyan" data-neon="otimizar" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <span>Otimizar</span>
        </button>
        <button class="mr-neon-btn violet" data-neon="seguranca" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
          <span>Segurança</span>
        </button>
        <button class="mr-neon-btn pink" data-neon="responsivo" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="14" height="16" rx="2"/><rect x="18" y="8" width="4" height="12" rx="1"/></svg>
          <span>Responsivo</span>
        </button>
        <button class="mr-neon-btn violet" data-neon="analisar" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Analisar</span>
        </button>
        <button class="mr-neon-btn cyan" data-neon="debug" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="7" width="8" height="13" rx="4"/><path d="M14 7V5a2 2 0 00-4 0v2"/><path d="M8 13H4M20 13h-4M6 8L4 6M18 8l2-2M6 18l-2 2M18 18l2 2"/></svg>
          <span>Debug</span>
        </button>
      </div>

      <div class="mr-neon-history">
        <div class="mr-neon-hist-head">
          <span class="mr-neon-hist-title"><span class="mr-neon-hist-dot"></span>Histórico de Prompts</span>
          <button class="mr-neon-hist-all" id="mrNeonHistAll" type="button">🕐 Ver tudo</button>
        </div>
        <div class="mr-neon-hist-list" id="mrNeonHistList">
          <div class="mr-neon-hist-empty">Nenhum prompt enviado ainda.</div>
        </div>
      </div>
    `;

    // Sub-tabs
    scroll.querySelector('#mrCompSubtabs').addEventListener('click', (e) => {
      const st = e.target.closest('.mr-comp-subtab');
      if (!st) return;
      const t = st.dataset.subtab;
      scroll.querySelectorAll('.mr-comp-subtab').forEach(x => x.classList.toggle('active', x === st));
      if (t === 'chat') document.querySelector('.mr-tab[data-mrtab="chat"]')?.click();
      else if (t === 'models') document.querySelector('.mr-tab[data-mrtab="tpl"]')?.click();
    });

    // Botões neon → envia prompt
    scroll.querySelector('#mrNeonGrid').addEventListener('click', async (e) => {
      const btn = e.target.closest('.mr-neon-btn');
      if (!btn) return;
      const key = btn.dataset.neon;
      const prompt = NEON_PROMPTS[key];
      if (!prompt) return;

      try { window.mrPromptHistory?.push(prompt, 'tab'); } catch (_) {}

      const nativeMsg = document.getElementById('message');
      const nativeBtn = document.getElementById('sendBtn');
      if (typeof window.sendDirectLovableMessage === 'function') {
        try { await window.sendDirectLovableMessage(prompt); } catch (_) {}
      } else if (nativeMsg && nativeBtn) {
        nativeMsg.value = prompt;
        nativeMsg.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(() => nativeBtn.click(), 200);
      }
    });

    // "Ver tudo" abre aba Prompts
    scroll.querySelector('#mrNeonHistAll')?.addEventListener('click', () => {
      document.querySelector('.mr-tab[data-mrtab="prompts"]')?.click();
    });

    // Renderiza histórico
    const renderHist = (list) => {
      const el = document.getElementById('mrNeonHistList');
      if (!el) return;
      if (!list || !list.length) {
        el.innerHTML = '<div class="mr-neon-hist-empty">Nenhum prompt enviado ainda.</div>';
        return;
      }
      const pad = (n) => String(n).padStart(2, '0');
      const fmtT = (ts) => { const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
      const esc = (s) => { const d = document.createElement('div'); d.textContent = String(s || ''); return d.innerHTML; };
      el.innerHTML = list.slice(0, 8).map(h => `
        <div class="mr-neon-hist-item">
          <span class="txt">${esc(h.text.slice(0, 140))}</span>
          <span class="time">${fmtT(h.ts)}</span>
        </div>
      `).join('');
    };
    const bindHist = () => {
      if (window.mrPromptHistory) { window.mrPromptHistory.subscribe(renderHist); return; }
      setTimeout(bindHist, 300);
    };
    bindHist();
  }

  // Comp panel pode ser renderizado depois; tenta agora e observa mutations
  renderCompPanel();
  const rootObserver = new MutationObserver(renderCompPanel);
  rootObserver.observe(document.body, { childList: true, subtree: true });
})();
