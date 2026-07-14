// Probe HTTP dos endpoints do Backend Oficial.
// Roda no servidor para evitar CORS. NÃO cria nem modifica endpoints —
// apenas os visita para reportar status / latência.

import { createServerFn } from "@tanstack/react-start";

export type ProbeResult = {
  key: string;
  label: string;
  requirement: "required" | "optional";
  url: string;
  method: string;
  status: number | null;   // HTTP status ou null (falha de rede)
  ok: boolean;             // 2xx
  responded: boolean;      // qualquer resposta HTTP (mesmo 4xx/5xx)
  ms: number;
  error?: string;
  bodyPreview?: string;
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
    const results = await Promise.all(
      data.endpoints.map((ep) => probeOne(ep, data)),
    );
    return results;
  });

async function probeOne(
  ep: ProbeInput["endpoints"][number],
  ctx: ProbeInput,
): Promise<ProbeResult> {
  const t0 = Date.now();
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-client-version": ctx.clientVersion ?? "",
    "x-extension-id": ctx.extensionId ?? "",
  };
  if (ctx.apiKey) {
    headers.apikey = ctx.apiKey;
    headers.authorization = `Bearer ${ctx.apiKey}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const method = ep.method.toUpperCase();
    const init: RequestInit = { method, headers, signal: controller.signal };
    if (method !== "GET" && method !== "HEAD") {
      init.body = JSON.stringify(ep.body ?? {});
    }
    const res = await fetch(ep.url, init);
    const ms = Date.now() - t0;
    let preview: string | undefined;
    try {
      const text = await res.text();
      preview = text.length > 240 ? text.slice(0, 240) + "…" : text;
    } catch {
      preview = undefined;
    }
    return {
      key: ep.key,
      label: ep.label,
      requirement: ep.requirement,
      url: ep.url,
      method,
      status: res.status,
      ok: res.ok,
      responded: true,
      ms,
      bodyPreview: preview,
    };
  } catch (e) {
    const ms = Date.now() - t0;
    const err = e as Error;
    return {
      key: ep.key,
      label: ep.label,
      requirement: ep.requirement,
      url: ep.url,
      method: ep.method,
      status: null,
      ok: false,
      responded: false,
      ms,
      error: err.name === "AbortError" ? "Timeout (8s)" : err.message,
    };
  } finally {
    clearTimeout(timer);
  }
}
