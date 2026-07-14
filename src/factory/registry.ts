// Registry em memória. Fonte única de verdade da Factory enquanto
// não houver backend. Cada extensão é 100% isolada.
//
// Para adicionar uma nova extensão basta acrescentar um item aqui
// (ext-02, ext-03, ...) — a Factory já é capaz de gerenciá-la.

import type { ExtensionRecord, ExtensionSummary } from "./types";

const EXTENSIONS: ExtensionRecord[] = [
  {
    id: "ext-01",
    slug: "mr-sem-limites",
    code: "EXT1",
    name: "MR Sem Limites",
    description:
      "Extensão premium com sidepanel, sons, prompts e integração completa.",
    version: "2.1.0",
    status: "ready",
    tone: "cyan",
    sourceDir: "extensions/ext-01/integrated/MR Sem Limites Reformulada 2.1",
    packagedZip: "/MR%20Sem%20Limites%20EXT1.zip",
    assets: {},
    manifest: {
      manifestVersion: 3,
      permissions: ["storage", "sidePanel", "scripting", "activeTab"],
      hasPopup: true,
      hasSidepanel: true,
      hasBackground: true,
      hasContentScripts: true,
    },
    builds: [],
    versions: [
      {
        version: "2.1.0",
        releasedAt: "2026-07-01",
        notes: "Reformulação da estrutura, novos sons e melhorias de UX.",
        changes: [
          "Sidepanel reformulado",
          "Novo sistema de sons",
          "Melhorias de performance",
        ],
      },
    ],
    createdAt: "2026-06-15",
    updatedAt: "2026-07-10",
  },
];

export function listExtensions(): ExtensionRecord[] {
  return EXTENSIONS;
}

export function listSummaries(): ExtensionSummary[] {
  return EXTENSIONS.map((e) => ({
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
  return EXTENSIONS.find((e) => e.id === id);
}

export function factoryStats() {
  const total = EXTENSIONS.length;
  const byStatus = EXTENSIONS.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});
  const lastBuild = EXTENSIONS.flatMap((e) => e.builds)
    .sort((a, b) => b.builtAt.localeCompare(a.builtAt))[0];
  const lastUpdated = [...EXTENSIONS]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  return { total, byStatus, lastBuild, lastUpdated };
}
