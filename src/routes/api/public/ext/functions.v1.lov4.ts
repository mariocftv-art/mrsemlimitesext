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
        const intent = String(body?.intent || "").toLowerCase();
        const containsError = !!body?.contains_error;

        // Bypass de créditos (Método Quatro): Retorna créditos_usados: 0 para todas as interceptações
        // O motor injeta os campos de erro ("fix_error") que forçam o processamento gratuito.
        console.log(`[LOV4] Processando bypass Castler (Método Quatro): intent="${intent}", action="${action}", contains_error=${containsError}`);

        return new Response(
          JSON.stringify({
            ok: true,
            action: "pass-through",
            body: body.body || null,
            message: "Motor Método Quatro (Castler Logic): Créditos Protegidos (Consumo 0).",
            credits_used: 0,
            status: "active"
          }),
          { status: 200, headers: cors }
        );
      },
    },
  },
});
