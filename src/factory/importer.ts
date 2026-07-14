// Importador de extensões — apenas análise, sem escrever/converter arquivos.
// Suporta ZIP (JSZip) e pastas (input webkitdirectory).

import JSZip from "jszip";

export interface ImportedFileEntry {
  path: string;          // caminho relativo (sem prefixo comum)
  size: number;
  isDir: boolean;
}

export interface ImportManifest {
  raw: unknown;
  manifest_version?: number;
  name?: string;
  version?: string;
  description?: string;
  permissions?: string[];
  host_permissions?: string[];
  action?: { default_popup?: string };
  side_panel?: { default_path?: string };
  background?: { service_worker?: string; scripts?: string[] };
  content_scripts?: Array<{ matches?: string[]; js?: string[]; css?: string[] }>;
  commands?: Record<string, unknown>;
  web_accessible_resources?: unknown[];
  icons?: Record<string, string>;
}

export interface ImportCheck {
  key: string;
  label: string;
  status: "ok" | "warn" | "missing";
  detail?: string;
}

export interface ImportReport {
  source: "zip" | "folder";
  sourceName: string;
  totalFiles: number;
  totalSize: number;
  rootPrefix: string;
  files: ImportedFileEntry[];
  manifest?: ImportManifest;
  manifestError?: string;
  checks: ImportCheck[];
  score: number;         // 0-100
  scoreLabel: string;    // "Estrutura Excelente" | ...
  detected: {
    manifest: string | null;
    popup: string | null;
    sidepanel: string | null;
    background: string[];
    contentScripts: string[];
    icons: string[];
    html: string[];
    js: string[];
    css: string[];
    assets: string[];
  };
}

// ---------------- helpers ----------------

const UNCOMMON_PERMISSIONS = new Set([
  "debugger",
  "proxy",
  "system.cpu",
  "system.memory",
  "system.storage",
  "privacy",
  "management",
  "declarativeNetRequestWithHostAccess",
  "webRequestBlocking",
]);

function stripCommonPrefix(paths: string[]): { prefix: string; stripped: string[] } {
  if (paths.length === 0) return { prefix: "", stripped: [] };
  const firsts = paths.map((p) => p.split("/")[0]);
  const allSame = firsts.every((f) => f === firsts[0]);
  const hasRootManifest = paths.some((p) => p === "manifest.json");
  if (allSame && !hasRootManifest && firsts[0]) {
    const prefix = firsts[0] + "/";
    return { prefix, stripped: paths.map((p) => p.slice(prefix.length)) };
  }
  return { prefix: "", stripped: paths };
}

function classify(files: ImportedFileEntry[], manifest?: ImportManifest) {
  const paths = files.filter((f) => !f.isDir).map((f) => f.path);

  const manifestPath = paths.find((p) => p === "manifest.json") ?? null;

  const html = paths.filter((p) => p.endsWith(".html"));
  const js = paths.filter((p) => p.endsWith(".js") || p.endsWith(".mjs"));
  const css = paths.filter((p) => p.endsWith(".css"));
  const icons = paths.filter((p) => /(^|\/)icon.*\.(png|jpg|jpeg|svg|webp)$/i.test(p));
  const imgAssets = paths.filter((p) => /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(p));

  const popup = manifest?.action?.default_popup
    ?? html.find((p) => /popup(\.html)?$/i.test(p) || p.includes("popup"))
    ?? null;

  const sidepanel = manifest?.side_panel?.default_path
    ?? html.find((p) => /side[-_]?panel(\.html)?$/i.test(p) || p.includes("sidepanel") || p.includes("side_panel"))
    ?? null;

  const background: string[] = [];
  if (manifest?.background?.service_worker) background.push(manifest.background.service_worker);
  if (manifest?.background?.scripts) background.push(...manifest.background.scripts);
  if (background.length === 0) {
    const bg = js.find((p) => /background/i.test(p) || /service[-_ ]?worker/i.test(p));
    if (bg) background.push(bg);
  }

  const contentScripts: string[] = [];
  manifest?.content_scripts?.forEach((cs) => {
    cs.js?.forEach((j) => contentScripts.push(j));
    cs.css?.forEach((j) => contentScripts.push(j));
  });
  if (contentScripts.length === 0) {
    js.filter((p) => /content[-_]?script/i.test(p)).forEach((p) => contentScripts.push(p));
  }

  return {
    manifest: manifestPath,
    popup,
    sidepanel,
    background,
    contentScripts,
    icons,
    html,
    js,
    css,
    assets: imgAssets,
  };
}

