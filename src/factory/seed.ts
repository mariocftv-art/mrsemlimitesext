// Seed base da Factory. Estas são as extensões que já existem
// fisicamente em disco. Novas extensões criadas pelo Wizard são
// persistidas no navegador via storage.ts.

import type { ExtensionRecord } from "./types";

export const SEED_EXTENSIONS: ExtensionRecord[] = [
  {
    id: "ext-01",
    slug: "mr-sem-limites",
    code: "EXT1",
    name: "MR Sem Limites",
    description:
      "Extensão premium com sidepanel, sons, prompts e integração completa.",
    version: "2.1.0",
    status: "production",
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
    notes: "Seed da Factory — extensão original.",
    createdAt: "2026-06-15",
    updatedAt: "2026-07-10",
  },
  {
    id: "ext-04",
    slug: "metodo-quatro",
    code: "EXT2",
    name: "Método Quatro",
    description: "Extensão Método Quatro (Infinito) v17.0 com motor original e backend integrado.",
    version: "17.0.0",
    status: "development",
    tone: "violet",
    sourceDir: "extensions/ext-04/integrated/metodo4-v17",
    packagedZip: "/Metodo%20Quatro%20v17.zip",
    assets: {},

    manifest: {
      manifestVersion: 3,
      permissions: ["storage", "sidePanel", "scripting", "activeTab", "cookies"],
      hasPopup: true,
      hasSidepanel: true,
      hasBackground: true,
      hasContentScripts: true,
    },
    builds: [],
    versions: [
      {
        version: "17.0.0",
        releasedAt: "2026-08-05",
        notes: "Versão importada do Método Quatro v17.",
        changes: ["Importação inicial", "Análise de ofuscação", "Preparação para sincronização de backend"],
      },
    ],
    notes: "Importação da FASE 16 — Método Quatro.",
    createdAt: "2026-08-05",
    updatedAt: "2026-08-05",
  },
];
