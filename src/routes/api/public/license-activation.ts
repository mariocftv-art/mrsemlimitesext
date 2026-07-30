import { createFileRoute } from "@tanstack/react-router";
import {
  corsHeaders,
  jsonResponse,
  licenseFromCode,
  readBody,
} from "@/lib/ext8-license.server-shared";

/**
 * EXT8 — ativação de licença por máquina.
 * POST /api/public/license-activation { code, machine_id, user_agent }
 */
export const Route = createFileRoute("/api/public/license-activation")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        const body = await readBody(request);
        const code = String(body.code || "");
        const machineId = String(body.machine_id || "");
        const lic = licenseFromCode(code);
        if (!lic.valid) {
          return jsonResponse({ ok: false, error: "Licença inválida" });
        }
        return jsonResponse({
          ok: true,
          activated: true,
          code,
          machine_id: machineId,
          user_agent: String(body.user_agent || "chrome-ext"),
          plan: lic.plan,
          expires_at: lic.expiresAt,
          days_remaining: lic.daysRemaining,
          source: "mr-sem-limites-backend",
        });
      },
    },
  },
});
