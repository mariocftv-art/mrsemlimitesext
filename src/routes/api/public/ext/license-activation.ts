import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

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
        
        const key = body.license_key || body.code || body.license;
        console.log("[Activation] Body recebido:", JSON.stringify(body));
        console.log("[Activation] Sincronizando com Banco MR SEM LIMITES:", key);

        if (!key) {
          return new Response(JSON.stringify({ valid: false, message: "Chave ausente" }), {
            status: 200,
            headers: cors,
          });
        }

        const sb = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { persistSession: false, autoRefreshToken: false } }
        );

        const { data: lic, error } = await sb
          .from("licencas")
          .select("id, status, expira_em")
          .eq("chave", key)
          .maybeSingle();

        if (error || !lic) {
          return new Response(JSON.stringify({ valid: false, message: "Licença não encontrada no banco oficial MR" }), {
            status: 200,
            headers: cors,
          });
        }

        return new Response(
          JSON.stringify({ 
            valid: true, 
            status: "valid", 
            session_id: "mr_" + Math.random().toString(36).slice(2),
            user_name: "Usuário MR SEM LIMITES",
            activated_at: new Date().toISOString(),
            message: "Ativado com sucesso via Banco MR Sem Limite"
          }),
          { status: 200, headers: cors }
        );
      },
    },
  },
});