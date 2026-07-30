import { createFileRoute } from "@tanstack/react-router";
import {
  corsHeaders,
  jsonResponse,
  licenseFromCode,
  readBody,
} from "@/lib/ext8-license.server-shared";

/**
 * EXT8 — heartbeat de sessão (mantém a licença marcada como em uso).
 * POST /api/public/license-heartbeat { code, machine_id }
 */
export const Route = createFileRoute("/api/public/license-heartbeat")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        const body = await readBody(request);
        const code = String(body.code || "");
        const lic = licenseFromCode(code);
        return jsonResponse({
          ok: lic.valid,
          valid: lic.valid,
          status: lic.valid ? "active" : "invalid",
          machine_id: String(body.machine_id || ""),
          expires_at: lic.expiresAt,
          days_remaining: lic.daysRemaining,
          server_time: Date.now(),
          source: "mr-sem-limites-backend",
        });
      },
    },
  },
});
