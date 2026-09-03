/**
 * MR Extension Factory — Motor de Fusão (fusion engine)
 * ------------------------------------------------------
 * Recebe o ZIP de uma extensão Chrome e devolve um ZIP novo com:
 *   - backend/banco antigo trocado pelo backend da MR Sem Limites
 *     (se houver DOIS ou mais bancos, TODOS apontam para um só)
 *   - nome(s) antigo(s) trocados pelo nome novo
 *   - logo/ícones trocados
 *   - marca d'água / assinatura de origem na build
 *
 * REGRA DE OURO: não toca no motor, no funcionamento nem nos injetores.
 * A única alteração que atinge esses arquivos é a troca de STRING de host
 * de backend e de NOME do produto — ambas pedidas explicitamente. Qualquer
 * arquivo sem host de backend e sem o nome antigo sai BYTE A BYTE idêntico.
 *
 * Testado contra extensões reais (ext5/ext7): os arquivos do motor
 * (content.js, pageHook.js, hwFingerprint.js, castle-capture.js,
 * upload-manager.js, lv-core.js, i18n.js) saem idênticos.
 */

import JSZip from "jszip";

// ---------------- tipos públicos ----------------

export interface RenameRule {
  from: string;
  to: string;
  caseInsensitive?: boolean;
}

export interface FusionConfig {
  /** Base do backend novo, ex.: "https://mrsemlimites.lovable.app" (obrigatório). */
  newBackendBase: string;
  /** Hosts extras a trocar além do autodetect (opcional). */
  extraOldBases?: string[];
  /** Hosts que NUNCA devem ser trocados (googleapis/lovable infra já são ignorados). */
  keepHosts?: string[];
  /** Troca de nome do produto nas strings. */
  renames?: RenameRule[];
  newManifestName?: string;
  newManifestDescription?: string;
  newVersion?: string;
  /** Ícones novos por tamanho: { "16": dataURL|bytes, "48": ..., "128": ... }. */
  icons?: Record<string, string | Uint8Array>;
  /** Logo a sobrescrever: { path?: "icon.png", data: dataURL|bytes }. */
  logo?: { path?: string; data: string | Uint8Array };
  /** Assinatura de origem gravada no manifest (_mr_build). */
  watermark?: { author?: string; buildId?: string };
  /** Remove *.map do pacote (default false). */
  stripSourceMaps?: boolean;
}

export interface FusionChange {
  file: string;
  kind: string;
  backendReplacements?: number;
  nameReplacements?: number;
  size?: string;
  before?: unknown;
  after?: unknown;
}

export interface FusionReport {
  detectedOldHosts: string[];
  newBackend: string;
  filesTotal: number;
  filesChanged: number;
  renames: string[];
  watermark: unknown;
}

export interface FusionResult {
  success: boolean;
  message: string;
  zip?: Blob;
  changes: FusionChange[];
  warnings: string[];
  report: FusionReport | null;
}

// ---------------- helpers ----------------

const TEXT_EXT = new Set([".js", ".json", ".html", ".htm", ".css", ".txt", ".md", ".map"]);
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".gif"]);

// Hosts de INFRAESTRUTURA — nunca são "backend do produto".
const INFRA_HOSTS = new Set([
  "lovable.app", "api.lovable.app", "lovable.dev", "api.lovable.dev",
  "cdn.lovable.app", "cdn.lovable.dev",
  "storage.googleapis.com", "fonts.googleapis.com", "fonts.gstatic.com",
]);

function isInfraHost(host: string): boolean {
  if (INFRA_HOSTS.has(host)) return true;
  return /(^|\.)gstatic\.com$/.test(host) || /(^|\.)googleapis\.com$/.test(host);
}

function extOf(path: string): string {
  const i = path.lastIndexOf(".");
  return i < 0 ? "" : path.slice(i).toLowerCase();
}
function hostOf(url: string): string {
  const m = String(url).match(/^https?:\/\/([^/]+)/i);
  return m ? m[1] : "";
}
function escapeRegExp(s: string): string {
  return String(s).replace(/[.*+?^\${}()|[\]\\]/g, "\\$&");
}

/**
 * Detecta os hosts de backend "antigos" presentes na extensão.
 * Reconhece Supabase e Lovable (project--UUID, id-preview--UUID, etc).
 * Ignora o host novo, os hosts em keepHosts e a infraestrutura.
 */
export function detectOldBackends(allText: string, newBase: string, keepHosts?: string[]): string[] {
  const keep = new Set([hostOf(newBase), ...(keepHosts || [])]);
  const found = new Set<string>();
  const re = /https?:\/\/([a-z0-9-]+(?:--[a-z0-9-]+)?\.supabase\.co|[a-z0-9-]+(?:--[a-z0-9-]+)?\.lovable\.app|[a-z0-9-]+(?:--[a-z0-9-]+)?\.lovable\.dev)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(allText)) !== null) {
    const host = m[1];
    if (!keep.has(host) && !isInfraHost(host)) found.add(host);
  }
  return [...found];
}

