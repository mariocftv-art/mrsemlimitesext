// Scanner em tempo real da árvore de arquivos de cada extensão.
// Fase 7.1 — a Factory reconhece os arquivos que existem em disco sem
// depender de mock. Só LEITURA — nenhum arquivo é movido, copiado
// ou alterado.
//
// Estratégia: usar import.meta.glob para enumerar arquivos em
// /extensions/**/* no build. Cada arquivo é servido em runtime pelo
// symlink public/ext-src -> ../extensions.

// Enumeração de arquivos apenas — SEM passar pelos transformadores do
// Vite (CSS/JS). Todo binário é servido em runtime pelo symlink
// public/ext-src -> ../extensions. Isso evita, por exemplo, que
// lightningcss tente resolver `@import url(https://…)` dentro do CSS
// da EXT1.
const FILE_KEYS: Record<string, unknown> = import.meta.glob(
  "/extensions/**/*",
  { query: "?raw", import: "default" },
);

// Conteúdo textual sob demanda. Só para arquivos que fazem sentido
// exibir como texto (manifest, config, docs, código-fonte pequeno).
const RAW_MODULES = import.meta.glob(
  "/extensions/**/*.{json,md,txt,html,js,mjs,ts,tsx}",
  { query: "?raw", import: "default" },
) as Record<string, () => Promise<string>>;

// ---------- Tipos ----------

export type FileCategory =
  | "manifest"
  | "config"
  | "script"
  | "style"
  | "page"
  | "image"
  | "icon"
  | "sound"
  | "font"
  | "data"
  | "doc"
  | "archive"
  | "other";

export interface FileEntry {
  /** caminho absoluto na chave do glob (ex.: "/extensions/ext-01/.../popup.html") */
  key: string;
  /** caminho relativo à pasta da extensão (ex.: "popup.html") */
  path: string;
  /** nome do arquivo */
  name: string;
  /** diretório relativo, "" para raiz */
  dir: string;
  /** extensão sem ponto, minúscula */
  ext: string;
  /** URL servível (via symlink /ext-src ou Vite) */
  url: string;
  /** categoria heurística */
  category: FileCategory;
}

export interface ScannedAssets {
  logo?: string;
  banner?: string;
  chatBg?: string;
  icon16?: string;
  icon32?: string;
  icon48?: string;
  icon64?: string;
  icon96?: string;
  icon128?: string;
  icon256?: string;
  icon512?: string;
  icons: FileEntry[];
  images: FileEntry[];
  sounds: FileEntry[];
  fonts: FileEntry[];
  screenshots: FileEntry[];
}

export interface ScannedBuild {
  filename: string;
  url: string;
  path: string;
  sizeBytes?: number;
}

export interface ScanResult {
  sourceDir: string;
  base: string;
  exists: boolean;
  files: FileEntry[];
  filesByCategory: Record<FileCategory, FileEntry[]>;
  assets: ScannedAssets;
  hasPopup: boolean;
  hasSidepanel: boolean;
  hasBackground: boolean;
  hasContentScripts: boolean;
  hasManifest: boolean;
  hasPackageJson: boolean;
  hasBuildScript: boolean;
  builds: ScannedBuild[];
}

// ---------- Helpers internos ----------

const IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "bmp", "ico"];
const SOUND_EXT = ["mp3", "wav", "ogg", "flac", "aac", "m4a"];
const FONT_EXT = ["woff", "woff2", "ttf", "otf", "eot"];
const DOC_EXT = ["md", "markdown", "txt", "rst"];
const DATA_EXT = ["json", "yml", "yaml", "toml", "csv", "xml"];
const SCRIPT_EXT = ["js", "mjs", "cjs", "ts", "tsx", "jsx"];
const STYLE_EXT = ["css", "scss", "sass", "less"];
const ARCHIVE_EXT = ["zip", "gz", "tar", "rar", "7z"];

function categoryFor(name: string, ext: string): FileCategory {
  const n = name.toLowerCase();
  if (n === "manifest.json") return "manifest";
  if (n === "package.json" || n.endsWith(".config.js") || n === "app.config.js") return "config";
  if (IMAGE_EXT.includes(ext)) {
    if (n.startsWith("icon") && n.endsWith(".png")) return "icon";
    if (n === "logo-banner.png") return "icon";
    return "image";
  }
  if (SOUND_EXT.includes(ext)) return "sound";
  if (FONT_EXT.includes(ext)) return "font";
  if (STYLE_EXT.includes(ext)) return "style";
  if (ext === "html") return "page";
  if (SCRIPT_EXT.includes(ext)) return "script";
  if (DATA_EXT.includes(ext)) return "data";
  if (DOC_EXT.includes(ext)) return "doc";
  if (ARCHIVE_EXT.includes(ext)) return "archive";
  return "other";
}

