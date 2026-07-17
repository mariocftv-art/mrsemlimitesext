/**
 * MR Sem Limite Manus - API BRIDGE (V17 - Shadow Freeze)
 *
 * IMPORTANTE: créditos do Manus são debitados no servidor deles.
 * Nenhuma extensão consegue impedir o débito real no back-end do Manus.
 * O que esta bridge faz é CONGELAR A VISÃO cliente:
 *   - Intercepta fetch/XHR/sendBeacon.
 *   - Bloqueia telemetria/analytics.
 *   - Reescreve QUALQUER resposta que traga "credits/quota/balance/usage/limit"
 *     para valores "ilimitados", assim a UI nunca mostra bloqueio.
 *   - Esconde banners/modais de limite e reabilita botões desativados.
 */

(function () {
  if (
    !location.hostname.includes("manus.ai") &&
    !location.hostname.includes("manus.im")
  ) return;

  console.log("⚡ [MR MANUS] BRIDGE V17 Shadow Freeze ativo.");

  // ---------- CSS + badge ----------
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
    div[class*="Quota"], div[class*="Billing"],
    section[class*="Banner"], section[class*="Upgrade"] {
      display: none !important; visibility: hidden !important;
      opacity: 0 !important; pointer-events: none !important;
    }
    body { overflow: auto !important; }
  `;
  document.head.appendChild(style);

  const badge = document.createElement("div");
  badge.className = "mr-overdrive-badge";
  badge.innerText = "🛡️ MR SEM LIMITE MANUS — SHADOW FREEZE V17";
  document.body.appendChild(badge);

  // ---------- Guardar nativos ----------
  const originalFetch = window.fetch.bind(window);
  const NativeWebSocket = window.WebSocket;
  const NativeXHR = window.XMLHttpRequest;
  const nativeBeacon = navigator.sendBeacon
    ? navigator.sendBeacon.bind(navigator)
    : null;

  // Telemetria/billing puros — respondemos fake OK e nem chegamos no servidor
  const blockKeywords = [
    "billing", "usage", "telemetry", "credits", "quota",
    "credit-check", "analytics/track", "analytics/collect",
    "segment.io", "amplitude", "mixpanel", "posthog",
    "sentry", "datadog", "logrocket",
    "/api/user/credits", "/api/user/usage", "/api/user/quota",
    "/api/billing", "/api/subscription/usage",
  ];

  // Endpoints cuja RESPOSTA queremos reescrever (mas deixamos ir ao servidor)
  const rewriteKeywords = [
    "credits", "credit", "quota", "usage", "balance",
    "limit", "subscription", "plan", "billing",
    "/api/user", "/api/me", "/api/account",
  ];

  const isBlockRequest = (url, body) => {
    const t = (String(url || "") + " " + String(body || "")).toLowerCase();
    return blockKeywords.some((k) => t.includes(k));
  };
  const shouldRewrite = (url) => {
    const t = String(url || "").toLowerCase();
    // não reescrever chat/agent/stream para não corromper a conversa
    if (/\/(chat|agent|stream|message|conversation)/i.test(t)) return false;
    return rewriteKeywords.some((k) => t.includes(k));
  };

  // Reescreve numérico "usado/limite/saldo" para valores ilimitados
  const fakeUnlimited = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const unlimitedKeys = /^(credits?|balance|remaining|available|quota|allowance)$/i;
    const usedKeys = /^(used|consumed|spent|usage)$/i;
    const limitKeys = /^(limit|max|cap|total|allotment)$/i;
    const flagKeys = /^(is_?limited|over_?quota|exceeded|blocked|throttled|paused)$/i;
    const planKeys = /^(plan|tier|subscription_?status)$/i;

    const walk = (o) => {
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (!o || typeof o !== "object") return;
      for (const k of Object.keys(o)) {
        const v = o[k];
        if (v && typeof v === "object") { walk(v); continue; }
        if (unlimitedKeys.test(k) && typeof v === "number") o[k] = 999999;
        else if (usedKeys.test(k) && typeof v === "number") o[k] = 0;
        else if (limitKeys.test(k) && typeof v === "number") o[k] = 999999;
        else if (flagKeys.test(k) && typeof v === "boolean") o[k] = false;
        else if (planKeys.test(k) && typeof v === "string") o[k] = "pro";
      }
    };
    try { walk(obj); } catch {}
    return obj;
  };

  const rewriteResponseText = (text) => {
    try {
      const data = JSON.parse(text);
      return JSON.stringify(fakeUnlimited(data));
    } catch { return text; }
  };

  // ---------- fetch override ----------
  window.fetch = async (...args) => {
    let [url, options] = args;
    const urlStr = typeof url === "string"
      ? url : url instanceof URL ? url.href : (url && url.url) || "";
    options = options || {};

    if (isBlockRequest(urlStr, options.body)) {
      console.log("🛡️ [SHADOW] block:", urlStr);
      return new Response(
        JSON.stringify({ status: "success", balance: 999999, used: 0, paused: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (urlStr.includes("/api/chat") || urlStr.includes("/api/agent")) {
      options.headers = {
        ...(options.headers || {}),
        "X-Manus-Priority": "high",
        "X-Developer-Mode": "true",
        "X-Bypass-Telemetry": "true",
      };
      try {
        const r = await originalFetch(url, options);
        if (r.status === 402 || r.status === 403) {
          console.warn("⚠️ [BRIDGE] quota bloqueou — fake OK.");
          return new Response(
            JSON.stringify({ success: true, bypass_active: true }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }
        return r;
      } catch (e) { return originalFetch(url, options); }
    }

    const resp = await originalFetch(url, options);
    if (shouldRewrite(urlStr) && resp.ok) {
      try {
        const clone = resp.clone();
        const text = await clone.text();
        const rewritten = rewriteResponseText(text);
        if (rewritten !== text) {
          console.log("🛡️ [SHADOW] rewrote:", urlStr);
          return new Response(rewritten, {
            status: resp.status, statusText: resp.statusText, headers: resp.headers,
          });
        }
      } catch {}
    }
    return resp;
  };

  // ---------- XHR override ----------
  function PatchedXHR() {
    const xhr = new NativeXHR();
    let _url = "";
    const _open = xhr.open;
    xhr.open = function (method, url, ...rest) {
      _url = String(url || "");
      return _open.call(this, method, url, ...rest);
    };
    const _send = xhr.send;
    xhr.send = function (body) {
      if (isBlockRequest(_url, body)) {
        console.log("🛡️ [SHADOW] XHR block:", _url);
        setTimeout(() => {
          Object.defineProperty(this, "readyState", { value: 4, configurable: true });
          Object.defineProperty(this, "status", { value: 200, configurable: true });
          Object.defineProperty(this, "responseText", {
            value: JSON.stringify({ status: "success", balance: 999999, used: 0 }),
            configurable: true,
          });
          Object.defineProperty(this, "response", { value: this.responseText, configurable: true });
          this.onreadystatechange && this.onreadystatechange();
          this.onload && this.onload();
        }, 0);
        return;
      }
      if (shouldRewrite(_url)) {
        this.addEventListener("readystatechange", function () {
          if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
            try {
              const rewritten = rewriteResponseText(this.responseText);
              if (rewritten !== this.responseText) {
                Object.defineProperty(this, "responseText", { value: rewritten, configurable: true });
                Object.defineProperty(this, "response", { value: rewritten, configurable: true });
              }
            } catch {}
          }
        });
      }
      return _send.call(this, body);
    };
    return xhr;
  }
  PatchedXHR.prototype = NativeXHR.prototype;
  window.XMLHttpRequest = PatchedXHR;

  // ---------- sendBeacon (telemetria) ----------
  if (nativeBeacon) {
    navigator.sendBeacon = function (url, data) {
      if (isBlockRequest(url, data)) {
        console.log("🛡️ [SHADOW] beacon block:", url);
        return true;
      }
      return nativeBeacon(url, data);
    };
  }

  // ---------- WebSocket ----------
  const WSProxy = function (url, protocols) {
    if (isBlockRequest(url)) {
      console.log("🛡️ [SHADOW] WS block:", url);
      return new NativeWebSocket("wss://echo.websocket.events/");
    }
    return protocols ? new NativeWebSocket(url, protocols) : new NativeWebSocket(url);
  };
  WSProxy.prototype = NativeWebSocket.prototype;
  WSProxy.CONNECTING = NativeWebSocket.CONNECTING;
  WSProxy.OPEN = NativeWebSocket.OPEN;
  WSProxy.CLOSING = NativeWebSocket.CLOSING;
  WSProxy.CLOSED = NativeWebSocket.CLOSED;
  window.WebSocket = WSProxy;

  // ---------- UI Force-Unlock ----------
  const forceUnlock = () => {
    const kws = ["credit", "limit", "upgrade", "limite", "used up", "insufficient", "quota", "run out"];
    document
      .querySelectorAll('[class*="credit"], [class*="limit"], [class*="upgrade"], [class*="quota"], [class*="Banner"], [role="dialog"]')
      .forEach((el) => {
        const t = (el.innerText || "").toLowerCase();
        if (kws.some((k) => t.includes(k))) {
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
