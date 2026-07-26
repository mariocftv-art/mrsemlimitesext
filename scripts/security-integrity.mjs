// Gera manifest.integrity.json com SHA-256 dos arquivos críticos.
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const CRITICAL_PATTERNS = [
  /^manifest\.json$/, /^background\.js$/, /^popup\.(html|js)$/,
  /^sidepanel\.(html|js)$/, /^offscreen\.(html|js)$/, /^permission\.(html|js)$/,
  /^remote-ui\.js$/, /^hide-element\.js$/,
  /^lib\/.+\.js$/, /^security\/.+\.js$/, /^content\/.+\.(js|css)$/,
  /^ui\/.+\.js$/, /^adapters\/.+\.js$/, /^config\/.+\.js$/,
  /^interfaces\/.+\.js$/, /^data\/.+\.js$/,
];

async function walk(root, base = root, out = []) {
  const entries = await readdir(base, { withFileTypes: true });
  for (const e of entries) {
    const p = join(base, e.name);
    if (e.isDirectory()) {
      if (["node_modules", "dist", ".git", "build"].includes(e.name)) continue;
      await walk(root, p, out);
    } else {
      const rel = relative(root, p).replaceAll("\\", "/");
      if (CRITICAL_PATTERNS.some((rx) => rx.test(rel))) out.push({ p, rel });
    }
  }
  return out;
}

export async function generateIntegrity(extDir) {
  const files = await walk(extDir);
  const map = {};
  for (const { p, rel } of files) {
    const buf = await readFile(p);
    map[rel] = "sha256-" + createHash("sha256").update(buf).digest("hex");
  }
  const out = { generatedAt: new Date().toISOString(), algo: "sha256", fileCount: files.length, files: map };
  await writeFile(join(extDir, "manifest.integrity.json"), JSON.stringify(out, null, 2));
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const extDir = process.argv[2];
  if (!extDir) { console.error("Usage: node scripts/security-integrity.mjs <extDir>"); process.exit(1); }
  generateIntegrity(extDir).then((r) => console.log(`OK ${r.fileCount} arquivos → ${extDir}/manifest.integrity.json`))
    .catch((e) => { console.error(e); process.exit(1); });
}
