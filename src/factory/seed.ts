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
];
