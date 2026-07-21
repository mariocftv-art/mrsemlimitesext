/**
 * MR Sem Limites — Anti-Tamper Module
 * Detecta DevTools, debugger, repack, integrity mismatch e reporta ao painel.
 * NÃO altera o SDK de licença, apenas roda em paralelo.
 */

const REPORT_URL = "https://mrsemlimites.lovable.app/api/public/ext/functions/v1/report-tamper";
const OFFICIAL_EXT_ID = "__OFFICIAL_EXT_ID__"; // substituído no build (opcional)
const EMBEDDED_BG_HASH = "__EMBEDDED_BG_HASH__"; // substituído no build (opcional)

const DEBOUNCE_MS = 60_000;
const TRIAL_GRACE_MS = 30_000;
const lastReport = new Map();
let trialStartTs = 0;

const isServiceWorker = typeof window === "undefined";
const scope = isServiceWorker ? self : window;

// ---------- storage helpers (SW-safe) ----------
async function storageGet(key) {
  try {
    if (chrome?.storage?.local) {
      const r = await chrome.storage.local.get(key);
      return r[key];
    }
  } catch {}
  try { return localStorage.getItem(key); } catch {}
  return null;
}
async function storageSet(key, val) {
  try {
    if (chrome?.storage?.local) {
      await chrome.storage.local.set({ [key]: val });
      return;
    }
  } catch {}
  try { localStorage.setItem(key, val); } catch {}
}

// ---------- get license/hwid without touching SDK ----------
async function getLicenseContext() {
  try {
    const data = await chrome.storage.local.get(["license_key", "licenseKey", "hwid", "device_id", "license"]);
    const license_key = data.license_key || data.licenseKey || data.license?.key || "";
    const hwid = data.hwid || data.device_id || data.license?.hwid || "";
    return { license_key, hwid };
  } catch {
    return { license_key: "", hwid: "" };
  }
}

