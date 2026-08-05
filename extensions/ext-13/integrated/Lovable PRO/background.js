import { validateLicense, emptyLicenseState, getLicenseState } from './lib/license.js';
import { setSettings, getSettings } from './lib/storage.js';

// ─────────────────────────────────────────────────────────────
// Nexus PRO + MR Backend — background service worker (MV3)
// ─────────────────────────────────────────────────────────────

const NX_ORIGINS = [
  "https://lovable.dev",
  "https://gptengineer.app",
];

function removeScoped(origins) {
  return new Promise((resolve) => {
    try {
      chrome.browsingData.remove(
        { origins: origins, since: 0 },
        { cacheStorage: true, indexedDB: true, serviceWorkers: true },
        () => resolve(!chrome.runtime.lastError)
      );
    } catch (_) { resolve(false); }
  });
}

function removeHttpCache() {
  return new Promise((resolve) => {
    try {
      chrome.browsingData.remove({ since: 0 }, { cache: true }, () =>
        resolve(!chrome.runtime.lastError)
      );
    } catch (_) { resolve(false); }
  });
}

async function deepClean(extraOrigin) {
  const origins = NX_ORIGINS.slice();
  if (extraOrigin && origins.indexOf(extraOrigin) === -1) origins.push(extraOrigin);
  const scoped = await removeScoped(origins);
  const http = await removeHttpCache();
  return { scoped: scoped, httpCache: http };
}

// Inicialização e Heartbeat da Licença MR
chrome.runtime.onInstalled.addListener(async () => {
  const settings = await getSettings();
  if (!settings.licenseState) {
    await setSettings({ licenseState: emptyLicenseState() });
  }
  await getLicenseState({ force: true }).catch(() => {});
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!msg) return false;

  // Lógica Original Nexus PRO
  if (msg.type === "NX_DEEP_CLEAN") {
    deepClean(msg.origin)
      .then((r) => sendResponse({ ok: true, detail: r }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }

  // Lógica de Licença MR Backend (Extensão 1)
  if (msg.type === 'CHECK_LICENSE') {
    getLicenseState({ force: !!msg.force })
      .then(state => sendResponse({ ok: true, state }))
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (msg.type === 'SET_LICENSE') {
    validateLicense(msg.key, msg.email)
      .then(state => sendResponse({ ok: true, state }))
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  return false;
});
