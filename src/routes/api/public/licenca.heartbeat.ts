import { createFileRoute } from "@tanstack/react-router";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "content-type": "application/json",
};

export const Route = createFileRoute("/api/public/licenca/heartbeat")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: any = {};
        try { body = await request.json(); } catch { /* corpo vazio */ }
        const chave = String(body?.chave ?? "").trim().toUpperCase();
        return new Response(
          JSON.stringify({ ok: Boolean(chave), estado: chave ? "ativa" : "inexistente", expira_em: null }),
          { status: 200, headers: cors },
        );
      },
    },
  },
});
