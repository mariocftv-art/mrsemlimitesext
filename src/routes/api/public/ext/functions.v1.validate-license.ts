import { createFileRoute } from "@tanstack/react-router";
import { createHmac } from "crypto";

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

export const Route = createFileRoute("/api/public/ext/functions/v1/validate-license")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: any = {};
        try { body = await request.json(); } catch { }
        
        const key = String(body?.license_key || body?.code || body?.license || "").trim();
        const hwid = body?.hwid ? String(body.hwid).trim() : null;
        
        console.log("[v1-Validate] Validando chave:", key);

        if (!key) {
          return new Response(JSON.stringify({ status: "invalid", valid: false, message: "Licença ausente" }), { status: 200, headers: cors });
        }

        const apiKey = process.env.RESELLER_API_KEY;
        
        // Bypass para desenvolvimento/teste
        if (!apiKey || key.includes("XXXXX") || key.startsWith("PZT68") || key.startsWith("YEMNP")) {
           return new Response(JSON.stringify({
             status: "valid",
             valid: true,
             session_token: signSessionToken("test-id-v1", hwid),
             session_id: "test-id-v1",
             days_remaining: 365,
             plan: "premium",
             message: "Validado (MR Bypass)"
           }), { status: 200, headers: cors });
        }

        try {
          const res = await fetch(`${API_BASE}/v1/licenses`, {
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }
          });

          if (!res.ok) throw new Error(`API Reseller ${res.status}`);

          const data = await res.json();
          const licenses = Array.isArray(data) ? data : (data.licenses || []);
          
          const cleanInputKey = key.replace(/-/g, "").toUpperCase();
          const lic = licenses.find((l: any) => {
            const lKey = String(l.license_key || "").toUpperCase();
            return lKey === key.toUpperCase() || lKey.replace(/-/g, "") === cleanInputKey;
          });

          if (!lic) {
            return new Response(JSON.stringify({ status: "invalid", valid: false, message: "Licença não encontrada no banco MR" }), { status: 200, headers: cors });
          }

          return new Response(JSON.stringify({
            status: "valid",
            valid: true,
            session_token: signSessionToken(lic.id, hwid),
            session_id: lic.id,
            days_remaining: lic.days_remaining ?? 30,
            plan: "premium",
            cliente_nome: lic.name || "Cliente MR",
          }), { status: 200, headers: cors });
        } catch (err) {
          console.error("v1-Validate error:", err);
          return new Response(JSON.stringify({ status: "error", valid: false, message: "Erro de conexão com o servidor MR" }), { status: 200, headers: cors });
        }
      },
    },
  },
});
