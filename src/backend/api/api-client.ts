/**
 * Cliente HTTP de baixo nível usado pelo BackendAdapter.
 *
 * Nesta fase é apenas o esqueleto. Nenhuma chamada real deve ser executada
 * enquanto `FEATURE_FLAGS.useSharedBackend === false`.
 */

import { APP_CONFIG } from "@/backend/config/app.config";

export interface ApiClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

export class ApiClient {
  readonly baseUrl: string;
  readonly timeoutMs: number;
  readonly defaultHeaders: Record<string, string>;

  constructor(opts: ApiClientOptions = {}) {
    this.baseUrl = opts.baseUrl ?? APP_CONFIG.API_BASE_URL;
    this.timeoutMs = opts.timeoutMs ?? APP_CONFIG.REQUEST_TIMEOUT_MS;
    this.defaultHeaders = {
      "content-type": "application/json",
      "x-client-version": APP_CONFIG.CLIENT_VERSION,
      "x-api-version": APP_CONFIG.API_VERSION,
      ...(opts.defaultHeaders ?? {}),
    };
  }

  /**
   * Executa uma requisição HTTP. Ainda não deve ser chamado — a
   * arquitetura só será ativada quando o backend compartilhado existir.
   */
  async request<T>(_path: string, _opts: RequestOptions = {}): Promise<T> {
    throw new Error(
      "ApiClient não implementado: aguardando backend compartilhado.",
    );
  }

  get<T>(path: string, opts: Omit<RequestOptions, "method" | "body"> = {}) {
    return this.request<T>(path, { ...opts, method: "GET" });
  }

  post<T>(path: string, body?: unknown, opts: Omit<RequestOptions, "method" | "body"> = {}) {
    return this.request<T>(path, { ...opts, method: "POST", body });
  }
}
