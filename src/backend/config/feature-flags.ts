/**
 * Feature flags do backend compartilhado.
 *
 * Enquanto `useSharedBackend` estiver `false`, o painel continua com o
 * mock atual (Zustand + localStorage) e nenhuma chamada real é executada.
 * A troca acontecerá ao ligar a flag após o backend estar disponível.
 */

export const FEATURE_FLAGS = {
  /** Habilita o consumo do backend compartilhado. */
  useSharedBackend: false,

  /** Habilita heartbeat periódico da sessão. */
  enableHeartbeat: false,

  /** Habilita envio de logs remotos. */
  enableRemoteLogs: false,

  /** Habilita verificação automática de versão. */
  enableVersionCheck: false,
} as const;

export type FeatureFlags = typeof FEATURE_FLAGS;
