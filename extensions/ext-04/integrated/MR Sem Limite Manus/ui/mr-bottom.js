/*
 * MR Sem Limites Ext 3 — Bottom Dock
 * - Reorganiza .qa-pro (era scroll horizontal bagunçado) em grade 2 colunas
 * - Injeta um dock inferior fixo com:
 *     • Histórico de prompts enviados (home + abas + envio direto Lovable)
 *     • Campo de escrita GRANDE + anexar + microfone + enviar
 * - Some quando a home overlay (#ext3-home) está visível
 */
(() => {
  'use strict';

  // ---------------- CSS ----------------
  const css = `
    /* Grade organizada dos botões PRO (antes rolavam horizontal em fileiras bagunçadas) */
    .qa-pro {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10px !important;
      padding: 12px !important;
      overflow: visible !important;
      background: linear-gradient(180deg, rgba(59,130,246,.05), transparent) !important;
    }
    .qa-pro-btn {
      justify-content: center !important;
      padding: 14px 12px !important;
      border-radius: 14px !important;
      font-size: 12px !important;
      background: linear-gradient(160deg, rgba(255,255,255,.04), rgba(255,255,255,.01)) !important;
      border: 1px solid rgba(236,72,153,.35) !important;
      box-shadow: 0 4px 14px -6px rgba(236,72,153,.35), inset 0 0 12px rgba(59,130,246,.06) !important;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease !important;
    }
    .qa-pro-btn:hover {
      transform: translateY(-2px) !important;
      border-color: rgba(0,229,255,.55) !important;
      box-shadow: 0 8px 22px -6px rgba(0,229,255,.4), inset 0 0 14px rgba(236,72,153,.14) !important;
    }
    .qa-pro-btn .qa-pro-ico { font-size: 16px !important; }

    /* Espaço no fundo para o dock não cobrir conteúdo */
    body.mr-has-dock .app-content,
    body.mr-has-dock .mr-panels { padding-bottom: 260px !important; }

    /* Dock inferior */
    #mrBottomDock {
      position: fixed;
      left: 0; right: 0; bottom: 0;
      z-index: 60;
      background: linear-gradient(180deg, rgba(8,6,20,.86), rgba(4,3,12,.96));
      border-top: 1px solid rgba(236,72,153,.35);
      box-shadow: 0 -14px 40px -12px rgba(0,229,255,.25), 0 -2px 0 rgba(236,72,153,.25);
      backdrop-filter: blur(14px) saturate(140%);
      -webkit-backdrop-filter: blur(14px) saturate(140%);
      padding: 10px 12px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 55vh;
      transition: transform .25s ease, opacity .25s ease;
    }
    #mrBottomDock.hidden { transform: translateY(110%); opacity: 0; pointer-events: none; }
    .mr-dock-head {
      display: flex; align-items: center; justify-content: space-between;
      font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase;
      color: rgba(200,220,255,.7);
    }
    .mr-dock-head .mr-dock-title { display:flex; align-items:center; gap:8px; }
    .mr-dock-head .mr-dock-title::before {
      content:""; width:6px; height:6px; border-radius:50%;
      background: #22d3ee; box-shadow: 0 0 10px #22d3ee;
    }
    .mr-dock-head button {
      background: transparent; border: 1px solid rgba(255,255,255,.12);
      color: rgba(255,255,255,.7); font-size: 10px; padding: 4px 10px;
      border-radius: 999px; cursor: pointer; letter-spacing: .06em;
    }
    .mr-dock-head button:hover { color:#fff; border-color: rgba(236,72,153,.55); }

    .mr-dock-hist {
      display: flex; flex-direction: column; gap: 6px;
      max-height: 130px; overflow-y: auto;
      padding: 4px 2px 2px;
      scrollbar-width: thin;
    }
    .mr-dock-hist::-webkit-scrollbar { width: 4px; }
    .mr-dock-hist::-webkit-scrollbar-thumb { background: rgba(236,72,153,.3); border-radius: 4px; }
    .mr-dock-empty {
      font-size: 11px; color: rgba(200,220,255,.4); text-align: center; padding: 14px 8px;
      border: 1px dashed rgba(255,255,255,.08); border-radius: 10px;
    }
    .mr-hist-item {
      display: flex; gap: 8px; align-items: flex-start;
      padding: 8px 10px; border-radius: 10px;
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(255,255,255,.06);
      font-size: 12px; color: #f0f0ff; line-height: 1.35;
    }
    .mr-hist-item .mr-hist-dot {
      width:6px; height:6px; border-radius:50%; margin-top:6px; flex-shrink:0;
      background: #22d3ee; box-shadow: 0 0 8px #22d3ee;
    }
    .mr-hist-item[data-src="orb"] .mr-hist-dot { background:#a78bfa; box-shadow:0 0 8px #a78bfa; }
    .mr-hist-item[data-src="lovable"] .mr-hist-dot { background:#ec4899; box-shadow:0 0 8px #ec4899; }
    .mr-hist-txt { flex:1; min-width:0; white-space:pre-wrap; word-break:break-word; max-height: 42px; overflow:hidden; }
    .mr-hist-time { font-size:10px; color: rgba(200,220,255,.5); flex-shrink:0; }

    .mr-dock-composer {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      gap: 8px;
      align-items: end;
      padding: 8px;
      border-radius: 14px;
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(236,72,153,.4);
      box-shadow: inset 0 0 18px rgba(0,229,255,.06);
    }
    .mr-dock-composer textarea {
      width: 100%;
      min-height: 60px;
      max-height: 140px;
      resize: none;
      background: transparent;
      border: none;
      color: #fff;
      font-size: 13px;
      font-family: inherit;
      line-height: 1.4;
      outline: none;
      padding: 6px 4px;
    }
    .mr-dock-composer textarea::placeholder { color: rgba(200,220,255,.4); }
    .mr-dock-btn {
      width: 40px; height: 40px;
      display: grid; place-items: center;
      border-radius: 10px;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.1);
      color: #e8e8ff;
      font-size: 16px;
      cursor: pointer;
      transition: .2s;
    }
    .mr-dock-btn:hover { background: rgba(236,72,153,.15); border-color: rgba(236,72,153,.5); color:#fff; }
    .mr-dock-btn.mic.active { background: rgba(61,255,176,.15); border-color: rgba(61,255,176,.6); color:#8affc9; box-shadow: 0 0 12px rgba(61,255,176,.4); }
    .mr-dock-send {
      width: 44px; height: 44px;
      display: grid; place-items: center;
      border-radius: 12px;
      background: linear-gradient(135deg, #ec4899, #8b5cf6);
      border: none;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 6px 18px -4px rgba(236,72,153,.55);
      transition: .2s;
    }
    .mr-dock-send:hover { transform: translateY(-1px); box-shadow: 0 10px 24px -6px rgba(236,72,153,.7); }
    .mr-dock-send:disabled { opacity:.4; cursor:not-allowed; transform:none; }
  `;
  const style = document.createElement('style');
  style.id = 'mr-bottom-dock-css';
  style.textContent = css;
  document.head.appendChild(style);

  // ---------------- DOM ----------------
  const dock = document.createElement('div');
  dock.id = 'mrBottomDock';
  dock.className = 'hidden';
  dock.innerHTML = `
    <div class="mr-dock-head">
      <div class="mr-dock-title">Histórico de Prompts</div>
      <button id="mrDockClear" type="button">Limpar</button>
    </div>
    <div class="mr-dock-hist" id="mrDockHist">
      <div class="mr-dock-empty">Nenhum prompt enviado ainda.</div>
    </div>
    <div class="mr-dock-composer">
      <button class="mr-dock-btn" id="mrDockAttach" title="Anexar arquivo">📎</button>
      <textarea id="mrDockInput" placeholder="Digite seu comando... (Enter envia, Shift+Enter quebra linha)"></textarea>
      <button class="mr-dock-btn mic" id="mrDockMic" title="Microfone">🎤</button>
      <button class="mr-dock-send" id="mrDockSend" title="Enviar">➤</button>
    </div>
  `;
  document.body.appendChild(dock);
  document.body.classList.add('mr-has-dock');

  const histEl = dock.querySelector('#mrDockHist');
  const clearBtn = dock.querySelector('#mrDockClear');
  const attachBtn = dock.querySelector('#mrDockAttach');
  const input = dock.querySelector('#mrDockInput');
  const micBtn = dock.querySelector('#mrDockMic');
  const sendBtn = dock.querySelector('#mrDockSend');

  // ---------------- Histórico render ----------------
  const pad = (n) => String(n).padStart(2, '0');
  const fmtTime = (ts) => {
    const d = new Date(ts);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const esc = (s) => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };

  function render(list) {
    if (!list || !list.length) {
      histEl.innerHTML = '<div class="mr-dock-empty">Nenhum prompt enviado ainda.</div>';
      return;
    }
    histEl.innerHTML = list.slice(0, 30).map((h) => `
      <div class="mr-hist-item" data-src="${h.source || 'chat'}">
        <div class="mr-hist-dot"></div>
        <div class="mr-hist-txt">${esc(h.text)}</div>
        <div class="mr-hist-time">${fmtTime(h.ts)}</div>
      </div>
    `).join('');
  }

  function bindStore() {
    if (window.mrPromptHistory) {
      window.mrPromptHistory.subscribe(render);
      return;
    }
    setTimeout(bindStore, 200);
  }
  bindStore();

  clearBtn.addEventListener('click', () => {
    if (window.mrPromptHistory && confirm('Limpar histórico de prompts?')) {
      window.mrPromptHistory.clear();
    }
  });

  // ---------------- Enviar ----------------
  async function doSend() {
    const text = (input.value || '').trim();
    if (!text) { input.focus(); return; }
    // Registra no histórico
    try { window.mrPromptHistory?.push(text, 'tab'); } catch (_) {}
    input.value = '';
    sendBtn.disabled = true;
    try {
      if (typeof window.sendDirectLovableMessage === 'function') {
        await window.sendDirectLovableMessage(text);
      } else {
        // fallback: usa campo nativo
        const nativeMsg = document.getElementById('message');
        const nativeBtn = document.getElementById('sendBtn');
        if (nativeMsg && nativeBtn) {
          nativeMsg.value = text;
          nativeMsg.dispatchEvent(new Event('input', { bubbles: true }));
          await new Promise((r) => setTimeout(r, 200));
          nativeBtn.click();
        } else {
          alert('Chat indisponível no momento.');
        }
      }
    } catch (e) {
      alert(e?.message || 'Falha ao enviar comando.');
    } finally {
      sendBtn.disabled = false;
    }
  }
  sendBtn.addEventListener('click', doSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
  });

  // ---------------- Anexar ----------------
  attachBtn.addEventListener('click', () => {
    const native =
      document.getElementById('attachBtn') ||
      document.querySelector('[data-attach], .attach-btn, .file-attach') ||
      document.querySelector('input[type="file"]');
    if (native) native.click();
    else alert('Anexo indisponível — abra o Chat para enviar arquivos.');
  });

  // ---------------- Microfone ----------------
  let rec = null, recActive = false;
  micBtn.addEventListener('click', () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Reconhecimento de voz indisponível neste navegador.'); return; }
    if (recActive) { try { rec.stop(); } catch (_) {} return; }
    rec = new SR();
    rec.lang = 'pt-BR'; rec.interimResults = false; rec.continuous = false;
    rec.onstart = () => { recActive = true; micBtn.classList.add('active'); };
    rec.onend = () => { recActive = false; micBtn.classList.remove('active'); };
    rec.onerror = async (ev) => {
      recActive = false; micBtn.classList.remove('active');
      if (ev?.error === 'not-allowed' || ev?.error === 'service-not-allowed') {
        try {
          const p = await navigator.permissions.query({ name: 'microphone' });
          if (p.state !== 'granted') alert('Permita o microfone para o site em: chrome://settings/content/microphone');
        } catch (_) {}
      }
    };
    rec.onresult = (ev) => {
      const txt = ev.results?.[0]?.[0]?.transcript || '';
      if (!txt) return;
      input.value = input.value ? `${input.value} ${txt}` : txt;
      input.focus();
    };
    try { rec.start(); } catch (_) {}
  });

  // ---------------- Visibilidade: some quando a home overlay está visível ----------------
  const home = document.getElementById('ext3-home');
  function sync() {
    const homeVisible = home && !home.classList.contains('hidden');
    dock.classList.toggle('hidden', !!homeVisible);
    document.body.classList.toggle('mr-has-dock', !homeVisible);
  }
  sync();
  // Observa mudanças na classe .hidden da home
  if (home) {
    const obs = new MutationObserver(sync);
    obs.observe(home, { attributes: true, attributeFilter: ['class'] });
  }
  // Também sincroniza quando telas de licença aparecem
  setInterval(() => {
    const ls = document.getElementById('licenseScreen');
    const lsVisible = ls && getComputedStyle(ls).display !== 'none';
    if (lsVisible) dock.classList.add('hidden');
    else sync();
  }, 1200);
})();
