// Seed base da Factory. Estas são as extensões que já existem
// fisicamente em disco. Novas extensões criadas pelo Wizard são
// persistidas no navegador via storage.ts.

import type { ExtensionRecord } from "./types";

export const SEED_EXTENSIONS: ExtensionRecord[] = [
  {
    id: "ext-01",
    slug: "mr-sem-limites",
    code: "EXT1",
    name: "MR Sem Limites 2.6",
    description:
      "Extensão premium com sidepanel, sons, prompts e motor econômico Método Quatro.",
    version: "2.2.0",
    status: "production",
    tone: "cyan",
    sourceDir: "extensions/ext-01/integrated/MR Sem Limites Reformulada 2.1",
    packagedZip: "ext1_v26_zip",
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
    name: "Método Quatro 2.6",
    description: "Extensão Método Quatro (Infinito) v17.0 com motor original e backend integrado.",
    version: "17.1.0",
    status: "development",
    tone: "violet",
    sourceDir: "extensions/ext-04/integrated/metodo4-v17",
    packagedZip: "ext2_v26_zip",
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
  {
    id: "ext-03",
    slug: "ext3-new",
    code: "EXT3",
    name: "MR Sem Limites v3 2.6",
    description: "Extensão de nova geração (EXT3) com backend sincronizado e suporte a chaves dinâmicas.",
    version: "2.6.0",
    status: "production",
    tone: "magenta",
    sourceDir: "extensions/ext-03/integrated/ext3-v1",
    packagedZip: "/__l5e/assets-v1/6f622d80-ef07-4850-8755-9afe60956796/MR_Sem_Limites_EXT3_v26.zip",
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
    versions: [],
    notes: "Preparado para ativação via FASE 17.",
    createdAt: "2026-08-05",
    updatedAt: "2026-08-05",
  },
];
