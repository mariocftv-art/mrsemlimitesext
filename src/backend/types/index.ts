/**
 * Tipos compartilhados usados pelo BackendAdapter.
 *
 * Espelham os contratos documentados em
 * `extensions/ext-01/integrated/*/docs/API_CONTRACTS.md`.
 */

export type ISO = string;

export type LicenseStatus =
  | "valid"
  | "expired"
  | "revoked"
  | "device_mismatch"
  | "not_found";

export interface ValidateLicenseRequest {
  license_key: string;
  hwid: string;
  device_name: string;
  product_slug: string;
  extension_version: string;
}

export interface ValidateLicenseResponse {
  status: LicenseStatus;
  days_remaining?: number;
  session_token?: string;
  config?: Record<string, unknown>;
  message?: string;
}

export interface HeartbeatRequest {
  session_token: string;
  hwid: string;
}

export interface HeartbeatResponse {
  ok: boolean;
}

export interface VersionInfo {
  version: string;
  url?: string;
}

export interface ActivationRequest {
  license_key: string;
  hwid: string;
  device_name: string;
  ip?: string;
  os?: string;
  version?: string;
}

export interface ActivationResponse {
  ok: boolean;
  session_token?: string;
  message?: string;
}

export interface RegisterHwidRequest {
  license_key: string;
  hwid: string;
  device_name: string;
  os?: string;
}

export interface RegisterHwidResponse {
  ok: boolean;
  device_id?: string;
  message?: string;
}

export interface RemoteLogEntry {
  ts: ISO;
  level: "info" | "warn" | "error";
  action: string;
  session_token?: string;
  hwid?: string;
  meta?: Record<string, unknown>;
}

export interface DownloadInfo {
  url: string;
  filename: string;
  sha256?: string;
  size_bytes?: number;
}

export interface InjectConfigResponse {
  feature_flags: Record<string, boolean>;
  ui: Record<string, unknown>;
  limits: Record<string, number>;
}

export interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string };
}
