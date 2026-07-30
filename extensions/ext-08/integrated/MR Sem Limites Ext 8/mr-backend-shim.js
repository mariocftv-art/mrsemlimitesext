/*
 * MR SEM LIMITES — EXT8 Backend Shim
 * ----------------------------------
 * Camada ADITIVA. Não altera UI, prompts, motor ou fluxo da extensão.
 * Função única: garantir que TODA chamada de rede saia para o backend
 * oficial MR Sem Limites, nunca para o backend antigo (qyrondev).
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
    var LEGACY = /(^|\/\/)([a-z0-9-]+\.)?qyrondev\.lovable\.app/i;

    function rewrite(url) {
      try {
        if (typeof url !== "string") return url;
        if (!LEGACY.test(url)) return url;
        return url.replace(/([a-z0-9-]+\.)?qyrondev\.lovable\.app/gi, MR_HOST);
      } catch (_) {
        return url;
      }
    }

    // --- fetch ---------------------------------------------------------
    try {
      var origFetch = globalThis.fetch;
      if (typeof origFetch === "function") {
        globalThis.fetch = function (input, init) {
          try {
            if (typeof input === "string") {
              input = rewrite(input);
            } else if (input && typeof input.url === "string" && LEGACY.test(input.url)) {
              input = new Request(rewrite(input.url), input);
            }
          } catch (_) {}
          return origFetch.call(this, input, init);
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
    try {
      if (typeof localStorage !== "undefined") {
        var KEY = "qyron_dashboard_url";
        var cur = localStorage.getItem(KEY);
        if (!cur || LEGACY.test(cur)) {
          localStorage.setItem(KEY, "https://" + MR_HOST);
        }
      }
    } catch (_) {}

    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(["qyron_dashboard_url"], function (v) {
          try {
            var u = v && v.qyron_dashboard_url;
            if (!u || LEGACY.test(String(u))) {
              chrome.storage.local.set({ qyron_dashboard_url: "https://" + MR_HOST });
            }
          } catch (_) {}
        });
      }
    } catch (_) {}

    globalThis.MR_EXT8_BACKEND = { host: MR_HOST, base: "https://" + MR_HOST, rewrite: rewrite };
  } catch (_) {}
})();
