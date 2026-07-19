import { createFileRoute } from "@tanstack/react-router";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export const Route = createFileRoute("/api/public/orbe-tts")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: CORS_HEADERS }),
      POST: async ({ request }) => {
        try {
          const key = process.env.LOVABLE_API_KEY;
          if (!key) throw new Error("LOVABLE_API_KEY ausente");
          const body = await request.json().catch(() => ({}));
          const text = String(body?.text || "").slice(0, 3000).trim();
          if (!text) {
            return Response.json({ ok: false, error: "text vazio" }, { status: 400, headers: CORS_HEADERS });
          }
          const voice = String(body?.voice || "onyx"); // onyx = masculina grave
          const r = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini-tts",
              input: text,
              voice,
              response_format: "mp3",
              instructions: "Fale em português do Brasil, tom natural, próximo e amigável, ritmo moderado.",
            }),
          });
          if (!r.ok) {
            const t = await r.text().catch(() => "");
            return Response.json({ ok: false, error: `TTS ${r.status}: ${t.slice(0, 200)}` }, { status: 500, headers: CORS_HEADERS });
          }
          const buf = await r.arrayBuffer();
          return new Response(buf, {
            headers: {
              ...CORS_HEADERS,
              "Content-Type": "audio/mpeg",
              "Cache-Control": "no-store",
            },
          });
        } catch (e: any) {
          return Response.json({ ok: false, error: String(e?.message || e) }, { status: 500, headers: CORS_HEADERS });
        }
      },
    },
  },
});
