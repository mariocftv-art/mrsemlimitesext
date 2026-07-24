/**
 * Contrato do backend consumido pela extensão.
 *
 * FASE 2A: somente tipagem/documentação em JSDoc. Nenhuma implementação real.
 * Qualquer implementação concreta (adapter) DEVE respeitar esta assinatura.
 *
 * @typedef {Object} ValidateLicenseRequest
 * @property {string} license_key
 * @property {string} hwid
 * @property {string} device_name
 * @property {string} product_slug
 * @property {string} extension_version
 *
 * @typedef {Object} ValidateLicenseResponse
 * @property {'valid'|'expired'|'revoked'|'device_mismatch'|'not_found'|'error'} status
 * @property {number} [days_remaining]
 * @property {string} [session_token]
 * @property {string} [message]
 * @property {Object} [config]
 *
 * @typedef {Object} InjectConfigResponse
 * @property {Object} feature_flags
 * @property {Object} ui
 * @property {Object} limits
 *
 * @typedef {Object} ProxyPromptRequest
 * @property {string} session_token
 * @property {string} prompt
 * @property {Array<Object>} [attachments]
 * @property {string} [chat_mode]
 *
 * @typedef {Object} ProxyPromptResponse
 * @property {boolean} ok
 * @property {string} [message]
 * @property {Object} [meta]
 *
 * @typedef {Object} HeartbeatRequest
 * @property {string} session_token
 * @property {string} hwid
 *
 * @typedef {Object} UploadResult
 * @property {string} url
 * @property {string} path
 * @property {number} size
 */

/**
 * Interface abstrata do backend. Contrato usado pelo adapter.
 *
 * @typedef {Object} BackendClient
 * @property {(req: ValidateLicenseRequest) => Promise<ValidateLicenseResponse>} validateLicense
 * @property {() => Promise<InjectConfigResponse>} getInjectedConfig
 * @property {(req: ProxyPromptRequest) => Promise<ProxyPromptResponse>} proxyPrompt
 * @property {(file: File|Blob, meta: Object) => Promise<UploadResult>} uploadAttachment
 * @property {(req: HeartbeatRequest) => Promise<{ok: boolean}>} heartbeat
 * @property {() => Promise<{version: string, url?: string}>} getLatestVersion
 */

export {};
