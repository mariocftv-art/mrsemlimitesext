
// ============================================================
// Lovable project download helpers (source-code + raw assets)
// Prefer MAIN world in an open Lovable tab (real session/cookies),
// fall back to background fetch with the captured Bearer token.
// ============================================================
function normalizeLovableSourceFiles(payload) {
  if (!payload || typeof payload !== "object") return [];
  var buckets = [
    payload.files,
    payload.data && payload.data.files,
    payload.source_code && payload.source_code.files,
    payload.sourceCode && payload.sourceCode.files,
    payload.project && payload.project.files
  ];
  var arr = null;
  for (var i = 0; i < buckets.length; i++) {
    if (Array.isArray(buckets[i])) { arr = buckets[i]; break; }
  }
  if (!arr) return [];
  var out = [];
  for (var j = 0; j < arr.length; j++) {
    var f = arr[j];
    if (!f || typeof f !== "object") continue;
    var name = f.name || f.path || f.file_path || f.filename || f.fileName || "";
    if (!name) continue;
    var contents = f.contents;
    if (contents == null) contents = f.content;
    if (contents == null) contents = f.source;
    if (contents == null) contents = f.text;
    var merged = Object.assign({}, f, { name: name });
    if (contents != null) merged.contents = contents;
    out.push(merged);
  }
  return out;
}

async function _lovablePickTab() {
  try {
    var tabs = await chrome.tabs.query({ url: ["https://lovable.dev/*", "https://*.lovable.dev/*"] });
    return (tabs && tabs[0]) || null;
  } catch (e) { return null; }
}

async function lovableFetchSourceCode(projectId, token) {
  var hosts = ["https://api.lovable.dev", "https://lovable-api.com"];
  var tab = await _lovablePickTab();
  if (tab && tab.id != null) {
    try {
      var results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: "MAIN",
        func: async function(projectId, token, hosts) {
          for (var i = 0; i < hosts.length; i++) {
            try {
              var headers = { "Accept": "application/json" };
              if (token) headers["Authorization"] = "Bearer " + token;
              var r = await fetch(hosts[i] + "/projects/" + projectId + "/source-code", {
                method: "GET", headers: headers, credentials: "include"
              });
              if (r.ok) return { ok: true, payload: await r.json() };
            } catch (e) {}
          }
          return { ok: false, error: "in-page source-code fetch failed" };
        },
        args: [projectId, token || "", hosts]
      });
      if (results && results[0] && results[0].result && results[0].result.ok) return results[0].result;
    } catch (e) {}
  }
  for (var i = 0; i < hosts.length; i++) {
    try {
      var headers = { "Accept": "application/json" };
      if (token) headers["Authorization"] = "Bearer " + token;
      var res = await fetch(hosts[i] + "/projects/" + projectId + "/source-code", { method: "GET", headers: headers });
      if (res.ok) return { ok: true, payload: await res.json() };
    } catch (e) {}
  }
  return { ok: false, error: "source-code fetch failed" };
}

async function lovableFetchRawFile(projectId, filePath, token) {
  var hosts = ["https://api.lovable.dev", "https://lovable-api.com"];
  var qs = "/projects/" + projectId + "/files/raw?path=" + encodeURIComponent(filePath);
  var tab = await _lovablePickTab();
  if (tab && tab.id != null) {
    try {
      var results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: "MAIN",
        func: async function(qs, token, hosts) {
          for (var i = 0; i < hosts.length; i++) {
            try {
              var headers = { "Accept": "*/*" };
              if (token) headers["Authorization"] = "Bearer " + token;
              var r = await fetch(hosts[i] + qs, { method: "GET", headers: headers, credentials: "include" });
              if (r.ok) {
                var ab = await r.arrayBuffer();
                return { ok: true, data: Array.from(new Uint8Array(ab)) };
              }
            } catch (e) {}
          }
          return { ok: false };
        },
        args: [qs, token || "", hosts]
      });
      if (results && results[0] && results[0].result && results[0].result.ok) {
        return new Uint8Array(results[0].result.data).buffer;
      }
    } catch (e) {}
  }
  for (var i = 0; i < hosts.length; i++) {
    try {
      var headers = { "Accept": "*/*" };
      if (token) headers["Authorization"] = "Bearer " + token;
      var res = await fetch(hosts[i] + qs, { method: "GET", headers: headers });
      if (res.ok) return await res.arrayBuffer();
    } catch (e) {}
  }
  return null;
}


// Capture Lovable Bearer token from outgoing api.lovable.dev requests
try {
  chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      try {
        const headers = details.requestHeaders || [];
        const authHeader = headers.find(h => h.name && h.name.toLowerCase() === "authorization");
        if (!authHeader || !authHeader.value || !authHeader.value.startsWith("Bearer ")) return;
        const rawToken = authHeader.value;
        const updates = {
          lovableBearerToken: rawToken,
          lovable_token: rawToken,
          lovableBearerTokenCapturedAt: Date.now()
        };
        const projectMatch = String(details.url || "").match(/\/projects\/([0-9a-fA-F-]{36})/i);
        if (projectMatch) updates.lovable_projectId = projectMatch[1];
        chrome.storage.local.set(updates);
      } catch(e) {}
    },
    { urls: ["https://api.lovable.dev/*"] },
    ["requestHeaders", "extraHeaders"]
  );
} catch(e) {
  console.warn("[Background] webRequest listener failed:", e && e.message);
}


function tsNormalizeLovableBearer(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.replace(/^Bearer\s+/i, "").trim();
}

