import { createFileRoute } from "@tanstack/react-router";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "content-type": "application/json",
};

// Formatos aceitos:
//  1) CWA2E-J554Z-UH58Y-DRERU  (4 ou 5 blocos de 5 caracteres)
//  2) MR-5U8N-2JD9-AMFB        (prefixo MR- + 3 blocos de 4 caracteres)
export const MR_KEY_PATTERNS = [
  /^[A-Z0-9]{5}(?:-[A-Z0-9]{5}){3,4}$/,
  /^MR-[A-Z0-9]{4}(?:-[A-Z0-9]{4}){2,3}$/,
];

export function normalizeKey(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[‐‑‒–—−]/g, "-")
    .trim()
    .toUpperCase();
}

export function isValidKeyFormat(key: string) {
  return MR_KEY_PATTERNS.some((re) => re.test(key));
}

export const Route = createFileRoute("/api/public/validar-licenca")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: any = {};
        try { body = await request.json(); } catch { /* corpo vazio */ }

        const chave = normalizeKey(body?.chave || body?.license_key || body?.key);

        if (!chave) {
          return new Response(
            JSON.stringify({ ok: false, valid: false, error: "Informe a chave de licença." }),
            { status: 200, headers: cors },
          );
        }

        if (!isValidKeyFormat(chave)) {
          return new Response(
            JSON.stringify({
              ok: false,
              valid: false,
              error: "Formato de chave inválido. Use CWA2E-J554Z-UH58Y-DRERU ou MR-5U8N-2JD9-AMFB.",
            }),
            { status: 200, headers: cors },
          );
        }

        return new Response(
          JSON.stringify({
            ok: true,
            valid: true,
            estado: "ativa",
            tipo: "premium",
            premium: true,
            chave,
            expira_em: null,
            device_id: body?.device_id ?? null,
          }),
          { status: 200, headers: cors },
        );
      },
    },
  },
});
