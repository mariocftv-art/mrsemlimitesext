// Server functions do painel /admin-secure.
// Regenera manifest.integrity.json, executa hardening, e atualiza limites de versão.

import { createServerFn } from "@tanstack/react-start";

const EXT_ROOTS: Record<string, string> = {
  ext1a: "extensions/ext-01/integrated/MR Ext Sem Limites",
  ext1b: "extensions/ext-01/integrated/MR Sem Limites Reformulada 2.1",
  ext2: "extensions/ext-02/integrated/MR Sem Limite Ext 2",
  ext3: "extensions/ext-03/integrated/MR Sem Limites Ext 3",
  ext4: "extensions/ext-04/integrated/MR Sem Limite Manus",
  ext6: "extensions/ext-06/MR Sem Limites Ext 6",
  ext7: "extensions/ext-07/MR Turbo GT",
};

export type IntegrityInfo = {
  extKey: string;
  path: string;
  present: boolean;
  fileCount?: number;
  generatedAt?: string;
};

export const listIntegrity = createServerFn({ method: "GET" }).handler(async (): Promise<IntegrityInfo[]> => {
  const nodeFs = await import("node:fs/promises");
  const nodePath = await import("node:path");
  const out: IntegrityInfo[] = [];
  for (const [key, dir] of Object.entries(EXT_ROOTS)) {
    const p = nodePath.join(process.cwd(), dir, "manifest.integrity.json");
    try {
      const raw = await nodeFs.readFile(p, "utf8");
      const j = JSON.parse(raw);
      out.push({ extKey: key, path: dir, present: true, fileCount: j.fileCount, generatedAt: j.generatedAt });
    } catch {
      out.push({ extKey: key, path: dir, present: false });
    }
  }
  return out;
});

export const regenerateIntegrity = createServerFn({ method: "POST" })
  .inputValidator((d: unknown): { extKey: string } => {
    const k = (d as { extKey?: unknown })?.extKey;
    if (typeof k !== "string" || !(k in EXT_ROOTS)) throw new Error("extKey inválido");
    return { extKey: k };
  })
  .handler(async ({ data }) => {
    const nodePath = await import("node:path");
    // @ts-expect-error — script sem tipos
    const mod = await import("../../scripts/security-integrity.mjs");
    const dir = nodePath.join(process.cwd(), EXT_ROOTS[data.extKey]);
    const res = await mod.generateIntegrity(dir);
    return { ok: true, extKey: data.extKey, fileCount: res.fileCount };
  });

export const hardenExtension = createServerFn({ method: "POST" })
  .inputValidator((d: unknown): { extKey: string } => {
    const k = (d as { extKey?: unknown })?.extKey;
    if (typeof k !== "string" || !(k in EXT_ROOTS)) throw new Error("extKey inválido");
    return { extKey: k };
  })
  .handler(async ({ data }) => {
    const nodePath = await import("node:path");
    const nodeFs = await import("node:fs/promises");
    const mod = await import("../../scripts/harden-ext.mjs");
    const src = nodePath.join(process.cwd(), EXT_ROOTS[data.extKey]);
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const outRoot = nodePath.join(process.cwd(), "public", "factory-builds", "hardened", `${data.extKey}-${ts}`);
    await nodeFs.mkdir(nodePath.dirname(outRoot), { recursive: true });
    const report = await mod.hardenExtension(src, outRoot);
    return {
      ok: true,
      extKey: data.extKey,
      outDir: `/factory-builds/hardened/${data.extKey}-${ts}/`,
      ...report,
    };
  });
