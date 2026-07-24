/*
 * MR Turbo GT — Anti-Inspeção (F12 / DevTools)
 * Comportamento:
 *  - Detecta abertura do DevTools (F12, Ctrl+Shift+I/J, Ctrl+U, menu, resize).
 *  - Mostra overlay VERMELHO "⚠ VIOLAÇÃO DE EXTENSÃO".
 *  - Fecha DevTools → overlay some.
 *  - Se persistir, inicia contagem regressiva de 60s.
 *  - Ao zerar: BLOQUEIA a extensão (limpa sessão, notifica painel).
 */
(function () {
  if (window.__MRT_ANTI_INSPECT__) return;
  window.__MRT_ANTI_INSPECT__ = true;

  const PANEL_ALERT_URL =
    "https://mrsemlimitesext.lovable.app/api/public/security-alert";
  const COUNTDOWN_SECONDS = 60;
  let countdown = COUNTDOWN_SECONDS;
  let timerId = null;
  let blocked = false;
  let overlayEl = null;

  function buildOverlay() {
    const el = document.createElement("div");
    el.id = "mrt-violation-overlay";
    el.innerHTML = `
      <style>
        #mrt-violation-overlay{
          position:fixed;inset:0;z-index:2147483647;
          background:radial-gradient(circle at 50% 30%,rgba(220,20,20,.95),rgba(70,0,0,.98));
          color:#fff;font-family:'Inter',system-ui,sans-serif;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          text-align:center;padding:28px;
          animation:mrt-blink 0.9s ease-in-out infinite alternate;
        }
        @keyframes mrt-blink{
          0%{box-shadow:inset 0 0 60px rgba(255,0,0,.6)}
          100%{box-shadow:inset 0 0 140px rgba(255,80,80,.95)}
        }
        #mrt-violation-overlay .mrt-icon{font-size:64px;margin-bottom:8px;filter:drop-shadow(0 0 12px #fff)}
        #mrt-violation-overlay h1{
          font-size:26px;font-weight:900;letter-spacing:.5px;margin:6px 0;
          text-shadow:0 0 14px rgba(255,255,255,.7);
        }
        #mrt-violation-overlay p{max-width:340px;font-size:14px;line-height:1.45;opacity:.95;margin:6px 0}
        #mrt-violation-overlay .mrt-count{
          margin-top:14px;font-size:56px;font-weight:900;color:#fff;
          text-shadow:0 0 22px #ff2b2b, 0 0 40px #ff2b2b;
        }
        #mrt-violation-overlay .mrt-hint{font-size:12px;opacity:.85;margin-top:10px}
        #mrt-violation-overlay .mrt-brand{
          position:absolute;bottom:14px;font-size:11px;opacity:.75;letter-spacing:1px;
        }
        #mrt-violation-overlay.blocked{background:#000;color:#ff5252;animation:none}
      </style>
      <div class="mrt-icon">⚠️</div>
      <h1>VIOLAÇÃO DE EXTENSÃO DETECTADA</h1>
      <p>O modo inspeção (DevTools/F12) está aberto. Feche a inspeção imediatamente para continuar usando a MR Turbo GT.</p>
      <div class="mrt-count" id="mrt-count">${COUNTDOWN_SECONDS}</div>
      <p class="mrt-hint">Se a inspeção continuar aberta, a extensão será bloqueada e o painel MR Sem Limites será notificado.</p>
      <div class="mrt-brand">MR TURBO GT · Segurança Ativa</div>
    `;
    return el;
  }

  function showOverlay() {
    if (blocked) return;
    if (!overlayEl) {
      overlayEl = buildOverlay();
      document.documentElement.appendChild(overlayEl);
    } else if (!overlayEl.isConnected) {
      document.documentElement.appendChild(overlayEl);
    }
    if (!timerId) {
      timerId = setInterval(tick, 1000);
    }
  }

  function hideOverlay() {
    if (blocked) return;
    countdown = COUNTDOWN_SECONDS;
    if (timerId) { clearInterval(timerId); timerId = null; }
    if (overlayEl && overlayEl.isConnected) overlayEl.remove();
  }

  function tick() {
    countdown -= 1;
    const c = overlayEl?.querySelector("#mrt-count");
    if (c) c.textContent = String(Math.max(countdown, 0));
    if (countdown <= 0) doBlock();
  }

  async function doBlock() {
    blocked = true;
    if (timerId) { clearInterval(timerId); timerId = null; }
    if (overlayEl) {
      overlayEl.classList.add("blocked");
      overlayEl.innerHTML = `
        <div style="font-size:72px;margin-bottom:6px">🛑</div>
        <h1 style="color:#ff5252">EXTENSÃO BLOQUEADA</h1>
        <p style="color:#ffb4b4;max-width:360px">
          Foi detectada tentativa de inspeção. A sessão foi encerrada por
          segurança e o painel MR Sem Limites foi notificado.<br><br>
          Para reativar, entre em contato com o suporte.
        </p>
        <div class="mrt-brand" style="position:absolute;bottom:14px;font-size:11px;opacity:.75;letter-spacing:1px">
          MR TURBO GT · Segurança Ativa
        </div>
      `;
    }
    try {
      chrome?.storage?.local?.remove?.([
        "mrsl_session_token",
        "mrsl_license_key",
        "mrsl_hwid",
      ]);
    } catch (_) {}
    try {
      await fetch(PANEL_ALERT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "extension_violation",
          product: "ext7-mr-turbo-gt",
          version: "7.0.0",
          ts: Date.now(),
          ua: navigator.userAgent,
        }),
      });
    } catch (_) {}
  }

  // ---------- Detection ----------
  function heuristicOpen() {
    const w = window.outerWidth - window.innerWidth;
    const h = window.outerHeight - window.innerHeight;
    return w > 200 || h > 200;
  }

  setInterval(() => {
    if (blocked) return;
    if (heuristicOpen()) showOverlay();
    else hideOverlay();
  }, 900);

  // console.log timing trick
  const trap = /./;
  trap.toString = function () {
    if (!blocked) showOverlay();
    return "";
  };
  setInterval(() => { if (!blocked) console.debug(trap); }, 1500);

  // Keyboard shortcuts → alert immediately
  window.addEventListener("keydown", (e) => {
    const k = (e.key || "").toLowerCase();
    if (
      k === "f12" ||
      (e.ctrlKey && e.shiftKey && (k === "i" || k === "j" || k === "c")) ||
      (e.ctrlKey && k === "u") ||
      (e.metaKey && e.altKey && (k === "i" || k === "j"))
    ) {
      e.preventDefault();
      showOverlay();
    }
  }, true);

  // Right-click context menu → alert (não bloqueia navegador do usuário)
  window.addEventListener("contextmenu", () => {
    if (heuristicOpen()) showOverlay();
  }, true);
})();
