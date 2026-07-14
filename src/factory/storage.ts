// Store persistente da Factory (navegador).
// Persiste no localStorage. Sem backend. Sem rede.
// Combina seed em disco + extensões criadas via Wizard.

import { SEED_EXTENSIONS } from "./seed";
import type { ExtensionRecord, ExtensionStatus, NeonTone } from "./types";

const STORAGE_KEY = "mr-factory:extensions:v1";

type Listener = () => void;
const listeners = new Set<Listener>();

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readCustom(): ExtensionRecord[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ExtensionRecord[]) : [];
  } catch {
    return [];
  }
}

function writeCustom(list: ExtensionRecord[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  emit();
}

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Todas as extensões (seed + custom). */
export function getAllExtensions(): ExtensionRecord[] {
  const seedIds = new Set(SEED_EXTENSIONS.map((s) => s.id));
  const custom = readCustom().filter((c) => !seedIds.has(c.id));
  // seed pode ser sobreescrita por overlay salvo (edições em EXT1)
  const overrides = new Map(
    readCustom().filter((c) => seedIds.has(c.id)).map((c) => [c.id, c] as const),
  );
  const seedWithOverrides = SEED_EXTENSIONS.map((s) => overrides.get(s.id) ?? s);
  return [...seedWithOverrides, ...custom];
}

export function getExtensionById(id: string): ExtensionRecord | undefined {
  return getAllExtensions().find((e) => e.id === id);
}

function nextExtId(existing: ExtensionRecord[]): { id: string; code: string } {
  const nums = existing
    .map((e) => Number(e.id.replace(/^ext-/, "")))
    .filter((n) => Number.isFinite(n));
  const n = (nums.length ? Math.max(...nums) : 0) + 1;
  const padded = String(n).padStart(2, "0");
  return { id: `ext-${padded}`, code: `EXT${n}` };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "extensao";
}

export interface CreateExtensionInput {
  name: string;
  code?: string;
  description: string;
  tone: NeonTone;
  logo?: string;   // dataURL
  banner?: string; // dataURL
  version?: string;
  notes?: string;
}

export function createExtension(input: CreateExtensionInput): ExtensionRecord {
  const all = getAllExtensions();
  const auto = nextExtId(all);
  const now = new Date().toISOString().slice(0, 10);
  const record: ExtensionRecord = {
    id: auto.id,
    code: input.code?.trim() || auto.code,
    slug: slugify(input.name),
    name: input.name.trim(),
    description: input.description.trim(),
    version: input.version?.trim() || "0.1.0",
    status: "development",
    tone: input.tone,
    sourceDir: `extensions/${auto.id}/`,
    assets: { logo: input.logo, banner: input.banner },
    manifest: {
      manifestVersion: 3,
      permissions: [],
      hasPopup: false,
      hasSidepanel: false,
      hasBackground: false,
      hasContentScripts: false,
    },
    builds: [],
    versions: [],
    notes: input.notes?.trim(),
    createdAt: now,
    updatedAt: now,
  };
  const custom = readCustom();
  writeCustom([...custom, record]);
  return record;
}

export function updateExtension(
  id: string,
  patch: Partial<Omit<ExtensionRecord, "id">>,
): ExtensionRecord | undefined {
  const current = getExtensionById(id);
  if (!current) return undefined;
  const updated: ExtensionRecord = {
    ...current,
    ...patch,
    id: current.id,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  const custom = readCustom();
  const idx = custom.findIndex((c) => c.id === id);
  if (idx >= 0) custom[idx] = updated;
  else custom.push(updated);
  writeCustom(custom);
  return updated;
}

export function archiveExtension(id: string) {
  updateExtension(id, { status: "archived" });
}

export function restoreExtension(id: string) {
  updateExtension(id, { status: "development" });
}

export function duplicateExtension(id: string): ExtensionRecord | undefined {
  const src = getExtensionById(id);
  if (!src) return undefined;
  return createExtension({
    name: `${src.name} (cópia)`,
    description: src.description,
    tone: src.tone,
    logo: src.assets.logo,
    banner: src.assets.banner,
    version: "0.1.0",
    notes: src.notes,
  });
}

/** Remove somente extensões custom (não permite deletar seed). */
export function deleteCustomExtension(id: string): boolean {
  const seedIds = new Set(SEED_EXTENSIONS.map((s) => s.id));
  if (seedIds.has(id)) return false;
  const custom = readCustom().filter((c) => c.id !== id);
  writeCustom(custom);
  return true;
}

export function resetFactoryStore() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  emit();
}

export function factoryStats() {
  const all = getAllExtensions();
  const total = all.length;
  const byStatus = all.reduce<Record<ExtensionStatus, number>>(
    (acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    },
    { production: 0, development: 0, testing: 0, archived: 0 },
  );
  const lastBuild = all
    .flatMap((e) => e.builds)
    .sort((a, b) => b.builtAt.localeCompare(a.builtAt))[0];
  const lastUpdated = [...all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  return { total, byStatus, lastBuild, lastUpdated };
}
