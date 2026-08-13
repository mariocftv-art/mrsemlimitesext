import { createFileRoute } from "@tanstack/react-router";
import { createHmac } from "crypto";

/**
 * Compat: /functions/v1/validate-license-v2 — usado pelo sidepanel.
 * Agora integrado com a Reseller API externa do MR Sem Limite.
 */
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "content-type": "application/json",
};

const API_BASE = "https://dwpuqewnfibeldegvimp.supabase.co/functions/v1/reseller-api";

function signSessionToken(licencaId: string, hwid: string | null): string {
  const secret = process.env.EXT_SESSION_SECRET ?? "mr-sem-limites-v17-secret";
  const payload = `${licencaId}.${hwid ?? ""}.${Date.now()}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex").slice(0, 32);
  return Buffer.from(payload).toString("base64url") + "." + sig;
}

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
        
        const key = String(body?.license_key ?? "").trim();
        const hwid = body?.hwid ? String(body.hwid).trim() : null;
        
        console.log("[v2-Validate] Validando chave:", key);

        if (!key) {
          return new Response(
            JSON.stringify({ status: "invalid", message: "Licença ausente" }),
            { status: 200, headers: cors }
          );
        }

        const apiKey = process.env.RESELLER_API_KEY;
        
        // Se não houver chave de API configurada, permitimos acesso de teste APENAS se for chave de teste hardcoded
        if (!apiKey) {
          console.warn("RESELLER_API_KEY não configurada.");
          if (key.includes("XXXXX") || key.startsWith("PZT68") || key.startsWith("YEMNP")) {
             return new Response(
              JSON.stringify({
                status: "valid",
                session_token: signSessionToken("test-id", hwid),
                days_remaining: 365,
                hours_remaining: 8760,
                license_id: "test-id",
                plan: "premium",
                message: "Modo Teste/Bypass"
              }),
              { status: 200, headers: cors }
            );
          }
        }

        try {
          // Consultar a Reseller API externa
          // Importante: A API /v1/licenses retorna todas as licenças do revendedor.
          // Filtramos localmente para encontrar a do usuário.
          const res = await fetch(`${API_BASE}/v1/licenses`, {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            }
          });

          if (!res.ok) {
            console.error(`Reseller API Error: ${res.status}`);
            throw new Error(`API Reseller retornou status ${res.status}`);
          }

          const data = await res.json();
          const licenses = Array.isArray(data) ? data : (data.licenses || []);
          
          // Busca exata ou sem hifens
          const cleanInputKey = key.replace(/-/g, "").toUpperCase();
          const lic = licenses.find((l: any) => {
            const lKey = String(l.license_key || "").toUpperCase();
            return lKey === key.toUpperCase() || lKey.replace(/-/g, "") === cleanInputKey;
          });

          if (!lic) {
            console.log("[v2-Validate] Chave não encontrada na lista da API");
            return new Response(
              JSON.stringify({ status: "invalid", message: "Licença não encontrada no servidor MR Sem Limite" }),
              { status: 200, headers: cors }
            );
          }

          // Verificar status na API externa
          // A API reseller costuma usar 'active' ou 'ativa'
          if (lic.status !== "active" && lic.status !== "ativa") {
            return new Response(
              JSON.stringify({ status: "invalid", message: `Licença com status: ${lic.status}` }),
              { status: 200, headers: cors }
            );
          }

          console.log("[v2-Validate] Licença VÁLIDA na API externa para:", lic.email);

          // Resposta de sucesso compatível com o sidepanel v17.7.0
          return new Response(
            JSON.stringify({
              status: "valid",
              session_token: signSessionToken(lic.id, hwid),
              days_remaining: lic.days_remaining ?? 30,
              hours_remaining: (lic.days_remaining ?? 30) * 24,
              license_id: lic.id,
              plan: "premium",
              expires_at: lic.expires_at || lic.created_at,
              cliente_nome: lic.name || lic.email?.split('@')[0] || "Cliente MR",
              cliente_email: lic.email
            }),
            { status: 200, headers: cors }
          );
        } catch (err) {
          console.error("Erro crítico na validação Reseller API:", err);
          return new Response(
            JSON.stringify({ status: "error", message: "Erro de conexão com o banco de dados MR Sem Limite" }),
            { status: 200, headers: cors }
          );
        }
      },
    },
  },
});
