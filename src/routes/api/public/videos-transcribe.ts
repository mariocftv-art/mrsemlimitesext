import { createFileRoute } from "@tanstack/react-router";

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export const Route = createFileRoute("/api/public/videos-transcribe")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        try {
          const key = process.env.LOVABLE_API_KEY;
          if (!key) throw new Error("LOVABLE_API_KEY ausente");

          const inForm = await request.formData();
          const file = inForm.get("file");
          if (!(file instanceof File)) {
            return Response.json({ ok: false, error: "file ausente" }, { status: 400, headers: CORS });
          }
          if (file.size > 24 * 1024 * 1024) {
            return Response.json(
              { ok: false, error: "Arquivo muito grande (limite 24MB para Whisper). Extraia o áudio ou envie um trecho menor." },
              { status: 413, headers: CORS },
            );
          }

          const outForm = new FormData();
          outForm.append("file", file, file.name || "audio.webm");
          outForm.append("model", String(inForm.get("model") || "openai/gpt-4o-mini-transcribe"));
          const language = inForm.get("language");
          if (language) outForm.append("language", String(language));

          const r = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}` },
            body: outForm,
          });

          const text = await r.text();
          if (!r.ok) {
            return Response.json(
              { ok: false, error: `STT ${r.status}: ${text.slice(0, 300)}` },
              { status: r.status === 429 || r.status === 402 ? r.status : 500, headers: CORS },
            );
          }
          let json: any = {};
          try { json = JSON.parse(text); } catch { json = { text }; }
          return Response.json({ ok: true, text: json.text ?? "", raw: json }, { headers: CORS });
        } catch (e: any) {
          return Response.json({ ok: false, error: String(e?.message || e) }, { status: 500, headers: CORS });
        }
      },
    },
  },
});