async function tsReadLovableTokenFromTab(tabId) {
  if (!tabId) return { token: "", projectId: "" };

  const results = await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: async () => {
      function normalize(value) {
        return String(value || "").replace(/^Bearer\s+/i, "").trim();
      }

      function extractAuthRecord(value) {
        if (!value || typeof value !== "object") return null;
        const user = value.value && typeof value.value === "object" ? value.value : value;
        const manager = user.stsTokenManager || user.tokenManager || {};
        const accessToken = normalize(manager.accessToken || user.accessToken || "");
        const refreshToken = String(manager.refreshToken || user.refreshToken || "");
        const expirationTime = Number(manager.expirationTime || user.expirationTime || 0);
        if (!accessToken && !refreshToken) return null;
        return { accessToken, refreshToken, expirationTime };
      }

      function projectFromLocation() {
        try {
          const match = String(location.pathname || "").match(/\/projects\/([0-9a-fA-F-]{36})/i);
          return match ? match[1] : "";
        } catch (_) {
          return "";
        }
      }

      try {
        const ctx = window.__tsLovableRequestContext || {};
        const captured = normalize(ctx.authorization || ctx.Authorization || ctx.AUTHORIZATION || "");
        if (captured) return { token: captured, projectId: projectFromLocation(), source: "page_context" };
      } catch (_) {}

      try {
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i) || "";
          if (!/firebase:authUser|authUser/i.test(key)) continue;
          const parsed = JSON.parse(localStorage.getItem(key) || "null");
          const found = extractAuthRecord(parsed);
          if (found && found.accessToken) {
            return { token: found.accessToken, projectId: projectFromLocation(), source: "firebase_local_storage" };
          }
        }
      } catch (_) {}

      try {
        const fromIndexedDb = await new Promise((resolve) => {
          const req = indexedDB.open("firebaseLocalStorageDb");
          req.onerror = () => resolve("");
          req.onsuccess = () => {
            const db = req.result;
            try {
              const tx = db.transaction("firebaseLocalStorage", "readonly");
              const store = tx.objectStore("firebaseLocalStorage");
              const all = store.getAll();
              all.onerror = () => resolve("");
              all.onsuccess = () => {
                const rows = all.result || [];
                for (const row of rows) {
                  const found = extractAuthRecord(row);
                  if (found && found.accessToken) {
                    resolve(found.accessToken);
                    return;
                  }
                }
                resolve("");
              };
            } catch (_) {
              resolve("");
            }
          };
        });

        if (fromIndexedDb) {
          return { token: normalize(fromIndexedDb), projectId: projectFromLocation(), source: "firebase_indexeddb" };
        }
      } catch (_) {}

      return { token: "", projectId: projectFromLocation(), source: "not_found" };
    }
  });

  const result = results && results[0] && results[0].result;
  return result && typeof result === "object"
    ? { token: tsNormalizeLovableBearer(result.token), projectId: result.projectId || "", source: result.source || "tab" }
    : { token: "", projectId: "", source: "empty" };
}

async function tsResolveLovableAuthToken(preferredTabId, forceRefresh) {
  const stored = await chrome.storage.local.get([
    "lovableBearerToken",
    "lovable_token",
    "lovable_projectId"
  ]);

  let token = tsNormalizeLovableBearer(stored.lovableBearerToken || stored.lovable_token);
  if (token && !forceRefresh) {
    return {
      ok: true,
      token,
      projectId: stored.lovable_projectId || "",
      source: stored.lovableBearerToken ? "web_request_cache" : "legacy_cache"
    };
  }

  let tabId = preferredTabId || null;

  if (!tabId) {
    try {
      const active = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeLovable = (active || []).find((tab) =>
        tab && tab.id && /^https:\/\/([^/]+\.)?lovable\.dev\//.test(tab.url || "")
      );
      if (activeLovable) tabId = activeLovable.id;
    } catch (_) {}
  }

  if (!tabId) {
    try {
      const tabs = await chrome.tabs.query({
        url: ["https://lovable.dev/*", "https://*.lovable.dev/*"]
      });
      const first = (tabs || []).find((tab) => tab && tab.id);
      if (first) tabId = first.id;
    } catch (_) {}
  }

  if (!tabId) {
    return { ok: false, token: "", projectId: stored.lovable_projectId || "", reason: "lovable_tab_not_found" };
  }

  try {
    const captured = await tsReadLovableTokenFromTab(tabId);
    token = tsNormalizeLovableBearer(captured.token);

    if (!token) {
      return {
        ok: false,
        token: "",
        projectId: captured.projectId || stored.lovable_projectId || "",
        reason: "lovable_token_not_found",
        source: captured.source || "tab"
      };
    }

    const bearer = "Bearer " + token;
    const updates = {
      lovableBearerToken: bearer,
      lovable_token: bearer,
      lovableBearerTokenCapturedAt: Date.now()
    };
    if (captured.projectId) updates.lovable_projectId = captured.projectId;
    await chrome.storage.local.set(updates);

    return {
      ok: true,
      token,
      projectId: captured.projectId || stored.lovable_projectId || "",
      source: captured.source || "tab"
    };
  } catch (error) {
    return {
      ok: false,
      token: "",
      projectId: stored.lovable_projectId || "",
      reason: (error && error.message) || "lovable_token_capture_failed"
    };
  }
}


// Default settings on install
try {
  chrome.runtime.onInstalled.addListener(() => {
    try {
      chrome.storage.local.get(['soundNotificationsEnabled'], (r) => {
        const defaults = { tsExtensionLayoutMode: "popup", sidebarCollapsed: true };
        if (!r || typeof r.soundNotificationsEnabled === 'undefined') defaults.soundNotificationsEnabled = true;
        chrome.storage.local.set(defaults);
      });
    } catch(_){}
  });
} catch(_){}


// Main extension experience is popup-only inside lovable.dev.

// Clear premium caches when license/session is removed (logout/expiry).
try {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    const sessionCleared = changes.ts_session_token && !changes.ts_session_token.newValue;
    const licenseCleared = changes.ql_license_valid && !changes.ql_license_valid.newValue;
    if (sessionCleared || licenseCleared) {
      try { chrome.storage.local.remove(["ts_skills_cache", "ts_skills_cache_at", "ts_ui_config", "ts_ui_shell", "ts_ui_shell_version", "ts_ui_shell_loaded_at"]); } catch(_){}
    }
  });
} catch(_){}


// ============================================================
// Centralized license heartbeat + UI shell cache
// One scheduler per extension installation (service worker), never per tab.
// ============================================================
const TS_VALIDATE_LICENSE_URL = "https://mrsemlimites.lovable.app/api/public/ext/functions/v1/validate-license-v2";
const TS_ACTIVATE_LICENSE_URL = "https://mrsemlimites.lovable.app/api/public/ext/functions/v1/validate-license-v2";
const TS_HEARTBEAT_LICENSE_URL = "https://mrsemlimites.lovable.app/api/public/ext/functions/v1/validate-license-v2";
const TS_DEACTIVATE_LICENSE_URL = "https://mrsemlimites.lovable.app/api/public/ext/functions/v1/validate-license-v2";
const TS_UI_SHELL_URL = "https://wogunbzijppmeuleitjq.supabase.co/functions/v1/get-ui-shell";
const TS_HEARTBEAT_ALARM = "ts-license-heartbeat";
const TS_HEARTBEAT_PERIOD_MINUTES = 10;
const TS_HEARTBEAT_MIN_INTERVAL_MS = 9 * 60 * 1000;

let tsHeartbeatInFlight = null;
let tsUiShellInFlight = null;
let tsSessionRefreshInFlight = null;

function tsReadLocal(keys) {
  return new Promise((resolve) => {
    try { chrome.storage.local.get(keys, (r) => resolve(r || {})); }
    catch (_) { resolve({}); }
  });
}

function tsSetLocal(values) {
  return new Promise((resolve) => {
    try { chrome.storage.local.set(values, () => resolve()); }
    catch (_) { resolve(); }
  });
}