/** Constrói URL servível via symlink public/ext-src → extensions. */
function symlinkUrl(key: string): string {
  // key: "/extensions/ext-01/integrated/MR Sem Limites Reformulada 2.1/popup.html"
  const rel = key.replace(/^\/extensions\//, "");
  return "/ext-src/" + rel.split("/").map(encodeURIComponent).join("/");
}

function keyOf(sourceDir: string): string {
  // sourceDir: "extensions/ext-01/integrated/MR Sem Limites Reformulada 2.1"
  return "/" + sourceDir.replace(/\/+$/, "");
}

function makeEntry(key: string, rootKey: string): FileEntry {
  const relative = key.slice(rootKey.length + 1); // sem barra inicial
  const parts = relative.split("/");
  const name = parts[parts.length - 1] ?? "";
  const dir = parts.slice(0, -1).join("/");
  const ext = (name.split(".").pop() || "").toLowerCase();
  const url = symlinkUrl(key);
  return {
    key,
    path: relative,
    name,
    dir,
    ext,
    url,
    category: categoryFor(name, ext),
  };
}

// ---------- API pública ----------

/**
 * Faz o scan de uma extensão a partir do sourceDir relativo declarado
 * no registry.
 */
export function scanExtension(sourceDir: string): ScanResult {
  const rootKey = keyOf(sourceDir);
  const keys = Object.keys(FILE_KEYS).filter(
    (k) => k === rootKey || k.startsWith(rootKey + "/"),
  );

  const files = keys.map((k) => makeEntry(k, rootKey)).sort((a, b) =>
    a.path.localeCompare(b.path),
  );

  const filesByCategory = files.reduce(
    (acc, f) => {
      (acc[f.category] ||= []).push(f);
      return acc;
    },
    {} as Record<FileCategory, FileEntry[]>,
  );

  // Assets nomeados
  const byName = new Map(files.map((f) => [f.path.toLowerCase(), f]));
  const pick = (path: string) => byName.get(path.toLowerCase())?.url;

  const assets: ScannedAssets = {
    logo: pick("logo.png") ?? pick("assets/logo.png") ?? pick("icons/logo-banner.png"),
    banner: pick("banner.png") ?? pick("banner.gif") ?? pick("assets/banner.png"),
    chatBg: pick("chat-bg.png") ?? pick("chat-bg.jpg"),
    icon16: pick("icons/icon16.png") ?? pick("icons/icon-16.png"),
    icon32: pick("icons/icon32.png") ?? pick("icons/icon-32.png"),
    icon48: pick("icons/icon48.png") ?? pick("icons/icon-48.png"),
    icon64: pick("icons/icon64.png"),
    icon96: pick("icons/icon96.png"),
    icon128: pick("icons/icon128.png"),
    icon256: pick("icons/icon256.png"),
    icon512: pick("icons/icon512.png"),
    icons: (filesByCategory.icon ?? []).slice(),
    images: (filesByCategory.image ?? []).slice(),
    sounds: (filesByCategory.sound ?? []).slice(),
    fonts: (filesByCategory.font ?? []).slice(),
    screenshots: files.filter((f) =>
      /^screenshots?\//i.test(f.path) && IMAGE_EXT.includes(f.ext),
    ),
  };

  const hasFile = (rel: string) => byName.has(rel.toLowerCase());

  const builds: ScannedBuild[] = files
    .filter((f) => f.category === "archive")
    .map((f) => ({ filename: f.name, url: f.url, path: f.path }));

  return {
    sourceDir,
    base: "/ext-src/" + sourceDir.replace(/^extensions\//, "").split("/").map(encodeURIComponent).join("/") + "/",
    exists: files.length > 0,
    files,
    filesByCategory,
    assets,
    hasPopup: hasFile("popup.html"),
    hasSidepanel: hasFile("sidepanel.html"),
    hasBackground: hasFile("background.js") || hasFile("service-worker.js"),
    hasContentScripts: files.some((f) => f.dir === "content" && f.ext === "js"),
    hasManifest: hasFile("manifest.json"),
    hasPackageJson: hasFile("package.json"),
    hasBuildScript:
      hasFile("build/build.mjs") || hasFile("build/build.js") || hasFile("build.mjs"),
    builds,
  };
}

/** Lê o conteúdo textual (raw) de um arquivo dentro da extensão. */
export async function readRaw(key: string): Promise<string | null> {
  const loader = RAW_MODULES[key];
  if (!loader) return null;
  try {
    return await loader();
  } catch {
    return null;
  }
}

export interface ExtensionManifest {
  manifest_version?: number;
  name?: string;
  version?: string;
  description?: string;
  permissions?: string[];
  host_permissions?: string[];
  action?: unknown;
  background?: unknown;
  content_scripts?: unknown;
  side_panel?: unknown;
  icons?: Record<string, string>;
  web_accessible_resources?: unknown;
  commands?: unknown;
  [k: string]: unknown;
}

export async function readManifest(
  sourceDir: string,
): Promise<ExtensionManifest | null> {
  const raw = await readRaw(keyOf(sourceDir) + "/manifest.json");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExtensionManifest;
  } catch {
    return null;
  }
}

export interface ExtensionPackageJson {
  name?: string;
  version?: string;
  description?: string;
  type?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  [k: string]: unknown;
}

export async function readPackageJson(
  sourceDir: string,
): Promise<ExtensionPackageJson | null> {
  const raw = await readRaw(keyOf(sourceDir) + "/package.json");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExtensionPackageJson;
  } catch {
    return null;
  }
}

/**
 * Detecta a versão declarada em config/app.config.js (APP.VERSION = '...').
 * Retorna null se não encontrar.
 */
export async function readAppConfigVersion(
  sourceDir: string,
): Promise<string | null> {
  const raw = await readRaw(keyOf(sourceDir) + "/config/app.config.js");
  if (!raw) return null;
  const m =
    raw.match(/VERSION\s*:\s*['"`]([^'"`]+)['"`]/) ??
    raw.match(/APP_VERSION\s*=\s*['"`]([^'"`]+)['"`]/);
  return m ? m[1] : null;
}
