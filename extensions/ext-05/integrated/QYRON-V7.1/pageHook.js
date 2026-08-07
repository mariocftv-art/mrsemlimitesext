(function () {
  if (window.__TS_LOVABLE_SECURITY_SCAN_HOOK__) return;
  window.__TS_LOVABLE_SECURITY_SCAN_HOOK__ = true;

  var originalFetch = window.fetch.bind(window);
  window.__tsLovableRequestContext = window.__tsLovableRequestContext || {};

  var sessionState = {
    authorization: null,
    browserSessionId: null,
    clientGitSha: null,
    lovPlatform: null,
    projectId: null,
    lastCaptureAt: 0
  };

  function getProjectFromPage() {
    try {
      var m = window.location.pathname.match(/projects\/([0-9a-fA-F-]{36})/i);
      return m ? m[1] : null;
    } catch (_) { return null; }
  }

  function extractProjectIdFromUrl(url) {
    try {
      var m = String(url || '').match(/projects\/([0-9a-fA-F-]{36})/i);
      return m ? m[1] : null;
    } catch (_) { return null; }
  }

  function postSessionStatus(requestId) {
    var pageProjectId = getProjectFromPage();
    if (pageProjectId) sessionState.projectId = pageProjectId;
    window.postMessage({
      source: 'TS_LOVABLE_PAGE_HOOK',
      type: 'SESSION_STATUS',
      requestId: requestId || null,
      hasAuthorization: Boolean(sessionState.authorization),
      hasBrowserSessionId: Boolean(sessionState.browserSessionId),
      hasClientGitSha: Boolean(sessionState.clientGitSha),
      hasLovPlatform: Boolean(sessionState.lovPlatform),
      projectId: sessionState.projectId || pageProjectId || null,
      lastCaptureAt: sessionState.lastCaptureAt
    }, '*');
  }

  function readHeader(headers, name) {
    try {
      if (!headers) return null;
      if (headers instanceof Headers) return headers.get(name) || headers.get(String(name).toLowerCase());
      if (Array.isArray(headers)) {
        var row = headers.find(function (x) {
          return Array.isArray(x) && String(x[0]).toLowerCase() === String(name).toLowerCase();
        });
        return row ? row[1] : null;
      }
      if (typeof headers === 'object') {
        var key = Object.keys(headers).find(function (k) { return k.toLowerCase() === String(name).toLowerCase(); });
        return key ? headers[key] : null;
      }
    } catch (_) {}
    return null;
  }

  function rememberLovableRequestContext(input, init) {
    try {
      var url = input instanceof Request ? input.url : String(input || '');
      if (!url || url.indexOf('api.lovable.dev') === -1) return;

      var headers = input instanceof Request ? input.headers : init && init.headers;
      var ctx = window.__tsLovableRequestContext || {};

      var authorization = readHeader(headers, 'authorization');
      var browserSessionId = readHeader(headers, 'x-browser-session-id');
      var clientGitSha = readHeader(headers, 'x-client-git-sha');
      var lovPlatform = readHeader(headers, 'x-lov-platform');
      var projectId = extractProjectIdFromUrl(url) || getProjectFromPage();

      if (authorization) { sessionState.authorization = authorization; ctx.authorization = authorization; }
      if (browserSessionId) { sessionState.browserSessionId = browserSessionId; ctx['x-browser-session-id'] = browserSessionId; }
      if (clientGitSha) { sessionState.clientGitSha = clientGitSha; ctx['x-client-git-sha'] = clientGitSha; }
      if (lovPlatform) { sessionState.lovPlatform = lovPlatform; ctx['x-lov-platform'] = lovPlatform; }
      if (projectId) sessionState.projectId = projectId;

      if (authorization || browserSessionId || clientGitSha || lovPlatform || projectId) {
        sessionState.lastCaptureAt = Date.now();
        ctx.lastCaptureAt = sessionState.lastCaptureAt;
        window.__tsLovableRequestContext = ctx;
        postSessionStatus(null);
      }
    } catch (error) {
      console.warn('[TS Extension] Failed to capture Lovable headers', error);
    }
  }

  function isLovableFileEndpoint(url) {
    var s = String(url || '');
    if (s.indexOf('api.lovable.dev') === -1) return false;
    return /generate-upload-url|upload-url|\/files(\/|$|\?)/i.test(s);
  }

  function emitNativeUploadStarted(url) {
    try {
      if (!isLovableFileEndpoint(url)) return;
      window.postMessage({
        source: 'TS_LOVABLE_PAGE_HOOK',
        type: 'TS_NATIVE_LOVABLE_FILE_UPLOAD_STARTED',
        url: String(url || '')
      }, '*');
      window.postMessage({
        source: 'TS_LOVABLE_PAGE_HOOK',
        type: 'TS_NATIVE_LOVABLE_FILE_UPLOAD_PENDING',
        url: String(url || '')
      }, '*');
    } catch (_) {}
  }

  function emitNativeUploadDone(url) {
    try {
      window.postMessage({
        source: 'TS_LOVABLE_PAGE_HOOK',
        type: 'TS_NATIVE_LOVABLE_FILE_UPLOAD_DONE',
        url: String(url || '')
      }, '*');
    } catch (_) {}
  }


  function emitNativeUploadedFile(json) {
    try {
      if (!json || typeof json !== 'object') return;
      var candidates = [json, json.file, json.data, json.upload, json.result];
      if (Array.isArray(json.files)) candidates = candidates.concat(json.files);
      for (var i = 0; i < candidates.length; i++) {
        var c = candidates[i];
        if (!c || typeof c !== 'object') continue;
        var fileId = c.file_id || c.id || c.fileId;
        var url = c.url || c.signed_url || c.upload_url || c.file_url || c.download_url;
        if (!fileId) continue;
        window.postMessage({
          source: 'TS_LOVABLE_PAGE_HOOK',
          type: 'TS_NATIVE_LOVABLE_FILE_UPLOADED',
          file: {
            file_id: fileId,
            file_name: c.file_name || c.name || c.original_file_name || null,
            name: c.name || c.file_name || c.original_file_name || null,
            original_file_name: c.original_file_name || c.file_name || c.name || null,
            content_type: c.content_type || c.mime_type || c.type || null,
            mime_type: c.mime_type || c.content_type || c.type || null,
            file_size_bytes: c.file_size_bytes || c.size || c.original_file_size_bytes || null,
            size: c.size || c.file_size_bytes || null,
            url: url || null,
            upload_url: c.upload_url || c.signed_url || url || null,
            signed_url: c.signed_url || c.upload_url || null,
            file_url: c.file_url || c.download_url || url || null,
            download_url: c.download_url || c.file_url || url || null
          }
        }, '*');
      }
    } catch (_) {}
  }

  async function maybeInspectFileResponse(url, response) {
    try {
      if (!isLovableFileEndpoint(url)) return;
      var clone = response.clone();
      var text = await clone.text();
      if (!text) { emitNativeUploadDone(url); return; }
      var json;
      try { json = JSON.parse(text); } catch (_) { emitNativeUploadDone(url); return; }
      emitNativeUploadedFile(json);
      emitNativeUploadDone(url);
    } catch (_) {}
  }


  window.fetch = async function patchedFetch(input, init) {
    try {
      rememberLovableRequestContext(input, init);
      var url = input instanceof Request ? input.url : String(input || '');
      emitNativeUploadStarted(url);
      var response = await originalFetch(input, init);
      try { maybeInspectFileResponse(url, response); } catch (_) {}
      return response;
    } catch (error) {
      return originalFetch(input, init);
    }
  };

  try {
    var OriginalXHR = window.XMLHttpRequest;
    if (OriginalXHR && !window.__TS_LOVABLE_XHR_HOOK__) {
      window.__TS_LOVABLE_XHR_HOOK__ = true;
      window.XMLHttpRequest = function XMLHttpRequestProxy() {
        var xhr = new OriginalXHR();
        var url = '';
        var headers = {};
        var open = xhr.open;
        var setRequestHeader = xhr.setRequestHeader;
        xhr.open = function (method, requestUrl) {
          url = String(requestUrl || '');
          return open.apply(xhr, arguments);
        };
        xhr.setRequestHeader = function (name, value) {
          try { headers[String(name)] = value; } catch (_) {}
          return setRequestHeader.apply(xhr, arguments);
        };
        var send = xhr.send;
        xhr.send = function () {
          try { rememberLovableRequestContext(url, { headers: headers }); } catch (_) {}
          try { emitNativeUploadStarted(url); } catch (_) {}
          try {
            if (isLovableFileEndpoint(url)) {
              xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState !== 4) return;
                try {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    var txt = xhr.responseText || '';
                    if (txt) {
                      try { var json = JSON.parse(txt); emitNativeUploadedFile(json); } catch (_) {}
                    }
                  }
                } catch (_) {}
                try { emitNativeUploadDone(url); } catch (_) {}
              });
            }
          } catch (_) {}
          return send.apply(xhr, arguments);
        };
        return xhr;
      };
    }
  } catch (_) {}

  function normalizeLovableChatPayload(payload, userText) {
    payload = payload || {};
    var text = String(userText == null ? '' : userText);

    payload.message = text;
    payload.text = text;
    payload.content = text;
    payload.user_message = text;
    payload.userMessage = text;
    payload.display_text = text;
    payload.displayText = text;

    payload.intent = 'security_scan';
    payload.message_intent = 'security_scan';
    payload.send_method = 'v5';
    payload.chat_only = false;

    delete payload.message_intent_metadata;
    delete payload.messageIntentMetadata;
    delete payload.contains_error;
    delete payload.error_source;
    delete payload.error_ids;
    delete payload.runtime_errors;
    delete payload.fix_error;
    delete payload.try_to_fix;

    if (!payload.thread_id) payload.thread_id = 'main';
    if (!payload.view) payload.view = 'preview';
    if (!payload.view_description) payload.view_description = 'The user is currently viewing the preview. ';

    if (!Array.isArray(payload.files)) payload.files = [];
    if (!Array.isArray(payload.selected_elements)) payload.selected_elements = [];
    if (!Array.isArray(payload.client_logs)) payload.client_logs = [];
    if (!Array.isArray(payload.network_requests)) payload.network_requests = [];
    if (!Array.isArray(payload.optimisticImageUrls)) payload.optimisticImageUrls = [];

    if (typeof payload.model === 'undefined') payload.model = null;

    return payload;
  }

  async function sendLovableChatMessage(data) {
    var requestId = data && data.requestId;
    try {
      var projectId = (data && data.projectId) || sessionState.projectId || getProjectFromPage();
      if (!projectId) throw new Error('PROJECT_ID_MISSING');
      if (!sessionState.authorization) throw new Error('LOVABLE_SESSION_NOT_CAPTURED');

      var normalizedPayload = normalizeLovableChatPayload((data && data.payload) || {}, (data && data.userText) || '');
      var headers = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': sessionState.authorization
      };

      if (sessionState.browserSessionId) headers['x-browser-session-id'] = sessionState.browserSessionId;
      if (sessionState.clientGitSha) headers['x-client-git-sha'] = sessionState.clientGitSha;
      if (sessionState.lovPlatform) headers['x-lov-platform'] = sessionState.lovPlatform;

      var response = await originalFetch(
        'https://api.lovable.dev/projects/' + encodeURIComponent(projectId) + '/chat',
        {
          method: 'POST',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify(normalizedPayload)
        }
      );

      var body = '';
      try { body = await response.clone().text(); } catch (_) {}
      var parsed = null;
      if (body) {
        try { parsed = JSON.parse(body); } catch (_) { parsed = { raw: body }; }
      }

      window.postMessage({
        source: 'TS_LOVABLE_PAGE_HOOK',
        type: 'SEND_CHAT_RESULT',
        requestId: requestId,
        ok: response.ok,
        status: response.status,
        data: parsed
      }, '*');
    } catch (error) {
      window.postMessage({
        source: 'TS_LOVABLE_PAGE_HOOK',
        type: 'SEND_CHAT_RESULT',
        requestId: requestId,
        ok: false,
        status: 0,
        error: (error && error.message) || String(error)
      }, '*');
    }
  }

  async function sendLovableApiRequest(data) {
    var requestId = data && data.requestId;
    try {
      var url = String((data && data.url) || '');
      if (!/^https:\/\/api\.lovable\.dev\//i.test(url)) throw new Error('INVALID_LOVABLE_API_URL');
      if (!sessionState.authorization) throw new Error('LOVABLE_SESSION_NOT_CAPTURED');

      var headers = {
        'Accept': '*/*',
        'Authorization': sessionState.authorization
      };
      if (data && data.headers && typeof data.headers === 'object') {
        Object.keys(data.headers).forEach(function (key) {
          var lower = String(key).toLowerCase();
          if (lower === 'authorization' || lower === 'x-browser-session-id' || lower === 'x-client-git-sha' || lower === 'x-lov-platform') return;
          headers[key] = data.headers[key];
        });
      }
      if (!headers['Content-Type'] && !headers['content-type']) headers['Content-Type'] = 'application/json';
      if (sessionState.browserSessionId) headers['x-browser-session-id'] = sessionState.browserSessionId;
      if (sessionState.clientGitSha) headers['x-client-git-sha'] = sessionState.clientGitSha;
      if (sessionState.lovPlatform) headers['x-lov-platform'] = sessionState.lovPlatform;

      var response = await originalFetch(url, {
        method: (data && data.method) || 'POST',
        headers: headers,
        credentials: 'include',
        body: data && data.body ? data.body : null
      });
      var text = await response.text().catch(function () { return ''; });
      var parsed = null;
      try { parsed = text ? JSON.parse(text) : null; } catch (_) { parsed = { raw: text }; }
      window.postMessage({ source: 'TS_LOVABLE_PAGE_HOOK', type: 'LOVABLE_API_RESULT', requestId: requestId, ok: response.ok, status: response.status, data: parsed }, '*');
    } catch (error) {
      window.postMessage({ source: 'TS_LOVABLE_PAGE_HOOK', type: 'LOVABLE_API_RESULT', requestId: requestId, ok: false, status: 0, error: (error && error.message) || String(error) }, '*');
    }
  }

  window.addEventListener('message', function (event) {
    if (event.source !== window) return;
    var data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.source === 'TS_LOVABLE_EXTENSION') {
      if (data.type === 'SEND_CHAT_MESSAGE') sendLovableChatMessage(data);
      if (data.type === 'LOVABLE_API_REQUEST') sendLovableApiRequest(data);
      if (data.type === 'GET_LOVABLE_SESSION_STATUS') postSessionStatus(data.requestId);
      return;
    }

    if (data.type === 'lovableRequestToken') {
      postSessionStatus(data.requestId || null);
      return;
    }

    if (data.type === 'TS_PAGE_UPLOAD_TO_GCS') {
      (async function () {
        var requestId = data.requestId;
        try {
          var blob = new Blob([data.arrayBuffer], { type: data.contentType });
          var putHeaders = new Headers();
          if (data.extraHeaders) {
            Object.keys(data.extraHeaders).forEach(function (k) {
              if (String(k).toLowerCase() === 'content-type') return;
              try { putHeaders.set(k, data.extraHeaders[k]); } catch (_) {}
            });
          }
          putHeaders.set('Content-Type', data.contentType);
          var putUrl = String(data.uploadUrl).replaceAll('&amp;', '&');
          var res = await originalFetch(putUrl, { method: 'PUT', headers: putHeaders, body: blob });
          var resultBody = await res.text().catch(function () { return ''; });
          window.postMessage({ type: 'TS_PAGE_UPLOAD_TO_GCS_RESULT', requestId: requestId, success: res.ok, status: res.status, body: resultBody }, '*');
        } catch (err) {
          window.postMessage({ type: 'TS_PAGE_UPLOAD_TO_GCS_RESULT', requestId: requestId, success: false, status: 0, error: String((err && err.message) || err) }, '*');
        }
      })();
    }
  });

  setInterval(function () {
    var projectId = getProjectFromPage();
    if (projectId && projectId !== sessionState.projectId) {
      sessionState.projectId = projectId;
      postSessionStatus(null);
    }
  }, 1500);
})();