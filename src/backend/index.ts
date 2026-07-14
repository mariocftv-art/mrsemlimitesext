/**
 * Ponto de entrada da camada de backend compartilhado.
 *
 * Regra: consumidores importam APENAS daqui.
 * Nunca importe `ApiClient` ou endpoints diretamente.
 */
export { APP_CONFIG } from "./config/app.config";
export { FEATURE_FLAGS } from "./config/feature-flags";
export { backendAdapter, BackendAdapter } from "./adapters/backend-adapter";
export type { IBackendAdapter } from "./interfaces/backend.interface";
export * from "./types";

export { licenseService } from "./services/license.service";
export { sessionService } from "./services/session.service";
export { versionService } from "./services/version.service";
export { activationService } from "./services/activation.service";
export { logsService } from "./services/logs.service";
export { downloadService } from "./services/download.service";
export { configService } from "./services/config.service";
