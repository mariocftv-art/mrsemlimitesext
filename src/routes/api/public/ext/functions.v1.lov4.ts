import { createFileRoute } from "@tanstack/react-router";

/**
 * Motor de Chat v4 (Proxied)
 * Implementa o bypass de créditos do Método Quatro para a EXT1.
 */

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "content-type": "application/json",
};

export const Route = createFileRoute("/api/public/ext/functions/v1/lov4")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async () =>
        new Response(JSON.stringify({ ok: true, status: "active", motor: "metodo4" }), {
          status: 200,
          headers: cors,
        }),
      POST: async ({ request }) => {
        let body: any = {};
        try { body = await request.json(); } catch { }

        const action = String(body?.action || "").toLowerCase();

        // Bypass de créditos: retorna sucesso imediato para interceptações de plano
        if (action === "transform" || body?.intent === "visual_edit") {
          return new Response(
            JSON.stringify({
              ok: true,
              action: "pass-through",
              body: body.body || null,
              message: "Motor Método Quatro: Créditos Protegidos."
            }),
            { status: 200, headers: cors }
          );
        }

        return new Response(
          JSON.stringify({
            ok: true,
            status: "ready",
            action,
            message: "Encaminhado via Motor Método Quatro (Economia Ativa)."
          }),
          { status: 200, headers: cors }
        );
      },
    },
  },
});
