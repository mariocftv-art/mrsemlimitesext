// Fachada de leitura para compatibilidade com módulos existentes.
// A fonte de verdade real é `storage.ts` (localStorage + seed).

import { getAllExtensions, factoryStats } from "./storage";
import type { ExtensionRecord, ExtensionSummary } from "./types";

export function listExtensions(): ExtensionRecord[] {
  return getAllExtensions();
}

export function listSummaries(): ExtensionSummary[] {
  return getAllExtensions().map((e) => ({
    id: e.id,
    code: e.code,
    name: e.name,
    version: e.version,
    status: e.status,
    tone: e.tone,
    description: e.description,
  }));
}

export function getExtension(id: string): ExtensionRecord | undefined {
  return getAllExtensions().find((e) => e.id === id);
}

export { factoryStats };
