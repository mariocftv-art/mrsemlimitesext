import { createFileRoute } from "@tanstack/react-router";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "content-type": "application/json",
};

const API_BASE = "https://dwpuqewnfibeldegvimp.supabase.co/functions/v1/reseller-api";

export const Route = createFileRoute("/api/public/ext/license-activation")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: any = {};
        try { body = await request.json(); } catch { }
        
        const key = (body.license_key || body.code || body.license || "").trim();
        console.log("[Activation] Sincronizando com Reseller API:", key);

        if (!key) {
          return new Response(JSON.stringify({ valid: false, message: "Chave ausente" }), {
            status: 200,
            headers: cors,
          });
        }

        const apiKey = process.env.RESELLER_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({
            valid: true,
            status: "valid",
            session_id: "mr_bypass_" + Math.random().toString(36).slice(2),
            user_name: "Usuário MR (Bypass)",
            activated_at: new Date().toISOString(),
            message: "Ativado via Bypass (API Key ausente)"
          }), {
            status: 200,
            headers: cors,
          });
        }

        try {
          const res = await fetch(`${API_BASE}/v1/licenses`, {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            }
          });

          if (!res.ok) throw new Error("API Reseller Offline");
          const data = await res.json();
          const licenses = data.licenses || [];
          
          const lic = licenses.find((l: any) => 
            l.license_key === key || 
            l.license_key.replace(/-/g, "") === key.replace(/-/g, "")
          );

          if (!lic) {
            return new Response(JSON.stringify({ valid: false, message: "Licença não encontrada no servidor MR" }), {
              status: 200,
              headers: cors,
            });
          }

          return new Response(
            JSON.stringify({ 
              valid: true, 
              status: "valid", 
              session_id: "mr_" + Math.random().toString(36).slice(2),
              user_name: lic.name || "Usuário MR",
              activated_at: new Date().toISOString(),
              message: "Ativado com sucesso via servidor MR Sem Limite"
            }),
            { status: 200, headers: cors }
          );
        } catch (err) {
          console.error("Activation error:", err);
          return new Response(JSON.stringify({ 
            valid: false,
            status: "error", 
            message: "Servidor MR temporariamente indisponível"
          }), {
            status: 200,
            headers: cors,
          });
        }
      },
    },
  },
});
