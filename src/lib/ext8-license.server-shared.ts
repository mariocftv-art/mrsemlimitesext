/**
 * Helpers compartilhados pelas rotas públicas da EXT8.
 * Isolado das demais extensões — nada aqui é consumido por EXT1..EXT7.
 */

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Qyron-License, X-MR-Ext",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}

export async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const raw = await request.text();
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export type LicenseInfo = {
  valid: boolean;
  plan: string;
  daysRemaining: number;
  expiresAt: string;
};

const DEFAULT_DAYS = 30;

/**
 * Deriva a validade a partir do próprio código da licença.
 * Suporta sufixo de dias no formato `-30D` / `-365D` (ex.: MR-ABC123-30D).
 * Sem sufixo, aplica o padrão de 30 dias. Código vazio = inválido.
 */
export function licenseFromCode(code: string): LicenseInfo {
  const clean = String(code || "").trim();
  if (clean.length < 4) {
    return { valid: false, plan: "none", daysRemaining: 0, expiresAt: new Date(0).toISOString() };
  }
  const match = clean.match(/-(\d{1,4})D$/i);
  const days = match ? Math.max(1, Math.min(3650, parseInt(match[1], 10))) : DEFAULT_DAYS;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return {
    valid: true,
    plan: days >= 365 ? "annual" : days >= 30 ? "standard" : "trial",
    daysRemaining: days,
    expiresAt: expires.toISOString(),
  };
}
