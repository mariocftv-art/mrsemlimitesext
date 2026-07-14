/**
 * MR Ext Sem Limites — Configuração centralizada
 *
 * Toda constante da extensão é declarada AQUI e importada onde for necessário.
 * Alterações de backend, produto, versão ou feature flags são feitas apenas
 * neste arquivo — o código de execução não deve conter strings hardcoded.
 *
 * FASE 2A: apenas contrato. Nenhuma chamada real é executada por este módulo.
 */

export const APP = Object.freeze({
  NAME: 'MR Ext Sem Limites',
  NAME_COMPACT: 'MRExtSemLimites',
  VERSION: '2.2.7',
  PRODUCT_SLUG: 'mr-ext-sem-limites',
  BUILD_CHANNEL: 'stable',
});

/**
 * Base do backend definitivo. Será apontada para o painel deste projeto
 * quando a Fase 2B (backend + Cloud) for executada.
 * Mantido igual ao valor atual da extensão para não quebrar o funcionamento.
 */
export const API = Object.freeze({
  BASE_URL: 'https://mrsemlimites.lovable.app/api/public/ext',
  ANON_KEY: 'mrlov',
  TIMEOUT_MS: 15000,
  RETRY: { attempts: 2, backoffMs: 500 },
});

export const ENDPOINTS = Object.freeze({
  injectConfig:     '/functions/v1/inject-config',
  validateLicense:  '/functions/v1/validate-license',
  heartbeat:        '/functions/v1/heartbeat',
  proxyPrompt:      '/functions/v1/proxy/prompt',
  proxyUpload:      '/functions/v1/proxy/upload',
  version:          '/functions/v1/version',
  storageObject:    '/storage/v1/object',
});

export const STORAGE_KEYS = Object.freeze({
  settings:        'settings',
  licenseState:    'licenseState',
  hwid:            'hwid',
  deviceName:      'deviceName',
  sessionToken:    'sessionToken',
});

export const BUCKETS = Object.freeze({
  attachments: 'lovable-message-attachments',
});

export const CACHE = Object.freeze({
  LICENSE_TTL_MS: 60 * 1000,
  CONFIG_TTL_MS:  10 * 60 * 1000,
});

export const FEATURE_FLAGS = Object.freeze({
  useNewBackend: false,   // ativa quando FASE 2B estiver pronta
  enableAudit:   true,
  enableProxy:   true,
});
