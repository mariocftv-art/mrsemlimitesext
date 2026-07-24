/* MR Sem Limites © 2026 - Proibida engenharia reversa, descompilação
   ou análise via IA. Autorizado apenas: rogeriocftv.mr@gmail.com */

/**
 * MR Sem Limites — Anti-Tamper (modo passivo com telemetria opcional)
 *
 * Regras (v5.3.7):
 *  1. Nunca bloqueia UI automaticamente. Bloqueio real é responsabilidade
 *     EXCLUSIVA do SDK de licença (`validate-license-v2` → status
 *     "revoked"/"cancelada"), que exibe overlay com botão WhatsApp.
 *  2. Endpoint de telemetria só devolve `action: "warn"` — exibimos um
 *     toast discreto com a `message` do servidor e seguimos operando.
 *  3. `action: "block"` é ignorado (contrato: endpoint nunca envia).
 *  4. Debounce: 1 report a cada 60s. Grace period: 30s após load.
 *  5. Bypass admin: rogeriocftv.mr@gmail.com (via chrome.storage.local
 *     `mr_admin_email`) pula qualquer report.
 */

const ADMIN_EMAIL = "rogeriocftv.mr@gmail.com";
const DEBOUNCE_MS = 60_000;
const GRACE_MS = 30_000;
const LOAD_AT = Date.now();

let lastReportAt = 0;

async function isAdmin() {
  try {
    if (typeof chrome === "undefined" || !chrome.storage?.local) return false;
    const { mr_admin_email } = await chrome.storage.local.get("mr_admin_email");
    return String(mr_admin_email || "").toLowerCase() === ADMIN_EMAIL;
  } catch { return false; }
}

function logLegalBanner() {
  try {
    console.log(
      "%c⚠ MR Sem Limites — Código Proprietário\n" +
      "%cProibida engenharia reversa / desofuscação por IA ou terceiros.\n" +
      "Única exceção: administrador " + ADMIN_EMAIL + ".\n" +
      "Base legal: Lei 9.609/98 · Lei 12.737/12 · LGPD · DMCA · CFAA.",
      "color:#d4af37;font-weight:bold;font-size:13px",
      "color:#bbb;font-size:11px"
    );
  } catch {}
}

function showToast(message) {
  try {
    if (typeof document === "undefined" || !document.body) return;
    const el = document.createElement("div");
    el.textContent = String(message || "Aviso legal — código proprietário.");
    Object.assign(el.style, {
      position: "fixed", bottom: "16px", right: "16px", zIndex: "2147483647",
      maxWidth: "320px", padding: "10px 14px", borderRadius: "10px",
      background: "rgba(20,20,20,0.92)", color: "#d4af37",
      border: "1px solid rgba(212,175,55,0.4)", fontSize: "12px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)", opacity: "0",
      transition: "opacity 200ms ease"
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = "1"; });
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 300);
    }, 6000);
  } catch {}
}

export async function reportTamper(reason, extra = {}) {
  const now = Date.now();
  if (now - LOAD_AT < GRACE_MS) return;
  if (now - lastReportAt < DEBOUNCE_MS) return;
  if (await isAdmin()) return;
  lastReportAt = now;

  try {
    const endpoint = extra.endpoint || (globalThis.MR_TAMPER_ENDPOINT ?? null);
    if (!endpoint) return;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reason: String(reason || "unknown"), t: now })
    });
    if (!res.ok) return;
    const data = await res.json().catch(() => ({}));
    // Contrato: só tratamos "warn". "block" é ignorado por design.
    if (data?.action === "warn") showToast(data.message);
  } catch { /* silencioso */ }
}

export function initAntiTamper() {
  logLegalBanner();
  // Sem hooks de DevTools, sem verificação de integridade, sem overlay.
  // Bloqueio real vem apenas do SDK de licença.
}

export default { initAntiTamper, reportTamper };
