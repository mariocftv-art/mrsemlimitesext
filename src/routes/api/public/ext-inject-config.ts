import { createFileRoute } from "@tanstack/react-router";
import {
  corsHeaders,
  jsonResponse,
  licenseFromCode,
  readBody,
} from "@/lib/ext8-license.server-shared";

/**
 * EXT FINAL 7 ULTRA — banco de licenças MR Sem Limites.
 * Substitui o antigo endpoint `inject-config` da extensão original.
 *
 * POST { key, email? } -> { config, license: { plan, expires_at, bound_email } }
 */
export const Route = createFileRoute("/api/public/ext-inject-config")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        const body = await readBody(request);
        const key = String(body.key || body.code || "").trim();
        const email = body.email ? String(body.email) : null;
        const lic = licenseFromCode(key);

        if (!lic.valid) {
          return jsonResponse(
            { error: "Chave não encontrada", reason: "invalid_key" },
            403,
          );
        }

        return jsonResponse({
          ok: true,
          config: {
            enabled: true,
            source: "mr-sem-limites-backend",
            plan: lic.plan,
            features: { unlimited: true, attachments: true, turbo: true },
          },
          license: {
            key,
            plan: lic.plan,
            expires_at: lic.expiresAt,
            days_remaining: lic.daysRemaining,
            bound_email: email,
            status: "active",
          },
        });
      },
    },
  },
});
