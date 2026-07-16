/*
 * MR Sem Limites 2026 Brasil — Sound Detector
 * FASE 2.4 — Notificações sonoras inteligentes
 *
 * ISOLADO: não altera nenhuma lógica, DOM, chat, licença ou backend.
 * Apenas observa o DOM do lovable.dev e toca um som quando:
 *   EVENTO 1 — A resposta terminou (fim de streaming/geração)  -> coin.mp3
 *   EVENTO 2 — Uma aprovação é solicitada                       -> alert.mp3
 *
 * Debounce por transição de estado + resetado em cada novo prompt.
 */
(() => {
  'use strict';
  if (window.__MRSL_SOUND_DETECTOR__) return;
  window.__MRSL_SOUND_DETECTOR__ = true;

  const STORAGE_KEY = 'mrsl_sounds_enabled';
  const COIN_URL  = chrome.runtime.getURL('assets/sounds/coin.mp3');
  const ALERT_URL = chrome.runtime.getURL('assets/sounds/alert.mp3');

  // ---- estado ----
  let enabled = true;
  let audioCoin = null;
  let audioAlert = null;

  // EVENTO 1: fim de resposta
  let wasGenerating = false;
  let lastCoinAt = 0;

  // EVENTO 2: aprovação
  let approvalActive = false;
  let lastAlertAt = 0;

  // ---- settings ----
  try {
    chrome.storage?.local?.get([STORAGE_KEY], (r) => {
      enabled = r?.[STORAGE_KEY] !== false; // default true
    });
    chrome.storage?.onChanged?.addListener((changes, area) => {
      if (area === 'local' && changes[STORAGE_KEY]) {
        enabled = changes[STORAGE_KEY].newValue !== false;
      }
    });
  } catch (_) {}

  // ---- audio (lazy) ----
  function play(kind) {
    if (!enabled) return;
    const now = Date.now();
    if (kind === 'coin') {
      if (now - lastCoinAt < 1500) return;
      lastCoinAt = now;
      if (!audioCoin) audioCoin = new Audio(COIN_URL);
      try { audioCoin.currentTime = 0; audioCoin.play().catch(() => {}); } catch (_) {}
    } else {
      if (now - lastAlertAt < 1500) return;
      lastAlertAt = now;
      if (!audioAlert) audioAlert = new Audio(ALERT_URL);
      try { audioAlert.currentTime = 0; audioAlert.play().catch(() => {}); } catch (_) {}
    }
  }

  // Permite tocar via mensagem vinda do sidepanel (botões "Testar")
  try {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg && msg.type === 'MRSL_PLAY_SOUND') {
        // Force play ignorando debounce
        lastCoinAt = 0; lastAlertAt = 0;
        play(msg.kind === 'alert' ? 'alert' : 'coin');
      }
    });
  } catch (_) {}

  // ---- detecção ----
  // EVENTO 1 — fim de resposta:
  // Detectamos qualquer botão/indicador de "generating/streaming/stop".
  // Heurística ampla (funciona para várias variações da UI):
  //   - Presença de botão "Stop generating" / aria-label "Stop generating"
  //   - Presença de elemento com atributos ou texto contendo "generating", "streaming"
  //   - Skeleton/loader ativo na área do chat
  function isGenerating() {
    // Selectors amplos, tolerantes a mudanças de UI
    const sel = [
      'button[aria-label*="Stop" i]',
      'button[aria-label*="stop generating" i]',
      'button[data-testid*="stop" i]',
      '[data-state="generating"]',
      '[data-loading="true"]',
      '[aria-busy="true"]',
    ];
    for (const s of sel) {
      try { if (document.querySelector(s)) return true; } catch (_) {}
    }
    // fallback textual (apenas texto curto para não pegar corpo do chat)
    try {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        const t = (b.textContent || '').trim().toLowerCase();
        if (t && t.length < 40 && (t === 'stop' || t.includes('stop generating') || t.includes('generating…') || t.includes('generating...'))) {
          return true;
        }
      }
    } catch (_) {}
    return false;
  }

  // EVENTO 2 — solicitação de aprovação:
  // Procura marcadores textuais típicos da UI do Lovable.
  const APPROVAL_KEYWORDS = [
    'user approval required',
    'waiting approval',
    'waiting for approval',
    'review request',
    'review changes',
    'submit secrets',
    'requires approval',
    'approval required',
    'confirm to continue',
    'awaiting approval',
  ];
  const APPROVAL_BUTTON_TEXTS = ['approve', 'review', 'continue', 'confirm', 'submit secrets'];

  function hasApprovalRequest() {
    // 1) elementos com data-attrs padronizados
    try {
      if (document.querySelector('[data-approval="pending"], [data-testid*="approval" i], [data-state="awaiting-approval"]')) return true;
    } catch (_) {}
    // 2) heurística por texto curto
    try {
      const nodes = document.querySelectorAll('h1,h2,h3,h4,p,span,div,button');
      for (const n of nodes) {
        if (n.childElementCount > 8) continue; // skip contêineres grandes
        const t = (n.textContent || '').trim().toLowerCase();
        if (!t || t.length > 120) continue;
        for (const kw of APPROVAL_KEYWORDS) {
          if (t.includes(kw)) return true;
        }
      }
    } catch (_) {}
    // 3) botão de aprovação visível (par de Approve/Review + Continue/Confirm próximos)
    try {
      const btns = Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent !== null);
      const labels = btns.map(b => (b.textContent || '').trim().toLowerCase());
      const hits = labels.filter(t => t && t.length < 24 && APPROVAL_BUTTON_TEXTS.some(k => t === k || t.startsWith(k + ' ')));
      if (hits.length >= 1 && hits.some(t => t === 'approve' || t === 'review' || t.startsWith('submit secrets'))) {
        return true;
      }
    } catch (_) {}
    return false;
  }

  // Reset dos "fired" quando o usuário inicia um novo prompt
  // (transição gerando: false -> true reseta o approvalActive/coin latch)
  function tick() {
    let gen = false, appr = false;
    try { gen = isGenerating(); } catch (_) {}
    try { appr = hasApprovalRequest(); } catch (_) {}

    // Novo prompt iniciando -> resetar aprovação prévia
    if (gen && !wasGenerating) {
      approvalActive = false;
    }
    // Fim de geração (transição true -> false) -> Coin
    if (!gen && wasGenerating) {
      play('coin');
    }
    wasGenerating = gen;

    // Aprovação apareceu (transição false -> true) -> Alert (uma vez)
    if (appr && !approvalActive) {
      approvalActive = true;
      // não tocar se ainda está gerando (evita disparo prematuro)
      if (!gen) play('alert');
      else {
        // aguarda o fim para tocar o alert (uma única vez)
        const wait = setInterval(() => {
          if (!isGenerating()) { clearInterval(wait); play('alert'); }
        }, 400);
        setTimeout(() => clearInterval(wait), 15000);
      }
    } else if (!appr && approvalActive) {
      // Usuário respondeu — reseta latch para próxima aprovação
      approvalActive = false;
    }
  }

  // Executa em resposta a mutações + fallback por intervalo curto
  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; tick(); });
  }

  function start() {
    try {
      const mo = new MutationObserver(schedule);
      mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label','aria-busy','data-state','data-loading','data-approval','data-testid'] });
    } catch (_) {}
    // fallback leve
    setInterval(tick, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
