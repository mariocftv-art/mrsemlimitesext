import { createFileRoute } from "@tanstack/react-router";
import {
  corsHeaders,
  jsonResponse,
  licenseFromCode,
  readBody,
} from "@/lib/ext8-license.server-shared";

/**
 * Endpoint Bridge para compatibilidade com extensões que usam
 * /functions/v1/validate-child-license
 */
export const Route = createFileRoute("/api/public/ext/functions/v1/validate-child-license")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        const body = await readBody(request);
        
        // Formato Child License
        const licenseKey = String(body.license_key || body.childKey || body.code || "");
        const machineId = String(body.hwid || body.device_id || body.machine_id || "");
        
        const lic = licenseFromCode(licenseKey);
        
        return jsonResponse({
          ok: lic.valid,
          valid: lic.valid,
          status: lic.valid ? "valid" : "invalid",
          session_token: `child_${Math.random().toString(36).substring(7)}`,
          session_id: `child_${Math.random().toString(36).substring(7)}`,
          customer_name: "MR Cliente Premium",
          user_name: "MR Cliente Premium",
          plan: lic.plan,
          type: lic.plan,
          expires_at: lic.expiresAt,
          days_remaining: lic.daysRemaining,
          message: lic.valid ? "Sub-licença validada" : "Sub-licença inválida",
          source: "mr-sem-limites-bridge-child",
        });
      },
    },
  },
});
