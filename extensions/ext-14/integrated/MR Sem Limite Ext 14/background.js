import { getSettings, setSettings } from './lib/storage.js';
import {
  getLicenseState,
  validateLicense,
  clearLicense,
} from './lib/license.js';

// Importa o código original ofuscado da Extensão 14 (o motor V17)
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
  
  // O motor lv-core.js já tem seus próprios ouvintes registrados no chrome.runtime.onMessage.
  // Como este arquivo é um módulo, os ouvintes registrados aqui e lá coexistem.
  // Se a mensagem não for interceptada acima, ela seguirá para os ouvintes do motor.
  
  return false;
});

console.log('[MRSL] Background Extensão 14 Ativo (Motor V17 + MR Backend)');
