import { createFileRoute } from "@tanstack/react-router";

// Mantido apenas como rota desativada para não expor um endpoint público de IA.
// A Orbe conversa pelo chat Lovable aberto na aba ativa da extensão.

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
      POST: async () =>
        Response.json(
          { ok: false, error: "Endpoint desativado. A Orbe usa o chat Lovable da aba ativa." },
          { status: 410, headers: CORS_HEADERS },
        ),
    },
  },
});
