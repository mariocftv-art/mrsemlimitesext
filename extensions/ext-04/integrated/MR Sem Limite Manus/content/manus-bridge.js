/**
 * MR Sem Limite Manus - API BRIDGE (V16.4 - Corrigido)
 * Congelamento de contadores de billing sem quebrar o chat.
 *
 * Correções aplicadas (Fase 4):
 *  1. NativeWebSocket agora é salvo antes do override.
 *  2. Um único override de window.fetch (removida a duplicata que quebrava tudo).
 *  3. Keywords "stream" e "report" removidas — Manus usa /stream no chat.
 *  4. forceUnlock intervalo aumentado (200ms -> 1800ms).
 *  5. Cleanup: sem ReferenceError em runtime.
 */

(function () {
  if (
    !location.hostname.includes("manus.ai") &&
    !location.hostname.includes("manus.im")
  ) return;

  console.log("⚡ [MR MANUS] API BRIDGE V16.4 ativo (corrigido).");

  // Estilos + esconder banners de crédito/limite
  const style = document.createElement("style");
  style.innerHTML = `
    .mr-overdrive-badge {
      position: fixed; bottom: 20px; left: 20px;
      background: linear-gradient(135deg, #FF4D00, #FF0000);
      color: white; padding: 10px 18px; border-radius: 25px;
      font-weight: 800; font-size: 11px; z-index: 999999;
      box-shadow: 0 4px 15px rgba(255, 0, 0, 0.5);
      letter-spacing: 1px; border: 1px solid rgba(255,255,255,0.2);
      pointer-events: none; font-family: 'Inter', sans-serif;
      text-transform: uppercase;
    }
    div[class*="Credit"], div[class*="Limit"], div[class*="Upgrade"],
    section[class*="Banner"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
    body { overflow: auto !important; }
  `;
  document.head.appendChild(style);

  const badge = document.createElement("div");
  badge.className = "mr-overdrive-badge";
  badge.innerText = "🛡️ MR SEM LIMITE MANUS - SHADOW MODE ATIVO";
  document.body.appendChild(badge);

  // ---- Guardar referências nativas ANTES de sobrescrever ----
  const originalFetch = window.fetch.bind(window);
  const NativeWebSocket = window.WebSocket;

  // Keywords: apenas billing/telemetria. NUNCA "stream"/"report" (chat usa).
  const billingKeywords = [
    "billing",
    "usage",
    "telemetry",
    "credits",
    "quota",
    "credit-check",
    "analytics/track",
  ];

  const isBillingRequest = (url, body) => {
    const target = (String(url || "") + " " + String(body || "")).toLowerCase();
    return billingKeywords.some((k) => target.includes(k));
  };

  // ---- Fetch override ÚNICO ----
  window.fetch = async (...args) => {
    let [url, options] = args;
    const urlStr =
      typeof url === "string"
        ? url
        : url instanceof URL
        ? url.href
        : (url && url.url) || "";
    options = options || {};

    // 1. Bloqueia billing/telemetria com resposta fake OK
    if (isBillingRequest(urlStr, options.body)) {
      console.log("🛡️ [SHADOW] Bloqueando billing:", urlStr);
      return new Response(
        JSON.stringify({ status: "success", balance: 999999, paused: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Injeta headers "dev" apenas no chat/agent (não bloqueia)
    if (urlStr.includes("/api/chat") || urlStr.includes("/api/agent")) {
      options.headers = {
        ...(options.headers || {}),
        "X-Manus-Priority": "high",
        "X-Developer-Mode": "true",
        "X-Bypass-Telemetry": "true",
        "X-Billing-Paused": "true",
        "X-Quota-Override": "unlimited",
      };

      try {
        const response = await originalFetch(url, options);
        if (response.status === 402 || response.status === 403) {
          console.warn("⚠️ [BRIDGE] Cota bloqueou — devolvendo fake OK.");
          return new Response(
            JSON.stringify({ success: true, bypass_active: true }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }
        return response;
      } catch (e) {
        console.error("❌ [BRIDGE] Falha:", e);
        return originalFetch(url, options);
      }
    }

    return originalFetch(url, options);
  };

  // ---- WebSocket override (com NativeWebSocket definido) ----
  const WSProxy = function (url, protocols) {
    if (isBillingRequest(url)) {
      console.log("🛡️ [SHADOW] Bloqueando WS billing:", url);
      // devolve um WS "morto" que não conecta a lugar nenhum problemático
      return new NativeWebSocket("wss://echo.websocket.events/");
    }
    return protocols
      ? new NativeWebSocket(url, protocols)
      : new NativeWebSocket(url);
  };
  WSProxy.prototype = NativeWebSocket.prototype;
  WSProxy.CONNECTING = NativeWebSocket.CONNECTING;
  WSProxy.OPEN = NativeWebSocket.OPEN;
  WSProxy.CLOSING = NativeWebSocket.CLOSING;
  WSProxy.CLOSED = NativeWebSocket.CLOSED;
  window.WebSocket = WSProxy;

  // ---- UI Force-Unlock (mais leve: 1.8s em vez de 200ms) ----
  const forceUnlock = () => {
    const keywords = ["credit", "limit", "upgrade", "limite", "used up", "insufficient"];
    document
      .querySelectorAll('[class*="credit"], [class*="limit"], [class*="upgrade"], [class*="Banner"], [role="dialog"]')
      .forEach((el) => {
        const text = (el.innerText || "").toLowerCase();
        if (keywords.some((k) => text.includes(k))) {
          if (!el.closest("nav") && !el.closest(".mr-overdrive-badge")) {
            el.style.setProperty("display", "none", "important");
          }
        }
      });

    document.querySelectorAll("button[disabled]").forEach((btn) => {
      const isSendBtn =
        btn.querySelector("svg") ||
        (btn.className && String(btn.className).includes("rounded-full"));
      if (isSendBtn) {
        btn.disabled = false;
        btn.style.setProperty("opacity", "1", "important");
        btn.style.setProperty("pointer-events", "auto", "important");
      }
    });
  };
  setInterval(forceUnlock, 1800);
})();
