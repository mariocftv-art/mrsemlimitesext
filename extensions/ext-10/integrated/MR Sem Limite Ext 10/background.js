import { getSettings, setSettings } from './lib/storage.js';
import { getLicenseState, validateLicense, clearLicense } from './lib/license.js';

// Importa o motor original V17Nexus desofuscado
// Note: lv-core.js é injetado como um módulo que registra ouvintes
import './lv-core.js';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg) return false;

  // 1. Intercepta requisições do novo design (Popup/Sidepanel da Ext8)
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

  // 2. Intercepta chamadas de proxy do motor original V17Nexus
  // O motor original usa { action: 'proxyFetch', ... }
  if (msg.action === 'proxyFetch') {
    console.log('[MRSL] Interceptando Proxy do Motor V17Nexus');
    // Aqui redirecionamos para o nosso gateway oficial se necessário
    // Por enquanto, deixamos seguir para o motor lidar
    return false;
  }

  return false;
});

console.log('[MRSL] Background EXT10 Ativo - V17 Nexus Engine + Gold Design + MR Backend');
