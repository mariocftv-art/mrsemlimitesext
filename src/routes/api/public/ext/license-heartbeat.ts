import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

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
        
        const key = body.license_key || body.code;
        console.log("[Heartbeat] Sincronizando com Banco MR:", key);

        if (!key) {
           return new Response(JSON.stringify({ valid: false, status: "error" }), { status: 200, headers: cors });
        }

        const sb = createClient(
          process.env.SUPABASE_URL ?? "",
          process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
          { auth: { persistSession: false, autoRefreshToken: false } }
        );

        const { data: lic } = await sb
          .from("licencas")
          .select("id, status")
          .eq("chave", key)
          .maybeSingle();

        if (!lic || (lic.status !== "ativa" && lic.status !== "premium")) {
          return new Response(JSON.stringify({ valid: false, status: "expired", message: "Licença inválida no banco MR" }), { status: 200, headers: cors });
        }

        return new Response(
          JSON.stringify({ 
            valid: true, 
            status: "active", 
            message: "Sessão Renovada (Banco MR)",
            session_id: body.session_id
          }),
          { status: 200, headers: cors }
        );
      },
    },
  },
});