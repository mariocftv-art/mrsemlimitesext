// Scanner leve da Factory.
//
// Importante: não use import.meta.glob em /extensions aqui. Isso coloca todos
// os arquivos das extensões dentro do bundle SSR publicado e estoura o limite
// do servidor. Este módulo mantém apenas metadados pequenos para a interface.

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
  key: string;
  path: string;
  name: string;
  dir: string;
  ext: string;
  url: string;
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

const EMPTY_BY_CATEGORY: Record<FileCategory, FileEntry[]> = {
  manifest: [],
  config: [],
  script: [],
  style: [],
  page: [],
  image: [],
  icon: [],
  sound: [],
  font: [],
  data: [],
  doc: [],
  archive: [],
  other: [],
};

const IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "bmp", "ico"];
const SOUND_EXT = ["mp3", "wav", "ogg", "flac", "aac", "m4a"];
const FONT_EXT = ["woff", "woff2", "ttf", "otf", "eot"];
const DATA_EXT = ["json", "yml", "yaml", "toml", "csv", "xml"];
const SCRIPT_EXT = ["js", "mjs", "cjs", "ts", "tsx", "jsx"];
const STYLE_EXT = ["css", "scss", "sass", "less"];
const ARCHIVE_EXT = ["zip", "gz", "tar", "rar", "7z"];

type CatalogEntry = {
  manifest?: ExtensionManifest;
  packageJson?: ExtensionPackageJson;
  appConfigVersion?: string | null;
  files?: string[];
  builds?: ScannedBuild[];
};

const EXTENSION_CATALOG: Record<string, CatalogEntry> = {
  "extensions/ext-01/integrated/MR Sem Limites Reformulada 2.1": {
    manifest: {
      manifest_version: 3,
      name: "MR Sem Limites",
      version: "2.1.0",
      description: "Extensão premium com sidepanel, sons, prompts e integração completa.",
      permissions: ["storage", "sidePanel", "scripting", "activeTab"],
      action: {},
      background: {},
      content_scripts: [],
      side_panel: {},
    },
    appConfigVersion: "2.1.0",
    files: [
      "manifest.json",
      "popup.html",
      "sidepanel.html",
      "offscreen.html",
      "permission.html",
      "background.js",
      "content/content.js",
      "logo.png",
      "banner.png",
      "chat-bg.png",
      "icons/logo-banner.png",
      "icons/icon128.png",
    ],
    builds: [{ filename: "MR Sem Limites EXT1.zip", url: "/MR%20Sem%20Limites%20EXT1.zip", path: "MR Sem Limites EXT1.zip" }],
  },
};

function categoryFor(name: string, ext: string): FileCategory {
  const n = name.toLowerCase();
  if (n === "manifest.json") return "manifest";
  if (n === "package.json" || n.endsWith(".config.js") || n === "app.config.js") return "config";
  if (IMAGE_EXT.includes(ext)) return n.startsWith("icon") || n === "logo-banner.png" ? "icon" : "image";
  if (SOUND_EXT.includes(ext)) return "sound";
  if (FONT_EXT.includes(ext)) return "font";
  if (STYLE_EXT.includes(ext)) return "style";
  if (ext === "html") return "page";
  if (SCRIPT_EXT.includes(ext)) return "script";
  if (DATA_EXT.includes(ext)) return "data";
  if (ARCHIVE_EXT.includes(ext)) return "archive";
  if (ext === "md" || ext === "txt") return "doc";
  return "other";
}

function baseUrlFor(sourceDir: string): string {
  return "/ext-src/" + sourceDir.replace(/^extensions\//, "").split("/").map(encodeURIComponent).join("/") + "/";
}

function entryFor(sourceDir: string, path: string): FileEntry {
  const parts = path.split("/");
  const name = parts[parts.length - 1] ?? "";
  const dir = parts.slice(0, -1).join("/");
  const ext = (name.split(".").pop() || "").toLowerCase();
  const base = baseUrlFor(sourceDir);
  return {
    key: `/${sourceDir}/${path}`,
    path,
    name,
    dir,
    ext,
    url: base + path.split("/").map(encodeURIComponent).join("/"),
    category: categoryFor(name, ext),
  };
}

export function scanExtension(sourceDir: string): ScanResult {
  const catalog = EXTENSION_CATALOG[sourceDir];
  const files = (catalog?.files ?? []).map((path) => entryFor(sourceDir, path));
  const filesByCategory = { ...EMPTY_BY_CATEGORY };
  for (const file of files) filesByCategory[file.category] = [...filesByCategory[file.category], file];

  const byPath = new Map(files.map((file) => [file.path.toLowerCase(), file]));
  const pick = (path: string) => byPath.get(path.toLowerCase())?.url;
  const hasFile = (path: string) => byPath.has(path.toLowerCase());
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
    icons: filesByCategory.icon.slice(),
    images: filesByCategory.image.slice(),
    sounds: filesByCategory.sound.slice(),
    fonts: filesByCategory.font.slice(),
    screenshots: files.filter((file) => /^screenshots?\//i.test(file.path) && IMAGE_EXT.includes(file.ext)),
  };

  return {
    sourceDir,
    base: baseUrlFor(sourceDir),
    exists: Boolean(catalog),
    files,
    filesByCategory,
    assets,
    hasPopup: hasFile("popup.html"),
    hasSidepanel: hasFile("sidepanel.html"),
    hasBackground: hasFile("background.js") || hasFile("service-worker.js"),
    hasContentScripts: files.some((file) => file.dir === "content" && file.ext === "js"),
    hasManifest: hasFile("manifest.json"),
    hasPackageJson: hasFile("package.json"),
    hasBuildScript: hasFile("build/build.mjs") || hasFile("build/build.js") || hasFile("build.mjs"),
    builds: catalog?.builds ?? files.filter((file) => file.category === "archive").map((file) => ({ filename: file.name, url: file.url, path: file.path })),
  };
}

export async function readRaw(key: string): Promise<string | null> {
  const normalized = key.replace(/^\//, "");
  const sourceDir = Object.keys(EXTENSION_CATALOG).find((dir) => normalized.startsWith(`${dir}/`));
  if (!sourceDir) return null;
  const rel = normalized.slice(sourceDir.length + 1);
  const catalog = EXTENSION_CATALOG[sourceDir];
  if (rel === "manifest.json" && catalog.manifest) return JSON.stringify(catalog.manifest, null, 2);
  if (rel === "package.json" && catalog.packageJson) return JSON.stringify(catalog.packageJson, null, 2);
  return null;
}

export async function readManifest(sourceDir: string): Promise<ExtensionManifest | null> {
  return EXTENSION_CATALOG[sourceDir]?.manifest ?? null;
}

export async function readPackageJson(sourceDir: string): Promise<ExtensionPackageJson | null> {
  return EXTENSION_CATALOG[sourceDir]?.packageJson ?? null;
}

export async function readAppConfigVersion(sourceDir: string): Promise<string | null> {
  return EXTENSION_CATALOG[sourceDir]?.appConfigVersion ?? null;
}