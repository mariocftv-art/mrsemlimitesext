/**
 * Contrato canônico do BackendAdapter.
 *
 * Toda comunicação com o backend compartilhado DEVE passar por uma
 * implementação desta interface — nunca chamar endpoints diretamente.
 */

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

export interface IBackendAdapter {
  validateLicense(req: ValidateLicenseRequest): Promise<ValidateLicenseResponse>;
  heartbeat(req: HeartbeatRequest): Promise<HeartbeatResponse>;
  getVersion(productSlug: string): Promise<VersionInfo>;
  activate(req: ActivationRequest): Promise<ActivationResponse>;
  registerHwid(req: RegisterHwidRequest): Promise<RegisterHwidResponse>;
  sendLog(entry: RemoteLogEntry): Promise<void>;
  getDownload(productSlug: string): Promise<DownloadInfo>;
  getInjectConfig(): Promise<InjectConfigResponse>;
}
