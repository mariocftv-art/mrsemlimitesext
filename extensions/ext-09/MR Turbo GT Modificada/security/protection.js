/*
 * MR Sem Limites 2026 Brasil — Configuração de Proteção
 * FASE 3.1 — DORMENTE por padrão.
 *
 * PROTECTION_MODE:
 *   'off'     -> nenhuma verificação (comportamento atual)
 *   'report'  -> apenas registra em console/backend (não bloqueia)
 *   'enforce' -> bloqueia + limpa sessão + solicita nova validação
 *
 * Só será ligado quando o usuário disser "ATIVAR BUILD FINAL".
 */
export const PROTECTION_MODE = 'off';

// Arquivos considerados críticos — alteração dispara adulteração.
export const CRITICAL_FILES = [
  'manifest.json',
  'background.js',
  'sidepanel.js',
  'popup.js',
  'content/content.js',
  'content/inject.js',
  'content/sound-detector.js',
  'lib/license.js',
  'lib/storage.js',
  'lib/constants.js'
];

// Endpoint futuro para telemetria de adulteração (definido na Fase 3.x).
export const TAMPER_REPORT_ENDPOINT = null;
