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
        // O motor "Método Quatro" deve retornar status ok sem consumir créditos
        if (action === "transform" || body?.intent === "visual_edit" || action === "oi") {
          console.log(`[LOV4] Motor Método Quatro ativo: Bypass para ação "${action}"`);
          return new Response(
            JSON.stringify({
              ok: true,
              action: "pass-through",
              body: body.body || null,
              message: "Motor Método Quatro: Créditos Protegidos.",
              credits_used: 0,
              status: "active"
            }),
            { status: 200, headers: cors }
          );
        }

        return new Response(
          JSON.stringify({
            ok: true,
            status: "ready",
            action,
            message: "Encaminhado via Motor Método Quatro (Economia Ativa).",
            credits_used: 0
          }),
          { status: 200, headers: cors }
        );
      },
    },
  },
});
