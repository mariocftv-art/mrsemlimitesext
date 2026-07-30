import { createFileRoute } from "@tanstack/react-router";
import {
  corsHeaders,
  jsonResponse,
  licenseFromCode,
  readBody,
} from "@/lib/ext8-license.server-shared";

/**
 * EXT8 — validação de licença.
 * GET  /api/public/validate-license?code=XXXX  -> { valid, expires_at, days_remaining }
 * POST /api/public/validate-license { code, machine_id } -> { ok, valid, ... }
 *
 * Modo aditivo (passthrough): sem tabela de licenças ativa, o backend
 * responde válido para não quebrar a extensão, exatamente como as rotas
 * de segurança já existentes das demais extensões.
 */
export const Route = createFileRoute("/api/public/validate-license")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code") || "";
        const lic = licenseFromCode(code);
        return jsonResponse({
          ok: lic.valid,
          valid: lic.valid,
          code,
          plan: lic.plan,
          expires_at: lic.expiresAt,
          days_remaining: lic.daysRemaining,
          source: "mr-sem-limites-backend",
        });
      },
      POST: async ({ request }) => {
        const body = await readBody(request);
        const code = String(body.code || "");
        const machineId = String(body.machine_id || "");
        const lic = licenseFromCode(code);
        return jsonResponse({
          ok: lic.valid,
          valid: lic.valid,
          code,
          machine_id: machineId,
          plan: lic.plan,
          status: lic.valid ? "active" : "invalid",
          expires_at: lic.expiresAt,
          days_remaining: lic.daysRemaining,
          error: lic.valid ? undefined : "Licença inválida",
          source: "mr-sem-limites-backend",
        });
      },
    },
  },
});
