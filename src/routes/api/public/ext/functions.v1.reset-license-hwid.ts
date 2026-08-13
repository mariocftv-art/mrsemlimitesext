import { createFileRoute } from "@tanstack/react-router";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "content-type": "application/json",
};

const API_BASE = "https://id-preview--44455b56-b609-45e7-8e53-9fd580b3ca9f.lovable.app/api/public/ext/proxy/reseller-api";

export const Route = createFileRoute("/api/public/ext/functions/v1/reset-license-hwid")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: any = {};
        try { body = await request.json(); } catch { }
        
        const key = String(body?.license_key || "").trim();
        console.log("[v1-Reset-HWID] Resetando para chave:", key);

        if (!key) {
          return new Response(JSON.stringify({ ok: false, message: "Chave ausente" }), { status: 200, headers: cors });
        }

        const apiKey = process.env.RESELLER_API_KEY;
        if (!apiKey) return new Response(JSON.stringify({ ok: true, message: "Reset simulado (Bypass)" }), { status: 200, headers: cors });

        try {
          const resList = await fetch(`${API_BASE}/v1/licenses`, {
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }
          });
          const data = await resList.json();
          const licenses = Array.isArray(data) ? data : (data.licenses || []);
          
          const cleanInputKey = key.replace(/-/g, "").toUpperCase();
          const lic = licenses.find((l: any) => {
            const lKey = String(l.license_key || "").toUpperCase();
            return lKey === key.toUpperCase() || lKey.replace(/-/g, "") === cleanInputKey;
          });

          if (!lic) return new Response(JSON.stringify({ ok: false, message: "Licença não encontrada" }), { status: 200, headers: cors });

          const resReset = await fetch(`${API_BASE}/v1/licenses/${lic.id}/reset-hwid`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }
          });

          if (!resReset.ok) throw new Error("Falha no reset via API");

          return new Response(JSON.stringify({ ok: true, message: "Hardware ID resetado com sucesso no banco MR" }), { status: 200, headers: cors });
        } catch (err) {
          return new Response(JSON.stringify({ ok: false, message: "Erro ao resetar no banco MR" }), { status: 200, headers: cors });
        }
      },
    },
  },
});