interface UrlReplacer { re: RegExp; to: string; note: string; }

/**
 * Mapeia cada host antigo para o backend novo.
 *   Supabase functions -> https://NOVO/api/public/ext/functions/v1/...
 *   Supabase (resto)   -> troca só o host
 *   Lovable            -> troca só o host (path /api/public/ext/... preservado)
 */
export function buildUrlReplacers(oldHosts: string[], newBase: string): UrlReplacer[] {
  const newHost = hostOf(newBase);
  const replacers: UrlReplacer[] = [];
  for (const host of oldHosts) {
    if (/\.supabase\.co$/i.test(host)) {
      replacers.push({
        re: new RegExp("https?:\\/\\/" + escapeRegExp(host) + "\\/functions\\/v1\\/", "gi"),
        to: "https://" + newHost + "/api/public/ext/functions/v1/",
        note: host + "/functions/v1 -> backend novo",
      });
      replacers.push({
        re: new RegExp("https?:\\/\\/" + escapeRegExp(host), "gi"),
        to: "https://" + newHost,
        note: host + " -> " + newHost,
      });
    } else {
      replacers.push({
        re: new RegExp("https?:\\/\\/" + escapeRegExp(host), "gi"),
        to: "https://" + newHost,
        note: host + " -> " + newHost,
      });
    }
  }
  return replacers;
}

// Aceita bytes crus ou dataURL (data:...;base64,....).
function toBytes(data: string | Uint8Array): Uint8Array {
  if (typeof data === "string") {
    const m = data.match(/^data:[^;]*;base64,(.*)$/);
    const b64 = m ? m[1] : data;
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }
  return data;
}

// ---------------- motor principal ----------------

