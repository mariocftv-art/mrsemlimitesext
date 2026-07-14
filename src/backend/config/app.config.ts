/**
 * Configuração central do backend compartilhado.
 *
 * IMPORTANTE: Este projeto NÃO possui backend próprio.
 * Todos os valores abaixo apontarão para o backend existente em outro
 * projeto Lovable / Supabase, que será informado posteriormente.
 *
 * Nesta fase apenas a ESTRUTURA é criada — nenhuma chamada real é feita.
 */

export const APP_CONFIG = {
  /** URL base do backend compartilhado (definir quando disponível). */
  API_BASE_URL: "" as string,

  /** Versão da API consumida pelo painel/extensão. */
  API_VERSION: "v1" as const,

  /** Identificador da extensão Chrome que consome este backend. */
  EXTENSION_ID: "" as string,

  /** Slug do produto associado (ex.: mr-sem-limites). */
  PRODUCT_ID: "mr-sem-limites" as string,

  /** Versão atual do cliente (painel ou extensão) que faz a chamada. */
  CLIENT_VERSION: "3.0.0" as string,

  /** Timeout padrão (ms) para requisições HTTP. */
  REQUEST_TIMEOUT_MS: 15_000,
} as const;

export type AppConfig = typeof APP_CONFIG;
