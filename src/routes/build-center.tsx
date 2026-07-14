import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  FolderOpen,
  Hammer,
  Loader2,
  Package,
  Play,
  RotateCw,
  Terminal,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  getAllExtensions,
  scanExtension,
  type ExtensionRecord,
  type NeonTone,
} from "@/factory";
import { runExtensionBuild, type BuildResult, type BuildStep } from "@/lib/build-runner.functions";

export const Route = createFileRoute("/build-center")({ component: BuildCenterPage });

const glow: Record<NeonTone, string> = {
  cyan: "var(--neon-cyan)",
  violet: "var(--neon-violet)",
  magenta: "var(--neon-magenta)",
  lime: "var(--neon-lime)",
};

type HistoryEntry = {
  n: number;
  date: string;
  version: string;
  ms: number;
  ok: boolean;
  mode: "dev" | "prod";
  sha256?: string;
  size?: number;
  filename?: string;
  downloadUrl?: string;
};

const HIST_KEY = (extId: string) => `mr-factory:build-history:${extId}`;

function loadHistory(extId: string): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HIST_KEY(extId));
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch { return []; }
}
function saveHistory(extId: string, h: HistoryEntry[]) {
  try { localStorage.setItem(HIST_KEY(extId), JSON.stringify(h.slice(0, 20))); } catch {}
}

function BuildCenterPage() {
  const items = getAllExtensions();
  const [selectedId, setSelectedId] = useState<string>(items[0]?.id ?? "");
  const selected = items.find((e) => e.id === selectedId) ?? items[0];

  return (
    <AppShell
      title="Build Center"
      subtitle="Executa o pipeline oficial de cada extensão — sem alterar seus arquivos."
    >
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="space-y-2">
          {items.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedId(e.id)}
              className={`w-full rounded-lg border p-3 text-left transition ${
                selected?.id === e.id
                  ? "border-primary/60 bg-primary/10"
                  : "border-border/40 bg-background/40 hover:border-border/60"
              }`}
              style={{ boxShadow: selected?.id === e.id ? `0 0 40px -28px ${glow[e.tone]}` : undefined }}
            >
              <div className="flex items-center gap-2">
                <Hammer className="h-4 w-4" style={{ color: glow[e.tone] }} />
                <span className="text-sm font-semibold">{e.name}</span>
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                {e.code} · v{e.version} · {e.status}
              </p>
            </button>
          ))}
        </div>

        {selected ? <BuildPanel ext={selected} /> : (
          <Card className="border-border/60"><CardContent className="p-6 text-sm text-muted-foreground">
            Nenhuma extensão no registry.
          </CardContent></Card>
        )}
      </div>
    </AppShell>
  );
}

