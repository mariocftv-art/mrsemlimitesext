import { createFileRoute } from "@tanstack/react-router";

/**
 * EXT8 — chat de IA (streaming SSE compatível com OpenAI).
 * POST /api/public/qyron-ai-chat { model, messages }
 * Header opcional: X-Qyron-License
 *
 * Roda no Lovable AI Gateway do backend MR Sem Limites.
 * Isolado: nenhuma outra extensão consome esta rota.
 */

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Qyron-License",
  "Access-Control-Max-Age": "86400",
};

const ALLOWED = new Set([
  "google/gemini-3.5-flash",
  "google/gemini-3.1-pro-preview",
  "openai/gpt-5.5",
]);
const DEFAULT_MODEL = "google/gemini-3.5-flash";

const SYSTEM = `Você é a IA da MR Sem Limites (EXT8). Responda sempre em português do Brasil, de forma direta, técnica e objetiva. Ajude o usuário a planejar e escrever prompts e código para o Lovable.`;

type Msg = { role: string; content: string };

function errStream(message: string): Response {
  const body =
    `data: ${JSON.stringify({ choices: [{ delta: { content: message } }] })}\n\n` +
    "data: [DONE]\n\n";
  return new Response(body, {
    status: 200,
    headers: { ...CORS, "Content-Type": "text/event-stream", "Cache-Control": "no-store" },
  });
}

export const Route = createFileRoute("/api/public/qyron-ai-chat")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return errStream("⚠️ Backend MR sem chave de IA configurada.");

        let payload: { model?: string; messages?: Msg[] } = {};
        try {
          payload = (await request.json()) as typeof payload;
        } catch {
          return errStream("⚠️ Requisição inválida.");
        }

        const model = ALLOWED.has(String(payload.model)) ? String(payload.model) : DEFAULT_MODEL;
        const incoming = Array.isArray(payload.messages) ? payload.messages.slice(-10) : [];
        const messages = [
          { role: "system", content: SYSTEM },
          ...incoming
            .filter((m) => m && typeof m.content === "string" && m.content.trim())
            .map((m) => ({
              role: m.role === "assistant" ? "assistant" : m.role === "system" ? "system" : "user",
              content: String(m.content),
            })),
        ];

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
          body: JSON.stringify({ model, messages, stream: true }),
        }).catch(() => null);

        if (!upstream || !upstream.ok || !upstream.body) {
          const status = upstream?.status ?? 0;
          if (status === 429) return errStream("⚠️ Limite de uso atingido. Tente novamente em instantes.");
          if (status === 402) return errStream("⚠️ Créditos de IA esgotados no workspace.");
          return errStream("⚠️ Falha temporária no motor de IA. Tente novamente.");
        }

        return new Response(upstream.body, {
          status: 200,
          headers: {
            ...CORS,
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-store",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});
