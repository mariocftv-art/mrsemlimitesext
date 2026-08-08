import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "content-type": "application/json",
};

export const Route = createFileRoute("/api/public/ext/validate-license")({
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
        
        const key = body.license_key || body.code || body.license;

        if (!key) {
          return new Response(JSON.stringify({ status: "invalid", message: "Chave ausente" }), {
            status: 200,
            headers: cors,
          });
        }

        const sb = createClient(
          process.env.SUPABASE_URL ?? "",
          process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
          { auth: { persistSession: false, autoRefreshToken: false } }
        );

        const { data: lic, error } = await sb
          .from("licencas")
          .select("id, status, expira_em")
          .eq("chave", key)
          .maybeSingle();

        if (error || !lic) {
          return new Response(JSON.stringify({ status: "invalid", message: "Licença não cadastrada no banco MR Sem Limite" }), {
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

        const response = {
          status: "valid",
          message: "Licença ativa (Banco MR Sem Limite)",
          expiry: lic.expira_em || "2026-12-31"
        };

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: cors,
        });
      },
    },
  },
});
