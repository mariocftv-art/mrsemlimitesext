/* =============================================================
 * TS Popup Extras — License Settings + History (POPUP ONLY)
 * Injeta modais escuros premium. Não altera o fluxo de envio,
 * upload nativo, security_scan, whitelabel ou branding dinâmico.
 * ============================================================= */
(function () {
  if (window.__tsPopupExtrasInstalled) return;
  window.__tsPopupExtrasInstalled = true;

  var HISTORY_KEY = 'ts_popup_prompt_history';
  var SEND_METHOD_KEY = 'ts_send_method';
  var HISTORY_TTL_MS = 24 * 60 * 60 * 1000;
  var HISTORY_MAX = 100;
  var MODAL_HOST_ID = 'ts-popup-extras-host';
  var STYLE_ID = 'ts-popup-extras-css';
  var licenseCountdownTimer = null;

  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]; }); }
  function nowMs(){ return Date.now(); }
  function uuid(){ try { return crypto.randomUUID(); } catch(_) { return 'id-'+Math.random().toString(36).slice(2)+'-'+Date.now(); } }

  function storageGet(keys){
    return new Promise(function(res){
      try { chrome.storage.local.get(keys, function(v){ res(v || {}); }); }
      catch(_) { res({}); }
    });
  }
  function storageSet(obj){
    return new Promise(function(res){
      try { chrome.storage.local.set(obj, function(){ res(true); }); }
      catch(_) { res(false); }
    });
  }

  // ------------------- Helpers públicos -------------------
  window.tsGetSendMethod = async function(){
    var v = await storageGet([SEND_METHOD_KEY]);
    var m = v[SEND_METHOD_KEY];
    return (m === 'method_2') ? 'method_2' : 'method_1';
  };
  window.tsSetSendMethod = async function(m){
    if (m !== 'method_1' && m !== 'method_2') m = 'method_1';
    await storageSet(_kv(SEND_METHOD_KEY, m));
    return m;
  };
  function _kv(k,v){ var o = {}; o[k]=v; return o; }

  window.tsFormatLicenseDate = function(input){
    if (!input) return 'Não disponível';
    var d = null;
    try {
      if (typeof input === 'number') d = new Date(input);
      else if (/^\d+$/.test(String(input))) d = new Date(parseInt(input,10));
      else d = new Date(input);
    } catch(_) { return 'Não disponível'; }
    if (!d || isNaN(d.getTime())) return 'Não disponível';
    try {
      return d.toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
    } catch(_) { return d.toISOString(); }
  };

  window.tsFormatRemainingTime = function(ms){
    if (ms == null) return '—';
    if (ms <= 0) return 'Expirado';
    var totalSeconds = Math.floor(ms/1000);
    var days = Math.floor(totalSeconds / 86400);
    var s = totalSeconds - (days * 86400);
    var hours = Math.floor(s / 3600); s -= hours * 3600;
    var mins = Math.floor(s / 60);
    var secs = s - mins * 60;
    if (days >= 1) return days + 'd ' + hours + 'h ' + mins + 'm restantes';
    return hours + 'h ' + mins + 'm ' + secs + 's restantes';
  };

  function maskKey(k){
    if (!k) return 'Não disponível';
    var s = String(k).trim();
    if (s.length <= 8) return s.slice(0,2) + '****';
    return s.slice(0,5) + '-XXXXX-XXXXX-' + s.slice(-5);
  }

  function parseTs(v){
    if (v == null || v === '') return null;
    if (typeof v === 'number') return v;
    if (/^\d+$/.test(String(v))) return parseInt(v,10);
    var d = new Date(v);
    return isNaN(d.getTime()) ? null : d.getTime();
  }

  window.tsLoadLicenseSettingsData = async function(){
    var keys = ['ql_user_name','ql_license_key','ql_license_status','ql_license_type','ql_license_lifetime','ql_expires_at','ql_activated_at','ql_session_id'];
    var v = await storageGet(keys);
    var lifetime = !!v.ql_license_lifetime || String(v.ql_license_type||'').toLowerCase().indexOf('vital')>=0;
    var activatedAt = parseTs(v.ql_activated_at);
    var expiresAt = lifetime ? null : parseTs(v.ql_expires_at);
    var sendMethod = await window.tsGetSendMethod();
    return {
      userName: v.ql_user_name || 'Não disponível',
      licenseKey: v.ql_license_key || '',
      licenseKeyMasked: maskKey(v.ql_license_key),
      status: v.ql_license_status || (lifetime ? 'Vitalício' : 'Não disponível'),
      type: v.ql_license_type || (lifetime ? 'VITALÍCIO' : 'PRO'),
      lifetime: lifetime,
      activatedAt: activatedAt,
      expiresAt: expiresAt,
      sendMethod: sendMethod
    };
  };

  // ------------------- Histórico -------------------
  async function readRawHistory(){
    var v = await storageGet([HISTORY_KEY]);
    var arr = Array.isArray(v[HISTORY_KEY]) ? v[HISTORY_KEY] : [];
    return arr;
  }
  function pruneOld(arr){
    var cutoff = nowMs() - HISTORY_TTL_MS;
    return arr.filter(function(it){ return it && typeof it.createdAt === 'number' && it.createdAt >= cutoff; }).slice(0, HISTORY_MAX);
  }
  window.tsLoadPopupPromptHistory = async function(){
    var arr = await readRawHistory();
    var pruned = pruneOld(arr);
    if (pruned.length !== arr.length) await storageSet(_kv(HISTORY_KEY, pruned));
    return pruned;
  };
  window.tsCleanPopupPromptHistory = window.tsLoadPopupPromptHistory;

  window.tsSavePopupPromptHistory = async function(prompt, meta){
    try {
      var p = String(prompt || '').trim();
      if (!p) return false;
      meta = meta || {};
      var arr = pruneOld(await readRawHistory());
      arr.unshift({
        id: uuid(),
        prompt: p.length > 4000 ? p.slice(0,4000) : p,
        createdAt: nowMs(),
        projectId: meta.projectId || null,
        method: meta.method || 'method_1',
        filesCount: typeof meta.filesCount === 'number' ? meta.filesCount : 0
      });
      arr = arr.slice(0, HISTORY_MAX);
      await storageSet(_kv(HISTORY_KEY, arr));
      return true;
    } catch(_) { return false; }
  };

  window.tsDeletePromptHistoryItem = async function(id){
    var arr = await readRawHistory();
    arr = arr.filter(function(it){ return it && it.id !== id; });
    await storageSet(_kv(HISTORY_KEY, arr));
    return true;
  };
  window.tsClearPromptHistory = async function(){
    await storageSet(_kv(HISTORY_KEY, []));
    return true;
  };
  window.tsReusePromptFromHistory = function(prompt){
    try {
      var candidates = [
        document.querySelector('#ts-popup-textarea'),
        document.querySelector('#ql-input'),
        document.querySelector('#ql-textarea'),
        document.querySelector('#ql-floating textarea'),
        document.querySelector('#ql-floating [contenteditable="true"]')
      ].filter(Boolean);
      var el = candidates[0];
      if (!el) return false;
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        el.value = prompt;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        el.textContent = prompt;
        el.dispatchEvent(new InputEvent('input', { bubbles: true }));
      }
      try { el.focus(); } catch(_){}
      return true;
    } catch(_) { return false; }
  };

  // ------------------- Estilos dos modais -------------------
  function ensureStyles(){
    if (document.getElementById(STYLE_ID)) return;
    var css = ""
      + ".ts-px-overlay{position:fixed;inset:0;padding:14px;background:rgba(0,0,0,.74);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);z-index:2147483646;display:flex;align-items:center;justify-content:center;animation:tsPxFade .18s ease}"
      + "@keyframes tsPxFade{from{opacity:0}to{opacity:1}}"
      + "@keyframes tsPxIn{from{transform:translateY(8px) scale(.975);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}"
      + ".ts-px-modal{width:min(338px,calc(100vw - 24px));max-height:calc(100vh - 28px);overflow:hidden;display:flex;flex-direction:column;background:linear-gradient(180deg,rgba(19,19,24,.98),rgba(10,10,13,.985));border:1px solid rgba(var(--ts-brand-primary-rgb,139,92,246),.26);border-radius:16px;color:#f4f4f5;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 36px 80px -26px rgba(0,0,0,.92),0 0 0 1px rgba(255,255,255,.03),0 0 56px -18px rgba(var(--ts-brand-primary-rgb,139,92,246),.32);animation:tsPxIn .22s cubic-bezier(.22,1,.36,1)}"
      + ".ts-px-license-modal{width:min(338px,calc(100vw - 24px))}"
      + ".ts-px-header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 14px 12px;border-bottom:1px solid rgba(var(--ts-brand-primary-rgb,139,92,246),.16);background:linear-gradient(180deg,rgba(var(--ts-brand-primary-rgb,139,92,246),.10),rgba(255,255,255,0))}"
      + ".ts-px-title{display:flex;align-items:center;gap:9px;font-size:12.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#fafafa}"
      + ".ts-px-title-ico{width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:rgba(var(--ts-brand-primary-rgb,139,92,246),.18);color:var(--ts-brand-primary,#8B5CF6);box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}"
      + ".ts-px-title-ico svg{width:14px;height:14px}"
      + ".ts-px-close{width:26px;height:26px;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);color:#8d8d98;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;transition:.15s}"
      + ".ts-px-close:hover{background:rgba(255,255,255,.06);color:#fff;border-color:rgba(255,255,255,.14)}"
      + ".ts-px-body{padding:12px 14px 14px;overflow-y:auto;flex:1;scrollbar-width:none!important;-ms-overflow-style:none!important}"
      + ".ts-px-body::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}"
      + ".ts-px-section{margin-bottom:12px}"
      + ".ts-px-section:last-child{margin-bottom:0}"
      + ".ts-px-section-title{display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#73737d}"
      + ".ts-px-section-title::before{content:'•';font-size:11px;color:var(--ts-brand-primary,#8B5CF6)}"
      + ".ts-px-card,.ts-px-info-grid,.ts-px-license-card,.ts-px-method{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.065);border-radius:12px;box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}"
      + ".ts-px-license-card{display:flex;align-items:center;gap:12px;padding:11px 12px;background:linear-gradient(135deg,rgba(var(--ts-brand-primary-rgb,139,92,246),.16),rgba(255,255,255,.028));border-color:rgba(var(--ts-brand-primary-rgb,139,92,246),.26)}"
      + ".ts-px-license-avatar{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;background:linear-gradient(135deg,var(--ts-brand-primary,#8B5CF6),var(--ts-brand-primary-hover,#7C3AED));color:#fff;font-size:14px;font-weight:900;box-shadow:0 8px 22px rgba(var(--ts-brand-primary-rgb,139,92,246),.34)}"
      + ".ts-px-license-main{flex:1;min-width:0}"
      + ".ts-px-license-name{font-size:13.5px;font-weight:800;color:#fff;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
      + ".ts-px-license-sub{margin-top:3px;font-size:10.5px;color:rgba(255,255,255,.54)}"
      + ".ts-px-license-plan{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:8px}"
      + ".ts-px-info-grid{overflow:hidden}"
      + ".ts-px-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.05);font-size:12.5px;background:rgba(255,255,255,.012)}"
      + ".ts-px-row:nth-child(even){background:rgba(255,255,255,.026)}"
      + ".ts-px-row:last-child{border-bottom:none}"
      + ".ts-px-row-k{color:#a1a1aa;font-weight:500}"
      + ".ts-px-row-v{color:#f4f4f5;font-weight:650;text-align:right;max-width:64%;word-break:break-word}"
      + ".ts-px-badge{display:inline-flex;align-items:center;justify-content:center;min-height:22px;padding:3px 9px;border-radius:7px;font-size:9.5px;font-weight:900;letter-spacing:.10em;text-transform:uppercase;background:rgba(var(--ts-brand-primary-rgb,139,92,246),.15);color:var(--ts-brand-primary,#8B5CF6);border:1px solid rgba(var(--ts-brand-primary-rgb,139,92,246),.28)}"
      + ".ts-px-badge.trial{background:rgba(251,191,36,.12);color:#fbbf24;border-color:rgba(251,191,36,.22)}"
      + ".ts-px-badge.expired{background:rgba(248,113,113,.12);color:#f87171;border-color:rgba(248,113,113,.24)}"
      + ".ts-px-badge.lifetime{background:rgba(var(--ts-brand-primary-rgb,139,92,246),.18);color:#d9c9ff;border-color:rgba(var(--ts-brand-primary-rgb,139,92,246),.30)}"
      + ".ts-px-mini-badge{display:inline-flex;align-items:center;justify-content:center;min-height:20px;padding:2px 8px;border-radius:6px;background:rgba(var(--ts-brand-primary-rgb,139,92,246),.10);border:1px solid rgba(var(--ts-brand-primary-rgb,139,92,246),.18);font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#c9b5ff}"
      + ".ts-px-mini-badge.files{background:rgba(52,211,153,.10);color:#34d399;border-color:rgba(52,211,153,.18)}"
      + ".ts-px-card{padding:12px}"
      + ".ts-px-progress{height:7px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.35)}"
      + ".ts-px-progress-bar{height:100%;border-radius:999px;background:linear-gradient(90deg,#b98cff 0%,var(--ts-brand-primary,#8B5CF6) 45%,var(--ts-brand-primary-hover,#7C3AED) 100%);box-shadow:0 0 14px rgba(var(--ts-brand-primary-rgb,139,92,246),.58);transition:width .35s ease}"
      + ".ts-px-progress-meta{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:8px}"
      + ".ts-px-plan-remaining{font-size:11px;font-weight:700;color:#ddd6fe;line-height:1.2}"
      + ".ts-px-plan-percent{font-size:10px;color:#8b8b96;white-space:nowrap}"
      + ".ts-px-methods{display:grid;grid-template-columns:1fr;gap:8px}"
      + ".ts-px-method{position:relative;padding:11px 12px;cursor:pointer;transition:.18s;text-align:left}"
      + ".ts-px-method:hover{border-color:rgba(var(--ts-brand-primary-rgb,139,92,246),.28);background:rgba(255,255,255,.03)}"
      + ".ts-px-method.selected{background:linear-gradient(90deg,rgba(var(--ts-brand-primary-rgb,139,92,246),.20),rgba(var(--ts-brand-primary-rgb,139,92,246),.05));border-color:rgba(var(--ts-brand-primary-rgb,139,92,246),.72);box-shadow:0 0 0 1px rgba(var(--ts-brand-primary-rgb,139,92,246),.30),0 10px 24px -16px rgba(var(--ts-brand-primary-rgb,139,92,246),.55)}"
      + ".ts-px-method-head{display:flex;align-items:center;gap:10px}"
      + ".ts-px-method-num{width:26px;height:26px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#f4f4f5;font-size:11px;font-weight:900;letter-spacing:.03em;flex:0 0 auto}"
      + ".ts-px-method.selected .ts-px-method-num{background:linear-gradient(135deg,var(--ts-brand-primary,#8B5CF6),var(--ts-brand-primary-hover,#7C3AED));border-color:transparent;color:#fff}"
      + ".ts-px-method-copy{flex:1;min-width:0}"
      + ".ts-px-method-t{font-size:12.8px;font-weight:800;color:#fff;line-height:1.15}"
      + ".ts-px-method-s{font-size:11px;color:rgba(255,255,255,.52);margin-top:4px}"
      + ".ts-px-method.selected .ts-px-method-s{color:rgba(255,255,255,.74)}"
      + ".ts-px-method-dot{width:15px;height:15px;border-radius:50%;border:2px solid rgba(255,255,255,.16);display:inline-block;flex:0 0 auto;margin-left:auto}"
      + ".ts-px-method.selected .ts-px-method-dot{border-color:var(--ts-brand-primary,#8B5CF6);background:var(--ts-brand-primary,#8B5CF6);box-shadow:0 0 0 3px rgba(var(--ts-brand-primary-rgb,139,92,246),.20)}"
      + ".ts-px-support-btn{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.065);color:#fff;text-decoration:none;transition:.18s;cursor:pointer}"
      + ".ts-px-support-btn:hover{border-color:rgba(var(--ts-brand-primary-rgb,139,92,246),.55);background:linear-gradient(90deg,rgba(var(--ts-brand-primary-rgb,139,92,246),.14),rgba(var(--ts-brand-primary-rgb,139,92,246),.04));transform:translateY(-1px)}"
      + ".ts-px-support-ico{width:32px;height:32px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--ts-brand-primary,#8B5CF6),var(--ts-brand-primary-hover,#7C3AED));font-size:16px;flex:0 0 auto}"
      + ".ts-px-support-copy{display:flex;flex-direction:column;min-width:0}"
      + ".ts-px-support-t{font-size:12.8px;font-weight:800;color:#fff;line-height:1.15}"
      + ".ts-px-support-s{font-size:11px;color:rgba(255,255,255,.55);margin-top:3px}"
      + ".ts-px-footer{padding:10px 14px;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center;gap:10px;background:rgba(0,0,0,.18)}"
      + ".ts-px-version{font-size:10px;color:#6f6f78;letter-spacing:.05em}"
      + ".ts-px-empty{text-align:center;padding:30px 10px;color:#71717a;font-size:12px}"
      + ".ts-px-hist-list{display:flex;flex-direction:column;gap:8px}"
      + ".ts-px-hist-item{background:#18181b;border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:12px 14px}"
      + ".ts-px-hist-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;font-size:11px;color:#a1a1aa}"
      + ".ts-px-hist-badges{display:flex;gap:6px;align-items:center}"
      + ".ts-px-hist-prompt{font-size:12.5px;color:#e4e4e7;line-height:1.5;margin-bottom:8px;white-space:pre-wrap;word-break:break-word}"
      + ".ts-px-hist-actions{display:flex;gap:6px;flex-wrap:wrap}"
      + ".ts-px-btn{background:rgba(255,255,255,.04);color:#e4e4e7;border:1px solid rgba(255,255,255,.08);padding:6px 12px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;transition:.15s}"
      + ".ts-px-btn:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15)}"
      + ".ts-px-btn.primary{background:linear-gradient(135deg,var(--ts-brand-primary,#8B5CF6),var(--ts-brand-primary-hover,#7C3AED));border-color:transparent;color:#fff}"
      + ".ts-px-btn.primary:hover{box-shadow:0 4px 16px rgba(var(--ts-brand-primary-rgb,139,92,246),.35)}"
      + ".ts-px-btn.danger{color:#f87171;border-color:rgba(248,113,113,.25)}"
      + ".ts-px-btn.danger:hover{background:rgba(248,113,113,.08)}"
      + ".ts-px-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#18181b;border:1px solid rgba(var(--ts-brand-primary-rgb,139,92,246),.35);color:#f4f4f5;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;z-index:2147483647;box-shadow:0 10px 30px -8px rgba(0,0,0,.6);animation:tsPxIn .2s ease}"
      + "@media (max-width:420px){.ts-px-overlay{padding:10px}.ts-px-modal{width:min(340px,calc(100vw - 16px));max-height:calc(100vh - 20px)}.ts-px-body{padding:10px 10px 12px}.ts-px-header{padding:12px 12px 10px}.ts-px-footer{padding:10px 12px}}";
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  function toast(msg){
    ensureStyles();
    var t = document.createElement('div');
    t.className = 'ts-px-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function(){ try { t.remove(); } catch(_){ } }, 2400);
  }

  function mountModal(html){
    ensureStyles();
    window.tsClosePopupModal();
    var host = document.createElement('div');
    host.id = MODAL_HOST_ID;
    host.className = 'ts-px-overlay';
    host.innerHTML = html;
    host.addEventListener('click', function(e){ if (e.target === host) window.tsClosePopupModal(); });
    document.body.appendChild(host);
    var closeBtn = host.querySelector('[data-px-close]');
    if (closeBtn) closeBtn.addEventListener('click', window.tsClosePopupModal);
    return host;
  }

  window.tsClosePopupModal = function(){
    try { if (licenseCountdownTimer) clearInterval(licenseCountdownTimer); } catch(_){ }
    licenseCountdownTimer = null;
    var el = document.getElementById(MODAL_HOST_ID);
    if (el) try { el.remove(); } catch(_){ }
  };

  // ------------------- License modal -------------------
  function statusBadgeClass(status, lifetime){
    var s = String(status||'').toLowerCase();
    if (lifetime || s.indexOf('vital')>=0) return 'lifetime';
    if (s.indexOf('exp')>=0) return 'expired';
    if (s.indexOf('test')>=0 || s.indexOf('trial')>=0) return 'trial';
    return '';
  }

  function getInitials(name){
    var n = String(name || '').trim();
    if (!n || n === 'Não disponível') return 'TS';
    var parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return n.slice(0,2).toUpperCase();
  }

  function getExtensionVersion(){
    try {
      return (chrome && chrome.runtime && chrome.runtime.getManifest && chrome.runtime.getManifest().version) || '5.2.1';
    } catch(_) { return '5.2.1'; }
  }

  function computePlanTiming(data){
    var lifetime = !!(data && data.lifetime);
    var progressPct = 0;
    var remainingLabel = '—';
    var progressText = '—';
    if (lifetime) {
      progressPct = 100;
      remainingLabel = 'Acesso vitalício';
      progressText = '∞';
    } else if (data && data.activatedAt && data.expiresAt) {
      var total = data.expiresAt - data.activatedAt;
      var used = nowMs() - data.activatedAt;
      var remaining = data.expiresAt - nowMs();
      if (total > 0) progressPct = Math.max(0, Math.min(100, (used/total)*100));
      remainingLabel = remaining <= 0 ? 'Expirado' : window.tsFormatRemainingTime(remaining);
      progressText = Math.round(progressPct) + '% usado';
    } else if (data && data.expiresAt) {
      var rem2 = data.expiresAt - nowMs();
      remainingLabel = rem2 <= 0 ? 'Expirado' : window.tsFormatRemainingTime(rem2);
      progressPct = rem2 <= 0 ? 100 : 25;
      progressText = Math.round(progressPct) + '% usado';
    }
    return { progressPct: progressPct, remainingLabel: remainingLabel, progressText: progressText };
  }

  function startLicenseCountdown(data){
    try { if (licenseCountdownTimer) clearInterval(licenseCountdownTimer); } catch(_){ }
    function update(){
      try {
        var host = document.getElementById(MODAL_HOST_ID);
        if (!host) { if (licenseCountdownTimer) clearInterval(licenseCountdownTimer); licenseCountdownTimer = null; return; }
        var t = computePlanTiming(data || {});
        var bar = host.querySelector('[data-license-progress-bar]');
        var rem = host.querySelector('[data-license-remaining]');
        var pct = host.querySelector('[data-license-progress-text]');
        if (bar) bar.style.width = t.progressPct.toFixed(1) + '%';
        if (rem) rem.textContent = t.remainingLabel;
        if (pct) pct.textContent = t.progressText;
      } catch(_) {}
    }
    update();
    if (!(data && data.lifetime)) licenseCountdownTimer = setInterval(update, 1000);
  }

  window.tsRenderLicenseSettingsModal = function(data){
    var lifetime = data.lifetime;
    var timing = computePlanTiming(data);
    var progressPct = timing.progressPct;
    var remainingLabel = timing.remainingLabel;
    var badgeCls = statusBadgeClass(data.status, lifetime);
    var typeLabel = lifetime ? 'VITALÍCIO' : String(data.type||'PRO').toUpperCase();
    var statusLabel = lifetime ? 'Ativo' : String(data.status || 'active');
    var m1sel = data.sendMethod === 'method_1';
    var m2sel = data.sendMethod === 'method_2';
    var avatarText = getInitials(data.userName);
    var version = getExtensionVersion();
    var gearIco = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
    var html = '<div class="ts-px-modal ts-px-license-modal" role="dialog" aria-label="Configurações da Licença">'
      + '<div class="ts-px-header"><div class="ts-px-title"><span class="ts-px-title-ico">'+gearIco+'</span>Configurações da Licença</div><button class="ts-px-close" data-px-close aria-label="Fechar">✕</button></div>'
      + '<div class="ts-px-body">'
        + '<div class="ts-px-section">'
          + '<div class="ts-px-license-card">'
            + '<div class="ts-px-license-avatar">'+esc(avatarText)+'</div>'
            + '<div class="ts-px-license-main">'
              + '<div class="ts-px-license-name">'+esc(data.userName)+'</div>'
              + '<div class="ts-px-license-sub">Plano vinculado à chave ativa</div>'
              + '<div class="ts-px-license-plan"><span class="ts-px-badge '+badgeCls+'">'+esc(typeLabel)+'</span><span class="ts-px-mini-badge">'+esc(statusLabel)+'</span></div>'
            + '</div>'
          + '</div>'
        + '</div>'
        + '<div class="ts-px-section">'
          + '<div class="ts-px-info-grid">'
            + '<div class="ts-px-row"><span class="ts-px-row-k">Chave</span><span class="ts-px-row-v" style="font-family:ui-monospace,monospace;font-size:11.5px">'+esc(data.licenseKeyMasked)+'</span></div>'
            + '<div class="ts-px-row"><span class="ts-px-row-k">Ativação</span><span class="ts-px-row-v">'+esc(window.tsFormatLicenseDate(data.activatedAt))+'</span></div>'
            + '<div class="ts-px-row"><span class="ts-px-row-k">Expiração</span><span class="ts-px-row-v">'+ (lifetime ? 'Vitalício' : esc(window.tsFormatLicenseDate(data.expiresAt))) +'</span></div>'
          + '</div>'
        + '</div>'
        + '<div class="ts-px-section">'
          + '<div class="ts-px-section-title">Tempo do plano</div>'
          + '<div class="ts-px-card">'
            + '<div class="ts-px-progress"><div class="ts-px-progress-bar" data-license-progress-bar style="width:'+progressPct.toFixed(1)+'%"></div></div>'
            + '<div class="ts-px-progress-meta"><span class="ts-px-plan-remaining" data-license-remaining>'+esc(remainingLabel)+'</span><span class="ts-px-plan-percent" data-license-progress-text>'+ (lifetime ? '∞' : (Math.round(progressPct)+'% usado')) +'</span></div>'
          + '</div>'
        + '</div>'
        + '<div class="ts-px-section">'
          + '<div class="ts-px-section-title">Qual método quer usar?</div>'
          + '<div class="ts-px-methods">'
            + '<button class="ts-px-method '+(m1sel?'selected':'')+'" data-method="method_1"><div class="ts-px-method-head"><span class="ts-px-method-num">01</span><div class="ts-px-method-copy"><div class="ts-px-method-t">Método 1</div><div class="ts-px-method-s">Método padrão</div></div><span class="ts-px-method-dot"></span></div></button>'
            + '<button class="ts-px-method '+(m2sel?'selected':'')+'" data-method="method_2"><div class="ts-px-method-head"><span class="ts-px-method-num">02</span><div class="ts-px-method-copy"><div class="ts-px-method-t">Método 2</div><div class="ts-px-method-s">Método alternativo</div></div><span class="ts-px-method-dot"></span></div></button>'
          + '</div>'
        + '</div>'
        + (function(){ try { var u = (typeof window.getBrandSupportUrl==="function" && window.getBrandSupportUrl()) || "https://wa.me/5518981868677"; return '<div class="ts-px-section"><div class="ts-px-section-title">Suporte</div><a class="ts-px-support-btn" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer"><span class="ts-px-support-ico">💬</span><span class="ts-px-support-copy"><span class="ts-px-support-t">Falar com o suporte</span><span class="ts-px-support-s">Tire dúvidas sobre sua licença</span></span></a></div>'; } catch(_) { return ""; } })()
      + '</div>'
      + '<div class="ts-px-footer"><span class="ts-px-version">Versão da extensão</span><span class="ts-px-version">v'+esc(version)+'</span></div>'
    + '</div>';
    var host = mountModal(html);
    host.querySelectorAll('.ts-px-method').forEach(function(btn){
      btn.addEventListener('click', async function(){
        var m = btn.getAttribute('data-method');
        await window.tsSetSendMethod(m);
        host.querySelectorAll('.ts-px-method').forEach(function(b){ b.classList.toggle('selected', b.getAttribute('data-method') === m); });
        toast('Método de envio atualizado.');
      });
    });
    startLicenseCountdown(data);
  };

  window.tsOpenLicenseSettingsModal = async function(){
    var data = await window.tsLoadLicenseSettingsData();
    window.tsRenderLicenseSettingsModal(data);
  };

  // ------------------- History modal -------------------
  function renderHistoryList(items){
    if (!items.length) return '<div class="ts-px-empty">Nenhum prompt enviado nas últimas 24h.</div>';
    return '<div class="ts-px-hist-list">' + items.map(function(it){
      var when = window.tsFormatLicenseDate(it.createdAt);
      var preview = String(it.prompt||'').split('\n')[0].slice(0,160);
      if (String(it.prompt||'').length > 160) preview += '…';
      var methodLabel = it.method === 'method_2' ? 'Método alternativo' : 'Método padrão';
      var filesBadge = (it.filesCount>0) ? '<span class="ts-px-mini-badge files">'+it.filesCount+' anexo'+(it.filesCount>1?'s':'')+'</span>' : '';
      return '<div class="ts-px-hist-item" data-id="'+esc(it.id)+'">'
        + '<div class="ts-px-hist-head"><span>'+esc(when)+'</span><span class="ts-px-hist-badges"><span class="ts-px-mini-badge">'+methodLabel+'</span>'+filesBadge+'</span></div>'
        + '<div class="ts-px-hist-prompt">'+esc(preview)+'</div>'
        + '<div class="ts-px-hist-actions">'
          + '<button class="ts-px-btn" data-act="copy">Copiar</button>'
          + '<button class="ts-px-btn primary" data-act="reuse">Reusar</button>'
          + '<button class="ts-px-btn danger" data-act="delete">Excluir</button>'
        + '</div>'
      + '</div>';
    }).join('') + '</div>';
  }

  function bindHistoryActions(host, items){
    var byId = {}; items.forEach(function(it){ byId[it.id]=it; });
    host.querySelectorAll('.ts-px-hist-item').forEach(function(row){
      var id = row.getAttribute('data-id');
      row.querySelectorAll('[data-act]').forEach(function(btn){
        btn.addEventListener('click', async function(){
          var it = byId[id]; if (!it) return;
          var act = btn.getAttribute('data-act');
          if (act === 'copy') {
            try { await navigator.clipboard.writeText(it.prompt); toast('Copiado.'); } catch(_) { toast('Falha ao copiar.'); }
          } else if (act === 'reuse') {
            var ok = window.tsReusePromptFromHistory(it.prompt);
            toast(ok ? 'Prompt reutilizado.' : 'Input não encontrado.');
            if (ok) window.tsClosePopupModal();
          } else if (act === 'delete') {
            await window.tsDeletePromptHistoryItem(id);
            window.tsOpenPromptHistoryModal();
          }
        });
      });
    });
  }

  var clockIco = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

  window.tsOpenPromptHistoryModal = async function(){
    var items = await window.tsLoadPopupPromptHistory();
    var html = '<div class="ts-px-modal" role="dialog" aria-label="Histórico">'
      + '<div class="ts-px-header"><div><div class="ts-px-title"><span class="ts-px-title-ico">'+clockIco+'</span>Histórico</div><div style="font-size:11px;color:#71717a;margin-top:4px;margin-left:38px">Prompts enviados nas últimas 24h</div></div><button class="ts-px-close" data-px-close aria-label="Fechar">✕</button></div>'
      + '<div class="ts-px-body">' + renderHistoryList(items) + '</div>'
      + '<div class="ts-px-footer"><span style="font-size:11px;color:#71717a">'+items.length+' item'+(items.length!==1?'s':'')+'</span><button class="ts-px-btn danger" data-px-clear>Limpar histórico</button></div>'
    + '</div>';
    var host = mountModal(html);
    bindHistoryActions(host, items);
    var clr = host.querySelector('[data-px-clear]');
    if (clr) clr.addEventListener('click', async function(){
      await window.tsClearPromptHistory();
      window.tsOpenPromptHistoryModal();
    });
  };

  console.log('[TS Popup Extras] loaded');
})();
