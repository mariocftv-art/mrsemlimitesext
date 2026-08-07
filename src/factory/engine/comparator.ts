// Centro de Compatibilidade — compara metadados/estrutura contra o padrão da Factory.
// Somente análise. Não altera nenhum arquivo.

import type { ExtensionRecord } from "../types";
import type { ImportReport } from "./importer";

export type CompatStatus = "ok" | "warn" | "bad";

export interface CompatCheck {
  key: string;
  category: "manifest" | "structure" | "assets" | "permissions" | "meta";
  label: string;
  factory: string;   // esperado pela Factory
  actual: string;    // encontrado na extensão
  status: CompatStatus;
  suggestion?: string;
}

export interface CompatReport {
  extension: {
    id: string;
    code: string;
    name: string;
    version: string;
  };
  source: "record" | "import";
  score: number;
  scoreLabel: string;
  scoreStatus: CompatStatus;
  totals: {
    files: number;
    missing: number;
    extras: number;
  };
  folders: string[];
  existingFiles: string[];
  missingFiles: string[];
  extraFiles: string[];
  checks: CompatCheck[];
  suggestions: string[];
  preparation: string[];
  generatedAt: string;
}

// ------- Padrão da Factory (referência de comparação) -------

export const FACTORY_STANDARD = {
  manifestVersion: 3 as 2 | 3,
  requiredFiles: [
    "manifest.json",
    "popup.html",
    "sidepanel.html",
    "background.js",
    "assets/icon16.png",
    "assets/icon48.png",
    "assets/icon128.png",
  ],
  recommendedFolders: ["assets", "assets/icons", "content", "styles"],
  minPermissions: ["storage"],
  discouragedPermissions: ["debugger", "proxy", "management", "privacy"],
  broadHosts: ["<all_urls>", "*://*/*"],
  requiresPopup: true,
  requiresSidepanel: true,
  requiresBackground: true,
} as const;

// ------- Helpers -------

const weight: Record<CompatStatus, number> = { ok: 1, warn: 0.5, bad: 0 };

function scoreOf(checks: CompatCheck[]): { score: number; label: string; status: CompatStatus } {
  if (checks.length === 0) return { score: 0, label: "Sem dados", status: "bad" };
  const raw = checks.reduce((a, c) => a + weight[c.status], 0);
  const score = Math.round((raw / checks.length) * 100);
  const label =
    score >= 95 ? "Compatibilidade Excelente" :
    score >= 80 ? "Alta Compatibilidade" :
    score >= 60 ? "Requer adaptação" :
    score >= 40 ? "Adaptação significativa" :
    "Incompatível";
  const status: CompatStatus = score >= 80 ? "ok" : score >= 60 ? "warn" : "bad";
  return { score, label, status };
}

function foldersFromPaths(paths: string[]): string[] {
  const set = new Set<string>();
  for (const p of paths) {
    const parts = p.split("/");
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i++) set.add(parts.slice(0, i).join("/"));
    }
  }
  return Array.from(set).sort();
}

// ------- Comparação sobre cadastro (ExtensionRecord) -------

