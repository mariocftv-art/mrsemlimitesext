import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";

import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";

// Endpoint público chamado pela extensão MR Sem Limites (Orbe IA).
// Recebe o histórico da conversa + a IA escolhida no ia-picker e devolve
// a resposta gerada pelo Lovable AI Gateway em português do Brasil.

const IA_MODEL_MAP: Record<string, string> = {
  gpt5: "openai/gpt-5.5",
  sonnet: "openai/gpt-5.4",
  gempro: "google/gemini-3.1-pro-preview",
  gpt5mini: "openai/gpt-5.4-mini",
  gemflash: "google/gemini-3.5-flash",
  gemlite: "google/gemini-3.1-flash-lite",
  gpt5nano: "openai/gpt-5.4-nano",
};

const DEFAULT_MODEL = "google/gemini-3.5-flash";

const SYSTEM_PROMPT = [
  "Você é a Orbe, a assistente de voz da extensão MR Sem Limites. Você conversa por VOZ com um empreendedor brasileiro que está construindo um projeto no Lovable.",
  "",
  "REGRAS OBRIGATÓRIAS:",
  "1) RESPONDA SEMPRE 100% EM PORTUGUÊS DO BRASIL. Nunca use inglês, espanhol ou qualquer palavra estrangeira. Toda palavra tem que estar em pt-BR.",
  "2) Tom conversacional, caloroso e de especialista — como se estivesse falando ao vivo. De 2 a 4 frases (não escreva textos longos, sua fala vai ser lida em voz alta).",
  "3) Seja ÚTIL DE VERDADE: comente a ideia do usuário, dê sugestões concretas (cores, layout, formato, tecnologia), tire dúvidas técnicas, responda perguntas diretas.",
  "4) Quando o usuário perguntar se algo é possível (ex.: 'você consegue trocar a cor do painel?'), responda 'Sim, consigo!' + explique como faria + peça o detalhe que falta.",
  "5) NÃO gere código, NÃO liste arquivos, NÃO simule comandos. Você só CONVERSA — a execução no Lovable só acontece quando o usuário disser 'pode enviar'.",
  "6) NÃO mencione que você é um modelo de IA, nem cite Claude/GPT/Gemini/Lovable/ferramentas/tokens. Você é simplesmente a Orbe.",
  "7) Ao final da resposta, quando fizer sentido, lembre em português que basta ele falar 'pode enviar' quando quiser que você monte e mande o plano pro Lovable. Não repita isso em toda resposta — só quando o plano já estiver tomando forma.",
  "8) Sem emojis, sem markdown, sem listas com marcadores, sem títulos. Só texto corrido, natural, para ser falado.",
].join("\n");

type ChatMessage = { role: "user" | "assistant"; content: string };

type OrbeChatBody = {
  messages?: ChatMessage[];
  iaId?: string;
  directive?: string;
};

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export const Route = createFileRoute("/api/public/orbe-chat")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: CORS_HEADERS }),
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return Response.json(
            { ok: false, error: "LOVABLE_API_KEY ausente no servidor." },
            { status: 500, headers: CORS_HEADERS },
          );
        }

        let body: OrbeChatBody;
        try {
          body = (await request.json()) as OrbeChatBody;
        } catch {
          return Response.json(
            { ok: false, error: "JSON inválido." },
            { status: 400, headers: CORS_HEADERS },
          );
        }

        const history = Array.isArray(body.messages) ? body.messages : [];
        const cleanHistory = history
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string" &&
              m.content.trim().length > 0,
          )
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 4000) }));

        if (cleanHistory.length === 0) {
          return Response.json(
            { ok: false, error: "Nenhuma mensagem enviada." },
            { status: 400, headers: CORS_HEADERS },
          );
        }

        const model = IA_MODEL_MAP[String(body.iaId || "")] || DEFAULT_MODEL;
        const directive =
          typeof body.directive === "string" && body.directive.trim()
            ? `\n\nDIRECIONAMENTO DO USUÁRIO PARA ESTA CONVERSA: ${body.directive.trim()}`
            : "";

        try {
          const gateway = createLovableAiGatewayProvider(key, getLovableAiGatewayRunId(request));
          const result = await generateText({
            model: gateway(model),
            system: SYSTEM_PROMPT + directive,
            messages: cleanHistory,
            abortSignal: request.signal,
          });

          const reply =
            result.text?.trim() ||
            "Entendi. Me conta mais um detalhe do que você quer construir.";

          return Response.json(
            { ok: true, reply, model },
            { headers: getLovableAiGatewayResponseHeaders(result.response.headers, CORS_HEADERS) },
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const lowered = message.toLowerCase();
          const status = /rate|429/.test(lowered) ? 429 : /credit|402|billing/.test(lowered) ? 402 : 502;
          const userMsg =
            status === 429
              ? "Muitas requisições agora. Aguarde alguns segundos e tente de novo."
              : status === 402
                ? "Créditos de IA esgotados. Adicione créditos no painel do Lovable."
                : "Falha ao conectar na IA: " + message;

          return Response.json(
            {
              ok: false,
              error: userMsg,
            },
            { status, headers: CORS_HEADERS },
          );
        }
      },
    },
  },
});