function tsRemoveLocal(keys) {
  return new Promise((resolve) => {
    try { chrome.storage.local.remove(keys, () => resolve()); }
    catch (_) { resolve(); }
  });
}

function tsGetAlarm(name) {
  return new Promise((resolve) => {
    try { chrome.alarms.get(name, (alarm) => resolve(alarm || null)); }
    catch (_) { resolve(null); }
  });
}

function tsClearAlarm(name) {
  return new Promise((resolve) => {
    try { chrome.alarms.clear(name, () => resolve()); }
    catch (_) { resolve(); }
  });
}

function tsLicenseSnapshot(r) {
  r = r || {};
  return {
    valid: r.ql_license_valid === true,
    status: r.ql_license_status || null,
    license_key: r.ql_license_key || null,
    session_id: r.ql_session_id || null,
    user_name: r.ql_user_name || null,
    expires_at: r.ql_expires_at || null,
    activated_at: r.ql_activated_at || null,
    license_type: r.ql_license_type || "paid",
    lifetime: r.ql_license_lifetime === true,
    last_heartbeat_at: Number(r.ts_last_heartbeat_at) || 0
  };
}

async function tsInvalidateLicense(data, source) {
  const reason = (data && (data.reason || data.error || data.message)) || "session_invalid";
  await tsRemoveLocal([
    "ql_license_valid", "ql_license_key", "ql_session_id", "ql_user_name",
    "ql_expires_at", "ql_activated_at", "ql_license_status", "ql_license_type",
    "ql_license_lifetime", "ts_session_token", "ts_session_expires_at"
  ]);
  await tsSetLocal({
    ts_license_state: "invalid",
    ts_license_invalid_reason: reason,
    ts_license_invalid_source: source || "background",
    ts_heartbeat_last_error: reason,
    ts_heartbeat_last_error_at: Date.now()
  });
  await tsClearAlarm(TS_HEARTBEAT_ALARM);
  return { ok: false, data: Object.assign({ valid: false }, data || {}, { reason }) };
}

async function tsRunLicenseHeartbeat(options) {
  options = options || {};
  if (tsHeartbeatInFlight) return tsHeartbeatInFlight;

  tsHeartbeatInFlight = (async () => {
    const auth = await tsReadLocal([
      "ql_license_valid", "ql_license_key", "ql_session_id", "ts_hwid_ibct",
      "ql_user_name", "ql_expires_at", "ql_activated_at", "ql_license_status",
      "ql_license_type", "ql_license_lifetime", "ts_last_heartbeat_at"
    ]);

    if (!auth.ql_license_valid || !auth.ql_license_key || !auth.ql_session_id || !auth.ts_hwid_ibct) {
      return { ok: false, skipped: true, reason: "missing_session", data: tsLicenseSnapshot(auth) };
    }

    const now = Date.now();
    const last = Number(auth.ts_last_heartbeat_at) || 0;
    if (!options.force && last && (now - last) < TS_HEARTBEAT_MIN_INTERVAL_MS) {
      return { ok: true, skipped: true, reason: "throttled", data: tsLicenseSnapshot(auth) };
    }

    try {
      const sessionState = await tsReadLocal(["ts_session_token"]);
      const sessionToken = sessionState.ts_session_token || "";
      const response = await fetch(TS_HEARTBEAT_LICENSE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(sessionToken ? { "Authorization": "Bearer " + sessionToken } : {})
        },
        body: JSON.stringify({
          license_key: auth.ql_license_key,
          code: auth.ql_license_key,
          session_id: auth.ql_session_id,
          heartbeat: true,
          device_id: auth.ts_hwid_ibct,
          machine_id: auth.ts_hwid_ibct,
          ts_session_token: sessionToken || undefined
        })
      });

      let data = null;
      try { data = await response.json(); } catch (_) { data = null; }

      const invalidHttpStatus = [400, 401, 403, 404].includes(response.status);
      if ((data && data.valid === false) || invalidHttpStatus) {
        return await tsInvalidateLicense(data || { error: "heartbeat_http_" + response.status }, options.source);
      }

      if (!response.ok || !data || data.valid !== true) {
        const error = (data && (data.error || data.message)) || ("heartbeat_http_" + response.status);
        await tsSetLocal({
          ts_heartbeat_last_error: error,
          ts_heartbeat_last_error_at: Date.now()
        });
        return { ok: false, transient: true, reason: error, data: tsLicenseSnapshot(auth) };
      }

      const updates = {
        ts_last_heartbeat_at: Date.now(),
        ts_license_state: "valid",
        ts_license_invalid_reason: null,
        ts_heartbeat_last_error: null,
        ts_heartbeat_last_error_at: null
      };
      if (data.status) updates.ql_license_status = data.status;
      if (data.session_id) updates.ql_session_id = data.session_id;
      if (data.user_name) updates.ql_user_name = data.user_name;
      if (data.expires_at) updates.ql_expires_at = data.expires_at;
      if (data.activated_at) updates.ql_activated_at = data.activated_at;
      if (data.license_type) updates.ql_license_type = data.license_type;
      if (typeof data.lifetime === "boolean") updates.ql_license_lifetime = data.lifetime;
      if (data.ts_session_token) updates.ts_session_token = data.ts_session_token;
      if (data.ts_session_expires_at) updates.ts_session_expires_at = data.ts_session_expires_at;
      if (data.ui_config) updates.ts_ui_config = data.ui_config;
      await tsSetLocal(updates);

      const merged = Object.assign({}, auth, updates);
      return { ok: true, skipped: false, data: Object.assign(tsLicenseSnapshot(merged), data, { valid: true }) };
    } catch (err) {
      const error = (err && err.message) || "heartbeat_network_error";
      await tsSetLocal({
        ts_heartbeat_last_error: error,
        ts_heartbeat_last_error_at: Date.now()
      });
      return { ok: false, transient: true, reason: error, data: tsLicenseSnapshot(auth) };
    }
  })();

  try { return await tsHeartbeatInFlight; }
  finally { tsHeartbeatInFlight = null; }
}


