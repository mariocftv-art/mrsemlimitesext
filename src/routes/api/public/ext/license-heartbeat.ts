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

        // Retorna sucesso total para manter a sessão da MR Sem Limites ativa
        return new Response(
          JSON.stringify({
            status: "success",
            message: "Sessão MR Sem Limites Renovada",
            session_id: body.session_id
          }),
          { status: 200, headers: cors }
        );
      },
    },
  },
});
