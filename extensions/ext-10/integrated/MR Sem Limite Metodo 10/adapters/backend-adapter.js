/**
 * Backend Adapter — MR Ext Sem Limites
 *
 * FASE 2A: adapter em modo "not-wired". Ele NÃO substitui ainda a comunicação
 * atual da extensão. Toda função retorna `NOT_IMPLEMENTED` para que o código
 * legado continue funcionando exatamente como hoje.
 *
 * FASE 2B (após Cloud): estas funções serão implementadas de fato, e o
 * background/sidepanel farão import daqui — sem tocar em UI/lógica.
 */

import { APP, API, ENDPOINTS, FEATURE_FLAGS } from '../config/app.config.js';

const NOT_IMPLEMENTED = Object.freeze({
  ok: false,
  status: 'not_implemented',
  message: 'Backend adapter aguardando ativação (Fase 2B).',
});

function url(path) {
  return `${API.BASE_URL}${path}`;
}

/** @type {import('../interfaces/backend.interface.js').BackendClient} */
export const backendAdapter = {
  async validateLicense(_req) {
    if (!FEATURE_FLAGS.useNewBackend) return { status: 'error', message: NOT_IMPLEMENTED.message };
    // TODO Fase 2B: POST url(ENDPOINTS.validateLicense)
    return { status: 'error', message: 'unwired' };
  },

  async getInjectedConfig() {
    if (!FEATURE_FLAGS.useNewBackend) return { feature_flags: {}, ui: {}, limits: {} };
    // TODO Fase 2B: GET url(ENDPOINTS.injectConfig)
    return { feature_flags: {}, ui: {}, limits: {} };
  },

  async proxyPrompt(_req) {
    if (!FEATURE_FLAGS.useNewBackend) return { ok: false, message: NOT_IMPLEMENTED.message };
    // TODO Fase 2B: POST url(ENDPOINTS.proxyPrompt)
    return { ok: false, message: 'unwired' };
  },

  async uploadAttachment(_file, _meta) {
    if (!FEATURE_FLAGS.useNewBackend) throw new Error(NOT_IMPLEMENTED.message);
    // TODO Fase 2B: POST url(ENDPOINTS.proxyUpload) / storage
    throw new Error('unwired');
  },

  async heartbeat(_req) {
    if (!FEATURE_FLAGS.useNewBackend) return { ok: false };
    // TODO Fase 2B: POST url(ENDPOINTS.heartbeat)
    return { ok: false };
  },

  async getLatestVersion() {
    if (!FEATURE_FLAGS.useNewBackend) return { version: APP.VERSION };
    // TODO Fase 2B: GET url(ENDPOINTS.version)?product=APP.PRODUCT_SLUG
    return { version: APP.VERSION };
  },
};

export default backendAdapter;
export { url as buildBackendUrl };
