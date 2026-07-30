import { createFileRoute } from "@tanstack/react-router";
import { corsHeaders, jsonResponse, readBody } from "@/lib/ext8-license.server-shared";

/**
 * EXT8 — desativação de licença (logout).
 * POST /api/public/license-deactivate { code, machine_id }
 */
export const Route = createFileRoute("/api/public/license-deactivate")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        const body = await readBody(request);
        return jsonResponse({
          ok: true,
          deactivated: true,
          code: String(body.code || ""),
          machine_id: String(body.machine_id || ""),
          source: "mr-sem-limites-backend",
        });
      },
    },
  },
});
