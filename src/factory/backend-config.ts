// Configuração da Factory para conversar com o Backend Oficial da EXT1.
// Este módulo NÃO altera nada no backend nem na EXT1. Apenas centraliza
// as URLs/valores que a Factory usa para testar/diagnosticar a conexão.
//
// Persistência: localStorage (chave "mr-factory:backend-config").
// A EXT1 continua lendo suas próprias constantes — nada aqui é escrito nela.

export type EndpointRequirement = "required" | "optional";

export type BackendEndpointKey =
  | "validate-license-v2"
  | "get-support-info"
  | "get-templates"
  | "serve-extension-ui"
  | "lov4"
  | "storage";

export interface BackendEndpointDef {
  key: BackendEndpointKey;
  label: string;
  method: "GET" | "POST" | "HEAD";
  path: string; // relativo à API_BASE_URL
  requirement: EndpointRequirement;
  probeBody?: Record<string, unknown>;
  description: string;
}

export interface BackendConfig {
  enabled: boolean;                 // "Modo Backend Oficial"
  testMode: boolean;                // "Modo TESTE" (URL/versão editáveis)
  API_BASE_URL: string;             // ex.: https://xxx.supabase.co
  PUBLIC_API_URL: string;           // ex.: https://xxx.lovable.app (superfície pública)
  EXTENSION_ID: string;             // id da extensão Chrome
  CLIENT_VERSION: string;           // versão do cliente (EXT1)
  PRODUCT_SLUG: string;             // slug do produto no backend
  API_KEY: string;                  // supabase anon (opcional; usada nos probes)
}

export const DEFAULT_BACKEND_CONFIG: BackendConfig = {
  enabled: false,
  testMode: false,
  API_BASE_URL: "https://mrsemlimites.lovable.app/api/public/ext",
  PUBLIC_API_URL: "https://mrsemlimites.lovable.app/api/public",
  EXTENSION_ID: "metodo-quatro",
  CLIENT_VERSION: "17.0.0",
  PRODUCT_SLUG: "metodo-quatro",
  API_KEY: "metodo4",
};

const STORAGE_KEY = "mr-factory:backend-config";

export function loadBackendConfig(): BackendConfig {
  if (typeof window === "undefined") return { ...DEFAULT_BACKEND_CONFIG };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_BACKEND_CONFIG };
    return { ...DEFAULT_BACKEND_CONFIG, ...(JSON.parse(raw) as Partial<BackendConfig>) };
  } catch {
    return { ...DEFAULT_BACKEND_CONFIG };
  }
}

export function saveBackendConfig(cfg: BackendConfig): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // silencioso — a Factory nunca deve derrubar a UI por isso
  }
}

/**
 * Endpoints REAIS utilizados pela EXT1 hoje.
 * Origem: leitura direta de sidepanel.js, content/content.js e background.js.
 * A Factory NÃO cria nem altera nenhum endpoint — apenas os visita.
 */
export const OFFICIAL_ENDPOINTS: BackendEndpointDef[] = [
  {
    key: "validate-license-v2",
    label: "Validação de licença (v2)",
    method: "POST",
    path: "/functions/v1/validate-license-v2",
    requirement: "required",
    probeBody: { license_key: "__PROBE__", hwid: "probe", device_info: { platform: "probe", cores: 0 } },
    description: "sidepanel.js:140 — POST { license_key, hwid, device_info }.",
  },
  {
    key: "get-support-info",
    label: "Suporte (WhatsApp)",
    method: "GET",
    path: "/functions/v1/get-support-info",
    requirement: "optional",
    description: "sidepanel.js:207 — GET sem body.",
  },
  {
    key: "get-templates",
    label: "Templates",
    method: "GET",
    path: "/functions/v1/get-templates",
    requirement: "optional",
    description: "sidepanel.js:559 — GET com header x-session-token.",
  },
  {
    key: "serve-extension-ui",
    label: "UI remota (HTML)",
    method: "GET",
    path: "/functions/v1/serve-extension-ui",
    requirement: "required",
    description: "sidepanel.js:802 — GET ?sessionToken=&extVersion=.",
  },
  {
    key: "lov4",
    label: "Proxy universal (lov4)",
    method: "POST",
    path: "/functions/v1/lov4",
    requirement: "required",
    probeBody: { action: "ping" },
    description: "content/content.js:85 / background.js:488 — POST { action, ... }.",
  },
  {
    key: "storage",
    label: "Storage (disponibilidade)",
    method: "GET",
    path: "/storage/v1/object",
    requirement: "optional",
    description: "content/inject.js:278 — /storage/v1/object/{bucket}/{path}. Só verifica se o host responde.",
  },
];

/** Constrói a URL absoluta do endpoint a partir da BackendConfig. */
export function endpointUrl(cfg: BackendConfig, ep: BackendEndpointDef): string {
  const base = (cfg.API_BASE_URL || "").replace(/\/+$/, "");
  if (!base) return ep.path;
  let path = ep.path;
  if (ep.key === "serve-extension-ui") {
    path += `?sessionToken=__probe__&extVersion=${encodeURIComponent(cfg.CLIENT_VERSION)}`;
  }
  return base + path;
}
