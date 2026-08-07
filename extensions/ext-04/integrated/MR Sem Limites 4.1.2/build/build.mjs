#!/usr/bin/env node
/*
 * MR Sem Limites 2026 Brasil — Build Pipeline
 * FASE 3.1 — Segurança e Proteção
 *
 * Modos:
 *   node build/build.mjs --mode=dev    -> cópia limpa, código legível (default para testes)
 *   node build/build.mjs --mode=prod   -> minificado + obfuscado + integrity map
 *
 * Ambos gerem:
 *   dist/<Name>/            (pasta pronta para "Carregar sem compactação")
 *   dist/<Name>.zip         (pacote instalável)
 *
 * Nenhuma funcionalidade do runtime é alterada. As proteções são adicionadas
 * como arquivos IRMÃOS (security/integrity.map.json, config/protection.js)
 * e ficam DORMENTES até `PROTECTION_MODE = 'enforce'`.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const NAME = 'MR Sem Limites EXT3';
const DIST = path.join(ROOT, 'dist');

const args = Object.fromEntries(
  process.argv.slice(2).map(a => a.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true])
);
const MODE = args.mode === 'prod' ? 'prod' : 'dev';

const IGNORE = new Set(['dist', 'build', 'node_modules', '.git', '.DS_Store', '.ai-deny']);
const JS_ENTRY = new Set([
  'background.js','sidepanel.js','popup.js','remote-ui.js','hide-element.js',
  'content/content.js','content/inject.js','content/sound-detector.js',
  'ui/sidepanel-ui.js','ui/sound-settings.js','ui/ia-picker.js','ui/input-status.js','ui/neocore.js',
  'lib/storage.js','lib/license.js','lib/constants.js',
  'data/animations.js','data/components.js','data/prompts.js',
  'adapters/backend-adapter.js','interfaces/backend.interface.js',
  'config/app.config.js','security/integrity.js','security/protection.js'
]);

function walk(dir, base = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(abs, rel));
    else out.push({ abs, rel });
  }
  return out;
}

async function tryImport(mod) {
  try { return await import(mod); } catch { return null; }
}

async function transformJs(code, rel) {
  if (MODE === 'dev') return code;
  const terser = await tryImport('terser');
  let out = code;
  if (terser) {
    const r = await terser.minify(out, {
      compress: { drop_console: false, drop_debugger: true, passes: 2 },
      mangle: { toplevel: false, reserved: ['chrome','browser'] },
      format: { comments: false }
    });
    if (r?.code) out = r.code;
  }
  const obf = await tryImport('javascript-obfuscator');
  if (obf) {
    out = obf.default.obfuscate(out, {
      compact: true,
      controlFlowFlattening: false, // manter performance no MV3
      deadCodeInjection: false,
      identifierNamesGenerator: 'mangled',
      renameGlobals: false,
      selfDefending: false,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      stringArrayThreshold: 0.6,
      transformObjectKeys: false,
      unicodeEscapeSequence: false,
      reservedNames: ['^chrome$','^browser$']
    }).getObfuscatedCode();
  }
  return out;
}

function stripDevComments(code) {
  // Remove blocos "DEV-ONLY" e headers legais mantendo o restante intacto.
  return code
    .replace(/\/\*\s*DEV-ONLY[\s\S]*?DEV-ONLY\s*\*\//g, '')
    .replace(/\/\*\s*╔[\s\S]*?╝\s*\*\//g, ''); // banners de cabeçalho
}

async function main() {
  console.log(`[build] mode=${MODE}`);
  const OUT = path.join(DIST, NAME);
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const files = walk(ROOT);
  const integrity = {};

  for (const { abs, rel } of files) {
    const outAbs = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(outAbs), { recursive: true });

    let content;
    const isJs = rel.endsWith('.js') || rel.endsWith('.mjs');
    if (isJs && JS_ENTRY.has(rel.replace(/\\/g, '/'))) {
      let src = fs.readFileSync(abs, 'utf8');
      if (MODE === 'prod') src = stripDevComments(src);
      content = await transformJs(src, rel);
      fs.writeFileSync(outAbs, content);
    } else {
      fs.copyFileSync(abs, outAbs);
      content = fs.readFileSync(outAbs);
    }

    const hash = crypto.createHash('sha256').update(content).digest('hex');
    integrity[rel.replace(/\\/g, '/')] = hash;
  }

  // Integrity map (usado pelo security/integrity.js quando PROTECTION_MODE = 'enforce')
  const map = {
    version: 1,
    mode: MODE,
    built_at: new Date().toISOString(),
    files: integrity
  };
  fs.writeFileSync(path.join(OUT, 'security/integrity.map.json'), JSON.stringify(map, null, MODE === 'prod' ? 0 : 2));

  // Zip
  const zipPath = path.join(DIST, `${NAME}.zip`);
  try {
    execSync(`cd "${DIST}" && zip -rq "${NAME}.zip" "${NAME}"`, { stdio: 'inherit' });
  } catch (_) {
    console.warn('[build] zip binary não encontrado — pulando ZIP. Rode manualmente.');
  }

  console.log(`[build] ✔ ${files.length} arquivos processados`);
  console.log(`[build] ✔ pasta: ${OUT}`);
  console.log(`[build] ✔ zip:   ${zipPath}`);
  console.log(`[build] ✔ integridade: ${Object.keys(integrity).length} entradas em security/integrity.map.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
