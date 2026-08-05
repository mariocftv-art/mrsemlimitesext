import { getSettings, setSettings } from './lib/storage.js';
import {
  getLicenseState,
  validateLicense,
  clearLicense,
  emptyLicenseState,
} from './lib/license.js';

// Importa o código original ofuscado da Extensão 14 (o zip enviado)
// Nota: O bundle original foi renomeado para m14-core.js para evitar conflitos.
import './lv-core.js';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg) return false;

  // ─────────────────────────────────────────────────────────────
  // 1. Sistema de Chaves (MR Backend) - Copiado da Extensão 3
  // ─────────────────────────────────────────────────────────────
  
  if (msg.type === 'GET_SETTINGS') {
    getSettings().then(sendResponse);
    return true;
  }

  if (msg.type === 'SET_SETTINGS') {
    setSettings(msg.updates || {}).then(sendResponse);
    return true;
  }

  if (msg.type === 'VALIDATE_LICENSE') {
    validateLicense(msg.key, msg.email).then(sendResponse);
    return true;
  }

  if (msg.type === 'GET_LICENSE_STATE') {
    getLicenseState({ force: !!msg.force }).then(sendResponse);
    return true;
  }

  if (msg.type === 'CLEAR_LICENSE') {
    clearLicense().then(() => setSettings({ enabled: false })).then(sendResponse);
    return true;
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Repasse para o Motor Original (Extensão 14)
  // ─────────────────────────────────────────────────────────────
  
  // Como o lv-core.js já registrou ouvintes, a maioria das mensagens 
  // será capturada por ele se não forem interceptadas acima.
  
  return false;
});

console.log('[MRSL] Background Extensão 14 Ativo (Motor V17 + MR Backend)');
