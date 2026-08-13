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
        console.log("[Activation] Ativando chave no MR Sem Limite:", key);

        if (!key) {
          return new Response(JSON.stringify({ valid: false, message: "Chave ausente" }), {
            status: 200,
            headers: cors,
          });
        }

        const apiKey = process.env.RESELLER_API_KEY;
        if (!apiKey) {
          // Fallback para chaves de teste
          if (key.includes("XXXXX") || key.startsWith("PZT68")) {
            return new Response(JSON.stringify({
              valid: true,
              status: "valid",
              session_id: "mr_test_" + Math.random().toString(36).slice(2),
              user_name: "Usuário Teste",
              activated_at: new Date().toISOString(),
              message: "Ativado (Modo Teste)"
            }), { status: 200, headers: cors });
          }
        }

        try {
          const res = await fetch(`${API_BASE}/v1/licenses`, {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            }
          });

          if (!res.ok) throw new Error("Servidor de Licenças Offline");
          const data = await res.json();
          const licenses = Array.isArray(data) ? data : (data.licenses || []);
          
          const cleanInputKey = key.replace(/-/g, "").toUpperCase();
          const lic = licenses.find((l: any) => {
            const lKey = String(l.license_key || "").toUpperCase();
            return lKey === key.toUpperCase() || lKey.replace(/-/g, "") === cleanInputKey;
          });

          if (!lic) {
            return new Response(JSON.stringify({ valid: false, message: "Chave não encontrada no banco MR Sem Limite" }), {
              status: 200,
              headers: cors,
            });
          }

          return new Response(
            JSON.stringify({ 
              valid: true, 
              status: "valid", 
              session_id: "mr_" + Math.random().toString(36).slice(2),
              user_name: lic.name || lic.email?.split('@')[0] || "Cliente MR",
              activated_at: new Date().toISOString(),
              message: "Licença ativada com sucesso no banco MR Sem Limite"
            }),
            { status: 200, headers: cors }
          );
        } catch (err) {
          console.error("Activation error:", err);
          return new Response(JSON.stringify({ 
            valid: false,
            status: "error", 
            message: "Erro ao conectar com o servidor do MR Sem Limite"
          }), {
            status: 200,
            headers: cors,
          });
        }
      },
    },
  },
});