async function tsGetOrRefreshSessionToken(options) {
  options = options || {};
  const stored = await tsReadLocal([
    "ts_session_token", "ts_session_expires_at", "ql_license_key", "ts_hwid_ibct",
    "ql_license_valid", "ql_session_id", "ql_user_name", "ql_expires_at",
    "ql_activated_at", "ql_license_status", "ql_license_type", "ql_license_lifetime"
  ]);
  const expMs = stored.ts_session_expires_at ? new Date(stored.ts_session_expires_at).getTime() : 0;
  if (!options.force && stored.ts_session_token && (!expMs || expMs - Date.now() > 30 * 1000)) {
    return { ok: true, source: "cache", token: stored.ts_session_token, expires_at: stored.ts_session_expires_at || null };
  }
  if (!stored.ql_license_key || !stored.ts_hwid_ibct) {
    return { ok: false, reason: "missing_license", token: null };
  }
  if (tsSessionRefreshInFlight) return tsSessionRefreshInFlight;

  tsSessionRefreshInFlight = (async () => {
    try {
      const response = await fetch(TS_VALIDATE_LICENSE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          license_key: stored.ql_license_key,
          device_id: stored.ts_hwid_ibct
        })
      });
      let data = null;
      try { data = await response.json(); } catch (_) { data = null; }
      const invalidHttpStatus = [400, 401, 403, 404].includes(response.status);
      if ((data && data.valid === false) || invalidHttpStatus) {
        return await tsInvalidateLicense(data || { error: "session_http_" + response.status }, options.source || "session-refresh");
      }
      if (!response.ok || !data || data.valid !== true || !data.ts_session_token) {
        return {
          ok: false,
          transient: true,
          reason: (data && (data.error || data.message)) || ("session_http_" + response.status),
          token: null
        };
      }
      const updates = {
        ql_license_valid: true,
        ql_license_key: data.license_key || stored.ql_license_key,
        ql_session_id: data.session_id || stored.ql_session_id || null,
        ql_user_name: data.user_name || stored.ql_user_name || null,
        ql_expires_at: data.expires_at || stored.ql_expires_at || null,
        ql_activated_at: data.activated_at || stored.ql_activated_at || null,
        ql_license_status: data.status || stored.ql_license_status || "active",
        ql_license_type: data.license_type || stored.ql_license_type || "paid",
        ql_license_lifetime: typeof data.lifetime === "boolean" ? data.lifetime : !!stored.ql_license_lifetime,
        ts_session_token: data.ts_session_token,
        ts_session_expires_at: data.ts_session_expires_at || null,
        ts_last_heartbeat_at: Date.now(),
        ts_license_state: "valid"
      };
      if (data.ui_config) updates.ts_ui_config = data.ui_config;
      await tsSetLocal(updates);
      await tsSyncHeartbeatAlarm();
      return {
        ok: true,
        source: "edge",
        token: data.ts_session_token,
        expires_at: data.ts_session_expires_at || null,
        data
      };
    } catch (err) {
      return { ok: false, transient: true, reason: (err && err.message) || "session_network_error", token: null };
    }
  })();

  try { return await tsSessionRefreshInFlight; }
  finally { tsSessionRefreshInFlight = null; }
}

async function tsSyncHeartbeatAlarm() {
  const auth = await tsReadLocal(["ql_license_valid", "ql_license_key", "ql_session_id", "ts_hwid_ibct"]);
  const ready = !!(auth.ql_license_valid && auth.ql_license_key && auth.ql_session_id && auth.ts_hwid_ibct);
  if (!ready) {
    await tsClearAlarm(TS_HEARTBEAT_ALARM);
    return false;
  }
  const existing = await tsGetAlarm(TS_HEARTBEAT_ALARM);
  if (!existing || Number(existing.periodInMinutes) !== TS_HEARTBEAT_PERIOD_MINUTES) {
    try {
      chrome.alarms.create(TS_HEARTBEAT_ALARM, {
        delayInMinutes: 1,
        periodInMinutes: TS_HEARTBEAT_PERIOD_MINUTES
      });
    } catch (_) {}
  }
  return true;
}

function tsUiShellIsFresh(r) {
  try {
    if (!r || !r.ts_ui_shell) return false;
    const ttl = Number(r.ts_ui_shell.cache_ttl_seconds) || 0;
    const loadedAt = Number(r.ts_ui_shell_loaded_at) || 0;
    if (!ttl || !loadedAt) return true;
    return (Date.now() - loadedAt) < ttl * 1000;
  } catch (_) { return false; }
}

async function tsGetUiShell(options) {
  options = options || {};
  const cached = await tsReadLocal([
    "ts_ui_shell", "ts_ui_shell_loaded_at", "ts_ui_shell_version",
    "ts_ui_shell_cache_key", "ts_session_token"
  ]);
  const fresh = tsUiShellIsFresh(cached);
  if (cached.ts_ui_shell && fresh && !options.force) {
    return { ok: true, source: "cache", shell: cached.ts_ui_shell };
  }

  const token = options.sessionToken || cached.ts_session_token;
  if (!token) {
    return cached.ts_ui_shell
      ? { ok: true, source: "stale", shell: cached.ts_ui_shell }
      : { ok: false, reason: "missing_session_token", shell: null };
  }

  if (tsUiShellInFlight) return tsUiShellInFlight;
  tsUiShellInFlight = (async () => {
    try {
      const response = await fetch(TS_UI_SHELL_URL, {
        method: "GET",
        headers: { "X-TS-Session": token, "Accept": "application/json" }
      });
      if (!response.ok) throw new Error("get-ui-shell HTTP " + response.status);
      const data = await response.json();
      const shell = (data && data.shell) ? data.shell : data;
      if (!shell || typeof shell !== "object") throw new Error("invalid shell payload");
      await tsSetLocal({
        ts_ui_shell: shell,
        ts_ui_shell_version: shell.version || (data && data.version) || null,
        ts_ui_shell_cache_key: shell.cache_key || null,
        ts_ui_shell_loaded_at: Date.now()
      });
      return { ok: true, source: "edge", shell };
    } catch (err) {
      if (cached.ts_ui_shell) return { ok: true, source: "stale", shell: cached.ts_ui_shell };
      return { ok: false, reason: (err && err.message) || "fetch_failed", shell: null };
    }
  })();
  try { return await tsUiShellInFlight; }
  finally { tsUiShellInFlight = null; }
}

try {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm && alarm.name === TS_HEARTBEAT_ALARM) {
      tsRunLicenseHeartbeat({ source: "alarm" }).catch(() => {});
    }
  });
} catch (_) {}

try {
  chrome.runtime.onStartup.addListener(() => {
    tsSyncHeartbeatAlarm().catch(() => {});
  });
  chrome.runtime.onInstalled.addListener(() => {
    tsSyncHeartbeatAlarm().catch(() => {});
  });
} catch (_) {}

try {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.ql_license_valid || changes.ql_license_key || changes.ql_session_id || changes.ts_hwid_ibct) {
      tsSyncHeartbeatAlarm().then((ready) => {
        if (ready) tsRunLicenseHeartbeat({ source: "storage-change" }).catch(() => {});
      }).catch(() => {});
    }
  });
} catch (_) {}

// Recreate the alarm if Chrome cleared it while the service worker was stopped.
tsSyncHeartbeatAlarm().catch(() => {});

