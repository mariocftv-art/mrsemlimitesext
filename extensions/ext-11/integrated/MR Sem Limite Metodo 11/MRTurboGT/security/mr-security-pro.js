/*
 * Lovable Security PRO — módulo aditivo compartilhado
 * ------------------------------------------------------
 * Objetivo: adicionar uma camada de proteção SEM alterar UI, prompts,
 * automações, IA, motor, configurações ou fluxo existente.
 *
 * REGRAS INVIOLÁVEIS:
 *   1. Se qualquer coisa aqui falhar, engolir o erro. A extensão nunca pode
 *      ficar pior por causa deste arquivo.
 *   2. Não modificar DOM da extensão, não injetar UI visível.
 *   3. Apenas exponhe window.MRSecurityPRO com utilitários opcionais.
 *
 * Este arquivo é replicado em cada extensão alvo (EXT1/2/3/4/6/7).
 */

(function () {
  "use strict";
  if (typeof globalThis === "undefined") return;
  if (globalThis.MRSecurityPRO && globalThis.MRSecurityPRO.__ready) return;

  var API_BASE = "https://mrsemlimitesext.lovable.app";
  var EXT_CODE = (function () {
    try {
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getManifest) {
        var m = chrome.runtime.getManifest();
        var name = String(m && m.name || "").toLowerCase();
        if (name.indexOf("turbo") >= 0) return "ext7";
        if (name.indexOf("ext 6") >= 0 || name.indexOf("ext6") >= 0) return "ext6";
        if (name.indexOf("manus") >= 0) return "ext4";
        if (name.indexOf("ext 3") >= 0 || name.indexOf("ext3") >= 0) return "ext3";
        if (name.indexOf("ext 2") >= 0 || name.indexOf("ext2") >= 0) return "ext2";
        if (name.indexOf("reformulada") >= 0 || name.indexOf("sem limites") >= 0) return "ext1";
      }
    } catch (_) {}
    return "unknown";
  })();
  var EXT_VERSION = (function () {
    try {
      return chrome.runtime.getManifest().version;
    } catch (_) { return "0.0.0"; }
  })();

  // ---- Log buffer (best-effort) --------------------------------------
  var logBuffer = [];
  var logTimer = null;
  function flushLogs() {
    if (!logBuffer.length) return;
    var events = logBuffer.splice(0, logBuffer.length);
    try {
      fetch(API_BASE + "/api/public/security-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-MR-Ext": EXT_CODE },
        body: JSON.stringify({ events: events }),
        keepalive: true,
      }).catch(function () {});
    } catch (_) {}
  }
  function log(type, detail) {
    try {
      logBuffer.push({ type: String(type), extCode: EXT_CODE, version: EXT_VERSION, detail: detail, ts: Date.now() });
      if (logBuffer.length > 40) flushLogs();
      if (!logTimer) {
        logTimer = setTimeout(function () { logTimer = null; flushLogs(); }, 5000);
      }
    } catch (_) {}
  }

  // ---- Secure client -------------------------------------------------
  async function secureFetch(path, opts) {
    opts = opts || {};
    var url = path.indexOf("http") === 0 ? path : API_BASE + path;
    var headers = Object.assign(
      { "Content-Type": "application/json", "X-MR-Ext": EXT_CODE },
      opts.headers || {},
    );
    var body = opts.body;
    if (body && typeof body !== "string") body = JSON.stringify(body);
    try {
      var res = await fetch(url, {
        method: opts.method || "GET",
        headers: headers,
        body: body,
        credentials: "omit",
      });
      if (!res.ok) return null;
      var text = await res.text();
      try { return JSON.parse(text); } catch (_) { return null; }
    } catch (_) {
      return null;
    }
  }

  async function validateLicense(licenseKey, hwid) {
    var payload = {
      licenseKey: licenseKey || null,
      hwid: hwid || null,
      extCode: EXT_CODE,
      version: EXT_VERSION,
      nonce: Math.random().toString(36).slice(2),
    };
    var out = await secureFetch("/api/public/security-validate-license", {
      method: "POST",
      body: payload,
    });
    if (!out || !out.ok) {
      log("license_fail", { reason: "unreachable" });
      return { ok: false };
    }
    return out;
  }

  async function checkAuthorizedVersion() {
    var out = await secureFetch("/api/public/security-version?ext=" + encodeURIComponent(EXT_CODE));
    if (!out || !out.ok) return { authorized: true, reason: "unreachable" };
    var authorized = compareSemver(EXT_VERSION, out.minVersion) >= 0;
    if (!authorized) log("version_unauthorized", { local: EXT_VERSION, min: out.minVersion });
    return { authorized: authorized, minVersion: out.minVersion, latestVersion: out.latestVersion };
  }

  function compareSemver(a, b) {
    var pa = String(a || "0").split(".").map(function (n) { return parseInt(n, 10) || 0; });
    var pb = String(b || "0").split(".").map(function (n) { return parseInt(n, 10) || 0; });
    for (var i = 0; i < 3; i++) {
      var da = pa[i] || 0, db = pb[i] || 0;
      if (da > db) return 1;
      if (da < db) return -1;
    }
    return 0;
  }

  // ---- Integrity (opcional; usa manifest.integrity.json se existir) --
  async function verifyIntegrity() {
    try {
      if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.getURL) return true;
      var url = chrome.runtime.getURL("manifest.integrity.json");
      var res = await fetch(url);
      if (!res.ok) return true; // sem manifesto -> não bloqueia
      var manifest = await res.json();
      if (!manifest || !manifest.files) return true;
      var subtle = (globalThis.crypto || {}).subtle;
      if (!subtle) return true;
      var files = Object.keys(manifest.files);
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var expected = manifest.files[file];
        try {
          var r = await fetch(chrome.runtime.getURL(file));
          if (!r.ok) continue;
          var buf = await r.arrayBuffer();
          var hashBuf = await subtle.digest("SHA-256", buf);
          var hash = Array.from(new Uint8Array(hashBuf))
            .map(function (b) { return b.toString(16).padStart(2, "0"); })
            .join("");
          if (hash !== expected) {
            log("integrity_fail", { file: file });
            return false;
          }
        } catch (_) {}
      }
      return true;
    } catch (_) { return true; }
  }

  // ---- Tamper guard (leve; nunca quebra UI) --------------------------
  var tampered = false;
  function markTampered(reason) {
    if (tampered) return;
    tampered = true;
    log("tamper", { reason: reason });
    try { globalThis.MRSecurityPRO && (globalThis.MRSecurityPRO.tampered = true); } catch (_) {}
  }
  function installTamperGuard() {
    try {
      var origToString = Function.prototype.toString;
      setInterval(function () {
        try {
          if (Function.prototype.toString !== origToString) markTampered("fn.toString-hooked");
        } catch (_) {}
      }, 15000);
    } catch (_) {}
    try {
      // Detecção passiva de devtools por timing (não usa loop de debugger)
      setInterval(function () {
        try {
          var t = performance.now();
          // eslint-disable-next-line no-debugger
          debugger;
          if (performance.now() - t > 200) markTampered("devtools-open");
        } catch (_) {}
      }, 30000);
    } catch (_) {}
  }

  // ---- Guard helper para funções protegidas --------------------------
  function guard(fn) {
    return async function () {
      try {
        if (tampered) return null;
        var ok = await verifyIntegrity();
        if (!ok) return null;
        return await fn.apply(this, arguments);
      } catch (e) {
        log("guard_error", { message: String((e && e.message) || e) });
        try { return await fn.apply(this, arguments); } catch (_) { return null; }
      }
    };
  }

  // ---- Boot silencioso ----------------------------------------------
  try { installTamperGuard(); } catch (_) {}
  // Executa checagens em background sem bloquear
  setTimeout(function () {
    try { verifyIntegrity(); } catch (_) {}
    try { checkAuthorizedVersion(); } catch (_) {}
  }, 3000);

  globalThis.MRSecurityPRO = {
    __ready: true,
    extCode: EXT_CODE,
    version: EXT_VERSION,
    log: log,
    secureFetch: secureFetch,
    validateLicense: validateLicense,
    checkAuthorizedVersion: checkAuthorizedVersion,
    verifyIntegrity: verifyIntegrity,
    guard: guard,
    get tampered() { return tampered; },
  };
})();
