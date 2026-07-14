import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Info,
  Loader2,
  Maximize2,
  Minimize2,
  RefreshCcw,
  ShieldAlert,
  Terminal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getExtensionById, type ExtensionRecord } from "@/factory";

export const Route = createFileRoute("/live/$id")({
  loader: ({ params }): { ext: ExtensionRecord } => {
    const ext = getExtensionById(params.id);
    if (!ext) throw notFound();
    return { ext };
  },
  component: LivePreview,
});

// Ajuste: se o cadastro apontar para um sourceDir dentro do repo, expomos
// via link simbólico public/ext-src -> extensions/. A URL base do iframe
// resolve para /ext-src/<relPath>/.
function baseUrlFor(ext: ExtensionRecord): string {
  const relative = ext.sourceDir.replace(/^extensions\//, "");
  const parts = relative.split("/").map(encodeURIComponent).join("/");
  const base = `/ext-src/${parts}/`;
  return base;
}

type PageDef = { key: string; label: string; file: string };
const KNOWN_PAGES: PageDef[] = [
  { key: "popup", label: "Popup", file: "popup.html" },
  { key: "sidepanel", label: "Sidepanel", file: "sidepanel.html" },
  { key: "permission", label: "Permissões", file: "permission.html" },
  { key: "offscreen", label: "Offscreen", file: "offscreen.html" },
];

type IframeEvent =
  | { type: "mr-factory:call"; label: string; payload?: unknown }
  | { type: "mr-factory:unsupported"; label: string; url: string }
  | { type: "mr-factory:error"; message: string; source?: string };

type LogEntry = { id: string; ts: number; kind: "call" | "unsupported" | "error"; label: string; detail?: string };

function LivePreview() {
  const { ext } = Route.useLoaderData() as { ext: ExtensionRecord };
  const navigate = useNavigate();
  const base = useMemo(() => baseUrlFor(ext), [ext]);

  const [availability, setAvailability] = useState<Record<string, boolean | "checking">>({});
  const [tab, setTab] = useState<string>("popup");
  const [full, setFull] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  // Checa quais arquivos existem via HEAD.
  useEffect(() => {
    let cancel = false;
    KNOWN_PAGES.forEach(async (p) => {
      setAvailability((s) => ({ ...s, [p.key]: "checking" }));
      try {
        const r = await fetch(base + p.file, { method: "HEAD" });
        if (!cancel) setAvailability((s) => ({ ...s, [p.key]: r.ok }));
      } catch {
        if (!cancel) setAvailability((s) => ({ ...s, [p.key]: false }));
      }
    });
    return () => { cancel = true; };
  }, [base]);

  // Ouve mensagens do iframe (mock chrome API)
  useEffect(() => {
    const onMsg = (e: MessageEvent<IframeEvent>) => {
      const d = e.data;
      if (!d || typeof d !== "object" || !("type" in d)) return;
      if (d.type === "mr-factory:call") {
        setLogs((l) => [{ id: crypto.randomUUID(), ts: Date.now(), kind: "call", label: d.label, detail: safeJson(d.payload) }, ...l].slice(0, 300));
      } else if (d.type === "mr-factory:unsupported") {
        setLogs((l) => [{ id: crypto.randomUUID(), ts: Date.now(), kind: "unsupported", label: d.label }, ...l].slice(0, 300));
        setWarnings((w) => (w.includes(d.label) ? w : [d.label, ...w].slice(0, 8)));
      } else if (d.type === "mr-factory:error") {
        setLogs((l) => [{ id: crypto.randomUUID(), ts: Date.now(), kind: "error", label: d.message, detail: d.source }, ...l].slice(0, 300));
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const refresh = () => {
    setWarnings([]);
    setReloadKey((k) => k + 1);
    toast.success("Preview recarregado.");
  };

  const availablePages = KNOWN_PAGES.filter((p) => availability[p.key] === true);
  const unavailablePages = KNOWN_PAGES.filter((p) => availability[p.key] === false);

  // Se a aba selecionada não existe, cai na primeira disponível
  useEffect(() => {
    if (availability[tab] === false && availablePages[0]) setTab(availablePages[0].key);
  }, [availability, tab, availablePages]);

  return (
    <AppShell
      title={`Live · ${ext.name}`}
      subtitle="Renderização real da interface da extensão, com APIs do Chrome mockadas pela Factory."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refresh} className="gap-1.5">
            <RefreshCcw className="h-4 w-4" /> Recarregar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFull((f) => !f)} className="gap-1.5">
            {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {full ? "Sair" : "Tela cheia"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/extensions" })} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
        </div>
      }
    >
      <div className={`grid gap-4 ${full ? "grid-cols-1" : "lg:grid-cols-[1fr_320px]"}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200">
            <span className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Preview real com APIs do Chrome mockadas — nenhuma chamada sai para a rede da extensão.
            </span>
            <Badge variant="outline" className="border-cyan-400/40 text-cyan-200">
              iframe sandbox
            </Badge>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex-wrap bg-background/40">
              {KNOWN_PAGES.map((p) => {
                const s = availability[p.key];
                return (
                  <TabsTrigger
                    key={p.key}
                    value={p.key}
                    disabled={s === false}
                    className="gap-1.5 text-xs"
                  >
                    {p.label}
                    {s === "checking" && <Loader2 className="h-3 w-3 animate-spin" />}
                    {s === false && <span className="text-[10px] opacity-60">indisponível</span>}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {KNOWN_PAGES.map((p) => (
              <TabsContent key={p.key} value={p.key} className="mt-3">
                {availability[p.key] === true ? (
                  <IframeStage key={`${p.key}-${reloadKey}`} base={base} file={p.file} pageKey={p.key} />
                ) : (
                  <Card className="border-border/60">
                    <CardContent className="flex flex-col items-center gap-2 p-8 text-center text-sm text-muted-foreground">
                      <Info className="h-6 w-6" />
                      <p>Arquivo <code className="font-mono">{p.file}</code> não encontrado em <code className="font-mono">{base}</code>.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {warnings.length > 0 && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
              <p className="mb-1 flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Função disponível apenas na extensão instalada.
              </p>
              <ul className="ml-6 list-disc space-y-0.5">
                {warnings.map((w) => <li key={w} className="font-mono">{w}</li>)}
              </ul>
            </div>
          )}
        </div>

        {!full && (
          <SidePanel
            ext={ext}
            base={base}
            available={availablePages}
            unavailable={unavailablePages}
            logs={logs}
            clearLogs={() => setLogs([])}
          />
        )}
      </div>
    </AppShell>
  );
}

// ============================================================
// Iframe stage
// ============================================================

function IframeStage({ base, file, pageKey }: { base: string; file: string; pageKey: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: string | null = null;
    setStatus("loading");
    setError(null);

    (async () => {
      try {
        const r = await fetch(base + file);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const raw = await r.text();
        const absBase = new URL(base, window.location.origin).toString();
        const injection =
          `<base href="${absBase}">\n` +
          `<script src="/factory-chrome-mock.js"></script>\n` +
          `<style>html,body{margin:0;background:#0b0b12;color:#eee;font-family:system-ui,sans-serif;}</style>\n`;

        let patched: string;
        if (/<head[^>]*>/i.test(raw)) {
          patched = raw.replace(/<head([^>]*)>/i, (_m, attrs) => `<head${attrs}>\n${injection}`);
        } else if (/<html[^>]*>/i.test(raw)) {
          patched = raw.replace(/<html([^>]*)>/i, (_m, attrs) => `<html${attrs}><head>${injection}</head>`);
        } else {
          patched = `<!doctype html><html><head>${injection}</head><body>${raw}</body></html>`;
        }

        const blob = new Blob([patched], { type: "text/html" });
        created = URL.createObjectURL(blob);
        if (!cancelled) setBlobUrl(created);
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      if (created) URL.revokeObjectURL(created);
    };
  }, [base, file]);

  const width = pageKey === "popup" ? 380 : pageKey === "sidepanel" ? 420 : "100%";
  const height = pageKey === "popup" ? 560 : 720;

  return (
    <div className="flex items-start justify-center rounded-xl border border-border/60 bg-background/40 p-4">
      <div className="relative" style={{ width, maxWidth: "100%" }}>
        {status === "loading" && !blobUrl && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 text-xs text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando {file}…
          </div>
        )}
        {status === "error" && (
          <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-200">
            Falha ao carregar: {error}
          </div>
        )}
        {blobUrl && (
          <iframe
            ref={iframeRef}
            title={file}
            src={blobUrl}
            onLoad={() => setStatus("ready")}
            sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
            style={{
              width: "100%",
              height,
              border: "1px solid hsl(var(--border) / 0.6)",
              borderRadius: 12,
              background: "#0b0b12",
              display: "block",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// Side panel: info + logs
// ============================================================

function SidePanel({
  ext,
  base,
  available,
  unavailable,
  logs,
  clearLogs,
}: {
  ext: ExtensionRecord;
  base: string;
  available: PageDef[];
  unavailable: PageDef[];
  logs: LogEntry[];
  clearLogs: () => void;
}) {
  return (
    <Card className="glass h-fit border-border/60">
      <CardContent className="space-y-4 p-4">
        <div>
          <p className="text-sm font-semibold">{ext.name}</p>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {ext.code} · v{ext.version}
          </p>
        </div>

        <div className="rounded-lg border border-border/40 bg-background/40 p-2 text-[11px]">
          <p className="mb-1 text-muted-foreground">Base URL</p>
          <p className="break-all font-mono">{base}</p>
          <a
            href={base}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" /> abrir pasta
          </a>
        </div>

        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            Páginas disponíveis
          </p>
          <ul className="space-y-1 text-xs">
            {available.length === 0 && <li className="text-muted-foreground">Nenhuma.</li>}
            {available.map((p) => (
              <li key={p.key} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {p.file}
              </li>
            ))}
          </ul>
        </div>

        {unavailable.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              Indisponíveis
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {unavailable.map((p) => (
                <li key={p.key} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> {p.file}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              <Terminal className="mr-1 inline h-3 w-3" /> Chamadas Chrome ({logs.length})
            </p>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={clearLogs}>
              <Trash2 className="mr-1 h-3 w-3" /> limpar
            </Button>
          </div>
          <ScrollArea className="h-[280px] rounded-md border border-border/40 bg-background/60">
            {logs.length === 0 ? (
              <p className="p-3 text-[11px] text-muted-foreground">Sem chamadas.</p>
            ) : (
              <ul className="divide-y divide-border/30 text-[10.5px]">
                {logs.map((l) => (
                  <li key={l.id} className="px-2 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <Dot kind={l.kind} />
                      <span className="font-mono">{l.label}</span>
                      <span className="ml-auto text-muted-foreground">
                        {new Date(l.ts).toLocaleTimeString("pt-BR")}
                      </span>
                    </div>
                    {l.detail && (
                      <p className="mt-0.5 truncate font-mono text-muted-foreground">{l.detail}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

function Dot({ kind }: { kind: LogEntry["kind"] }) {
  const c = kind === "call" ? "bg-sky-400" : kind === "unsupported" ? "bg-amber-400" : "bg-rose-400";
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${c}`} />;
}

function safeJson(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  try {
    const s = JSON.stringify(v);
    return s && s.length > 160 ? s.slice(0, 160) + "…" : s;
  } catch {
    return String(v);
  }
}
