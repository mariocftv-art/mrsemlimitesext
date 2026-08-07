// Seed base da Factory. Estas são as extensões que já existem
// fisicamente em disco. Novas extensões criadas pelo Wizard são
// persistidas no navegador via storage.ts.

import type { ExtensionRecord } from "./types";

export const SEED_EXTENSIONS: ExtensionRecord[] = [
  {
    id: "ext-01",
    slug: "mr-sem-limites",
    code: "EXT1",
    name: "MR Sem Limites 3.5",
    description:
      "Extensão premium com motor Método Quatro (Castler Logic) 100% original, livre de chaves e bypass de créditos.",
    version: "3.5.0",
    status: "production",
    tone: "cyan",
    sourceDir: "extensions/ext-01/integrated/MR Ext Sem Limites",
    packagedZip: "ext1_v30_zip",
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
    name: "Método Quatro 2.9",
    description: "Extensão Método Quatro (Infinito) v17.0 com motor original e backend integrado.",
    version: "2.9.0",
    status: "development",
    tone: "violet",
    sourceDir: "extensions/ext-04/integrated/metodo4-v17",
    packagedZip: "ext2_v27_zip", // Mantendo v27 para EXT2 por enquanto
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
    name: "MR Sem Limites v3 2.9",
    description: "Extensão de nova geração (EXT3) com backend sincronizado e suporte a chaves dinâmicas.",
    version: "2.9.0",
    status: "production",
    tone: "magenta",
    sourceDir: "extensions/ext-03/integrated/ext3-v26",
    packagedZip: "ext3_v27_zip", // Mantendo v27 para EXT3 por enquanto
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
    notes: "Atualizado para v2.7 com branding MR Sem Limites.",
    createdAt: "2026-08-05",
    updatedAt: "2026-08-06",
  },
];
