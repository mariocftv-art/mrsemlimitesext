/**
 * MR Sem Limite Manus - LEGACY REBORN (V4 - Corrigido)
 *
 * Correções aplicadas:
 *  5. huntAndFreeze não cria mais um MutationObserver novo a cada 2s
 *     (marca elementos com data-frozen e reusa um único observer).
 */

(function () {
  if (!/(manus\.im|manus\.ai|lovable\.dev)/.test(location.hostname)) return;

  console.log("🔥 [MR SEM LIMITE] LEGACY REBORN V4 ativo.");

  // 1. Estilo do input + badge
  const style = document.createElement("style");
  style.innerHTML = `
    div[contenteditable="true"], textarea, [class*="chat-input"] {
      border: 2px solid transparent !important;
      background-image: linear-gradient(var(--bg, #0a0c1c), var(--bg, #0a0c1c)),
                        linear-gradient(90deg, #FF0000, #FF8000, #FF0000) !important;
      background-origin: border-box !important;
      background-clip: padding-box, border-box !important;
      box-shadow: 0 0 15px rgba(255, 77, 0, 0.2) !important;
      transition: all 0.3s ease !important;
    }
    div[contenteditable="true"]:focus, textarea:focus {
      box-shadow: 0 0 25px rgba(255, 77, 0, 0.4) !important;
      border-width: 2.5px !important;
    }
    .mr-legacy-badge {
      position: fixed; bottom: 15px; left: 15px;
      background: linear-gradient(135deg, #FF0000, #FF8000);
      color: white; padding: 8px 15px; border-radius: 20px;
      font-size: 10px; font-weight: 900; z-index: 1000000;
      box-shadow: 0 4px 15px rgba(255, 0, 0, 0.5);
      text-transform: uppercase; letter-spacing: 1px;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  const badge = document.createElement("div");
  badge.className = "mr-legacy-badge";
  badge.innerText = "🛡️ MR MANUS LEGACY REBORN";
  document.body.appendChild(badge);

  // 2. Comando externo (ponte com sidepanel/lovable)
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "TYPE_AND_SEND_IN_LOVABLE") {
      const text = e.data.text;
      const input = document.querySelector(
        'div[contenteditable="true"], textarea'
      );
      if (input) {
        input.focus();
        document.execCommand("insertText", false, text);
        setTimeout(() => {
          const btn = document.querySelector(
            'button[class*="send"], button[type="submit"], .rounded-full'
          );
          if (btn) btn.click();
        }, 100);
      }
    }
  });

  // 3. Hunter — sem vazamento de observers
  const CREDIT_RE = /(credit|saldo|balance|token|cota)/i;
  const NUM_RE = /\d+/;

  const freezeElement = (el) => {
    if (el.dataset.mrFrozen === "1") return;
    el.dataset.mrFrozen = "1";
    el.style.opacity = "0.5";
    el.style.filter = "grayscale(1)";
    el.title = "CONGELADO PELO MR MANUS";
    // Congela o texto atual — não cria mais observer aqui.
    const frozenText = el.innerText;
    Object.defineProperty(el, "innerText", {
      configurable: true,
      get() {
        return frozenText;
      },
      set() {
        /* bloqueado */
      },
    });
  };

  const huntAndFreeze = () => {
    // Escopo restrito a candidatos prováveis (mais rápido).
    document
      .querySelectorAll('[class*="credit"], [class*="balance"], [class*="token"], [class*="cota"], [class*="saldo"]')
      .forEach((el) => {
        if (el.dataset.mrFrozen === "1") return;
        const txt = el.innerText || "";
        if (CREDIT_RE.test(txt) && NUM_RE.test(txt)) freezeElement(el);
      });
  };

  setInterval(huntAndFreeze, 2500);
  console.log("✅ [MR SEM LIMITE] Protocolo Rigoroso Corrigido.");
})();