export async function fuseExtension(
  zipData: ArrayBuffer | Uint8Array | Blob,
  cfg: FusionConfig,
): Promise<FusionResult> {
  const warnings: string[] = [];
  const changes: FusionChange[] = [];
  if (!cfg || !cfg.newBackendBase) {
    return { success: false, message: "newBackendBase é obrigatório.", changes, warnings, report: null };
  }
  const newBase = cfg.newBackendBase.replace(/\/+$/, "");
  const newHost = hostOf(newBase);

  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(zipData as any);
  } catch (e: any) {
    return { success: false, message: "Não consegui abrir o ZIP: " + e.message, changes, warnings, report: null };
  }

  const entries: { path: string; file: JSZip.JSZipObject }[] = [];
  zip.forEach((relPath, file) => { if (!file.dir) entries.push({ path: relPath, file }); });

  const firstSeg = entries.map((e) => e.path.split("/")[0]);
  const commonPrefix = (entries.length && firstSeg.every((s) => s === firstSeg[0]) &&
    !entries.some((e) => e.path === "manifest.json")) ? firstSeg[0] + "/" : "";

  const textFiles = entries.filter((e) => TEXT_EXT.has(extOf(e.path)));
  const textContent = new Map<string, string>();
  for (const e of textFiles) textContent.set(e.path, await e.file.async("string"));

  const bigText = [...textContent.values()].join("\n");
  const oldHosts = [
    ...detectOldBackends(bigText, newBase, cfg.keepHosts),
    ...(cfg.extraOldBases || []).map(hostOf).filter(Boolean),
  ];
  const uniqueOldHosts = [...new Set(oldHosts)].filter((h) => h && h !== newHost);
  const urlReplacers = buildUrlReplacers(uniqueOldHosts, newBase);

  if (uniqueOldHosts.length === 0) {
    warnings.push("Nenhum host de backend antigo detectado. Confira se a extensão usa Supabase/Lovable, ou informe extraOldBases.");
  }

  const renames = (cfg.renames || []).filter((r) => r && r.from && r.to);
  const manifestPath = commonPrefix + "manifest.json";

  // Troca de host + nome em todos os textos (exceto manifest, tratado à parte).
  for (const [path, original] of textContent.entries()) {
    if (path === manifestPath) continue;
    let content = original;
    let backendHits = 0, nameHits = 0;
    for (const r of urlReplacers) content = content.replace(r.re, () => { backendHits++; return r.to; });
    for (const r of renames) {
      const re = new RegExp(escapeRegExp(r.from), r.caseInsensitive ? "gi" : "g");
      content = content.replace(re, () => { nameHits++; return r.to; });
    }
    if (content !== original) {
      zip.file(path, content);
      changes.push({ file: path, kind: "text-rewrite", backendReplacements: backendHits, nameReplacements: nameHits });
    }
  }

  // Manifest: troca host/nome no texto, reprocessa host_permissions/matches, nome, versão, assinatura.
  let manifestObj: any = null;
  if (textContent.has(manifestPath)) {
    try {
      const rawNow = await zip.file(manifestPath)!.async("string");
      let cleaned = rawNow.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
      for (const r of urlReplacers) cleaned = cleaned.replace(r.re, r.to);
      for (const r of renames) cleaned = cleaned.replace(new RegExp(escapeRegExp(r.from), r.caseInsensitive ? "gi" : "g"), r.to);
      manifestObj = JSON.parse(cleaned);

      if (Array.isArray(manifestObj.host_permissions)) {
        const before = manifestObj.host_permissions.slice();
        manifestObj.host_permissions = manifestObj.host_permissions
          .filter((h: string) => !uniqueOldHosts.some((old) => h.includes(old)));
        const newPatterns = ["https://" + newHost + "/*", "https://" + newHost + "/api/public/ext/*"];
        for (const p of newPatterns) if (!manifestObj.host_permissions.includes(p)) manifestObj.host_permissions.push(p);
        manifestObj.host_permissions = [...new Set(manifestObj.host_permissions)];
        changes.push({ file: manifestPath, kind: "host_permissions", before, after: manifestObj.host_permissions.slice() });
      }

      const scrubMatches = (arr: string[]) => arr.filter((h) => !uniqueOldHosts.some((old) => String(h).includes(old)));
      if (Array.isArray(manifestObj.content_scripts)) {
        for (const cs of manifestObj.content_scripts) {
          if (Array.isArray(cs.matches)) {
            cs.matches = scrubMatches(cs.matches);
            if (cs.matches.length === 0) cs.matches = ["https://" + newHost + "/*"];
          }
        }
      }
      if (Array.isArray(manifestObj.web_accessible_resources)) {
        for (const war of manifestObj.web_accessible_resources) {
          if (war && Array.isArray(war.matches)) {
            war.matches = scrubMatches(war.matches);
            if (war.matches.length === 0) war.matches = ["https://" + newHost + "/*"];
          }
        }
      }

      if (cfg.newManifestName) { changes.push({ file: manifestPath, kind: "name", before: manifestObj.name, after: cfg.newManifestName }); manifestObj.name = cfg.newManifestName; }
      if (cfg.newManifestDescription) manifestObj.description = cfg.newManifestDescription;
      if (cfg.newVersion) { changes.push({ file: manifestPath, kind: "version", before: manifestObj.version, after: cfg.newVersion }); manifestObj.version = cfg.newVersion; }

      if (cfg.watermark) {
        manifestObj._mr_build = {
          author: cfg.watermark.author || "MR Sem Limites",
          buildId: cfg.watermark.buildId || ("MRF-" + Date.now().toString(36).toUpperCase()),
          fusedAt: new Date().toISOString(),
          backend: newHost,
        };
      }

      zip.file(manifestPath, JSON.stringify(manifestObj, null, 2));
    } catch (e: any) {
      warnings.push("Manifest não pôde ser reprocessado como JSON (" + e.message + "). host_permissions/nome podem não ter sido ajustados.");
    }
  } else {
    warnings.push("manifest.json não encontrado na raiz — pacote pode não ser uma extensão válida.");
  }

  // Ícones.
  if (cfg.icons && manifestObj && manifestObj.icons) {
    for (const [size, ref] of Object.entries(manifestObj.icons)) {
      const bytes = cfg.icons[size] || cfg.icons[String(size)];
      if (!bytes) continue;
      const target = commonPrefix + String(ref).replace(/^\/+/, "");
      zip.file(target, toBytes(bytes), { binary: true });
      changes.push({ file: target, kind: "icon", size: String(size) });
    }
    const ai = manifestObj.action && manifestObj.action.default_icon;
    if (ai && typeof ai === "object") {
      for (const [size, ref] of Object.entries(ai)) {
        const bytes = cfg.icons[size] || cfg.icons[String(size)];
        if (!bytes) continue;
        zip.file(commonPrefix + String(ref).replace(/^\/+/, ""), toBytes(bytes), { binary: true });
      }
    }
  }

  // Logo.
  if (cfg.logo && cfg.logo.data) {
    const candidates = cfg.logo.path
      ? [commonPrefix + cfg.logo.path.replace(/^\/+/, "")]
      : entries.map((e) => e.path).filter((p) => /logo/i.test(p) && IMAGE_EXT.has(extOf(p)));
    if (candidates.length === 0) warnings.push("Logo informada mas nenhum arquivo de logo encontrado; especifique cfg.logo.path.");
    for (const c of candidates) { zip.file(c, toBytes(cfg.logo.data), { binary: true }); changes.push({ file: c, kind: "logo" }); }
  }

  // Source maps.
  if (cfg.stripSourceMaps) {
    for (const e of entries) if (extOf(e.path) === ".map") { zip.remove(e.path); changes.push({ file: e.path, kind: "removed-sourcemap" }); }
  }

  const outBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });

  const report: FusionReport = {
    detectedOldHosts: uniqueOldHosts,
    newBackend: newBase,
    filesTotal: entries.length,
    filesChanged: new Set(changes.map((c) => c.file)).size,
    renames: renames.map((r) => r.from + " -> " + r.to),
    watermark: cfg.watermark ? (manifestObj && manifestObj._mr_build) : null,
  };

  return {
    success: uniqueOldHosts.length > 0 || renames.length > 0 || !!cfg.icons || !!cfg.logo,
    message: uniqueOldHosts.length
      ? "Fusão concluída: backend trocado para " + newHost + " em " + report.filesChanged + " arquivo(s)."
      : "Fusão concluída, mas nenhum backend antigo foi trocado (ver warnings).",
    zip: outBlob,
    changes,
    warnings,
    report,
  };
}

