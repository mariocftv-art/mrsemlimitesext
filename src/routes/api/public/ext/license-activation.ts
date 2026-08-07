import { createFileRoute } from "@tanstack/react-router";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "content-type": "application/json",
};

export const Route = createFileRoute("/api/public/ext/license-activation")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: any = {};
        try { body = await request.json(); } catch { }
        
        const key = body.license_key || body.code;
        console.log("[Activation] Ativando chave QYRON (v7.1.0):", key);

        return new Response(
          JSON.stringify({ 
            valid: true, 
            status: "valid", 
            session_id: "sq_" + Math.random().toString(36).slice(2),
            user_name: "Usuário QYRON",
            activated_at: new Date().toISOString()
          }),
          { status: 200, headers: cors }
        );
      },
    },
  },
});