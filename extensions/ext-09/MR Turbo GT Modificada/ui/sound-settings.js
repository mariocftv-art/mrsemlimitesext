/*
 * MR Sem Limites 2026 Brasil — Sound Settings (sidepanel)
 * FASE 2.4 — controla o toggle "Ativar sons" e os botões "Testar".
 * Não altera chat, licença, autenticação ou backend.
 */
(() => {
  'use strict';
  const KEY = 'mrsl_sounds_enabled';
  const COIN = chrome.runtime.getURL('assets/sounds/coin.mp3');
  const ALERT = chrome.runtime.getURL('assets/sounds/alert.mp3');

  let audioCoin = null, audioAlert = null;

  function playLocal(kind) {
    const url = kind === 'alert' ? ALERT : COIN;
    let a = kind === 'alert' ? audioAlert : audioCoin;
    if (!a) { a = new Audio(url); if (kind === 'alert') audioAlert = a; else audioCoin = a; }
    try { a.currentTime = 0; a.play().catch(() => {}); } catch (_) {}
  }

  function setStatus(msg) {
    const el = document.getElementById('mrslSoundStatus');
    if (el) el.textContent = msg;
  }

  function init() {
    const toggle = document.getElementById('mrslSoundsToggle');
    const btnCoin = document.getElementById('mrslTestCoin');
    const btnAlert = document.getElementById('mrslTestAlert');
    if (!toggle) return;

    // load setting
    try {
      chrome.storage.local.get([KEY], (r) => {
        const on = r?.[KEY] !== false; // default true
        toggle.checked = on;
        setStatus(on ? 'Sons ativados.' : 'Sons desativados.');
      });
    } catch (_) { toggle.checked = true; }

    toggle.addEventListener('change', () => {
      const on = !!toggle.checked;
      try { chrome.storage.local.set({ [KEY]: on }); } catch (_) {}
      setStatus(on ? 'Sons ativados.' : 'Sons desativados.');
    });

    async function testSound(kind) {
      // Verifica se está ativado; teste respeita a preferência
      const on = await new Promise(res => {
        try { chrome.storage.local.get([KEY], r => res(r?.[KEY] !== false)); }
        catch (_) { res(true); }
      });
      if (!on) { setStatus('Ative os sons para testar.'); return; }
      playLocal(kind);
      setStatus('Tocando ' + (kind === 'alert' ? 'Alert' : 'Coin') + '…');
    }

    btnCoin?.addEventListener('click', () => testSound('coin'));
    btnAlert?.addEventListener('click', () => testSound('alert'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
