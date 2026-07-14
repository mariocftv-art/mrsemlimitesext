/**
 * BackendAdapter — ponto único de comunicação com o backend compartilhado.
 *
 * Toda camada de serviço, UI ou extensão DEVE consumir este adapter.
 * Não expor `ApiClient` diretamente a chamadores.
 *
 * FASE ATUAL: apenas a estrutura. Todas as chamadas lançam erro proposital
 * para deixar claro que a integração ainda não foi ativada.
 */

import { ApiClient } from "@/backend/api/api-client";
import { APP_CONFIG } from "@/backend/config/app.config";
import { FEATURE_FLAGS } from "@/backend/config/feature-flags";
import type { IBackendAdapter } from "@/backend/interfaces/backend.interface";
import type {
  ActivationRequest,
  ActivationResponse,
  DownloadInfo,
  HeartbeatRequest,
  HeartbeatResponse,
  InjectConfigResponse,
  RegisterHwidRequest,
  RegisterHwidResponse,
  RemoteLogEntry,
  ValidateLicenseRequest,
  ValidateLicenseResponse,
  VersionInfo,
} from "@/backend/types";

const NOT_READY = "Backend compartilhado ainda não configurado.";

function assertReady() {
  if (!FEATURE_FLAGS.useSharedBackend || !APP_CONFIG.API_BASE_URL) {
    throw new Error(NOT_READY);
  }
}

export class BackendAdapter implements IBackendAdapter {
  private readonly api: ApiClient;

  constructor(api: ApiClient = new ApiClient()) {
    this.api = api;
  }

  async validateLicense(_req: ValidateLicenseRequest): Promise<ValidateLicenseResponse> {
    assertReady();
    // Futuro: return this.api.post(`/functions/v1/validate-license`, _req);
    throw new Error(NOT_READY);
  }

  async heartbeat(_req: HeartbeatRequest): Promise<HeartbeatResponse> {
    assertReady();
    // Futuro: return this.api.post(`/functions/v1/heartbeat`, _req);
    throw new Error(NOT_READY);
  }

  async getVersion(_productSlug: string): Promise<VersionInfo> {
    assertReady();
    // Futuro: return this.api.get(`/functions/v1/version?product=${_productSlug}`);
    throw new Error(NOT_READY);
  }

  async activate(_req: ActivationRequest): Promise<ActivationResponse> {
    assertReady();
    // Futuro: return this.api.post(`/functions/v1/activate`, _req);
    throw new Error(NOT_READY);
  }

  async registerHwid(_req: RegisterHwidRequest): Promise<RegisterHwidResponse> {
    assertReady();
    // Futuro: return this.api.post(`/functions/v1/register-hwid`, _req);
    throw new Error(NOT_READY);
  }

  async sendLog(_entry: RemoteLogEntry): Promise<void> {
    assertReady();
    // Futuro: await this.api.post(`/functions/v1/logs`, _entry);
    throw new Error(NOT_READY);
  }

  async getDownload(_productSlug: string): Promise<DownloadInfo> {
    assertReady();
    // Futuro: return this.api.get(`/functions/v1/download?product=${_productSlug}`);
    throw new Error(NOT_READY);
  }

  async getInjectConfig(): Promise<InjectConfigResponse> {
    assertReady();
    // Futuro: return this.api.get(`/functions/v1/inject-config`);
    throw new Error(NOT_READY);
  }
}

/** Instância padrão consumida pelos serviços. */
export const backendAdapter: IBackendAdapter = new BackendAdapter();
