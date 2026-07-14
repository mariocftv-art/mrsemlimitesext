import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Boxes,
  Bug,
  Database,
  FileJson,
  Image as ImageIcon,
  Info,
  Loader2,
  RefreshCcw,
  Terminal,
  Trash2,
  Zap,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getExtensionById, type ExtensionRecord } from "@/factory";
import {
  readManifest,
  readRaw,
  scanExtension,
  type ExtensionManifest,
  type ScanResult,
} from "@/factory/ext-scanner";

export const Route = createFileRoute("/runtime/$id")({
  loader: ({ params }): { ext: ExtensionRecord } => {
    const ext = getExtensionById(params.id);
    if (!ext) throw notFound();
    return { ext };
  },
  component: RuntimeViewer,
  errorComponent: ({ error }) => (
    <AppShell title="Runtime" subtitle="Erro">
      <Card className="border-rose-500/40 bg-rose-500/10">
        <CardContent className="p-4 text-sm text-rose-200">
          {String((error as Error).message ?? error)}
        </CardContent>
      </Card>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell title="Runtime" subtitle="Extensão não encontrada">
      <p className="text-sm text-muted-foreground">
        A extensão solicitada não existe no registry.
      </p>
    </AppShell>
  ),
});

function baseUrlFor(ext: ExtensionRecord): string {
  const relative = ext.sourceDir.replace(/^extensions\//, "");
  const parts = relative.split("/").map(encodeURIComponent).join("/");
  return `/ext-src/${parts}/`;
}

type PageDef = { key: string; label: string; file: string };
const PAGES: PageDef[] = [
  { key: "popup", label: "Popup", file: "popup.html" },
  { key: "sidepanel", label: "Sidepanel", file: "sidepanel.html" },
  { key: "permission", label: "Permission", file: "permission.html" },
  { key: "offscreen", label: "Offscreen", file: "offscreen.html" },
];

type ConsoleEntry = { id: string; level: string; ts: number; args: unknown[] };
type EventEntry = { id: string; ts: number; label: string; detail?: string };
type StoreState = Record<string, Record<string, unknown>>;

function RuntimeViewer() {
  const { ext } = Route.useLoaderData() as { ext: ExtensionRecord };
  const base = useMemo(() => baseUrlFor(ext), [ext]);
  const scan = useMemo<ScanResult>(() => scanExtension(ext.sourceDir), [ext.sourceDir]);

  const [availability, setAvailability] = useState<Record<string, boolean | "checking">>({});
  const [tab, setTab] = useState<string>("popup");
  const [reloadKey, setReloadKey] = useState(0);

  const [consoleLog, setConsoleLog] = useState<ConsoleEntry[]>([]);
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [store, setStore] = useState<StoreState>({ local: {}, sync: {}, session: {}, managed: {} });
  const [errors, setErrors] = useState<string[]>([]);

  const [manifest, setManifest] = useState<ExtensionManifest | null>(null);
  const [manifestRaw, setManifestRaw] = useState<string>("");

  // HEAD probes
  useEffect(() => {
    let cancel = false;
    PAGES.forEach(async (p) => {
      setAvailability((s) => ({ ...s, [p.key]: "checking" }));
      try {
        const r = await fetch(base + p.file, { method: "HEAD" });
        if (!cancel) setAvailability((s) => ({ ...s, [p.key]: r.ok }));
      } catch {
        if (!cancel) setAvailability((s) => ({ ...s, [p.key]: false }));
      }
    });
    return () => {
      cancel = true;
    };
  }, [base]);

  // Manifest cache
  useEffect(() => {
    let cancel = false;
    (async () => {
      const m = await readManifest(ext.sourceDir);
      const raw = await readRaw(`/${ext.sourceDir}/manifest.json`);
      if (cancel) return;
      setManifest(m);
      setManifestRaw(raw ?? "");
    })();
    return () => {
      cancel = true;
    };
  }, [ext.sourceDir]);

  // Message bus
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || typeof d !== "object" || !("type" in d)) return;
      const t = d.type as string;
      if (t === "mr-runtime:console") {
        setConsoleLog((l) =>
          [{ id: crypto.randomUUID(), level: d.level, ts: d.ts, args: d.args }, ...l].slice(0, 500),
        );
        if (d.level === "error") {
          setErrors((es) => [String(d.args?.[0] ?? "error"), ...es].slice(0, 20));
        }
      } else if (t === "mr-runtime:storage") {
        setStore(d.store);
      } else if (t === "mr-factory:call") {
        setEvents((l) =>
          [{ id: crypto.randomUUID(), ts: Date.now(), label: d.label, detail: safeJson(d.payload) }, ...l].slice(0, 500),
        );
      } else if (t === "mr-factory:unsupported") {
        setEvents((l) =>
          [{ id: crypto.randomUUID(), ts: Date.now(), label: `⚠ ${d.label}` }, ...l].slice(0, 500),
        );
      } else if (t === "mr-factory:error") {
        setErrors((es) => [String(d.message), ...es].slice(0, 20));
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const refresh = () => {
    setConsoleLog([]);
    setEvents([]);
    setErrors([]);
    setReloadKey((k) => k + 1);
  };

  const backgroundFile = scan.files.find(
    (f) => f.name === "background.js" || f.name === "service-worker.js",
  );

  return (
    <AppShell
      title={`Runtime · ${ext.name}`}
      subtitle="Ambiente de inspeção e desenvolvimento — leitura direta da pasta da EXT1."
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={refresh} className="gap-1.5">
            <RefreshCcw className="h-4 w-4" /> Recarregar
          </Button>
          <Button size="sm" variant="outline" asChild className="gap-1.5">
            <Link to="/live/$id" params={{ id: ext.id }}>
              <Zap className="h-4 w-4" /> Live
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild className="gap-1.5">
            <Link to="/extensions">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-xs text-violet-200">
            <Bug className="h-4 w-4" />
            Runtime Viewer — inspecionando <code className="font-mono">{base}</code>
            <Badge variant="outline" className="ml-auto border-violet-400/40 text-violet-200">
              {scan.files.length} arquivos
            </Badge>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex-wrap bg-background/40">
              {PAGES.map((p) => (
                <TabsTrigger key={p.key} value={p.key} className="text-xs">
                  {p.label}
                  {availability[p.key] === "checking" && (
                    <Loader2 className="ml-1 h-3 w-3 animate-spin" />
                  )}
                  {availability[p.key] === false && (
                    <span className="ml-1 text-[10px] opacity-60">·</span>
                  )}
                </TabsTrigger>
              ))}
              <TabsTrigger value="background" className="text-xs">Background</TabsTrigger>
              <TabsTrigger value="manifest" className="text-xs">Manifest</TabsTrigger>
              <TabsTrigger value="assets" className="text-xs">Assets</TabsTrigger>
              <TabsTrigger value="storage" className="text-xs">Storage</TabsTrigger>
              <TabsTrigger value="console" className="text-xs">Console</TabsTrigger>
              <TabsTrigger value="events" className="text-xs">Eventos</TabsTrigger>
              <TabsTrigger value="info" className="text-xs">Informações</TabsTrigger>
            </TabsList>

            {PAGES.map((p) => (
              <TabsContent key={p.key} value={p.key} className="mt-3">
                {availability[p.key] === true ? (
                  <IframeStage
                    key={`${p.key}-${reloadKey}`}
                    base={base}
                    file={p.file}
                    pageKey={p.key}
                  />
                ) : availability[p.key] === "checking" ? (
                  <PanelMsg icon={Loader2} spin text={`Verificando ${p.file}…`} />
                ) : (
                  <PanelMsg icon={Info} text={`Arquivo não encontrado: ${p.file}`} />
                )}
              </TabsContent>
            ))}

            <TabsContent value="background" className="mt-3">
              {backgroundFile ? (
                <CodeView pathLabel={backgroundFile.path} url={backgroundFile.url} language="js" />
              ) : (
                <PanelMsg icon={Info} text="background.js / service-worker.js não encontrado" />
              )}
            </TabsContent>

            <TabsContent value="manifest" className="mt-3">
              <ManifestPanel manifest={manifest} raw={manifestRaw} />
            </TabsContent>

            <TabsContent value="assets" className="mt-3">
              <AssetsPanel scan={scan} />
            </TabsContent>

            <TabsContent value="storage" className="mt-3">
              <StoragePanel store={store} />
            </TabsContent>

            <TabsContent value="console" className="mt-3">
              <ConsolePanel entries={consoleLog} clear={() => setConsoleLog([])} />
            </TabsContent>

            <TabsContent value="events" className="mt-3">
              <EventsPanel entries={events} clear={() => setEvents([])} />
            </TabsContent>

            <TabsContent value="info" className="mt-3">
              <InfoPanel ext={ext} scan={scan} manifest={manifest} />
            </TabsContent>
          </Tabs>
        </div>

        <SidePanel
          ext={ext}
          scan={scan}
          consoleCount={consoleLog.length}
          eventsCount={events.length}
          errors={errors}
        />
      </div>
    </AppShell>
  );
}

// ============================================================
// Iframe stage (com mock estendido)
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
          `<script src="/factory-runtime-mock.js"></script>\n` +
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
// Panels
// ============================================================

function PanelMsg({
  icon: Icon,
  text,
  spin,
}: {
  icon: typeof Info;
  text: string;
  spin?: boolean;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
        <Icon className={`h-4 w-4 ${spin ? "animate-spin" : ""}`} />
        {text}
      </CardContent>
    </Card>
  );
}

const rawCache = new Map<string, string>();

function CodeView({ pathLabel, url, language }: { pathLabel: string; url: string; language: string }) {
  const [text, setText] = useState<string | null>(rawCache.get(url) ?? null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (rawCache.has(url)) return;
    let cancel = false;
    fetch(url)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((t) => {
        if (cancel) return;
        rawCache.set(url, t);
        setText(t);
      })
      .catch((e) => !cancel && setErr((e as Error).message));
    return () => {
      cancel = true;
    };
  }, [url]);
  return (
    <Card className="border-border/60">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-border/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="font-mono">{pathLabel}</span>
          <Badge variant="outline" className="border-border/40 text-[9px]">{language}</Badge>
        </div>
        {err ? (
          <p className="p-4 text-xs text-rose-300">Erro: {err}</p>
        ) : text === null ? (
          <p className="p-4 text-xs text-muted-foreground">Carregando…</p>
        ) : (
          <ScrollArea className="h-[520px]">
            <pre className="whitespace-pre p-3 font-mono text-[11px] leading-relaxed">{text}</pre>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function ManifestPanel({ manifest, raw }: { manifest: ExtensionManifest | null; raw: string }) {
  if (!manifest) {
    return <PanelMsg icon={Info} text="manifest.json não encontrado ou inválido" />;
  }
  const rows: [string, unknown][] = [
    ["name", manifest.name],
    ["version", manifest.version],
    ["manifest_version", manifest.manifest_version],
    ["description", manifest.description],
    ["permissions", manifest.permissions],
    ["host_permissions", manifest.host_permissions],
    ["action", manifest.action],
    ["background", manifest.background],
    ["content_scripts", manifest.content_scripts],
    ["side_panel", manifest.side_panel],
    ["commands", manifest.commands],
    ["icons", manifest.icons],
    ["web_accessible_resources", manifest.web_accessible_resources],
  ];
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="border-b border-border/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            Campos
          </div>
          <ScrollArea className="h-[520px]">
            <table className="w-full text-[11px]">
              <tbody>
                {rows.map(([k, v]) => (
                  <tr key={k} className="border-b border-border/20 align-top">
                    <td className="w-40 px-3 py-1.5 font-mono text-muted-foreground">{k}</td>
                    <td className="px-3 py-1.5 font-mono">
                      {v === undefined ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <pre className="whitespace-pre-wrap break-all">{JSON.stringify(v, null, 2)}</pre>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="border-b border-border/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            manifest.json (raw)
          </div>
          <ScrollArea className="h-[520px]">
            <pre className="whitespace-pre p-3 font-mono text-[11px]">{raw}</pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function AssetsPanel({ scan }: { scan: ScanResult }) {
  const groups: [string, { name: string; url: string }[]][] = [
    ["Icons", scan.assets.icons.map((f) => ({ name: f.path, url: f.url }))],
    ["Imagens", scan.assets.images.map((f) => ({ name: f.path, url: f.url }))],
    ["Sons", scan.assets.sounds.map((f) => ({ name: f.path, url: f.url }))],
    ["Fontes", scan.assets.fonts.map((f) => ({ name: f.path, url: f.url }))],
  ];
  return (
    <div className="space-y-4">
      {groups.map(([label, items]) => (
        <Card key={label} className="border-border/60">
          <CardContent className="space-y-2 p-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              <ImageIcon className="h-3 w-3" /> {label} ({items.length})
            </div>
            {items.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum arquivo.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
                {items.map((it) => (
                  <a
                    key={it.name}
                    href={it.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col items-center gap-1 rounded border border-border/40 bg-background/40 p-2 text-[10px] hover:border-primary/60"
                    title={it.name}
                  >
                    {label === "Sons" ? (
                      <audio src={it.url} controls className="w-full" />
                    ) : label === "Fontes" ? (
                      <FileJson className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <img
                        src={it.url}
                        alt=""
                        className="h-16 w-full object-contain"
                        loading="lazy"
                      />
                    )}
                    <span className="w-full truncate font-mono text-muted-foreground group-hover:text-foreground">
                      {it.name.split("/").pop()}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StoragePanel({ store }: { store: StoreState }) {
  const areas = ["local", "sync", "session", "managed"] as const;
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {areas.map((area) => {
        const data = store[area] ?? {};
        const keys = Object.keys(data);
        return (
          <Card key={area} className="border-border/60">
            <CardContent className="space-y-2 p-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <Database className="h-3 w-3" /> chrome.storage.{area} ({keys.length})
              </div>
              {keys.length === 0 ? (
                <p className="text-xs text-muted-foreground">Vazio.</p>
              ) : (
                <ScrollArea className="h-[240px]">
                  <table className="w-full text-[11px]">
                    <tbody>
                      {keys.map((k) => (
                        <tr key={k} className="border-b border-border/20 align-top">
                          <td className="w-32 px-2 py-1 font-mono text-primary">{k}</td>
                          <td className="px-2 py-1 font-mono text-muted-foreground">
                            <pre className="whitespace-pre-wrap break-all">
                              {JSON.stringify(data[k], null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ConsolePanel({ entries, clear }: { entries: ConsoleEntry[]; clear: () => void }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-border/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Terminal className="h-3 w-3" /> Console ({entries.length})
          </span>
          <Button variant="ghost" size="sm" onClick={clear} className="h-6 gap-1 px-2 text-[10px]">
            <Trash2 className="h-3 w-3" /> limpar
          </Button>
        </div>
        <ScrollArea className="h-[480px]">
          {entries.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground">Sem mensagens.</p>
          ) : (
            <ul className="divide-y divide-border/20 font-mono text-[11px]">
              {entries.map((e) => (
                <li key={e.id} className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-1 text-[9px] uppercase ${levelColor(e.level)}`}>
                      {e.level}
                    </span>
                    <span className="ml-auto text-muted-foreground">
                      {new Date(e.ts).toLocaleTimeString("pt-BR")}
                    </span>
                  </div>
                  <pre className="mt-1 whitespace-pre-wrap break-all">
                    {e.args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")}
                  </pre>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function levelColor(level: string): string {
  if (level === "error") return "bg-rose-500/20 text-rose-300";
  if (level === "warn") return "bg-amber-500/20 text-amber-300";
  if (level === "info") return "bg-sky-500/20 text-sky-300";
  return "bg-secondary text-muted-foreground";
}

function EventsPanel({ entries, clear }: { entries: EventEntry[]; clear: () => void }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-border/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3 w-3" /> Eventos Chrome ({entries.length})
          </span>
          <Button variant="ghost" size="sm" onClick={clear} className="h-6 gap-1 px-2 text-[10px]">
            <Trash2 className="h-3 w-3" /> limpar
          </Button>
        </div>
        <ScrollArea className="h-[480px]">
          {entries.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground">Nenhum evento capturado ainda.</p>
          ) : (
            <ul className="divide-y divide-border/20 font-mono text-[11px]">
              {entries.map((e) => (
                <li key={e.id} className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">{e.label}</span>
                    <span className="ml-auto text-muted-foreground">
                      {new Date(e.ts).toLocaleTimeString("pt-BR")}
                    </span>
                  </div>
                  {e.detail && <p className="mt-0.5 truncate text-muted-foreground">{e.detail}</p>}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function InfoPanel({
  ext,
  scan,
  manifest,
}: {
  ext: ExtensionRecord;
  scan: ScanResult;
  manifest: ExtensionManifest | null;
}) {
  const rows: [string, string][] = [
    ["ID", ext.id],
    ["Código", ext.code],
    ["Registry version", ext.version],
    ["Manifest version", manifest?.version ?? "—"],
    ["Manifest name", manifest?.name ?? "—"],
    ["Source dir", ext.sourceDir],
    ["Arquivos", String(scan.files.length)],
    ["Popup", scan.hasPopup ? "sim" : "não"],
    ["Sidepanel", scan.hasSidepanel ? "sim" : "não"],
    ["Background", scan.hasBackground ? "sim" : "não"],
    ["Content scripts", scan.hasContentScripts ? "sim" : "não"],
    ["Package.json", scan.hasPackageJson ? "sim" : "não"],
    ["Build script", scan.hasBuildScript ? "sim" : "não"],
  ];
  return (
    <Card className="border-border/60">
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k} className="border-b border-border/20">
                <td className="w-48 px-3 py-1.5 text-muted-foreground">{k}</td>
                <td className="px-3 py-1.5 font-mono">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function SidePanel({
  ext,
  scan,
  consoleCount,
  eventsCount,
  errors,
}: {
  ext: ExtensionRecord;
  scan: ScanResult;
  consoleCount: number;
  eventsCount: number;
  errors: string[];
}) {
  return (
    <Card className="glass h-fit border-border/60">
      <CardContent className="space-y-3 p-4 text-xs">
        <div>
          <p className="text-sm font-semibold">{ext.name}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {ext.code} · v{ext.version}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Stat icon={Boxes} label="Arquivos" value={scan.files.length} />
          <Stat icon={ImageIcon} label="Assets" value={scan.assets.icons.length + scan.assets.images.length + scan.assets.sounds.length} />
          <Stat icon={Terminal} label="Console" value={consoleCount} />
          <Stat icon={Zap} label="Eventos" value={eventsCount} />
        </div>
        {errors.length > 0 && (
          <div className="rounded border border-rose-500/40 bg-rose-500/10 p-2 text-[11px] text-rose-200">
            <p className="mb-1 font-semibold">Erros ({errors.length})</p>
            <ul className="space-y-0.5">
              {errors.slice(0, 5).map((e, i) => (
                <li key={i} className="truncate font-mono">{e}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="rounded border border-border/40 bg-background/40 p-2 text-[10px] leading-relaxed text-muted-foreground">
          Runtime é apenas visualizador. Nenhum arquivo da EXT1 é modificado. Storage é
          mockado em sessionStorage e reflete somente o que o UI da extensão gravar
          durante esta sessão.
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Info; label: string; value: number }) {
  return (
    <div className="rounded border border-border/40 bg-background/40 p-2">
      <p className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
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
