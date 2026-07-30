/*
 * MR SEM LIMITES — EXT8 Backend Shim
 * ----------------------------------
 * Camada ADITIVA. Não altera UI, prompts, motor ou fluxo da extensão.
 * Função única: garantir que TODA chamada de rede saia para o backend
 * oficial MR Sem Limites, nunca para qualquer host herdado.
 *
 * Regras:
 *  1. Se algo aqui falhar, engolir o erro — a extensão nunca pode piorar.
 *  2. Nenhum endpoint novo é inventado: apenas o host é reescrito.
 *  3. Funciona em service worker, content script e popup/sidepanel.
 */
(function () {
  "use strict";
  try {
    if (globalThis.__MR_EXT8_BACKEND_SHIM__) return;
    globalThis.__MR_EXT8_BACKEND_SHIM__ = true;

    var MR_HOST = "mrsemlimitesext.lovable.app";
    // Qualquer host *.lovable.app que não seja o oficial e sirva /api/public/
    // é considerado herdado e reescrito para o backend MR Sem Limites.
    var LEGACY = /^https?:\/\/([a-z0-9-]+\.)*lovable\.app\/api\/public\//i;

    function rewrite(url) {
      try {
        if (typeof url !== "string") return url;
        if (url.indexOf(MR_HOST) !== -1) return url;
        if (!LEGACY.test(url)) return url;
        return url.replace(/^(https?:\/\/)([a-z0-9-]+\.)*lovable\.app/i, "$1" + MR_HOST);
      } catch (_) {
        return url;
      }
    }


    // Host de contingência (build de preview sempre atualizado).
    var MR_FALLBACK = "project--44455b56-b609-45e7-8e53-9fd580b3ca9f-dev.lovable.app";

    function isApi(url) {
      try { return String(url).indexOf("/api/public/") !== -1; } catch (_) { return false; }
    }

    function looksLikeHtml(res) {
      try {
        var ct = res && res.headers && res.headers.get ? res.headers.get("content-type") || "" : "";
        if (ct.indexOf("application/json") !== -1) return false;
        if (ct.indexOf("text/event-stream") !== -1) return false;
        return true;
      } catch (_) { return false; }
    }

    // --- fetch ---------------------------------------------------------
    try {
      var origFetch = globalThis.fetch;
      if (typeof origFetch === "function") {
        globalThis.fetch = function (input, init) {
          var self = this;
          var target = typeof input === "string" ? input : input && input.url;
          try {
            if (typeof input === "string") {
              input = rewrite(input);
              target = input;
            } else if (input && typeof input.url === "string" && LEGACY.test(input.url)) {
              input = new Request(rewrite(input.url), input);
              target = input.url;
            }
          } catch (_) {}

          var p = origFetch.call(self, input, init);
          if (!isApi(target)) return p;

          // Failover: se o backend publicado ainda não tem a rota (HTML/404),
          // repete a chamada no host de preview para não quebrar a extensão.
          return p.then(function (res) {
            if (res && res.ok && !looksLikeHtml(res)) return res;
            var alt = String(target).replace(MR_HOST, MR_FALLBACK);
            if (alt === String(target)) return res;
            return origFetch.call(self, alt, init).then(function (r2) {
              if (r2 && r2.ok && !looksLikeHtml(r2)) return r2;
              return res;
            }).catch(function () { return res; });
          }).catch(function (err) {
            var alt = String(target).replace(MR_HOST, MR_FALLBACK);
            if (alt === String(target)) throw err;
            return origFetch.call(self, alt, init);
          }).then(function (res) {
            // Última barreira: nunca devolver HTML para um JSON.parse().
            if (res && looksLikeHtml(res)) {
              return new Response(
                JSON.stringify({
                  ok: false,
                  valid: false,
                  error: "Backend MR Sem Limites indisponível no momento. Tente novamente.",
                }),
                { status: 200, headers: { "content-type": "application/json" } },
              );
            }
            return res;
          });
        };
      }
    } catch (_) {}


    // --- XMLHttpRequest ------------------------------------------------
    try {
      if (typeof XMLHttpRequest !== "undefined") {
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
          var args = Array.prototype.slice.call(arguments);
          try { args[1] = rewrite(url); } catch (_) {}
          return origOpen.apply(this, args);
        };
      }
    } catch (_) {}

    // --- dashboard url persistido (usado como base pela extensão) -------
    var DASH_KEY = "mrsemlimites_dashboard_url";
    try {
      if (typeof localStorage !== "undefined") {
        var cur = localStorage.getItem(DASH_KEY);
        if (!cur || String(cur).indexOf(MR_HOST) === -1) {
          localStorage.setItem(DASH_KEY, "https://" + MR_HOST);
        }
      }
    } catch (_) {}

    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([DASH_KEY], function (v) {
          try {
            var u = v && v[DASH_KEY];
            if (!u || String(u).indexOf(MR_HOST) === -1) {
              var patch = {};
              patch[DASH_KEY] = "https://" + MR_HOST;
              chrome.storage.local.set(patch);
            }
          } catch (_) {}
        });
      }
    } catch (_) {}


    globalThis.MR_EXT8_BACKEND = { host: MR_HOST, base: "https://" + MR_HOST, rewrite: rewrite };
  } catch (_) {}
})();
