import { createFileRoute } from "@tanstack/react-router";

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

const MODELS = [
  "google/gemini-3-pro-image",
  "google/gemini-2.5-flash-image",
];

async function genOne(key: string, prompt: string, size: string) {
  let lastErr = "";
  for (const model of MODELS) {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, prompt, size, n: 1 }),
    });
    if (r.ok) {
      const j: any = await r.json().catch(() => ({}));
      const item = j?.data?.[0];
      if (item?.b64_json) return `data:image/png;base64,${item.b64_json}`;
      if (item?.url) return item.url;
      lastErr = "resposta sem imagem";
      continue;
    }
    const t = await r.text().catch(() => "");
    lastErr = `${model} ${r.status}: ${t.slice(0, 160)}`;
    if (r.status === 402 || r.status === 429) {
      // fallback pra Pollinations quando gateway esgotou / limitou
      const seed = Math.floor(Math.random() * 1e9);
      const u = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;
      return u;
    }
  }
  throw new Error(lastErr || "falha ao gerar imagem");
}

export const Route = createFileRoute("/api/public/videos-keyframes")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        try {
          const key = process.env.LOVABLE_API_KEY;
          if (!key) throw new Error("LOVABLE_API_KEY ausente");
          const body = await request.json().catch(() => ({}));
          const prompt = String(body?.prompt || "").slice(0, 800).trim();
          if (!prompt) return Response.json({ ok: false, error: "prompt vazio" }, { status: 400, headers: CORS });
          const frames = Math.min(8, Math.max(2, Number(body?.frames) || 5));
          const aspect = String(body?.aspect || "16:9");
          const size = aspect === "9:16" ? "1024x1792" : aspect === "1:1" ? "1024x1024" : "1792x1024";

          // Prompts variados para dar sensação de progressão
          const shots = [
            "wide establishing shot, cinematic lighting",
            "medium shot, dynamic angle",
            "close-up detail, dramatic focus",
            "low angle hero shot, volumetric light",
            "high angle overview, depth of field",
            "over-the-shoulder perspective",
            "tracking shot, motion blur trail",
            "final resolution shot, golden hour",
          ];

          const tasks = Array.from({ length: frames }, (_, i) => {
            const shot = shots[i % shots.length];
            const p = `${prompt}. Cinematic frame ${i + 1}/${frames}, ${shot}, ultra detailed, film grain, 35mm, professional color grading.`;
            return genOne(key, p, size);
          });
          const settled = await Promise.allSettled(tasks);
          const images = settled
            .filter((s): s is PromiseFulfilledResult<string> => s.status === "fulfilled")
            .map((s) => s.value);
          if (images.length === 0) {
            const err = settled.find((s) => s.status === "rejected") as PromiseRejectedResult | undefined;
            throw new Error(err?.reason?.message || "todas as gerações falharam");
          }
          return Response.json({ ok: true, images, aspect }, { headers: CORS });
        } catch (e: any) {
          return Response.json({ ok: false, error: String(e?.message || e) }, { status: 500, headers: CORS });
        }
      },
    },
  },
});
