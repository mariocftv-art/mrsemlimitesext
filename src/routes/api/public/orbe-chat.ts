import { createFileRoute } from "@tanstack/react-router";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

type Msg = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_CONVERSA = `Você é a IA MR — uma consultora especialista brasileira que conversa com o usuário para planejar projetos no Lovable.
Regras:
- Responda SEMPRE em português do Brasil, natural e objetiva (2 a 5 frases).
- Nunca use listas gigantes nem markdown pesado — fale como num diálogo por voz.
- Faça perguntas curtas quando faltar informação; sugira ideias concretas (cores, layout, seções, funcionalidades).
- Você NÃO executa nada no Lovable ainda. Só planeja. O envio final só acontece quando o usuário disser "pode enviar", "pode fazer" ou "manda o prompt".
- Nunca se apresente novamente durante a mesma conversa.`;

const SYSTEM_PROMPT_FINAL = `Você é a IA MR. Com base no histórico de conversa, gere UM único prompt final, objetivo e completo, em português, pronto para colar no chat do Lovable e executar a tarefa combinada.
Regras:
- Retorne SOMENTE o texto do prompt (sem aspas, sem "Prompt:", sem explicação).
- Seja específico: descreva telas, componentes, cores, comportamento, dados, integrações — tudo que foi conversado.
- Não invente requisitos que o usuário não pediu. Não quebre nada existente.
- Máximo 12 linhas.`;

const ALLOWED_MODELS = new Set([
  "openai/gpt-5.5",
  "google/gemini-3.1-pro-preview",
  "google/gemini-3.5-flash",
]);
const DEFAULT_MODEL = "openai/gpt-5.5";

async function callGateway(messages: Msg[], model: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY ausente");
  const useModel = ALLOWED_MODELS.has(model) ? model : DEFAULT_MODEL;
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({ model: useModel, messages }),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    // Fallback automático se o modelo primário falhar (ex: 400/429) — tenta o Gemini.
    if (useModel !== "google/gemini-3.1-pro-preview") {
      const r2 = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model: "google/gemini-3.1-pro-preview", messages }),
      });
      if (r2.ok) {
        const j2 = await r2.json();
        return String(j2?.choices?.[0]?.message?.content || "").trim();
      }
    }
    throw new Error(`Gateway ${r.status}: ${t.slice(0, 300)}`);
  }
  const j = await r.json();
  return String(j?.choices?.[0]?.message?.content || "").trim();
}

export const Route = createFileRoute("/api/public/orbe-chat")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: CORS_HEADERS }),
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const mode = body?.mode === "final" ? "final" : "chat";
          const history: Msg[] = Array.isArray(body?.messages)
            ? body.messages
                .filter((m: any) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
                .slice(-20)
                .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 4000) }))
            : [];
          if (!history.length) {
            return Response.json({ ok: false, error: "messages vazio" }, { status: 400, headers: CORS_HEADERS });
          }
          const system = mode === "final" ? SYSTEM_PROMPT_FINAL : SYSTEM_CONVERSA;
          const model = typeof body?.model === "string" ? body.model : DEFAULT_MODEL;
          const reply = await callGateway([{ role: "system", content: system }, ...history], model);
          return Response.json({ ok: true, reply }, { headers: CORS_HEADERS });
        } catch (e: any) {
          return Response.json(
            { ok: false, error: String(e?.message || e) },
            { status: 500, headers: CORS_HEADERS },
          );
        }
      },
    },
  },
});