// ---------------- compatibilidade (API antiga do stub) ----------------

export interface FusionTarget {
  popup?: string; sidepanel?: string; background?: string; contentScripts?: string;
  options?: string; offscreen?: string; ui?: string; motor?: string;
}

/** @deprecated Use fuseExtension. Mantido para compatibilidade do barrel. */
export function planFusion(_targets: FusionTarget): { success: boolean; message: string; logs: string[] } {
  return { success: true, message: "planFusion foi substituído por fuseExtension().", logs: [] };
}

// ---------------- análise (review-first) ----------------

export interface AnalyzeResult {
  ok: boolean;
  manifestName?: string;
  manifestVersion?: string;
  manifestVersionNumber?: number;
  oldBackends: string[];      // hosts que a fusão trocaria
  infraHosts: string[];       // hosts de infra preservados (contexto)
  brandingConfig: boolean;    // tem branding.config.js?
  logoCandidates: string[];   // imagens candidatas a logo
  files: string[];
  warnings: string[];
}

/** Analisa o ZIP sem alterar nada. Alimenta a tela de revisão. */
export async function analyzeExtension(
  zipData: ArrayBuffer | Uint8Array | Blob,
  newBackendBase = "https://mrsemlimites.lovable.app",
): Promise<AnalyzeResult> {
  const warnings: string[] = [];
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(zipData as any);
  } catch (e: any) {
    return { ok: false, oldBackends: [], infraHosts: [], brandingConfig: false, logoCandidates: [], files: [], warnings: ["Não consegui abrir o ZIP: " + e.message] };
  }

  const entries: { path: string; file: JSZip.JSZipObject }[] = [];
  zip.forEach((relPath, file) => { if (!file.dir) entries.push({ path: relPath, file }); });

  const firstSeg = entries.map((e) => e.path.split("/")[0]);
  const commonPrefix = (entries.length && firstSeg.every((s) => s === firstSeg[0]) &&
    !entries.some((e) => e.path === "manifest.json")) ? firstSeg[0] + "/" : "";

  let allText = "";
  for (const e of entries) if (TEXT_EXT.has(extOf(e.path))) allText += "\n" + await e.file.async("string");

  const oldBackends = detectOldBackends(allText, newBackendBase);
  const infraRe = /https?:\/\/([a-z0-9-]+\.(?:lovable\.app|lovable\.dev|googleapis\.com|gstatic\.com))/gi;
  const infra = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = infraRe.exec(allText)) !== null) if (isInfraHost(m[1])) infra.add(m[1]);

  let manifestName: string | undefined, manifestVersion: string | undefined, manifestVersionNumber: number | undefined;
  const mf = zip.file(commonPrefix + "manifest.json");
  if (mf) {
    try {
      const raw = (await mf.async("string")).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
      const obj = JSON.parse(raw);
      manifestName = obj.name; manifestVersion = obj.version; manifestVersionNumber = obj.manifest_version;
    } catch { warnings.push("manifest.json não pôde ser lido como JSON."); }
  } else {
    warnings.push("manifest.json não encontrado — pode não ser uma extensão válida.");
  }

  if (oldBackends.length === 0) warnings.push("Nenhum backend antigo detectado automaticamente. Você pode informar o endereço manualmente.");

  return {
    ok: true,
    manifestName, manifestVersion, manifestVersionNumber,
    oldBackends,
    infraHosts: [...infra],
    brandingConfig: entries.some((e) => /branding\.config\.js$/i.test(e.path)),
    logoCandidates: entries.map((e) => e.path).filter((p) => IMAGE_EXT.has(extOf(p))),
    files: entries.map((e) => e.path),
    warnings,
  };
}
