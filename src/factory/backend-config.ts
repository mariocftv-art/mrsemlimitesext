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
  EXTENSION_ID: "mr-sem-limites",
  CLIENT_VERSION: "2.2.7",
  PRODUCT_SLUG: "mr-sem-limites",
  API_KEY: "mrlov",
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
 * Endpoints oficiais conhecidos (contrato canônico documentado em
 * docs/API_CONTRACTS.md da EXT1). A Factory NÃO cria nenhum endpoint.
 */
export const OFFICIAL_ENDPOINTS: BackendEndpointDef[] = [
  {
    key: "validate",
    label: "Validação de licença",
    method: "POST",
    path: "/functions/v1/validate-license",
    requirement: "required",
    probeBody: { license_key: "PROBE-0000", hwid: "probe", product_slug: "__probe__" },
    description: "Retorna status da licença. Obrigatório para a EXT1 funcionar.",
  },
  {
    key: "heartbeat",
    label: "Heartbeat de sessão",
    method: "POST",
    path: "/functions/v1/heartbeat",
    requirement: "optional",
    probeBody: { session_token: "__probe__", hwid: "probe" },
    description: "Marca a sessão como viva. Opcional.",
  },
  {
    key: "config",
    label: "Injeção de configuração",
    method: "GET",
    path: "/functions/v1/inject-config",
    requirement: "optional",
    description: "Feature flags e limites remotos. Opcional.",
  },
  {
    key: "download",
    label: "Download do pacote",
    method: "GET",
    path: "/functions/v1/download-latest",
    requirement: "optional",
    description: "Retorna URL do ZIP mais recente. Opcional.",
  },
  {
    key: "update",
    label: "Verificação de versão",
    method: "GET",
    path: "/functions/v1/version",
    requirement: "optional",
    description: "Retorna versão atual publicada. Opcional.",
  },
];

/** Constrói a URL absoluta do endpoint a partir da BackendConfig. */
export function endpointUrl(cfg: BackendConfig, ep: BackendEndpointDef): string {
  const base = (cfg.API_BASE_URL || "").replace(/\/+$/, "");
  if (!base) return ep.path;
  let path = ep.path;
  if (ep.key === "update" && cfg.PRODUCT_SLUG) {
    path += `?product=${encodeURIComponent(cfg.PRODUCT_SLUG)}`;
  }
  if (ep.key === "download" && cfg.PRODUCT_SLUG) {
    path += `?product=${encodeURIComponent(cfg.PRODUCT_SLUG)}`;
  }
  return base + path;
}
