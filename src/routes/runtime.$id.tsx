import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bug,
  Chrome,
  Cloud,
  Database,
  FlaskConical,
  Globe,
  Info,
  KeyRound,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Shield,
  Tag,
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
  { key: "options", label: "Options", file: "options.html" },
];

type ConsoleEntry = { id: string; level: string; ts: number; args: unknown[] };
type EventEntry = { id: string; ts: number; label: string; detail?: string };
type StoreState = Record<string, Record<string, unknown>>;

type LicenseState =
  | "none"
  | "trial"
  | "premium"
  | "expired"
  | "revoked"
  | "hwid_mismatch";
type LovableState = "offline" | "online" | "timeout" | "slow" | "error500";
type GoogleState =
  | "page_open"
  | "page_closed"
  | "logged_in"
  | "logged_out"
  | "incompatible";
type ChromeStorageState = "empty" | "filled";
type ChromeCookiesState = "present" | "absent";
type ChromePermissionState = "granted" | "denied";
type ChromeAlarmState = "active" | "inactive";
type VersionState = "2.1.0" | "2.2.0" | "2.2.7" | "dev";

type SimState = {
  license: LicenseState;
  lovable: LovableState;
  google: GoogleState;
  storage: ChromeStorageState;
  cookies: ChromeCookiesState;
  permission: ChromePermissionState;
  alarm: ChromeAlarmState;
  version: VersionState;
};

const DEFAULT_SIM: SimState = {
  license: "none",
  lovable: "online",
  google: "page_closed",
  storage: "empty",
  cookies: "absent",
  permission: "granted",
  alarm: "inactive",
  version: "2.2.7",
};

function RuntimeViewer() {
  const { ext } = Route.useLoaderData() as { ext: ExtensionRecord };
  const base = useMemo(() => baseUrlFor(ext), [ext]);
  const scan = useMemo<ScanResult>(() => scanExtension(ext.sourceDir), [ext.sourceDir]);

  const [availability, setAvailability] = useState<Record<string, boolean | "checking">>({});
  const [tab, setTab] = useState<string>("popup");
  const [reloadKey, setReloadKey] = useState(0);

  const [sim, setSim] = useState<SimState>(DEFAULT_SIM);
  const updateSim = <K extends keyof SimState>(k: K, v: SimState[K]) => {
    setSim((s) => ({ ...s, [k]: v }));
    setReloadKey((r) => r + 1);
  };
  const resetSim = () => {
    setSim(DEFAULT_SIM);
    setConsoleLog([]);
    setEvents([]);
    setErrors([]);
    setReloadKey((r) => r + 1);
  };

  const [consoleLog, setConsoleLog] = useState<ConsoleEntry[]>([]);
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [store, setStore] = useState<StoreState>({ local: {}, sync: {}, session: {}, managed: {} });
  const [errors, setErrors] = useState<string[]>([]);

  const [manifest, setManifest] = useState<ExtensionManifest | null>(null);

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

  useEffect(() => {
    let cancel = false;
    (async () => {
      const m = await readManifest(ext.sourceDir);
      if (!cancel) setManifest(m);
    })();
    return () => {
      cancel = true;
    };
  }, [ext.sourceDir]);

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

  const visiblePages = PAGES.filter((p) => availability[p.key] !== false);

  return (
    <AppShell
      title={`Runtime · ${ext.name}`}
      subtitle="Simulação visual da extensão instalada — leitura direta da EXT1, sem alterações."
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
      <div className="grid gap-4 lg:grid-cols-[260px_1fr_340px]">
        <SimulationsPanel sim={sim} update={updateSim} reset={resetSim} />

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-xs text-violet-200">
            <Bug className="h-4 w-4" />
            Runtime simulado — cada tela abre como se a extensão estivesse instalada no Chrome.
            <SimBadges sim={sim} />
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex-wrap bg-background/40">
              {PAGES.map((p) => (
                <TabsTrigger
                  key={p.key}
                  value={p.key}
                  disabled={availability[p.key] === false}
                  className="text-xs"
                >
                  {p.label}
                  {availability[p.key] === "checking" && (
                    <Loader2 className="ml-1 h-3 w-3 animate-spin" />
                  )}
                </TabsTrigger>
              ))}
              <TabsTrigger value="manifest" className="text-xs">Manifest</TabsTrigger>
              <TabsTrigger value="storage" className="text-xs">Storage</TabsTrigger>
              <TabsTrigger value="console" className="text-xs">Console</TabsTrigger>
              <TabsTrigger value="events" className="text-xs">Eventos</TabsTrigger>
            </TabsList>

            {PAGES.map((p) => (
              <TabsContent key={p.key} value={p.key} className="mt-3">
                {availability[p.key] === true ? (
                  <ChromeFrame
                    key={`${p.key}-${reloadKey}`}
                    base={base}
                    file={p.file}
                    pageKey={p.key}
                    label={p.label}
                    sim={sim}
                  />
                ) : availability[p.key] === "checking" ? (
                  <PanelMsg icon={Loader2} spin text={`Verificando ${p.label}…`} />
                ) : (
                  <PanelMsg
                    icon={Info}
                    text={`Esta extensão não fornece a tela ${p.label}.`}
                  />
                )}
              </TabsContent>
            ))}

            <TabsContent value="manifest" className="mt-3">
              <ManifestCard manifest={manifest} base={base} />
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
          </Tabs>
        </div>

        <SidePanel
          ext={ext}
          scan={scan}
          manifest={manifest}
          pagesAvailable={visiblePages.length}
          consoleCount={consoleLog.length}
          eventsCount={events.length}
          errors={errors}
          sim={sim}
        />
      </div>
    </AppShell>
  );
}


