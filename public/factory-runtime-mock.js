// Runtime mock: estende factory-chrome-mock com instrumentação extra
// (console, storage snapshot, eventos). Somente leitura/visualização.
// Nada persiste além de sessionStorage. Nada altera a EXT1.

(function () {
  // Carrega o mock base sincronamente já foi feito via <script src>.
  if (!window.chrome || !window.chrome.__mrFactoryMock) {
    console.warn("[MR Runtime] mock base ausente");
    return;
  }
  if (window.__mrRuntimeInstalled) return;
  window.__mrRuntimeInstalled = true;

  const post = (payload) => {
    try { window.parent?.postMessage(payload, "*"); } catch (_) {}
  };

  // ---- Console interceptor ----
  ["log", "info", "warn", "error", "debug", "table"].forEach((level) => {
    const orig = console[level]?.bind(console);
    console[level] = function (...args) {
      try {
        post({
          type: "mr-runtime:console",
          level,
          ts: Date.now(),
          args: args.map((a) => {
            try { return JSON.parse(JSON.stringify(a)); }
            catch { return String(a); }
          }),
        });
      } catch (_) {}
      if (orig) orig(...args);
    };
  });

  window.addEventListener("error", (e) => {
    post({ type: "mr-runtime:console", level: "error", ts: Date.now(), args: [String(e.message), e.filename + ":" + e.lineno] });
  });
  window.addEventListener("unhandledrejection", (e) => {
    post({ type: "mr-runtime:console", level: "error", ts: Date.now(), args: ["UnhandledRejection", String(e.reason)] });
  });

  // ---- Storage snapshot broadcast ----
  const readStore = () => {
    try {
      const raw = sessionStorage.getItem("__mr_factory_chrome_storage__");
      return raw ? JSON.parse(raw) : { local: {}, sync: {}, session: {}, managed: {} };
    } catch { return { local: {}, sync: {}, session: {}, managed: {} }; }
  };
  const broadcastStore = () => post({ type: "mr-runtime:storage", ts: Date.now(), store: readStore() });
  setTimeout(broadcastStore, 50);
  setInterval(broadcastStore, 1500);

  // ---- Event tap (chrome.* calls já viram mr-factory:call — só reencaminhamos como evento) ----
  window.addEventListener("message", (ev) => {
    // no-op; a Factory já lê mr-factory:call diretamente
    void ev;
  });

  // Ready ping
  post({ type: "mr-runtime:ready", href: location.href, ts: Date.now() });
})();
