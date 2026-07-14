// Probe HTTP dos endpoints do Backend Oficial.
// Roda no servidor para evitar CORS. NÃO cria nem modifica endpoints —
// apenas os visita para reportar status / latência / autenticação.
//
// FASE 11: cada endpoint executa 4 sub-testes:
//   1) connection  — verifica se o host responde (HEAD/GET curto)
//   2) response    — chamada real (com apikey se houver)
//   3) timeout     — chamada com janela curta (2s) para medir SLA
//   4) auth        — chamada SEM apikey para descobrir se exige auth
//
// Nenhum teste grava nada. license_key usada é sempre "__PROBE__" — o
// backend rejeita (401/404/422) sem tocar em licenças reais.

import { createServerFn } from "@tanstack/react-start";

export type SubTestKey = "connection" | "response" | "timeout" | "auth";

export type SubTestResult = {
  test: SubTestKey;
  status: number | null;
  ok: boolean;
  responded: boolean;
  ms: number;
  error?: string;
  bodyPreview?: string; // até ~4KB
};

export type ProbeResult = {
  key: string;
  label: string;
  requirement: "required" | "optional";
  url: string;
  method: string;
  // agregado (compat c/ tela antiga)
  status: number | null;
  ok: boolean;
  responded: boolean;
  ms: number;
  error?: string;
  bodyPreview?: string;
  // FASE 11
  tests: SubTestResult[];
  authRequired: boolean | null; // true se sem-apikey deu 401/403
};

type ProbeInput = {
  endpoints: Array<{
    key: string;
    label: string;
    method: string;
    url: string;
    requirement: "required" | "optional";
    body?: Record<string, unknown>;
  }>;
  apiKey?: string;
  extensionId?: string;
  clientVersion?: string;
};

export const probeBackend = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): ProbeInput => {
    const d = data as Partial<ProbeInput>;
    if (!Array.isArray(d?.endpoints)) throw new Error("endpoints ausentes");
    for (const e of d.endpoints) {
      if (typeof e?.url !== "string" || !/^https?:\/\//i.test(e.url)) {
        throw new Error(`URL inválida em endpoint ${e?.key ?? "?"}`);
      }
    }
    return {
      endpoints: d.endpoints,
      apiKey: typeof d.apiKey === "string" ? d.apiKey : undefined,
      extensionId: typeof d.extensionId === "string" ? d.extensionId : undefined,
      clientVersion: typeof d.clientVersion === "string" ? d.clientVersion : undefined,
    };
  })
  .handler(async ({ data }): Promise<ProbeResult[]> => {
    return Promise.all(data.endpoints.map((ep) => probeOne(ep, data)));
  });

function buildHeaders(ctx: ProbeInput, withAuth: boolean): Record<string, string> {
  const h: Record<string, string> = {
    "content-type": "application/json",
    "x-client-version": ctx.clientVersion ?? "",
    "x-extension-id": ctx.extensionId ?? "",
  };
  if (withAuth && ctx.apiKey) {
    h.apikey = ctx.apiKey;
    h.authorization = `Bearer ${ctx.apiKey}`;
  }
  return h;
}

async function doFetch(
  url: string,
  method: string,
  headers: Record<string, string>,
  body: Record<string, unknown> | undefined,
  timeoutMs: number,
): Promise<SubTestResult["status"] extends never ? never : Omit<SubTestResult, "test">> {
  const t0 = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const M = method.toUpperCase();
    const init: RequestInit = { method: M, headers, signal: controller.signal };
    if (M !== "GET" && M !== "HEAD") init.body = JSON.stringify(body ?? {});
    const res = await fetch(url, init);
    const ms = Date.now() - t0;
    let preview: string | undefined;
    try {
      const text = await res.text();
      preview = text.length > 4000 ? text.slice(0, 4000) + "…" : text;
    } catch { /* ignore */ }
    return { status: res.status, ok: res.ok, responded: true, ms, bodyPreview: preview };
  } catch (e) {
    const err = e as Error;
    return {
      status: null, ok: false, responded: false, ms: Date.now() - t0,
      error: err.name === "AbortError" ? `Timeout (${timeoutMs}ms)` : err.message,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function probeOne(
  ep: ProbeInput["endpoints"][number],
  ctx: ProbeInput,
): Promise<ProbeResult> {
  // 1) Connection — HEAD (fallback GET) na URL absoluta, janela curta
  const connection: SubTestResult = {
    test: "connection",
    ...(await doFetch(ep.url, "HEAD", buildHeaders(ctx, true), undefined, 4000)),
  };
  if (!connection.responded) {
    // alguns backends bloqueiam HEAD — tentar GET curto
    const alt = await doFetch(ep.url, "GET", buildHeaders(ctx, true), undefined, 4000);
    if (alt.responded) Object.assign(connection, alt);
  }

  // 2) Response — chamada real (com body do probe, com auth)
  const response: SubTestResult = {
    test: "response",
    ...(await doFetch(ep.url, ep.method, buildHeaders(ctx, true), ep.body, 8000)),
  };

  // 3) Timeout — janela curta pra medir SLA
  const timeoutTest: SubTestResult = {
    test: "timeout",
    ...(await doFetch(ep.url, ep.method, buildHeaders(ctx, true), ep.body, 2000)),
  };

  // 4) Auth — sem apikey, pra saber se exige
  const authTest: SubTestResult = {
    test: "auth",
    ...(await doFetch(ep.url, ep.method, buildHeaders(ctx, false), ep.body, 5000)),
  };
  const authRequired =
    authTest.status === 401 || authTest.status === 403 ? true
    : authTest.responded ? false
    : null;

  return {
    key: ep.key,
    label: ep.label,
    requirement: ep.requirement,
    url: ep.url,
    method: ep.method,
    status: response.status,
    ok: response.ok,
    responded: response.responded,
    ms: response.ms,
    error: response.error,
    bodyPreview: response.bodyPreview,
    tests: [connection, response, timeoutTest, authTest],
    authRequired,
  };
}
