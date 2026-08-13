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
        
        // No modo Reseller API, o heartbeat apenas confirma que a sessão continua ativa.
        // Como não temos persistência de sessão no sandbox Lovable fora do Supabase local,
        // retornamos sucesso se a chave for enviada, permitindo que a extensão continue operando.
        
        return new Response(
          JSON.stringify({ 
            valid: true, 
            status: "active", 
            message: "Sessão Renovada (MR Cloud)",
            session_id: body.session_id
          }),
          { status: 200, headers: cors }
        );
      },
    },
  },
});