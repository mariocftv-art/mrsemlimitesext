// Mock mínimo das APIs do Chrome para permitir que a UI da extensão
// renderize dentro do iframe da Factory. Nada persiste; nada faz rede.
// Se algo não puder ser executado, dispara um CustomEvent
// "mr-factory:unsupported" que a Factory usa para exibir aviso visual.

(function () {
  if (window.chrome && window.chrome.__mrFactoryMock) return;

  const notify = (label) => {
    try {
      window.parent?.postMessage(
        { type: "mr-factory:unsupported", label, url: location.href },
        "*",
      );
    } catch (_) {}
    console.warn("[MR Factory Mock] Chamada indisponível:", label);
  };

  const okLog = (label, payload) => {
    try {
      window.parent?.postMessage(
        { type: "mr-factory:call", label, payload: JSON.parse(JSON.stringify(payload ?? null)) },
        "*",
      );
    } catch (_) {}
  };

  const store = { local: {}, sync: {}, session: {}, managed: {} };
  try {
    const raw = sessionStorage.getItem("__mr_factory_chrome_storage__");
    if (raw) Object.assign(store, JSON.parse(raw));
  } catch (_) {}
  const persist = () => {
    try {
      sessionStorage.setItem("__mr_factory_chrome_storage__", JSON.stringify(store));
    } catch (_) {}
  };
  const makeArea = (area) => ({
    get: (keys, cb) => {
      let out = {};
      if (!keys) out = { ...store[area] };
      else if (typeof keys === "string") out[keys] = store[area][keys];
      else if (Array.isArray(keys)) keys.forEach((k) => (out[k] = store[area][k]));
      else if (typeof keys === "object") {
        for (const k in keys) out[k] = k in store[area] ? store[area][k] : keys[k];
      }
      okLog(`storage.${area}.get`, keys);
      if (cb) cb(out);
      return Promise.resolve(out);
    },
    set: (items, cb) => {
      Object.assign(store[area], items);
      persist();
      okLog(`storage.${area}.set`, items);
      if (cb) cb();
      return Promise.resolve();
    },
    remove: (keys, cb) => {
      const arr = Array.isArray(keys) ? keys : [keys];
      arr.forEach((k) => delete store[area][k]);
      persist();
      okLog(`storage.${area}.remove`, keys);
      if (cb) cb();
      return Promise.resolve();
    },
    clear: (cb) => {
      store[area] = {};
      persist();
      okLog(`storage.${area}.clear`);
      if (cb) cb();
      return Promise.resolve();
    },
    onChanged: { addListener() {}, removeListener() {} },
  });

  const runtimeListeners = new Set();
  const chrome = {
    __mrFactoryMock: true,

    runtime: {
      id: "mr-factory-preview",
      lastError: null,
      getManifest: () => ({ manifest_version: 3, name: "MR Sem Limites (Preview)", version: "preview" }),
      getURL: (p) => new URL(p, location.href).toString(),
      sendMessage: (...args) => {
        const msg = args[args.length - 1] instanceof Function ? args[args.length - 2] : args[args.length - 1];
        const cb = args[args.length - 1] instanceof Function ? args[args.length - 1] : null;
        okLog("runtime.sendMessage", msg);
        runtimeListeners.forEach((fn) => {
          try { fn(msg, { id: chrome.runtime.id }, (r) => cb && cb(r)); } catch (_) {}
        });
        if (cb) setTimeout(() => cb(undefined), 0);
        return Promise.resolve(undefined);
      },
      onMessage: {
        addListener: (fn) => runtimeListeners.add(fn),
        removeListener: (fn) => runtimeListeners.delete(fn),
        hasListener: (fn) => runtimeListeners.has(fn),
      },
      onInstalled: { addListener() {}, removeListener() {} },
      onStartup: { addListener() {}, removeListener() {} },
      connect: () => ({
        name: "mock",
        postMessage() {},
        disconnect() {},
        onMessage: { addListener() {}, removeListener() {} },
        onDisconnect: { addListener() {}, removeListener() {} },
      }),
      openOptionsPage: (cb) => { notify("chrome.runtime.openOptionsPage"); if (cb) cb(); },
    },

    storage: {
      local: makeArea("local"),
      sync: makeArea("sync"),
      session: makeArea("session"),
      managed: makeArea("managed"),
      onChanged: { addListener() {}, removeListener() {} },
    },

    tabs: {
      query: (_q, cb) => {
        const t = [{ id: 1, url: "https://lovable.dev/projects/preview", active: true, windowId: 1, title: "Preview" }];
        okLog("tabs.query", _q);
        if (cb) cb(t);
        return Promise.resolve(t);
      },
      get: (id, cb) => {
        const t = { id, url: "https://lovable.dev/projects/preview", active: true, title: "Preview" };
        if (cb) cb(t);
        return Promise.resolve(t);
      },
      sendMessage: (id, msg, cb) => {
        okLog("tabs.sendMessage", { id, msg });
        if (cb) cb();
        return Promise.resolve();
      },
      create: (props, cb) => {
        notify("chrome.tabs.create");
        const t = { id: 999, ...props };
        if (cb) cb(t);
        return Promise.resolve(t);
      },
      update: (id, props, cb) => { okLog("tabs.update", { id, props }); if (cb) cb({ id, ...props }); return Promise.resolve({ id, ...props }); },
      onUpdated: { addListener() {}, removeListener() {} },
      onActivated: { addListener() {}, removeListener() {} },
    },

    sidePanel: {
      open: (opts, cb) => { notify("chrome.sidePanel.open"); if (cb) cb(); return Promise.resolve(); },
      setOptions: (opts, cb) => { okLog("sidePanel.setOptions", opts); if (cb) cb(); return Promise.resolve(); },
      setPanelBehavior: (opts, cb) => { okLog("sidePanel.setPanelBehavior", opts); if (cb) cb(); return Promise.resolve(); },
      getOptions: (opts, cb) => { const o = { path: "sidepanel.html", enabled: true }; if (cb) cb(o); return Promise.resolve(o); },
    },

    action: {
      setIcon:  (o, cb) => { okLog("action.setIcon", o); if (cb) cb(); return Promise.resolve(); },
      setTitle: (o, cb) => { okLog("action.setTitle", o); if (cb) cb(); return Promise.resolve(); },
      setBadgeText: (o, cb) => { okLog("action.setBadgeText", o); if (cb) cb(); return Promise.resolve(); },
      setBadgeBackgroundColor: (o, cb) => { if (cb) cb(); return Promise.resolve(); },
      onClicked: { addListener() {}, removeListener() {} },
    },

    scripting: {
      executeScript: (opts, cb) => { notify("chrome.scripting.executeScript"); if (cb) cb([]); return Promise.resolve([]); },
      insertCSS:    (opts, cb) => { notify("chrome.scripting.insertCSS"); if (cb) cb(); return Promise.resolve(); },
      removeCSS:    (opts, cb) => { if (cb) cb(); return Promise.resolve(); },
    },

    cookies: {
      get:  (_d, cb) => { notify("chrome.cookies.get"); if (cb) cb(null); return Promise.resolve(null); },
      getAll: (_d, cb) => { notify("chrome.cookies.getAll"); if (cb) cb([]); return Promise.resolve([]); },
      set:  (_d, cb) => { notify("chrome.cookies.set"); if (cb) cb(null); return Promise.resolve(null); },
      remove: (_d, cb) => { notify("chrome.cookies.remove"); if (cb) cb(null); return Promise.resolve(null); },
    },

    alarms: {
      create() { okLog("alarms.create"); },
      clear(_n, cb) { if (cb) cb(true); return Promise.resolve(true); },
      clearAll(cb) { if (cb) cb(true); return Promise.resolve(true); },
      get(_n, cb) { if (cb) cb(null); return Promise.resolve(null); },
      getAll(cb) { if (cb) cb([]); return Promise.resolve([]); },
      onAlarm: { addListener() {}, removeListener() {} },
    },

    offscreen: {
      createDocument: (opts, cb) => { notify("chrome.offscreen.createDocument"); if (cb) cb(); return Promise.resolve(); },
      closeDocument:  (cb) => { if (cb) cb(); return Promise.resolve(); },
      hasDocument:    (cb) => { if (cb) cb(false); return Promise.resolve(false); },
    },

    permissions: {
      contains: (_p, cb) => { if (cb) cb(true); return Promise.resolve(true); },
      request:  (_p, cb) => { notify("chrome.permissions.request"); if (cb) cb(true); return Promise.resolve(true); },
      remove:   (_p, cb) => { if (cb) cb(true); return Promise.resolve(true); },
      getAll:   (cb) => { const p = { permissions: [], origins: [] }; if (cb) cb(p); return Promise.resolve(p); },
    },

    webRequest: {
      onBeforeRequest: { addListener() { notify("chrome.webRequest.onBeforeRequest"); }, removeListener() {} },
      onCompleted:     { addListener() {}, removeListener() {} },
      onErrorOccurred: { addListener() {}, removeListener() {} },
    },

    i18n: {
      getMessage: (k) => k,
      getUILanguage: () => navigator.language || "pt-BR",
    },

    windows: {
      getCurrent: (cb) => { const w = { id: 1, focused: true }; if (cb) cb(w); return Promise.resolve(w); },
      create: (opts, cb) => { notify("chrome.windows.create"); const w = { id: 2, ...opts }; if (cb) cb(w); return Promise.resolve(w); },
    },

    notifications: {
      create: (_id, _o, cb) => { notify("chrome.notifications.create"); if (cb) cb("mock"); return Promise.resolve("mock"); },
      clear:  (_id, cb) => { if (cb) cb(true); return Promise.resolve(true); },
    },
  };

  // Proxy defensivo: qualquer chrome.<algo>.<metodo>() não-mockado avisa em vez de crashar.
  const guard = (obj, path) =>
    new Proxy(obj, {
      get(target, prop) {
        if (prop in target) return target[prop];
        const p = `${path}.${String(prop)}`;
        return function () {
          notify(p);
          const last = arguments[arguments.length - 1];
          if (typeof last === "function") try { last(undefined); } catch (_) {}
          return Promise.resolve(undefined);
        };
      },
    });

  const root = new Proxy(chrome, {
    get(target, prop) {
      if (prop in target) {
        const v = target[prop];
        return v && typeof v === "object" ? guard(v, `chrome.${String(prop)}`) : v;
      }
      return guard({}, `chrome.${String(prop)}`);
    },
  });

  window.chrome = root;
  window.browser = root; // compat com libs que checam browser.*

  // Aviso quando script tenta importar módulo indisponível
  window.addEventListener("error", (e) => {
    try {
      window.parent?.postMessage(
        { type: "mr-factory:error", message: e.message, source: e.filename },
        "*",
      );
    } catch (_) {}
  });
})();
