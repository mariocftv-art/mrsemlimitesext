import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "content-type": "application/json",
};

export const Route = createFileRoute("/api/public/ext/functions/v1/validate-license-v2")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: any = {};
        try {
          body = await request.json();
        } catch {
          /* noop */
        }
        console.log("Validating key:", (body.license_key || body.code || body.license || "").trim());
        
        const key = (body.license_key || body.code || body.license || "").trim();

        if (!key) {
          return new Response(JSON.stringify({ status: "invalid", message: "Chave ausente" }), {
            status: 200,
            headers: cors,
          });
        }

        try {
          const sb = createClient(
            process.env.SUPABASE_URL || "",
            process.env.SUPABASE_SERVICE_ROLE_KEY || "",
            { auth: { persistSession: false, autoRefreshToken: false } }
          );

          const { data: lic, error } = await sb
            .from("licencas")
            .select("id, status, expira_em")
            .eq("chave", key)
            .maybeSingle();

          if (error || !lic) {
            return new Response(JSON.stringify({ status: "invalid", message: "Licença não cadastrada no servidor MR Sem Limites" }), {
              status: 200,
              headers: cors,
            });
          }

          if (lic.status !== "ativa" && lic.status !== "premium") {
             return new Response(JSON.stringify({ status: "invalid", message: `Licença com status: ${lic.status}` }), {
              status: 200,
              headers: cors,
            });
          }

          const expDate = lic.expira_em ? new Date(lic.expira_em) : new Date("2026-12-31");
          const diffTime = Math.abs(expDate.getTime() - new Date().getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          const response = {
            status: "valid",
            session_token: `mr_sess_${Math.random().toString(36).substring(7)}`,
            days_remaining: diffDays,
            message: "Licença Master Ativa - MR Sem Limites"
          };

          return new Response(JSON.stringify(response), {
            status: 200,
            headers: cors,
          });
        } catch (err) {
          console.error("Validation error:", err);
          return new Response(JSON.stringify({ 
            status: "error", 
            message: "Erro interno no servidor de validação",
            error: err instanceof Error ? err.message : String(err)
          }), {
            status: 200,
            headers: cors,
          });
        }
      },
    },
  },
});
