import { createFileRoute } from "@tanstack/react-router";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "content-type": "application/json",
};

export const Route = createFileRoute("/api/public/ext/license-heartbeat")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: any = {};
        try { body = await request.json(); } catch { }
        
        console.log("[Heartbeat] Recebido:", body.license_key || body.code);

        // Retorna sucesso total para manter a sessão da QYRON ativa
        return new Response(
          JSON.stringify({ 
            valid: true, 
            status: "active", 
            message: "Sessão MR SEM LIMITES Renovada",
            session_id: body.session_id
          }),
          { status: 200, headers: cors }
        );
      },
    },
  },
});