export function compareRecord(ext: ExtensionRecord): CompatReport {
  const checks: CompatCheck[] = [];
  const m = ext.manifest;

  checks.push({
    key: "manifest-version",
    category: "manifest",
    label: "Manifest Version",
    factory: `V${FACTORY_STANDARD.manifestVersion}`,
    actual: `V${m.manifestVersion}`,
    status: m.manifestVersion === FACTORY_STANDARD.manifestVersion ? "ok" : "bad",
    suggestion: m.manifestVersion === FACTORY_STANDARD.manifestVersion
      ? undefined
      : "Atualizar para Manifest V3.",
  });

  checks.push({
    key: "popup",
    category: "structure",
    label: "Popup",
    factory: "Obrigatório",
    actual: m.hasPopup ? "Presente" : "Ausente",
    status: m.hasPopup ? "ok" : "warn",
    suggestion: m.hasPopup ? undefined : "Adicionar popup.html e declarar action.default_popup.",
  });

  checks.push({
    key: "sidepanel",
    category: "structure",
    label: "Sidepanel",
    factory: "Obrigatório",
    actual: m.hasSidepanel ? "Presente" : "Ausente",
    status: m.hasSidepanel ? "ok" : "warn",
    suggestion: m.hasSidepanel ? undefined : "Adicionar sidepanel.html e declarar side_panel.default_path.",
  });

  checks.push({
    key: "background",
    category: "structure",
    label: "Background",
    factory: "service_worker",
    actual: m.hasBackground ? "Presente" : "Ausente",
    status: m.hasBackground ? "ok" : "warn",
    suggestion: m.hasBackground ? undefined : "Adicionar background.js como service_worker.",
  });

  checks.push({
    key: "content-scripts",
    category: "structure",
    label: "Content Scripts",
    factory: "Opcional",
    actual: m.hasContentScripts ? "Declarados" : "Nenhum",
    status: "ok",
  });

  const perms = m.permissions ?? [];
  const missingMin = FACTORY_STANDARD.minPermissions.filter((p) => !perms.includes(p));
  checks.push({
    key: "min-permissions",
    category: "permissions",
    label: "Permissões mínimas",
    factory: FACTORY_STANDARD.minPermissions.join(", "),
    actual: perms.join(", ") || "—",
    status: missingMin.length === 0 ? "ok" : "warn",
    suggestion: missingMin.length === 0 ? undefined : `Adicionar: ${missingMin.join(", ")}`,
  });

  const discouraged = perms.filter((p: string) => (FACTORY_STANDARD.discouragedPermissions as readonly string[]).includes(p));
  if (discouraged.length > 0) {
    checks.push({
      key: "discouraged-permissions",
      category: "permissions",
      label: "Permissões desencorajadas",
      factory: "Evitar",
      actual: discouraged.join(", "),
      status: "warn",
      suggestion: `Revisar necessidade de: ${discouraged.join(", ")}`,
    });
  }

  const hosts = m.hostPermissions ?? [];
  const broad = hosts.some((h: string) => (FACTORY_STANDARD.broadHosts as readonly string[]).includes(h));
  if (hosts.length > 0) {
    checks.push({
      key: "host-permissions",
      category: "permissions",
      label: "Host Permissions",
      factory: "Específico por domínio",
      actual: hosts.join(", "),
      status: broad ? "warn" : "ok",
      suggestion: broad ? "Restringir <all_urls> aos domínios necessários." : undefined,
    });
  }

  const hasIcons = !!(ext.assets.icon16 && ext.assets.icon48 && ext.assets.icon128);
  checks.push({
    key: "icons",
    category: "assets",
    label: "Ícones (16/48/128)",
    factory: "Obrigatório",
    actual: hasIcons ? "Completo" : "Incompleto",
    status: hasIcons ? "ok" : "warn",
    suggestion: hasIcons ? undefined : "Fornecer ícones 16, 48 e 128 px.",
  });

  checks.push({
    key: "logo",
    category: "assets",
    label: "Logo",
    factory: "Recomendado",
    actual: ext.assets.logo ? "Presente" : "Ausente",
    status: ext.assets.logo ? "ok" : "warn",
    suggestion: ext.assets.logo ? undefined : "Cadastrar logo da marca.",
  });

  checks.push({
    key: "banner",
    category: "assets",
    label: "Banner",
    factory: "Recomendado",
    actual: ext.assets.banner ? "Presente" : "Ausente",
    status: ext.assets.banner ? "ok" : "warn",
    suggestion: ext.assets.banner ? undefined : "Cadastrar banner (1400×560).",
  });

  checks.push({
    key: "version",
    category: "meta",
    label: "Versão",
    factory: "SemVer",
    actual: ext.version,
    status: /^\d+\.\d+\.\d+$/.test(ext.version) ? "ok" : "warn",
    suggestion: /^\d+\.\d+\.\d+$/.test(ext.version) ? undefined : "Usar formato SemVer (X.Y.Z).",
  });

  const { score, label, status } = scoreOf(checks);
  const suggestions = checks.filter((c) => c.suggestion).map((c) => `${c.label}: ${c.suggestion!}`);
  const preparation = buildPreparation(checks);

  return {
    extension: { id: ext.id, code: ext.code, name: ext.name, version: ext.version },
    source: "record",
    score,
    scoreLabel: label,
    scoreStatus: status,
    totals: { files: 0, missing: 0, extras: 0 },
    folders: [],
    existingFiles: [],
    missingFiles: [],
    extraFiles: [],
    checks,
    suggestions,
    preparation,
    generatedAt: new Date().toISOString(),
  };
}

// ------- Comparação sobre ImportReport (com árvore de arquivos) -------