function buildChecks(
  files: ImportedFileEntry[],
  manifest: ImportManifest | undefined,
  manifestError: string | undefined,
  detected: ImportReport["detected"],
): { checks: ImportCheck[]; score: number; scoreLabel: string } {
  const checks: ImportCheck[] = [];

  // manifest
  if (manifestError) {
    checks.push({ key: "manifest", label: "Manifest", status: "missing", detail: manifestError });
  } else if (!manifest) {
    checks.push({ key: "manifest", label: "Manifest", status: "missing", detail: "manifest.json não encontrado." });
  } else {
    checks.push({ key: "manifest", label: "Manifest", status: "ok", detail: `manifest_version ${manifest.manifest_version ?? "?"}` });
  }

  // MV2 warning
  if (manifest?.manifest_version === 2) {
    checks.push({ key: "mv2", label: "Manifest V2 (obsoleto)", status: "warn", detail: "Chrome exige MV3." });
  }

  // popup
  checks.push({
    key: "popup",
    label: "Popup",
    status: detected.popup ? "ok" : "warn",
    detail: detected.popup ?? "Não declarado no manifest.",
  });

  // sidepanel
  checks.push({
    key: "sidepanel",
    label: "Sidepanel",
    status: detected.sidepanel ? "ok" : "warn",
    detail: detected.sidepanel ?? "Não declarado.",
  });

  // background
  checks.push({
    key: "background",
    label: "Background",
    status: detected.background.length > 0 ? "ok" : "warn",
    detail: detected.background.join(", ") || "Não declarado.",
  });

  // content scripts
  checks.push({
    key: "content",
    label: "Content Scripts",
    status: detected.contentScripts.length > 0 ? "ok" : "warn",
    detail: detected.contentScripts.join(", ") || "Nenhum encontrado.",
  });

  // icons
  const iconsCount = detected.icons.length + Object.keys(manifest?.icons ?? {}).length;
  checks.push({
    key: "icons",
    label: "Ícones",
    status: iconsCount > 0 ? "ok" : "warn",
    detail: iconsCount > 0 ? `${detected.icons.length} arquivo(s)` : "Não encontrados.",
  });

  // assets
  checks.push({
    key: "assets",
    label: "Assets",
    status: detected.assets.length > 0 ? "ok" : "warn",
    detail: `${detected.assets.length} imagem(ns).`,
  });

  // HTML / JS / CSS presença
  checks.push({
    key: "html",
    label: "Arquivos HTML",
    status: detected.html.length > 0 ? "ok" : "warn",
    detail: `${detected.html.length} arquivo(s).`,
  });
  checks.push({
    key: "js",
    label: "Arquivos JS",
    status: detected.js.length > 0 ? "ok" : "warn",
    detail: `${detected.js.length} arquivo(s).`,
  });
  checks.push({
    key: "css",
    label: "Arquivos CSS",
    status: detected.css.length > 0 ? "ok" : "warn",
    detail: `${detected.css.length} arquivo(s).`,
  });

  // permissions
  const perms = manifest?.permissions ?? [];
  const uncommon = perms.filter((p) => UNCOMMON_PERMISSIONS.has(p));
  if (perms.length > 0) {
    checks.push({
      key: "permissions",
      label: "Permissões",
      status: uncommon.length > 0 ? "warn" : "ok",
      detail: uncommon.length > 0 ? `Incomuns: ${uncommon.join(", ")}` : perms.join(", "),
    });
  } else {
    checks.push({ key: "permissions", label: "Permissões", status: "warn", detail: "Nenhuma declarada." });
  }

  // host permissions
  const hosts = manifest?.host_permissions ?? [];
  if (hosts.length > 0) {
    const broad = hosts.some((h) => h === "<all_urls>" || h === "*://*/*");
    checks.push({
      key: "hosts",
      label: "Host Permissions",
      status: broad ? "warn" : "ok",
      detail: broad ? "Amplo (<all_urls>)" : hosts.join(", "),
    });
  }

  // commands
  if (manifest?.commands) {
    checks.push({
      key: "commands",
      label: "Commands",
      status: "ok",
      detail: `${Object.keys(manifest.commands).length} comando(s).`,
    });
  }

  // war
  if (manifest?.web_accessible_resources) {
    checks.push({
      key: "war",
      label: "Web Accessible Resources",
      status: "ok",
      detail: `${manifest.web_accessible_resources.length} entrada(s).`,
    });
  }

  // arquivos totais
  const total = files.filter((f) => !f.isDir).length;
  checks.push({
    key: "files",
    label: "Arquivos totais",
    status: total > 0 ? "ok" : "missing",
    detail: `${total} arquivo(s).`,
  });

  // score
  const weight = { ok: 1, warn: 0.5, missing: 0 } as const;
  const raw = checks.reduce((a, c) => a + weight[c.status], 0);
  const score = Math.round((raw / checks.length) * 100);
  const scoreLabel =
    score >= 90 ? "Estrutura Excelente" :
    score >= 75 ? "Estrutura Boa" :
    score >= 60 ? "Necessita adaptação" :
    score >= 40 ? "Adaptação significativa" :
    "Estrutura incompatível";

  return { checks, score, scoreLabel };
}

