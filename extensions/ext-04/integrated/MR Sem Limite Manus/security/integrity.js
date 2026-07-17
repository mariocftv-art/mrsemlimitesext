/*
 * MR Sem Limites 2026 Brasil — Verificação de Integridade
 * FASE 3.1 — módulo DORMENTE.
 *
 * Uso futuro (quando ativado):
 *   import { runIntegrityCheck } from './security/integrity.js';
 *   const result = await runIntegrityCheck();
 *   if (!result.ok && ENFORCE) { bloquear+limpar+revalidar }
 *
 * Compara SHA-256 de cada arquivo crítico contra security/integrity.map.json
 * (gerado no build). Detecta:
 *   - arquivo alterado
 *   - arquivo removido
 *   - manifest com nome/versão inesperados
 *   - ausência dos módulos de licença/HWID/content-script
 */
import { PROTECTION_MODE, CRITICAL_FILES, TAMPER_REPORT_ENDPOINT } from '../config/app.config.js';

async function sha256(buf) {
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function fetchAsBytes(url) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error('missing: ' + url);
  return await r.arrayBuffer();
}

export async function runIntegrityCheck() {
  const result = { ok: true, mode: PROTECTION_MODE, issues: [], checked: 0 };
  if (PROTECTION_MODE === 'off') return result;

  let map = null;
  try {
    const url = chrome.runtime.getURL('security/integrity.map.json');
    map = await (await fetch(url, { cache: 'no-store' })).json();
  } catch (e) {
    result.ok = false;
    result.issues.push({ type: 'no_integrity_map', error: String(e) });
    return result;
  }

  // 1) Manifest
  try {
    const m = chrome.runtime.getManifest();
    if (!m || m.manifest_version !== 3) {
      result.ok = false; result.issues.push({ type: 'manifest_mv', got: m?.manifest_version });
    }
    if (!m.mrsl_namespace) {
      result.ok = false; result.issues.push({ type: 'manifest_namespace_missing' });
    }
  } catch (e) {
    result.ok = false; result.issues.push({ type: 'manifest_read_error', error: String(e) });
  }

  // 2) Arquivos críticos existentes + hash
  for (const rel of CRITICAL_FILES) {
    const expected = map?.files?.[rel];
    try {
      const bytes = await fetchAsBytes(chrome.runtime.getURL(rel));
      const actual = await sha256(bytes);
      result.checked++;
      if (expected && expected !== actual) {
        result.ok = false;
        result.issues.push({ type: 'hash_mismatch', file: rel });
      }
    } catch (e) {
      result.ok = false;
      result.issues.push({ type: 'file_missing_or_unreadable', file: rel, error: String(e) });
    }
  }

  if (!result.ok && TAMPER_REPORT_ENDPOINT) {
    try {
      fetch(TAMPER_REPORT_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ts: Date.now(), issues: result.issues })
      }).catch(() => {});
    } catch (_) {}
  }

  return result;
}

// Ação padrão quando ENFORCE detecta adulteração.
// Não é chamada automaticamente na Fase 3.1 (código dormente).
export async function enforceTamperResponse() {
  try {
    const { clearLicense } = await import('../lib/license.js');
    await clearLicense?.();
  } catch (_) {}
  try { chrome.storage?.local?.clear?.(); } catch (_) {}
  try { chrome.runtime?.sendMessage?.({ type: 'MRSL_TAMPER_DETECTED' }); } catch (_) {}
}