// ---------- report ----------
async function reportTamper(signal, details = {}) {
  try {
    // trial grace
    if (trialStartTs && Date.now() - trialStartTs < TRIAL_GRACE_MS) return;

    // admin bypass
    const bypass = await storageGet("anti_tamper_bypass");
    const bypassUntil = Number(bypass || 0);
    if (bypassUntil && Date.now() < bypassUntil) return;

    // debounce
    const now = Date.now();
    const last = lastReport.get(signal) || 0;
    if (now - last < DEBOUNCE_MS) return;
    lastReport.set(signal, now);

    const { license_key, hwid } = await getLicenseContext();

    const payload = {
      license_key,
      signal,
      hwid,
      details: {
        url: (typeof location !== "undefined" && location.href) || "background",
        ...details,
      },
      user_agent: (typeof navigator !== "undefined" && navigator.userAgent) || "sw",
    };

    const res = await fetch(REPORT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return;
    const json = await res.json().catch(() => ({}));
    await handleServerAction(json);
  } catch (err) {
    // silencioso
  }
}

async function handleServerAction(res) {
  if (!res || !res.action) return;
  if (res.action === "allow") {
    await storageSet("anti_tamper_bypass", String(Date.now() + 60 * 60 * 1000));
    return;
  }
  if (res.action === "warn") {
    if (!isServiceWorker) showWarnToast(res.message || "Aviso de segurança");
    return;
  }
  if (res.action === "block") {
    await storageSet("blocked", "1");
    if (!isServiceWorker) showBlockOverlay(res.message || "Extensão bloqueada por violação de segurança", res.support_whatsapp_url, res.support_button_label);
  }
}

// ---------- UI (only in pages) ----------
function showWarnToast(msg) {
  try {
    const el = document.createElement("div");
    el.textContent = "⚠ " + msg;
    el.style.cssText = "position:fixed;top:12px;right:12px;z-index:2147483646;background:#3b2f00;color:#ffd166;border:1px solid #ffd166;padding:10px 14px;border-radius:8px;font:13px/1.4 system-ui;max-width:320px;box-shadow:0 8px 24px rgba(0,0,0,.4)";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  } catch {}
}

function showBlockOverlay(msg, waUrl, btnLabel) {
  try {
    if (document.getElementById("__mr_block_overlay__")) return;
    const ov = document.createElement("div");
    ov.id = "__mr_block_overlay__";
    ov.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font:15px/1.5 system-ui;text-align:center;padding:24px;gap:16px";
    ov.innerHTML = `
      <div style="font-size:48px">🔒</div>
      <div style="font-size:20px;font-weight:600;color:#ffd166">Extensão Bloqueada</div>
      <div style="max-width:420px;color:#ddd">${(msg || "").replace(/</g, "&lt;")}</div>
      <button id="__mr_block_btn__" style="margin-top:8px;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;border:0;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">${btnLabel || "💬 Falar com Suporte"}</button>
    `;
    document.documentElement.appendChild(ov);
    document.getElementById("__mr_block_btn__").onclick = () => {
      const url = waUrl || "https://wa.me/5511962579428";
      try { chrome.tabs.create({ url }); } catch { window.open(url, "_blank"); }
    };
  } catch {}
}

async function checkPersistedBlock() {
  if (isServiceWorker) return;
  const blocked = await storageGet("blocked");
  if (blocked === "1") showBlockOverlay("Sessão bloqueada. Contate o suporte para reativar.", null, "💬 Falar com Suporte");
}

// ---------- detections ----------

// 1) DevTools via getter trick
function startDevToolsGetterProbe() {
  if (isServiceWorker) return;
  const probe = { get id() { reportTamper("devtools_open", { via: "getter" }); return ""; } };
  setInterval(() => { try { console.log(probe); console.clear?.(); } catch {} }, 3000);
}

// 2) Debugger timing
function startDebuggerProbe() {
  const check = () => {
    try {
      const t0 = performance.now();
      // eslint-disable-next-line no-new-func
      const fn = new Function("debugger;");
      fn();
      const dt = performance.now() - t0;
      if (dt > 100) reportTamper("debugger_detected", { ms: Math.round(dt) });
    } catch {}
  };
  setInterval(check, 5000);
}

// 3) Context / F12 keys
function startContextInspectionProbe() {
  if (isServiceWorker) return;
  window.addEventListener("contextmenu", () => reportTamper("context_inspected", { kind: "contextmenu" }), true);
  window.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "F12" ||
        (e.ctrlKey && e.shiftKey && (k === "I" || k === "J" || k === "C")) ||
        (e.ctrlKey && k === "U")) {
      reportTamper("source_view_attempt", { key: k, ctrl: e.ctrlKey, shift: e.shiftKey });
    }
  }, true);
}

// 4) Integrity — hash background.js
async function checkIntegrity() {
  try {
    if (!EMBEDDED_BG_HASH || EMBEDDED_BG_HASH.startsWith("__")) return;
    const res = await fetch(chrome.runtime.getURL("background.js"));
    const txt = await res.text();
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt));
    const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    if (hex !== EMBEDDED_BG_HASH) reportTamper("integrity_mismatch", { got: hex.slice(0, 12) });
  } catch {}
}

// 5) Repack — extension id
function checkRepack() {
  try {
    if (!OFFICIAL_EXT_ID || OFFICIAL_EXT_ID.startsWith("__")) return;
    if (chrome?.runtime?.id && chrome.runtime.id !== OFFICIAL_EXT_ID) {
      reportTamper("extension_repack", { current: chrome.runtime.id });
    }
  } catch {}
}

// 6) Console tampering
function checkConsoleTamper() {
  try {
    if (!String(console.log).includes("[native code]")) {
      reportTamper("console_tampering", {});
    }
  } catch {}
}

// ---------- init ----------
export function initAntiTamper(opts = {}) {
  if (opts.trialStart) trialStartTs = Date.now();
  checkPersistedBlock();
  checkRepack();
  checkIntegrity();
  checkConsoleTamper();
  startDebuggerProbe();
  if (!isServiceWorker) {
    startDevToolsGetterProbe();
    startContextInspectionProbe();
  }
}

// auto-init em contextos non-module (sidepanel via <script>)
if (!isServiceWorker && !scope.__MR_AT_INIT__) {
  scope.__MR_AT_INIT__ = true;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAntiTamper());
  } else {
    initAntiTamper();
  }
}

scope.__mrReportTamper = reportTamper;