function BuildPanel({ ext }: { ext: ExtensionRecord }) {
  const scan = useMemo(() => scanExtension(ext.sourceDir), [ext.sourceDir]);
  const run = useServerFn(runExtensionBuild);

  const [mode, setMode] = useState<"dev" | "prod">("dev");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<BuildResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory(ext.id));
  const [copied, setCopied] = useState(false);

  const scanned = scan.builds;
  const lastLocal = scanned[scanned.length - 1];
  const lastHist = history[0];

  const doBuild = async () => {
    setRunning(true);
    setResult(null);
    try {
      const r = (await run({
        data: { sourceDir: ext.sourceDir, mode, extCode: ext.code.toLowerCase() },
      })) as BuildResult;
      setResult(r);
      const entry: HistoryEntry = {
        n: (history[0]?.n ?? 0) + 1,
        date: new Date().toISOString(),
        version: ext.version,
        ms: r.ms,
        ok: r.ok,
        mode: r.mode,
        sha256: r.zip?.sha256,
        size: r.zip?.sizeBytes,
        filename: r.zip?.filename,
        downloadUrl: r.zip?.downloadUrl,
      };
      const next = [entry, ...history].slice(0, 20);
      setHistory(next);
      saveHistory(ext.id, next);
    } catch (e) {
      setResult({
        ok: false, mode, ms: 0, log: "", steps: [], missingDeps: [],
        error: { message: (e as Error).message, stack: (e as Error).stack },
      });
    } finally {
      setRunning(false);
    }
  };

  const copyChecksum = async () => {
    if (!result?.zip?.sha256) return;
    await navigator.clipboard.writeText(result.zip.sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = async () => {
    if (!result?.zip?.downloadUrl) return;
    try {
      const res = await fetch(result.zip.downloadUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = result.zip.filename ?? "build.zip";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const stepsDisplay: BuildStep[] = running && !result
    ? [
        { key: "prepare", label: "Preparando", status: "running" },
        { key: "structure", label: "Validando estrutura", status: "pending" },
        { key: "manifest", label: "Validando manifest", status: "pending" },
        { key: "assets", label: "Validando assets", status: "pending" },
        { key: "run", label: "Executando build", status: "pending" },
        { key: "optimize", label: "Otimizando", status: "pending" },
        { key: "pack", label: "Gerando pacote", status: "pending" },
        { key: "done", label: "Finalizado", status: "pending" },
      ]
    : result?.steps ?? [];

  const doneCount = stepsDisplay.filter((s) => s.status === "ok").length;
  const pct = stepsDisplay.length ? Math.round((doneCount / stepsDisplay.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="glass border-border/60" style={{ boxShadow: `0 0 40px -28px ${glow[ext.tone]}` }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Hammer className="h-4 w-4" style={{ color: glow[ext.tone] }} />
            {ext.name}
          </CardTitle>
          <Badge variant="outline" className="border-border/60 text-[10px] uppercase tracking-widest">
            {ext.code} · v{ext.version}
          </Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-xs md:grid-cols-3">
          <Meta label="Nome" value={ext.name} />
          <Meta label="Versão" value={ext.version} />
          <Meta label="Status" value={ext.status} />
          <Meta
            label="Última build"
            value={
              lastHist
                ? `${new Date(lastHist.date).toLocaleString("pt-BR")} · ${lastHist.mode}`
                : lastLocal
                ? lastLocal.filename
                : "—"
            }
          />
          <Meta label="Destino" value={`dist/ · public/factory-builds/${ext.code.toLowerCase()}/`} mono />
          <Meta label="Pipeline" value={`${ext.sourceDir}/build/build.mjs`} mono />
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="border-border/60">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="flex overflow-hidden rounded-md border border-border/60">
            {(["dev", "prod"] as const).map((m) => (
              <button
                key={m}
                onClick={() => !running && setMode(m)}
                disabled={running}
                className={`px-3 py-1.5 text-xs uppercase tracking-widest ${
                  mode === m ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-background/60"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <Button onClick={doBuild} disabled={running} className="gap-1.5">
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running ? "Executando…" : "Gerar Build"}
          </Button>
          {result && (
            <Button variant="outline" onClick={doBuild} disabled={running} className="gap-1.5">
              <RotateCw className="h-4 w-4" /> Gerar novamente
            </Button>
          )}
          {result?.zip && (
            <>
              <Button variant="outline" onClick={download} className="gap-1.5">
                <Download className="h-4 w-4" /> Baixar ZIP
              </Button>
              <Button variant="outline" onClick={copyChecksum} className="gap-1.5">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar checksum"}
              </Button>
              <Button variant="outline" asChild className="gap-1.5">
                <a href={result.zip.downloadUrl} target="_blank" rel="noreferrer">
                  <FolderOpen className="h-4 w-4" /> Abrir pasta
                </a>
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Steps + progress */}
      {(running || result) && (
        <Card className="border-border/60">
          <CardContent className="space-y-3 p-4">
            <Progress value={pct} className="h-2" />
            <ul className="grid gap-1.5 text-xs md:grid-cols-2">
              {stepsDisplay.map((s) => (
                <li key={s.key} className="flex items-center gap-2 rounded border border-border/40 bg-background/40 px-2 py-1.5">
                  <StepIcon status={s.status} />
                  <span className={s.status === "fail" ? "text-rose-300" : ""}>{s.label}</span>
                  {s.detail && <span className="ml-auto truncate text-[10px] text-muted-foreground">{s.detail}</span>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Result summary */}
      {result && (
        <Card className={`border-border/60 ${result.ok ? "" : "border-rose-500/40 bg-rose-500/5"}`}>
          <CardContent className="space-y-3 p-4 text-xs">
            {result.ok && result.zip ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Meta label="Tempo" value={`${(result.ms / 1000).toFixed(2)} s`} />
                <Meta label="Versão" value={ext.version} />
                <Meta label="Tamanho" value={humanSize(result.zip.sizeBytes)} />
                <Meta label="Arquivos" value={String(result.zip.fileCount)} />
                <div className="col-span-full">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground">SHA-256</p>
                  <p className="break-all font-mono text-[11px] text-emerald-300">{result.zip.sha256}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">Build falhou</span>
                </div>
                {result.error && (
                  <div className="space-y-1 rounded border border-rose-500/40 bg-background/40 p-2">
                    <p className="font-mono text-[11px] text-rose-200">{result.error.message}</p>
                    {result.error.file && (
                      <p className="text-[10px] text-muted-foreground">
                        {result.error.file}
                        {result.error.line ? `:${result.error.line}` : ""}
                      </p>
                    )}
                    {result.error.stack && (
                      <ScrollArea className="h-40">
                        <pre className="whitespace-pre-wrap break-all font-mono text-[10px] text-rose-200/80">
                          {result.error.stack}
                        </pre>
                      </ScrollArea>
                    )}
                  </div>
                )}
              </div>
            )}

            {result.missingDeps.length > 0 && (
              <div className="rounded border border-amber-500/40 bg-amber-500/10 p-2 text-[11px] text-amber-200">
                <p className="mb-1 font-semibold">Dependências ausentes ({result.missingDeps.length})</p>
                <ul className="list-inside list-disc font-mono">
                  {result.missingDeps.map((d) => <li key={d}>{d}</li>)}
                </ul>
                <p className="mt-1 text-[10px] text-amber-200/80">
                  Nenhuma instalação automática. Rode manualmente no diretório do pipeline se necessário.
                </p>
              </div>
            )}

            {result.log && (
              <details className="rounded border border-border/40 bg-background/40 p-2">
                <summary className="flex cursor-pointer items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Terminal className="h-3 w-3" /> stdout / stderr ({result.log.split("\n").length} linhas)
                </summary>
                <ScrollArea className="mt-2 h-48">
                  <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-muted-foreground">
                    {result.log}
                  </pre>
                </ScrollArea>
              </details>
            )}
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Histórico de builds ({history.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {history.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground">Nenhuma build gerada nesta sessão.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr className="border-b border-border/40">
                    <th className="px-3 py-1.5 text-left">#</th>
                    <th className="px-3 py-1.5 text-left">Data</th>
                    <th className="px-3 py-1.5 text-left">Versão</th>
                    <th className="px-3 py-1.5 text-left">Modo</th>
                    <th className="px-3 py-1.5 text-left">Tempo</th>
                    <th className="px-3 py-1.5 text-left">Tamanho</th>
                    <th className="px-3 py-1.5 text-left">Status</th>
                    <th className="px-3 py-1.5 text-left">Checksum</th>
                    <th className="px-3 py-1.5" />
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {history.map((h) => (
                    <tr key={h.n} className="border-b border-border/20">
                      <td className="px-3 py-1.5">#{h.n}</td>
                      <td className="px-3 py-1.5">{new Date(h.date).toLocaleString("pt-BR")}</td>
                      <td className="px-3 py-1.5">{h.version}</td>
                      <td className="px-3 py-1.5">{h.mode}</td>
                      <td className="px-3 py-1.5">{(h.ms / 1000).toFixed(2)}s</td>
                      <td className="px-3 py-1.5">{h.size ? humanSize(h.size) : "—"}</td>
                      <td className="px-3 py-1.5">
                        {h.ok ? <span className="text-emerald-300">ok</span> : <span className="text-rose-300">falhou</span>}
                      </td>
                      <td className="px-3 py-1.5">
                        {h.sha256 ? <span className="truncate text-emerald-300/80">{h.sha256.slice(0, 12)}…</span> : "—"}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        {h.downloadUrl && (
                          <a href={h.downloadUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                            <Package className="h-3 w-3" /> zip
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StepIcon({ status }: { status: BuildStep["status"] }) {
  if (status === "ok") return <Check className="h-3.5 w-3.5 text-emerald-400" />;
  if (status === "fail") return <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />;
  if (status === "running") return <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />;
  return <span className="h-3.5 w-3.5 rounded-full border border-border/60" />;
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded border border-border/40 bg-background/40 p-2">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-0.5 truncate text-sm ${mono ? "font-mono text-[11px]" : ""}`}>{value}</p>
    </div>
  );
}

function humanSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