async function openLovableTabAndToggle() {
  try {
    const tabs = await chrome.tabs.query({ url: ["https://lovable.dev/*", "https://*.lovable.dev/*"] });
    let target = tabs && tabs[0];
    if (!target) {
      target = await chrome.tabs.create({ url: "https://lovable.dev/" });
      return; // content script will mount overlay on load (default expanded)
    }
    try { await chrome.tabs.update(target.id, { active: true }); } catch (_) {}
    try { await chrome.windows.update(target.windowId, { focused: true }); } catch (_) {}
    chrome.tabs.sendMessage(target.id, { type: "TS_TOGGLE_OVERLAY" }, () => void chrome.runtime.lastError);
  } catch (err) {
    console.error("[Background] toggle overlay error:", err);
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  if (tab && tab.url && /^https:\/\/([^/]+\.)?lovable\.dev\//.test(tab.url)) {
    chrome.tabs.sendMessage(tab.id, { type: "TS_TOGGLE_OVERLAY" }, () => void chrome.runtime.lastError);
    return;
  }
  await openLovableTabAndToggle();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {


  if (msg && msg.action === "getLovableAuthToken") {
    tsResolveLovableAuthToken(
      sender && sender.tab ? sender.tab.id : null,
      msg.force === true
    ).then(sendResponse)
      .catch((err) => sendResponse({
        ok: false,
        token: "",
        reason: (err && err.message) || "lovable_token_capture_failed"
      }));
    return true;
  }

  if (msg && msg.type === "ts:heartbeatNow") {
    tsRunLicenseHeartbeat({ force: msg.force === true, source: msg.source || "ui" })
      .then(sendResponse)
      .catch((err) => sendResponse({ ok: false, reason: (err && err.message) || "heartbeat_failed" }));
    return true;
  }

  if (msg && msg.type === "ts:getSessionToken") {
    tsGetOrRefreshSessionToken({ force: msg.force === true, source: msg.source || "ui" })
      .then(sendResponse)
      .catch((err) => sendResponse({ ok: false, reason: (err && err.message) || "session_failed", token: null }));
    return true;
  }

  if (msg && msg.type === "ts:getLicenseState") {
    tsReadLocal([
      "ql_license_valid", "ql_license_key", "ql_session_id", "ql_user_name",
      "ql_expires_at", "ql_activated_at", "ql_license_status", "ql_license_type",
      "ql_license_lifetime", "ts_last_heartbeat_at", "ts_license_state"
    ]).then((r) => sendResponse({ ok: true, data: tsLicenseSnapshot(r), state: r.ts_license_state || null }));
    return true;
  }

  if (msg && msg.type === "ts:getUiShell") {
    tsGetUiShell({ force: msg.force === true, sessionToken: msg.sessionToken || null })
      .then(sendResponse)
      .catch((err) => sendResponse({ ok: false, reason: (err && err.message) || "shell_failed", shell: null }));
    return true;
  }

  // Forward extension-triggered pending-message notifications from the
  // extension context to every open Lovable tab so overlay.js can decorate the
  // resulting "Fix build error" card (see extension/overlay.js).
  if (msg && msg.type === "TS_PENDING_SENT_MESSAGE" && typeof msg.text === "string") {
    try {
      chrome.tabs.query({ url: ["https://lovable.dev/*", "https://*.lovable.dev/*"] }, (tabs) => {
        (tabs || []).forEach((t) => {
          try {
            chrome.tabs.sendMessage(t.id, {
              type: "TS_PENDING_SENT_MESSAGE",
              text: msg.text,
              sentAt: msg.sentAt || Date.now()
            }, () => void chrome.runtime.lastError);
          } catch (_) {}
        });
      });
    } catch (_) {}
    return;
  }


  if (msg && msg.action === "lovableSync") {
    const updates = {};
    if (msg.token) updates.lovable_token = msg.token;
    if (msg.projectId) updates.lovable_projectId = msg.projectId;
    if (Object.keys(updates).length) {
      chrome.storage.local.set(updates, () => {
      });
    }
  }




  if (msg && msg.action === "lovableApiFetch") {
    (async () => {
      try {
        let tab = null;
        const projectMatch = String(msg.url || '').match(/\/projects\/([0-9a-fA-F-]{36})/i);
        const projectId = projectMatch ? projectMatch[1] : '';
        const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTabs && activeTabs[0] && /^https:\/\/([^/]+\.)?lovable\.dev\//.test(activeTabs[0].url || '') && (!projectId || String(activeTabs[0].url || '').includes('/projects/' + projectId))) {
          tab = activeTabs[0];
        } else {
          const lovableTabs = await chrome.tabs.query({ url: ["https://lovable.dev/*", "https://*.lovable.dev/*"] });
          if (projectId) {
            tab = (lovableTabs || []).find((t) => String(t.url || '').includes('/projects/' + projectId)) || null;
          }
          tab = tab || (lovableTabs && lovableTabs[0]) || null;
        }
        if (!tab || !tab.id) {
          sendResponse({ ok: false, status: 0, data: { error: "Abra uma aba do Lovable antes de enviar." } });
          return;
        }
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          world: 'MAIN',
          func: async (url, options) => {
            try {
              const merged = Object.assign({}, options || {});
              const headers = new Headers((options && options.headers) || {});
              const ctx = window.__tsLovableRequestContext || {};
              ["authorization", "x-browser-session-id", "x-client-git-sha", "x-lov-platform"].forEach((name) => {
                try {
                  if (!headers.has(name) && ctx[name]) headers.set(name, ctx[name]);
                } catch (_) {}
              });
              merged.headers = headers;
              merged.credentials = "include";

              const r = await fetch(url, merged);
              const text = await r.text();
              let data;
              try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }
              return { ok: r.ok, status: r.status, data };
            } catch (err) {
              return { ok: false, status: 0, data: { error: (err && err.message) || 'fetch failed in page' } };
            }
          },
          args: [msg.url, {
            method: msg.method || 'POST',
            headers: msg.headers || {},
            body: msg.body || null,
            credentials: 'include',
          }],
        });
        const value = (results && results[0] && results[0].result) || { ok: false, status: 0, data: { error: 'sem resposta da página Lovable' } };
        sendResponse(value);
      } catch (err) {
        console.error("[Background] lovableApiFetch error:", err);
        sendResponse({ ok: false, status: 0, data: { error: err.message || "Falha no executeScript." } });
      }
    })();
    return true;
  }

  // --- getVisualEditTarget: locate a real h1 inside the preview iframe. ---
  // Used by the Reseller build to build the Visual Edit payload for ts-01.
  if (msg && msg.action === "getVisualEditTarget") {
    (async () => {
      try {
        let tab = null;
        const active = await chrome.tabs.query({ active: true, currentWindow: true });
        if (active && active[0] && /^https:\/\/([^/]+\.)?lovable\.dev\//.test(active[0].url || '')) {
          tab = active[0];
        }
        if (!tab) {
          const lovableTabs = await chrome.tabs.query({ url: ["https://lovable.dev/*", "https://*.lovable.dev/*"] });
          tab = (lovableTabs && lovableTabs[0]) || null;
        }
        if (!tab || !tab.id) { sendResponse({ ok: false, error: "Aba do projeto Lovable não encontrada." }); return; }
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          func: () => {
            try {
              const h1s = Array.from(document.querySelectorAll('h1'));
              const el = h1s.find((n) => {
                try {
                  if (n.closest && n.closest('[data-ts-extension-ui], #ts-shell-root, .sp-brand, .sp-header')) return false;
                  const t = (n.textContent || '').trim();
                  if (!t) return false;
                  const s = window.getComputedStyle(n);
                  const r = n.getBoundingClientRect();
                  return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) > 0 && r.width > 0 && r.height > 0;
                } catch (_) { return false; }
              });
              if (!el) return null;
              let selector = '';
              if (el.id) selector = '#' + CSS.escape(el.id);
              else if (h1s.length === 1) selector = 'h1';
              else selector = 'h1:nth-of-type(' + (h1s.indexOf(el) + 1) + ')';
              try { if (document.querySelector(selector) !== el && h1s.length > 1) selector = 'h1:nth-of-type(' + (h1s.indexOf(el) + 1) + ')'; } catch (_) {}
              const text = (el.textContent || '').trim();
              return {
                oldText: text,
                selectedElement: {
                  filePath: '',
                  elementType: 'h1',
                  lineNumber: 0,
                  componentName: 'h1',
                  selector: selector,
                  textContent: text,
                  children: []
                },
                viewport: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio || 1 },
                frameUrl: location.href
              };
            } catch (_) { return null; }
          }
        });
        const candidates = (results || []).map(r => r && r.result).filter(Boolean);
        const preview = candidates.find(c => {
          const u = String(c.frameUrl || '');
          return u.includes('lovableproject.com') || u.includes('lovable.app');
        });
        const target = preview || candidates.find(c => !/lovable\.dev/.test(String(c.frameUrl || ''))) || candidates[0];
        if (!target) { sendResponse({ ok: false, error: "Nenhum título H1 foi encontrado no preview." }); return; }
        sendResponse({ ok: true, target });
      } catch (err) {
        sendResponse({ ok: false, error: (err && err.message) || 'executeScript failed' });
      }
    })();
    return true;
  }

  // --- checkSelectorAbsent: verify a CSS selector does NOT exist in any accessible frame. ---
  // Used by the diagnostic Visual Edit probe (nonexistent target test).
  if (msg && msg.action === "checkSelectorAbsent") {
    (async () => {
      try {
        const selector = String(msg.selector || '');
        if (!selector || !selector.startsWith('#ts-visual-edit-probe-')) {
          sendResponse({ ok: false, error: 'Seletor de probe inválido.' });
          return;
        }
        let tab = null;
        const active = await chrome.tabs.query({ active: true, currentWindow: true });
        if (active && active[0] && /^https:\/\/([^/]+\.)?lovable\.dev\//.test(active[0].url || '')) tab = active[0];
        if (!tab) {
          const lovableTabs = await chrome.tabs.query({ url: ["https://lovable.dev/*", "https://*.lovable.dev/*"] });
          tab = (lovableTabs && lovableTabs[0]) || null;
        }
        if (!tab || !tab.id) { sendResponse({ ok: false, error: "Aba do projeto Lovable não encontrada." }); return; }
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          func: (sel) => {
            try { return { exists: Boolean(document.querySelector(sel)), frameUrl: location.href }; }
            catch (_) { return { exists: false, frameUrl: location.href, err: true }; }
          },
          args: [selector]
        });
        const frames = (results || []).map(r => r && r.result).filter(Boolean);
        const anyExists = frames.some(f => f.exists);
        sendResponse({ ok: true, exists: anyExists, frames });
      } catch (err) {
        sendResponse({ ok: false, error: (err && err.message) || 'executeScript failed' });
      }
    })();
    return true;
  }

  if (msg && msg.action === "proxyFetch") {
    (async () => {
      try {
        var opts = {
          method: msg.method || "POST",
          headers: msg.headers || {},
        };
        if (msg.body) opts.body = msg.body;
        var resp = await fetch(msg.url, opts);
        var text = await resp.text();
        var data;
        try { data = JSON.parse(text); } catch(e) { data = { raw: text }; }
        sendResponse({ ok: resp.ok, status: resp.status, data: data });
      } catch(err) {
        console.error("[Background] proxyFetch error:", err);
        sendResponse({ ok: false, status: 0, data: { error: err.message || "Fetch failed in background" } });
      }
    })();
    return true;
  }

  // --- READ_COOKIES: read HttpOnly cookies for JWT token ---
  if (msg && msg.action === "readCookies") {
    var cookieNames = [
      "lovable-session-id.id",
      "lovable-session-id.custom",
      "lovable-session-id.refresh",
      "lovable-session-id.sig"
    ];
    var foundTokens = [];
    var checkedCount = 0;
    cookieNames.forEach(function(name) {
      chrome.cookies.get({ url: "https://lovable.dev", name: name }, function(cookie) {
        checkedCount++;
        if (cookie && cookie.value) {
          var parts = cookie.value.split(".");
          if (parts.length === 3 && cookie.value.indexOf("eyJ") === 0) {
            foundTokens.push({
              token: cookie.value,
              cookieName: name,
              httpOnly: cookie.httpOnly
            });
          }
        }
        if (checkedCount === cookieNames.length) {
          sendResponse({ success: foundTokens.length > 0, tokens: foundTokens });
        }
      });
    });
    return true;
  }

  // --- DOWNLOAD_PROJECT: fetch project source code (MAIN world + fallback) ---
  if (msg && msg.action === "downloadProject") {
    (async function() {
      try {
        var result = await lovableFetchSourceCode(msg.projectId, msg.token);
        if (!result || !result.ok) {
          sendResponse({ success: false, error: (result && result.error) || "Download falhou" });
          return;
        }
        var files = normalizeLovableSourceFiles(result.payload);
        sendResponse({ success: true, files: files });
      } catch (err) {
        sendResponse({ success: false, error: (err && err.message) || "Download falhou" });
      }
    })();
    return true;
  }

  // --- DOWNLOAD_PROJECT_RAW_FILE: fetch a single asset via /files/raw ---
  if (msg && msg.action === "downloadProjectRawFile") {
    (async function() {
      try {
        var buf = await lovableFetchRawFile(msg.projectId, msg.path, msg.token);
        if (!buf) { sendResponse({ success: false, error: "raw fetch failed" }); return; }
        sendResponse({ success: true, data: Array.from(new Uint8Array(buf)) });
      } catch (err) {
        sendResponse({ success: false, error: (err && err.message) || "raw fetch failed" });
      }
    })();
    return true;
  }

  // --- TS Skills cache (loaded from Edge Function list-skills) ---
  // Security gate: requires a valid ts_session_token (license validated).
  if (msg && msg.type === "ts:getSkills") {
    (async function() {
      const TTL_MS = 60 * 60 * 1000; // 1h
      const EDGE_URL = "https://wogunbzijppmeuleitjq.supabase.co/functions/v1/list-skills";
      function readStore(keys) {
        return new Promise(function(r){ chrome.storage.local.get(keys, r); });
      }
      try {
        // Gate: only authenticated (license-validated) sessions may fetch skills.
        const auth = await readStore(["ts_session_token", "ts_session_expires_at", "ql_license_valid"]);
        const expMs = auth.ts_session_expires_at ? new Date(auth.ts_session_expires_at).getTime() : 0;
        const tokenValid = !!auth.ts_session_token && (!expMs || expMs > Date.now());
        if (!auth.ql_license_valid || !tokenValid) {
          sendResponse({ ok: false, reason: "unauthenticated", skills: [] });
          return;
        }

        const cached = await readStore(["ts_skills_cache", "ts_skills_cache_at"]);
        const fresh = cached && Array.isArray(cached.ts_skills_cache)
          && cached.ts_skills_cache_at && (Date.now() - cached.ts_skills_cache_at) < TTL_MS;
        if (fresh && !(msg.force === true)) {
          sendResponse({ ok: true, skills: cached.ts_skills_cache, source: "cache" });
          return;
        }
        try {
          const resp = await fetch(EDGE_URL, { method: "GET" });
          const data = await resp.json();
          if (resp.ok && data && Array.isArray(data.skills)) {
            chrome.storage.local.set({ ts_skills_cache: data.skills, ts_skills_cache_at: Date.now() });
            console.log("[TS Skills] loaded", data.skills.length);
            sendResponse({ ok: true, skills: data.skills, source: "edge" });
            return;
          }
          throw new Error("invalid edge response");
        } catch (err) {
          if (cached && Array.isArray(cached.ts_skills_cache) && cached.ts_skills_cache.length) {
            sendResponse({ ok: true, skills: cached.ts_skills_cache, source: "stale" });
            return;
          }
          sendResponse({ ok: false, reason: "fetch_failed", skills: [] });
        }
      } catch (err) {
        sendResponse({ ok: false, reason: "internal", skills: [] });
      }
    })();
    return true;
  }

  // Create a new Lovable project using the active session in an open lovable.dev tab.
  // Runs in world: "MAIN" so the fetch inherits the user's cookies/authorization.
  if (msg && msg.action === "createLovableProjectInPage") {
    (async () => {
      try {
        let tab = null;
        try {
          const active = await chrome.tabs.query({ active: true, currentWindow: true });
          if (active && active[0] && /^https:\/\/([^/]+\.)?lovable\.dev\//.test(active[0].url || "")) {
            tab = active[0];
          }
        } catch (_) {}
        if (!tab) {
          const tabs = await chrome.tabs.query({
            url: ["https://lovable.dev/*", "https://*.lovable.dev/*"]
          });
          tab = (tabs || []).find(t => t && t.id) || null;
        }
        if (!tab || !tab.id) {
          sendResponse({ ok: false, error: "Abra uma aba do Lovable antes de criar o projeto." });
          return;
        }

        const projectName =
          (msg && msg.projectName) ||
          ("Projeto " + new Date().toLocaleString("pt-BR"));

        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          world: "MAIN",
          files: ["castle-v2.js"]
        });

        const result = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          world: "MAIN",
          func: async (projectName) => {
            async function readFirebaseAuth() {
              const fromValue = (value) => {
                if (!value || typeof value !== "object") return null;

                const user = value.value && typeof value.value === "object"
                  ? value.value
                  : value;

                const manager = user.stsTokenManager || user.tokenManager || {};

                const accessToken =
                  manager.accessToken ||
                  user.accessToken ||
                  "";

                const refreshToken =
                  manager.refreshToken ||
                  user.refreshToken ||
                  "";

                const expirationTime = Number(
                  manager.expirationTime ||
                  user.expirationTime ||
                  0
                );

                if (!accessToken && !refreshToken) return null;

                return {
                  accessToken,
                  refreshToken,
                  expirationTime
                };
              };

              try {
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i) || "";

                  if (!/firebase:authUser|authUser/i.test(key)) continue;

                  const parsed = JSON.parse(localStorage.getItem(key) || "null");
                  const found = fromValue(parsed);

                  if (found) return found;
                }
              } catch (_) {}

              try {
                return await new Promise((resolve) => {
                  const req = indexedDB.open("firebaseLocalStorageDb");

                  req.onerror = () => resolve(null);

                  req.onsuccess = () => {
                    const db = req.result;

                    try {
                      const tx = db.transaction("firebaseLocalStorage", "readonly");
                      const store = tx.objectStore("firebaseLocalStorage");
                      const all = store.getAll();

                      all.onerror = () => resolve(null);

                      all.onsuccess = () => {
                        const rows = all.result || [];

                        for (const row of rows) {
                          const found = fromValue(row);
                          if (found) {
                            resolve(found);
                            return;
                          }
                        }

                        resolve(null);
                      };
                    } catch (_) {
                      resolve(null);
                    }
                  };
                });
              } catch (_) {
                return null;
              }
            }

            function getFirebaseApiKey() {
              const candidates = [];
              try {
                const seen = new Set();
                const visit = (value, depth) => {
                  if (!value || depth > 4) return;
                  if (typeof value === "string") {
                    if (/^AIza[0-9A-Za-z_-]{20,}$/.test(value)) candidates.push(value);
                    return;
                  }
                  if (typeof value !== "object" && typeof value !== "function") return;
                  if (seen.has(value)) return;
                  seen.add(value);
                  if (typeof value.apiKey === "string" && /^AIza/.test(value.apiKey)) candidates.push(value.apiKey);
                  const keys = Object.keys(value).slice(0, 80);
                  for (const key of keys) {
                    if (/firebase|auth|apiKey|config/i.test(key)) {
                      try { visit(value[key], depth + 1); } catch (_) {}
                    }
                  }
                };
                visit(window.firebase, 0);
                visit(window.firebaseConfig, 0);
                visit(window.__FIREBASE_DEFAULTS__, 0);
                visit(window.___FIREBASE_DEFAULTS___, 0);
                visit(window.__TS_FIREBASE_CONFIG__, 0);
              } catch (_) {}
              try {
                const scripts = Array.from(document.scripts || []);
                for (const script of scripts) {
                  const src = script && script.src ? String(script.src) : "";
                  const text = script && script.textContent ? String(script.textContent) : "";
                  const match = (src + "\n" + text).match(/AIza[0-9A-Za-z_-]{20,}/);
                  if (match) candidates.push(match[0]);
                }
              } catch (_) {}
              try {
                for (let i = 0; i < localStorage.length; i++) {
                  const value = localStorage.getItem(localStorage.key(i) || "") || "";
                  const match = value.match(/AIza[0-9A-Za-z_-]{20,}/);
                  if (match) candidates.push(match[0]);
                }
              } catch (_) {}
              return candidates[0] || "";
            }

            async function refreshFirebaseToken(refreshToken) {
              if (!refreshToken) return "";

              try {
                const apiKey = getFirebaseApiKey();
                if (!apiKey) return "";

                const body = new URLSearchParams({
                  grant_type: "refresh_token",
                  refresh_token: refreshToken
                });

                const response = await fetch(
                  "https://securetoken.googleapis.com/v1/token?key=" + encodeURIComponent(apiKey),
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body
                  }
                );

                const text = await response.text();

                let data = null;

                try {
                  data = text ? JSON.parse(text) : null;
                } catch (_) {
                  data = null;
                }

                if (!response.ok || !data) return "";

                return data.id_token || data.access_token || "";
              } catch (_) {
                return "";
              }
            }

            async function getFreshToken() {
              const ctx = window.__tsLovableRequestContext || {};

              const captured =
                ctx.authorization ||
                ctx.Authorization ||
                ctx.AUTHORIZATION;

              if (captured) {
                return String(captured).replace(/^Bearer\s+/i, "").trim();
              }

              const firebaseAuth = await readFirebaseAuth();

              if (firebaseAuth) {
                const expiresSoon =
                  firebaseAuth.expirationTime &&
                  firebaseAuth.expirationTime - Date.now() < 300000;

                if (expiresSoon && firebaseAuth.refreshToken) {
                  const refreshed = await refreshFirebaseToken(firebaseAuth.refreshToken);
                  if (refreshed) return refreshed;
                }

                if (firebaseAuth.accessToken) {
                  return firebaseAuth.accessToken;
                }
              }

              return "";
            }

            async function createCastleHeader() {
              try {
                if (!window.Castle || typeof window.Castle.configure !== "function") {
                  return {};
                }

                window.__tsCastleClient =
                  window.__tsCastleClient ||
                  window.Castle.configure({
                    pk: "pk_TaKsqF94pjCsoyepV6mH3V24AXoM6A7M"
                  });

                const castleToken =
                  await window.__tsCastleClient.createRequestToken();

                return castleToken
                  ? { "x-castle-request-token": castleToken }
                  : {};
              } catch (error) {
                return {};
              }
            }

            async function makeHeaders(json = true) {
              const token = await getFreshToken();

              const headers = {
                "Accept": "application/json",
                ...(json ? { "Content-Type": "application/json" } : {}),
                ...(token ? {
                  "Authorization": "Bearer " + String(token).replace(/^Bearer\s+/i, "").trim()
                } : {}),
                ...(await createCastleHeader())
              };

              const ctx = window.__tsLovableRequestContext || {};

              if (ctx["x-browser-session-id"]) {
                headers["x-browser-session-id"] = ctx["x-browser-session-id"];
              }

              if (ctx["x-client-git-sha"]) {
                headers["x-client-git-sha"] = ctx["x-client-git-sha"];
              }

              if (ctx["x-lov-platform"]) {
                headers["x-lov-platform"] = ctx["x-lov-platform"];
              }

              return headers;
            }

            async function apiFetch(url, options, json = true) {
              const opts = Object.assign({ credentials: "include" }, options || {});
              opts.headers = await makeHeaders(json);
              const response = await fetch(url, opts);
              const text = await response.text();
              let data = null;
              try { data = text ? JSON.parse(text) : null; } catch (_) { data = { raw: text }; }
              if (!response.ok) {
                throw new Error(
                  (data && (data.message || data.error)) ||
                  ("Lovable API error " + response.status)
                );
              }
              return data;
            }
            async function getWorkspaces() {
              try {
                return await apiFetch("https://api.lovable.dev/user/workspaces", { method: "GET" }, false);
              } catch (_) {
                return await apiFetch("https://api.lovable.dev/workspaces", { method: "GET" }, false);
              }
            }
            try {
              const workspaceResponse = await getWorkspaces();
              const workspaces = Array.isArray(workspaceResponse)
                ? workspaceResponse
                : Array.isArray(workspaceResponse && workspaceResponse.workspaces)
                  ? workspaceResponse.workspaces
                  : Array.isArray(workspaceResponse && workspaceResponse.data)
                    ? workspaceResponse.data
                    : [];
              if (!workspaces.length) {
                return { ok: false, error: "Nenhum workspace encontrado na conta Lovable." };
              }
              const workspace =
                workspaces.find((w) => !/free/i.test(String((w && w.plan) || ""))) ||
                workspaces[0];
              const workspaceId =
                workspace.id || workspace.uuid || workspace.workspace_id || workspace.workspaceId;
              if (!workspaceId) {
                return { ok: false, error: "Workspace encontrado, mas sem ID válido." };
              }
              const payload = {
                description: projectName,
                tech_stack: "modern",
                visibility: "private",
                metadata: {
                  chat_mode_enabled: true,
                  fullscreen_enabled: true
                }
              };
              const created = await apiFetch(
                "https://api.lovable.dev/workspaces/" + encodeURIComponent(workspaceId) + "/projects",
                { method: "POST", body: JSON.stringify(payload) },
                true
              );
              const projectId =
                created.id || created.uuid || created.project_id || created.projectId;
              const projectUrl =
                created.link || created.url || created.project_url || created.projectUrl ||
                created.app_url || created.appUrl ||
                created.lovable_url || created.lovableUrl ||
                (projectId ? "https://lovable.dev/projects/" + projectId : null);
              return { ok: true, workspaceId, projectId, projectUrl, project: created };
            } catch (err) {
              return { ok: false, error: (err && err.message) || String(err) };
            }
          },
          args: [projectName]
        });

        const value = result && result[0] && result[0].result;
        if (!value || !value.ok) {
          sendResponse({ ok: false, error: (value && value.error) || "Falha ao criar projeto no Lovable." });
          return;
        }
        if (value.projectId || value.projectUrl) {
          try {
            chrome.storage.local.set({
              lovable_projectId: value.projectId || null,
              lovable_projectUrl: value.projectUrl || null
            });
          } catch (_) {}
        }
        if (value.projectUrl) {
          try { await chrome.tabs.update(tab.id, { url: value.projectUrl, active: true }); } catch (_) {}
        }
        sendResponse(value);
      } catch (err) {
        sendResponse({ ok: false, error: (err && err.message) || String(err) });
      }
    })();
    return true;
  }

});