function parseManifest(text: string): { manifest?: ImportManifest; error?: string } {
  try {
    // remove comentários // e /* */
    const cleaned = text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    const raw = JSON.parse(cleaned);
    return { manifest: { ...raw, raw } };
  } catch (e) {
    return { error: `manifest.json inválido: ${(e as Error).message}` };
  }
}

// ---------------- API ----------------

export async function analyzeZip(file: File): Promise<ImportReport> {
  const zip = await JSZip.loadAsync(file);
  const rawEntries: { path: string; size: number; isDir: boolean }[] = [];
  const zipFiles: Array<[string, JSZip.JSZipObject]> = [];
  zip.forEach((relPath, obj) => zipFiles.push([relPath, obj]));

  for (const [relPath, obj] of zipFiles) {
    let size = 0;
    if (!obj.dir) {
      try {
        const buf = await obj.async("uint8array");
        size = buf.byteLength;
      } catch {
        size = 0;
      }
    }
    rawEntries.push({ path: relPath, size, isDir: obj.dir });
  }

  const { prefix, stripped } = stripCommonPrefix(rawEntries.map((e) => e.path));
  const files: ImportedFileEntry[] = rawEntries.map((e, i) => ({
    path: stripped[i],
    size: e.size,
    isDir: e.isDir,
  })).filter((f) => f.path.length > 0);

  let manifest: ImportManifest | undefined;
  let manifestError: string | undefined;
  const manifestEntry = zipFiles.find(([p]) => p === `${prefix}manifest.json` || p === "manifest.json");
  if (manifestEntry) {
    const text = await manifestEntry[1].async("string");
    const parsed = parseManifest(text);
    manifest = parsed.manifest;
    manifestError = parsed.error;
  }

  const detected = classify(files, manifest);
  const { checks, score, scoreLabel } = buildChecks(files, manifest, manifestError, detected);

  return {
    source: "zip",
    sourceName: file.name,
    totalFiles: files.filter((f) => !f.isDir).length,
    totalSize: files.reduce((a, f) => a + f.size, 0),
    rootPrefix: prefix,
    files,
    manifest,
    manifestError,
    checks,
    score,
    scoreLabel,
    detected,
  };
}

export async function analyzeFolder(fileList: FileList): Promise<ImportReport> {
  const arr = Array.from(fileList);
  if (arr.length === 0) throw new Error("Pasta vazia.");
  const rawPaths = arr.map((f) => (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name);
  const { prefix, stripped } = stripCommonPrefix(rawPaths);

  const files: ImportedFileEntry[] = arr.map((f, i) => ({
    path: stripped[i],
    size: f.size,
    isDir: false,
  })).filter((f) => f.path.length > 0);

  let manifest: ImportManifest | undefined;
  let manifestError: string | undefined;
  const manifestIdx = rawPaths.findIndex((p) => p === `${prefix}manifest.json` || p === "manifest.json" || p.endsWith("/manifest.json"));
  if (manifestIdx >= 0) {
    const text = await arr[manifestIdx].text();
    const parsed = parseManifest(text);
    manifest = parsed.manifest;
    manifestError = parsed.error;
  }

  const rootName = arr[0] && (arr[0] as File & { webkitRelativePath?: string }).webkitRelativePath?.split("/")[0];
  const detected = classify(files, manifest);
  const { checks, score, scoreLabel } = buildChecks(files, manifest, manifestError, detected);

  return {
    source: "folder",
    sourceName: rootName || "pasta",
    totalFiles: files.length,
    totalSize: files.reduce((a, f) => a + f.size, 0),
    rootPrefix: prefix,
    files,
    manifest,
    manifestError,
    checks,
    score,
    scoreLabel,
    detected,
  };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