// ============================================================
// Chrome-like frame (popup / sidepanel / permission / offscreen / options)
// ============================================================

function ChromeFrame({
  base,
  file,
  pageKey,
  label,
  sim,
}: {
  base: string;
  file: string;
  pageKey: string;
  label: string;
  sim: SimState;
}) {
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
        const simScript =
          `<script>window.__mrSim=${JSON.stringify(sim)};</script>\n` +
          `<script>${simBootstrap()}</script>\n`;
        const injection =
          `<base href="${absBase}">\n` +
          simScript +
          `<script src="/factory-chrome-mock.js"></script>\n` +
          `<script src="/factory-runtime-mock.js"></script>\n` +
          `<script>${simApplyAfterMock()}</script>\n` +
          `<style>html,body{margin:0;background:#0b0b12;color:#eee;font-family:system-ui,sans-serif;}${simBanner(sim)}</style>\n`;

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
  }, [base, file, sim]);


  // Dimensões similares às do Chrome
  const { width, height } = frameSize(pageKey);

  return (
    <div className="flex items-start justify-center rounded-xl border border-border/60 bg-[#1a1a24] p-6">
      <div style={{ width, maxWidth: "100%" }}>
        {/* Barra estilo Chrome */}
        <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-border/60 bg-[#2a2a35] px-3 py-1.5 text-[11px] text-muted-foreground">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-400/70" />
            <span className="h-2 w-2 rounded-full bg-amber-400/70" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
          </div>
          <span className="ml-2 font-mono">chrome-extension://mr-factory/{file}</span>
          <Badge variant="outline" className="ml-auto border-border/40 text-[9px]">
            {label}
          </Badge>
        </div>
        <div className="relative">
          {status === "loading" && !blobUrl && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Abrindo {label}…
            </div>
          )}
          {status === "error" && (
            <div className="rounded-b-lg border border-t-0 border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-200">
              Falha ao abrir: {error}
            </div>
          )}
          {blobUrl && (
            <iframe
              ref={iframeRef}
              title={label}
              src={blobUrl}
              onLoad={() => setStatus("ready")}
              sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
              style={{
                width: "100%",
                height,
                border: "1px solid hsl(var(--border) / 0.6)",
                borderTop: "none",
                borderRadius: "0 0 12px 12px",
                background: "#0b0b12",
                display: "block",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function frameSize(pageKey: string): { width: number | string; height: number } {
  switch (pageKey) {
    case "popup":
      return { width: 380, height: 560 };
    case "sidepanel":
      return { width: 420, height: 720 };
    case "permission":
      return { width: 560, height: 520 };
    case "offscreen":
      return { width: "100%", height: 200 };
    case "options":
      return { width: "100%", height: 720 };
    default:
      return { width: "100%", height: 640 };
  }
}

// ============================================================
// Manifest card (resumo)
// ============================================================

function ManifestCard({
  manifest,
  base,
}: {
  manifest: ExtensionManifest | null;
  base: string;
}) {
  if (!manifest) {
    return <PanelMsg icon={Info} text="Manifest indisponível." />;
  }
  const perms = manifest.permissions ?? [];
  const hostPerms = manifest.host_permissions ?? [];
  const iconEntries = Object.entries(manifest.icons ?? {}) as [string, string][];
  const bg = manifest.background as { service_worker?: string; scripts?: string[] } | undefined;
  const sw = bg?.service_worker ?? bg?.scripts?.[0] ?? "—";

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-5 p-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Nome</p>
          <p className="text-lg font-semibold">{manifest.name ?? "—"}</p>
          {manifest.description && (
            <p className="mt-1 text-xs text-muted-foreground">{manifest.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Versão" value={manifest.version ?? "—"} />
          <Field label="Manifest" value={String(manifest.manifest_version ?? "—")} />
          <Field label="Service Worker" value={sw} mono />
          <Field label="Permissões" value={`${perms.length + hostPerms.length}`} />
        </div>

        {iconEntries.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              Ícones
            </p>
            <div className="flex flex-wrap items-end gap-3">
              {iconEntries
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([size, path]) => (
                  <div key={size} className="flex flex-col items-center gap-1">
                    <img
                      src={base + path}
                      alt=""
                      className="rounded border border-border/40 bg-background/40 object-contain"
                      style={{ width: Math.min(64, Number(size)), height: Math.min(64, Number(size)) }}
                    />
                    <span className="text-[10px] text-muted-foreground">{size}px</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {(perms.length > 0 || hostPerms.length > 0) && (
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              <Shield className="h-3 w-3" /> Permissões
            </p>
            <div className="flex flex-wrap gap-1.5">
              {perms.map((p) => (
                <Badge key={p} variant="outline" className="border-border/40 font-mono text-[10px]">
                  {p}
                </Badge>
              ))}
              {hostPerms.map((p) => (
                <Badge
                  key={p}
                  variant="outline"
                  className="border-cyan-500/40 font-mono text-[10px] text-cyan-200"
                >
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded border border-border/40 bg-background/40 p-2">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-0.5 truncate text-sm ${mono ? "font-mono text-[11px]" : ""}`}>{value}</p>
    </div>
  );
}

// ============================================================
// Diagnostics
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

// ============================================================
// Side info panel
// ============================================================

function SidePanel({
  ext,
  scan,
  manifest,
  pagesAvailable,
  consoleCount,
  eventsCount,
  errors,
  sim,
}: {
  ext: ExtensionRecord;
  scan: ScanResult;
  manifest: ExtensionManifest | null;
  pagesAvailable: number;
  consoleCount: number;
  eventsCount: number;
  errors: string[];
  sim: SimState;
}) {
  const iconPath =
    (manifest?.icons?.["128"] as string | undefined) ??
    (manifest?.icons?.["48"] as string | undefined) ??
    undefined;
  const iconUrl = iconPath ? baseUrlFor(ext) + iconPath : scan.assets.icon128 ?? scan.assets.icon48;

  return (
    <Card className="glass h-fit border-border/60">
      <CardContent className="space-y-3 p-4 text-xs">
        <div className="flex items-center gap-3">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt=""
              className="h-12 w-12 rounded-xl border border-border/40 bg-background/40 object-contain"
            />
          ) : (
            <div className="h-12 w-12 rounded-xl border border-border/40 bg-background/40" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{manifest?.name ?? ext.name}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              v{manifest?.version ?? ext.version}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat label="Telas" value={pagesAvailable} />
          <Stat label="Console" value={consoleCount} />
          <Stat label="Eventos" value={eventsCount} />
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
          Runtime é apenas simulação visual. Nenhum arquivo da EXT1 é modificado. As
          telas rodam em iframe com as APIs do Chrome mockadas pela Factory.
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-border/40 bg-background/40 p-2 text-center">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
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
