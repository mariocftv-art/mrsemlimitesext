/*
 * MR Turbo GT — Anti-Inspeção (F12 / DevTools)  v7.0.2
 *
 * Regras críticas (revisadas para eliminar falso-positivo pós-instalação):
 *  1) NUNCA arma no boot só porque existe um token antigo no storage.
 *     Só arma se houver o flag explícito `mrsl_ext7_armed === "1"`,
 *     gravado pelo fluxo de ativação de licença bem-sucedida.
 *  2) NÃO usa heurística de janela (outer/inner) — falso-positivo no sidepanel.
 *  3) NÃO usa trap `console.debug(regex)` — em alguns cenários o Chrome
 *     avalia toString mesmo com o painel de dev fechado, disparando alerta
 *     sem que o usuário tenha aberto o inspecionar. Removido.
 *  4) Detecção agora é EXCLUSIVAMENTE por atalhos de teclado:
 *     F12, Ctrl+Shift+I / J / C, Ctrl+U, Cmd+Opt+I/J.
 *  5) Se o usuário soltar o F12 (ou nenhuma tecla for pressionada por 3s),
 *     o overlay some. Persistiu 60s de teclas → bloqueia sessão.
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
  let armed = false;
  let lastTrigger = 0;

  // ---------- Gate: arma APENAS quando o cockpit estiver ATIVO (LED verde) ----------
  // Regra do usuário: o alerta só pode disparar quando (a) a extensão está ativa
  // E (b) o usuário pressionou F12/atalho de inspeção. Sem cockpit verde, F12 é ignorado.
  function checkArmed() {
    try {
      chrome?.storage?.local?.get?.(["mrsl_ext7_armed"], (r) => {
        armed = !!(r && r.mrsl_ext7_armed === "1");
        if (!armed && overlayEl?.isConnected) hideOverlay();
      });
    } catch (_) {
      armed = false;
    }
  }
  checkArmed();
  try {
    chrome?.storage?.onChanged?.addListener?.((changes, area) => {
      if (area !== "local") return;
      if (changes.mrsl_ext7_armed) checkArmed();
    });
  } catch (_) {}

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
        #mrt-violation-overlay h1{font-size:26px;font-weight:900;letter-spacing:.5px;margin:6px 0;text-shadow:0 0 14px rgba(255,255,255,.7)}
        #mrt-violation-overlay p{max-width:340px;font-size:14px;line-height:1.45;opacity:.95;margin:6px 0}
        #mrt-violation-overlay .mrt-count{margin-top:14px;font-size:56px;font-weight:900;color:#fff;text-shadow:0 0 22px #ff2b2b, 0 0 40px #ff2b2b}
        #mrt-violation-overlay .mrt-hint{font-size:12px;opacity:.85;margin-top:10px}
        #mrt-violation-overlay .mrt-brand{position:absolute;bottom:14px;font-size:11px;opacity:.75;letter-spacing:1px}
        #mrt-violation-overlay.blocked{background:#000;color:#ff5252;animation:none}
      </style>
      <div class="mrt-icon">⚠️</div>
      <h1>VIOLAÇÃO DE EXTENSÃO DETECTADA</h1>
      <p>Modo inspeção (DevTools/F12) detectado. Feche imediatamente para continuar usando a MR Turbo GT.</p>
      <div class="mrt-count" id="mrt-count">${COUNTDOWN_SECONDS}</div>
      <p class="mrt-hint">Persistindo com inspeção, a extensão será bloqueada e o painel MR Sem Limites notificado.</p>
      <div class="mrt-brand">MR TURBO GT · Segurança Ativa</div>
    `;
    return el;
  }

  function showOverlay() {
    if (blocked || !armed) return;
    lastTrigger = Date.now();
    if (!overlayEl) {
      overlayEl = buildOverlay();
      document.documentElement.appendChild(overlayEl);
    } else if (!overlayEl.isConnected) {
      document.documentElement.appendChild(overlayEl);
    }
    if (!timerId) timerId = setInterval(tick, 1000);
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
        "mrsl_session_token","mrsl_license_key","mrsl_hwid","mrsl_ext7_armed",
      ]);
    } catch (_) {}
    try {
      await fetch(PANEL_ALERT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "extension_violation",
          product: "ext7-mr-turbo-gt",
          version: "7.0.2",
          ts: Date.now(),
          ua: navigator.userAgent,
        }),
      });
    } catch (_) {}
  }

  // Se nenhuma tecla F12/Ctrl+Shift+I foi disparada nos últimos 3s, esconde.
  setInterval(() => {
    if (!armed || blocked) return;
    if (overlayEl?.isConnected && Date.now() - lastTrigger > 3000) hideOverlay();
  }, 1000);

  // ÚNICO gatilho: atalhos reais de inspeção
  window.addEventListener("keydown", (e) => {
    if (!armed || blocked) return;
    const k = (e.key || "").toLowerCase();
    if (
      k === "f12" ||
      (e.ctrlKey && e.shiftKey && (k === "i" || k === "j" || k === "c")) ||
      (e.ctrlKey && k === "u") ||
      (e.metaKey && e.altKey && (k === "i" || k === "j"))
    ) {
      showOverlay();
    }
  }, true);
})();