export function compareImport(ext: ExtensionRecord, report: ImportReport): CompatReport {
  const base = compareRecord({
    ...ext,
    manifest: {
      manifestVersion: (report.manifest?.manifest_version === 2 ? 2 : 3) as 2 | 3,
      permissions: report.manifest?.permissions ?? [],
      hostPermissions: report.manifest?.host_permissions ?? [],
      hasPopup: !!report.detected.popup,
      hasSidepanel: !!report.detected.sidepanel,
      hasBackground: report.detected.background.length > 0,
      hasContentScripts: report.detected.contentScripts.length > 0,
    },
  });

  const filePaths = report.files.filter((f) => !f.isDir).map((f) => f.path);
  const fileSet = new Set(filePaths);
  const missingFiles = FACTORY_STANDARD.requiredFiles.filter((f) => !fileSet.has(f));
  const requiredSet = new Set(FACTORY_STANDARD.requiredFiles as readonly string[]);
  const extraFiles = filePaths.filter((p) => !requiredSet.has(p)).slice(0, 200);

  const checks = base.checks.slice();
  checks.push({
    key: "required-files",
    category: "structure",
    label: "Arquivos obrigatórios",
    factory: `${FACTORY_STANDARD.requiredFiles.length} arquivos`,
    actual: `${FACTORY_STANDARD.requiredFiles.length - missingFiles.length} presentes`,
    status: missingFiles.length === 0 ? "ok" : missingFiles.length <= 2 ? "warn" : "bad",
    suggestion: missingFiles.length === 0 ? undefined : `Criar: ${missingFiles.join(", ")}`,
  });

  const folders = foldersFromPaths(filePaths);
  const missingFolders = FACTORY_STANDARD.recommendedFolders.filter((f) => !folders.includes(f));
  if (missingFolders.length > 0) {
    checks.push({
      key: "recommended-folders",
      category: "structure",
      label: "Pastas recomendadas",
      factory: FACTORY_STANDARD.recommendedFolders.join(", "),
      actual: folders.slice(0, 6).join(", ") || "—",
      status: "warn",
      suggestion: `Criar pastas: ${missingFolders.join(", ")}`,
    });
  }

  const { score, label, status } = scoreOf(checks);
  const suggestions = checks.filter((c) => c.suggestion).map((c) => `${c.label}: ${c.suggestion!}`);
  const preparation = buildPreparation(checks);

  return {
    ...base,
    source: "import",
    score,
    scoreLabel: label,
    scoreStatus: status,
    totals: {
      files: filePaths.length,
      missing: missingFiles.length,
      extras: extraFiles.length,
    },
    folders,
    existingFiles: filePaths,
    missingFiles,
    extraFiles,
    checks,
    suggestions,
    preparation,
  };
}

function buildPreparation(checks: CompatCheck[]): string[] {
  const steps: string[] = [];
  const byKey = new Map(checks.map((c) => [c.key, c] as const));

  if (byKey.get("manifest-version")?.status !== "ok") {
    steps.push("Migrar manifest.json para V3 (mudar manifest_version, converter background em service_worker).");
  }
  if (byKey.get("popup")?.status !== "ok") {
    steps.push("Preparar popup.html + popup.js e declarar em action.default_popup.");
  }
  if (byKey.get("sidepanel")?.status !== "ok") {
    steps.push("Preparar sidepanel.html + sidepanel.js e declarar em side_panel.default_path.");
  }
  if (byKey.get("background")?.status !== "ok") {
    steps.push("Preparar background.js como service_worker MV3.");
  }
  if (byKey.get("icons")?.status !== "ok") {
    steps.push("Fornecer ícones 16/48/128 px em assets/.");
  }
  if (byKey.get("required-files")?.status !== "ok") {
    steps.push("Alinhar estrutura ao padrão da Factory (arquivos obrigatórios em falta).");
  }
  if (byKey.get("host-permissions")?.status === "warn") {
    steps.push("Restringir host permissions a domínios específicos.");
  }
  if (steps.length === 0) steps.push("Nenhuma preparação necessária — pronta para as próximas fases.");
  return steps;
}

// ------- Exportações -------

export function exportJSON(report: CompatReport): string {
  return JSON.stringify(report, null, 2);
}

export function exportMarkdown(report: CompatReport): string {
  const line = (c: CompatCheck) =>
    `| ${c.label} | ${c.factory} | ${c.actual} | ${c.status.toUpperCase()} | ${c.suggestion ?? "—"} |`;
  return [
    `# Relatório de Compatibilidade — ${report.extension.name} (${report.extension.code})`,
    ``,
    `**Versão:** ${report.extension.version}`,
    `**Gerado em:** ${report.generatedAt}`,
    `**Score:** ${report.score}% — ${report.scoreLabel}`,
    ``,
    `## Verificações`,
    ``,
    `| Item | Factory | Extensão | Status | Sugestão |`,
    `| --- | --- | --- | --- | --- |`,
    ...report.checks.map(line),
    ``,
    `## Arquivos ausentes`,
    report.missingFiles.length ? report.missingFiles.map((f) => `- ${f}`).join("\n") : "_Nenhum._",
    ``,
    `## Sugestões`,
    report.suggestions.length ? report.suggestions.map((s) => `- ${s}`).join("\n") : "_Nenhuma._",
    ``,
    `## Preparação`,
    report.preparation.map((p) => `- ${p}`).join("\n"),
    ``,
  ].join("\n");
}
