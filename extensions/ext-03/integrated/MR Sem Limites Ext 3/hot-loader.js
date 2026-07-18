/**
 * MR EXT3 — Hot Loader (Opção 3)
 * Busca os módulos "vivos" do servidor Lovable e injeta.
 * Fallback: se falhar (offline / servidor fora), usa a cópia local empacotada.
 */
(function () {
  const REMOTE_BASE = "https://mrsemlimitesext.lovable.app/ext3-live";
  const LOCAL_BASE = "ui"; // fallback dentro da extensão

  // Ordem importa: dependências primeiro
  const FILES = [
    "sound-settings.js",
    "ia-picker.js",
    "input-status.js",
    "neocore.js",
    "mr-bottom.js",
    "ext3-redesign.js",
  ];

  const VERSION_TAG = "v=" + Date.now(); // sempre pega a última

  async function loadRemote(file) {
    const url = `${REMOTE_BASE}/${file}?${VERSION_TAG}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const code = await res.text();
    if (!code || code.length < 20) throw new Error("empty");
    const blob = new Blob([code + `\n//# sourceURL=live/${file}`], {
      type: "application/javascript",
    });
    return URL.createObjectURL(blob);
  }

  function injectScript(src) {
    return new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  }

  async function loadOne(file) {
    try {
      const blobUrl = await loadRemote(file);
      const ok = await injectScript(blobUrl);
      if (ok) {
        console.log(`[MR HotLoader] ✓ live: ${file}`);
        return;
      }
      throw new Error("inject failed");
    } catch (e) {
      console.warn(`[MR HotLoader] fallback local: ${file} (${e.message})`);
      await injectScript(`${LOCAL_BASE}/${file}`);
    }
  }

  (async () => {
    for (const f of FILES) {
      await loadOne(f);
    }
    console.log("[MR HotLoader] pronto — versão viva carregada");
    window.dispatchEvent(new Event("mr-hotloader-ready"));
  })();
})();
