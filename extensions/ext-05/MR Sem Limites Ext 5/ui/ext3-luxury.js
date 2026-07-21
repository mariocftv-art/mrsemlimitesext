/*
 * MR Sem Limites Ext 3 — Luxury Gold Theme (v3.2.5)
 * ─────────────────────────────────────────────────
 * Overlay visual: preto profundo + acentos dourados, tipografia serifada
 * para títulos, bordas metálicas, sombras douradas, orbe com halo gold.
 * Não altera lógica — só estética.
 */
(() => {
  'use strict';
  if (document.getElementById('ext3-luxury-css')) return;

  // Fonte Playfair Display + Inter para o luxo tipográfico
  const pre1 = document.createElement('link');
  pre1.rel = 'preconnect'; pre1.href = 'https://fonts.googleapis.com';
  const pre2 = document.createElement('link');
  pre2.rel = 'preconnect'; pre2.href = 'https://fonts.gstatic.com'; pre2.crossOrigin = 'anonymous';
  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap';
  document.head.append(pre1, pre2, font);

  const CSS = `
    :root {
      --lx-gold-1: #f4d47c;
      --lx-gold-2: #c9a24a;
      --lx-gold-3: #8a6a1f;
      --lx-gold-soft: rgba(244,212,124,.18);
      --lx-gold-line: rgba(244,212,124,.42);
      --lx-black-1: #05060a;
      --lx-black-2: #0a0d15;
      --lx-black-3: #10131d;
      --lx-gold-grad: linear-gradient(135deg,#f4d47c 0%,#e6b95a 40%,#a67c2b 100%);
    }

    /* Fundo profundo + textura sutil dourada */
    html, body, #app, #mainApp {
      background:
        radial-gradient(1200px 600px at 20% -10%, rgba(244,212,124,.08), transparent 60%),
        radial-gradient(900px 500px at 100% 110%, rgba(201,162,74,.07), transparent 60%),
        linear-gradient(180deg,#05060a 0%, #08090f 100%) !important;
      color:#f2ead6 !important;
      font-family: 'Inter', system-ui, sans-serif !important;
    }
    body::before {
      content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
      background-image:
        radial-gradient(circle at 25% 30%, rgba(244,212,124,.05) 0, transparent 1px),
        radial-gradient(circle at 75% 70%, rgba(201,162,74,.04) 0, transparent 1px);
      background-size: 3px 3px, 5px 5px; opacity:.6;
    }

    /* HEADER da home — moldura dourada */
    #ext3-home .nc-header {
      background:
        linear-gradient(180deg, rgba(15,17,26,.9), rgba(8,10,16,.9)) !important;
      border:1px solid var(--lx-gold-line) !important;
      border-radius:18px !important;
      box-shadow:
        0 0 0 1px rgba(244,212,124,.08) inset,
        0 12px 40px rgba(0,0,0,.6),
        0 0 24px rgba(244,212,124,.10);
      padding:14px 16px !important;
    }
    #ext3-home .nc-header::after {
      content:''; display:block; height:1px; margin-top:10px;
      background: linear-gradient(90deg, transparent, var(--lx-gold-2), transparent);
      opacity:.7;
    }
    #ext3-home .nc-topbar-title,
    #ext3-home .nc-work-caption h3 {
      font-family:'Cormorant Garamond', serif !important;
      background: var(--lx-gold-grad);
      -webkit-background-clip:text; background-clip:text; color:transparent !important;
      letter-spacing:.04em !important; font-weight:700 !important;
      text-shadow: 0 0 22px rgba(244,212,124,.18);
    }

    /* Badges */
    .nc-badge-active {
      background: linear-gradient(135deg, rgba(244,212,124,.18), rgba(201,162,74,.10)) !important;
      border:1px solid var(--lx-gold-line) !important;
      color:#f4d47c !important;
      box-shadow: 0 0 12px rgba(244,212,124,.25);
    }
    .nc-badge-active .nc-badge-dot { background:#f4d47c !important; box-shadow:0 0 10px #f4d47c !important; }
    .nc-badge-days {
      background: rgba(244,212,124,.06) !important;
      border:1px solid rgba(244,212,124,.28) !important;
      color:#efe0b3 !important;
    }

    /* ORBE — halo dourado */
    #ext3-home .nc-orb {
      filter:
        drop-shadow(0 0 22px rgba(244,212,124,.55))
        drop-shadow(0 0 60px rgba(201,162,74,.35)) !important;
    }
    #ext3-home .nc-orb::before {
      content:''; position:absolute; inset:-14px; border-radius:50%;
      background: conic-gradient(from 0deg, #f4d47c, #a67c2b, #f4d47c, #6b4e14, #f4d47c);
      filter: blur(14px); opacity:.35; z-index:-1;
      animation: lxSpin 8s linear infinite;
    }
    @keyframes lxSpin { to { transform:rotate(360deg); } }

    /* Card conversa ativa */
    .nc-conv-card {
      background: linear-gradient(180deg, rgba(20,16,8,.85), rgba(8,7,4,.85)) !important;
      border:1px solid var(--lx-gold-line) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,.5), 0 0 18px rgba(244,212,124,.15) !important;
    }
    .nc-conv-card .nc-conv-icon {
      background: var(--lx-gold-grad) !important;
      color:#1a1204 !important; border:none !important;
      box-shadow: 0 0 14px rgba(244,212,124,.5);
    }
    .nc-conv-title { color:#faf1d2 !important; }
    .nc-conv-sub {
      background: var(--lx-gold-grad);
      -webkit-background-clip:text; background-clip:text; color:transparent !important;
    }

    /* Botão ⋮ menu */
    #ext3MenuBtn {
      background: linear-gradient(180deg, rgba(20,16,8,.9), rgba(8,7,4,.9)) !important;
      border:1px solid var(--lx-gold-line) !important;
      color:#f4d47c !important;
      box-shadow: 0 0 12px rgba(244,212,124,.18);
    }
    #ext3MenuBtn:hover { box-shadow: 0 0 20px rgba(244,212,124,.45); }

    /* Painel dropdown ⋮ */
    #ncMenuPanel {
      background: linear-gradient(180deg, rgba(10,8,4,.98), rgba(4,3,2,.98)) !important;
      border:1px solid var(--lx-gold-line) !important;
      box-shadow:
        0 24px 60px rgba(0,0,0,.75),
        0 0 30px rgba(244,212,124,.22) !important;
    }
    #ncMenuPanel .nc-item {
      border:1px solid rgba(244,212,124,.18) !important;
      background: rgba(20,16,8,.55) !important;
      color:#f2ead6 !important; transition:.2s;
    }
    #ncMenuPanel .nc-item:hover {
      border-color: var(--lx-gold-2) !important;
      background: rgba(244,212,124,.10) !important;
      box-shadow: 0 0 14px rgba(244,212,124,.3);
    }
    #ncForceUpdate {
      background: var(--lx-gold-grad) !important;
      color:#120c02 !important; border:none !important;
      box-shadow: 0 6px 20px rgba(244,212,124,.35);
    }

    /* ABAS laterais */
    #mainApp .mr-tabs, .mr-tabs {
      background: linear-gradient(180deg, rgba(10,12,18,.92), rgba(6,7,11,.92)) !important;
      border-left:1px solid var(--lx-gold-line) !important;
    }
    .mr-tab {
      color:#c9bfa2 !important;
      border:1px solid transparent !important;
      transition:.2s;
    }
    .mr-tab:hover { color:#f4d47c !important; background: rgba(244,212,124,.06) !important; }
    .mr-tab.active {
      color:#0f0a02 !important;
      background: var(--lx-gold-grad) !important;
      border-color: var(--lx-gold-2) !important;
      box-shadow: 0 0 14px rgba(244,212,124,.5), inset 0 0 0 1px rgba(255,255,255,.25);
      font-weight:700 !important;
    }

    /* Painéis das abas */
    .mr-panel, .mr-panel-scroll {
      background: transparent !important;
      color:#eee3c4 !important;
    }
    .mr-panel h1, .mr-panel h2, .mr-panel h3 {
      font-family:'Cormorant Garamond', serif !important;
      background: var(--lx-gold-grad);
      -webkit-background-clip:text; background-clip:text; color:transparent !important;
      letter-spacing:.03em; font-weight:700;
    }

    /* Cards genéricos */
    .mr-card, .card, .nc-panel {
      background: linear-gradient(180deg, rgba(15,17,26,.9), rgba(8,10,16,.9)) !important;
      border:1px solid var(--lx-gold-line) !important;
      border-radius:14px !important;
      box-shadow: 0 8px 24px rgba(0,0,0,.5) !important;
    }

    /* Inputs / textarea / buttons */
    input, textarea, select {
      background: rgba(8,10,16,.85) !important;
      border:1px solid rgba(244,212,124,.28) !important;
      color:#faf1d2 !important;
      border-radius:10px !important;
    }
    input:focus, textarea:focus, select:focus {
      border-color: var(--lx-gold-2) !important;
      box-shadow: 0 0 0 3px rgba(244,212,124,.18) !important;
      outline:none !important;
    }
    button.primary, .btn-primary, .mr-btn-primary, #sendBtn {
      background: var(--lx-gold-grad) !important;
      color:#120c02 !important; border:none !important; font-weight:800 !important;
      letter-spacing:.02em !important;
      box-shadow: 0 8px 22px rgba(244,212,124,.35) !important;
    }
    button.primary:hover, .btn-primary:hover, #sendBtn:hover {
      filter:brightness(1.08); transform:translateY(-1px);
    }

    /* Área do chat / prompt */
    .mr-composer, .composer {
      background: linear-gradient(180deg, rgba(15,17,26,.92), rgba(8,10,16,.92)) !important;
      border-top:1px solid var(--lx-gold-line) !important;
    }

    /* GRID NEON (aba Componentes) — reveste em ouro */
    .mr-neon-btn {
      background: linear-gradient(180deg, rgba(15,12,4,.92), rgba(6,5,2,.92)) !important;
      border:1px solid var(--lx-gold-line) !important;
      color:#f2ead6 !important;
    }
    .mr-neon-btn:hover {
      border-color: var(--lx-gold-1) !important;
      box-shadow: 0 0 0 1px var(--lx-gold-1), 0 12px 26px rgba(244,212,124,.35) !important;
    }
    .mr-neon-btn svg {
      color:#f4d47c !important;
      filter: drop-shadow(0 0 10px rgba(244,212,124,.55)) !important;
    }
    .mr-neon-btn span {
      background: var(--lx-gold-grad);
      -webkit-background-clip:text; background-clip:text; color:transparent !important;
      font-weight:700 !important;
    }

    /* Sub-abas de Componentes */
    .mr-comp-subtab.active {
      color:#f4d47c !important;
      border-bottom-color:#f4d47c !important;
      text-shadow: 0 0 12px rgba(244,212,124,.6) !important;
    }
    .mr-comp-subtabs { border-bottom-color: var(--lx-gold-line) !important; }

    /* Histórico */
    .mr-neon-hist-title { color:#f4d47c !important; }
    .mr-neon-hist-title .mr-neon-hist-dot { background:#f4d47c !important; box-shadow:0 0 8px #f4d47c !important; }
    .mr-neon-hist-all {
      border-color: var(--lx-gold-line) !important; color:#efe0b3 !important;
    }
    .mr-neon-hist-all:hover {
      background: rgba(244,212,124,.10) !important; border-color:#f4d47c !important; color:#faf1d2 !important;
    }
    .mr-neon-hist-item {
      background: rgba(15,12,4,.55) !important;
      border-color: rgba(244,212,124,.22) !important;
    }
    .mr-neon-hist-item:hover {
      border-color: var(--lx-gold-line) !important;
      background: rgba(20,16,8,.75) !important;
    }
    .mr-neon-hist-item .time::after { background:#f4d47c !important; box-shadow:0 0 6px #f4d47c !important; }

    /* Scrollbar dourada fina */
    ::-webkit-scrollbar { width:8px; height:8px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,.4); }
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg,#c9a24a,#8a6a1f);
      border-radius:8px; border:1px solid rgba(0,0,0,.6);
    }
    ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg,#f4d47c,#c9a24a); }

    /* Selo "MR" no rodapé da home */
    #ext3-home::after {
      content:'MR · Sem Limites';
      display:block; text-align:center; margin-top:14px;
      font-family:'Cormorant Garamond', serif; font-style:italic;
      background: var(--lx-gold-grad);
      -webkit-background-clip:text; background-clip:text; color:transparent;
      letter-spacing:.35em; font-size:11px; opacity:.85;
    }
  `;

  const style = document.createElement('style');
  style.id = 'ext3-luxury-css';
  style.textContent = CSS;
  document.head.appendChild(style);
})();
