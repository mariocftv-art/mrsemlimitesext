// Tipos canônicos da MR Extension Factory.
// Este módulo NÃO conversa com backend. É a estrutura em memória
// que descreve cada extensão gerenciada pela Factory.

export type ExtensionStatus =
  | "production"
  | "development"
  | "testing"
  | "archived";

export type NeonTone = "cyan" | "violet" | "magenta" | "lime" | "amber";

export interface ExtensionAssets {
  logo?: string;      // dataURL ou URL
  banner?: string;    // dataURL ou URL
  icon16?: string;
  icon48?: string;
  icon128?: string;
  screenshots?: string[];
}

export interface ExtensionManifestMeta {
  manifestVersion: 2 | 3;
  permissions: string[];
  hostPermissions?: string[];
  hasPopup: boolean;
  hasSidepanel: boolean;
  hasBackground: boolean;
  hasContentScripts: boolean;
}

export interface BuildHistoryEntry {
  id: string;
  version: string;
  builtAt: string;
  sizeBytes: number;
  sha256: string;
  notes?: string;
  filename: string;
}

export interface VersionHistoryEntry {
  version: string;
  releasedAt: string;
  notes: string;
  changes: string[];
}

export interface ExtensionRecord {
  id: string;                // "ext-01"
  slug: string;              // "mr-sem-limites"
  code: string;              // "EXT1"
  name: string;              // "MR Sem Limites"
  description: string;
  version: string;
  status: ExtensionStatus;
  tone: NeonTone;
  sourceDir: string;         // caminho relativo da fonte
  packagedZip?: string;      // caminho servível do zip atual
  assets: ExtensionAssets;
  manifest: ExtensionManifestMeta;
  builds: BuildHistoryEntry[];
  versions: VersionHistoryEntry[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExtensionSummary = Pick<
  ExtensionRecord,
  "id" | "code" | "name" | "version" | "status" | "tone" | "description"
>;
