// Hardening pós-build: minifica (terser) e ofusca (javascript-obfuscator)
// TODOS os .js dentro de uma pasta de extensão, IN-PLACE em uma cópia.
// Uso:
//   node scripts/harden-ext.mjs <sourceDir> <outDir>
//
// Regras:
//   - Não toca em security/mr-security-pro.js (deixa legível para debug).
//   - Não toca em EXT5 (Manus) — o chamador é responsável por não passar
//     essa pasta.
//   - Se qualquer arquivo falhar, mantém o original.

import { cp, readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { minify } from "terser";
import Obfuscator from "javascript-obfuscator";

const SKIP = new Set(["node_modules", "dist", ".git"]);
const KEEP_READABLE = new Set(["security/mr-security-pro.js"]);

async function walkJs(root, base = root, out = []) {
  for (const e of await readdir(base, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(base, e.name);
    if (e.isDirectory()) await walkJs(root, p, out);
    else if (e.name.endsWith(".js")) out.push({ p, rel: relative(root, p).replaceAll("\\", "/") });
  }
  return out;
}

export async function hardenExtension(sourceDir, outDir) {
  await cp(sourceDir, outDir, { recursive: true });
  const files = await walkJs(outDir);
  const report = { total: files.length, minified: 0, obfuscated: 0, skipped: 0, failed: [] };
  for (const { p, rel } of files) {
    if (KEEP_READABLE.has(rel)) { report.skipped++; continue; }
    try {
      const src = await readFile(p, "utf8");
      const min = await minify(src, {
        compress: { drop_console: false, passes: 2 },
        mangle: true,
        format: { comments: false },
      });
      let code = min.code || src;
      report.minified++;
      try {
        const obf = Obfuscator.obfuscate(code, {
          compact: true,
          controlFlowFlattening: false, // mais leve — não quebra runtime da extensão
          deadCodeInjection: false,
          identifierNamesGenerator: "hexadecimal",
          renameGlobals: false,
          selfDefending: false,
          stringArray: true,
          stringArrayEncoding: ["base64"],
          stringArrayThreshold: 0.7,
          simplify: true,
          target: "browser",
        });
        code = obf.getObfuscatedCode();
        report.obfuscated++;
      } catch (e) {
        report.failed.push({ rel, stage: "obfuscate", message: String(e?.message || e) });
      }
      await writeFile(p, code);
    } catch (e) {
      report.failed.push({ rel, stage: "minify", message: String(e?.message || e) });
    }
  }
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , src, out] = process.argv;
  if (!src || !out) { console.error("Usage: node scripts/harden-ext.mjs <sourceDir> <outDir>"); process.exit(1); }
  hardenExtension(src, out).then((r) => { console.log(JSON.stringify(r, null, 2)); })
    .catch((e) => { console.error(e); process.exit(1); });
}
