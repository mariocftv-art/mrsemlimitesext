import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Cloud,
  FlaskConical,
  Loader2,
  Power,
  RefreshCw,
  Save,
  ServerCog,
  X,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DEFAULT_BACKEND_CONFIG,
  OFFICIAL_ENDPOINTS,
  endpointUrl,
  loadBackendConfig,
  saveBackendConfig,
  type BackendConfig,
} from "@/factory/backend-config";
import { probeBackend, type ProbeResult } from "@/lib/backend-probe.functions";

export const Route = createFileRoute("/backend")({ component: BackendPage });

function BackendPage() {
  const [cfg, setCfg] = useState<BackendConfig>(DEFAULT_BACKEND_CONFIG);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ProbeResult[] | null>(null);

  const [autoProbed, setAutoProbed] = useState(false);

  useEffect(() => {
    const loaded = loadBackendConfig();
    if (!loaded.API_BASE_URL) {
      saveBackendConfig(DEFAULT_BACKEND_CONFIG);
      setCfg(DEFAULT_BACKEND_CONFIG);
    } else {
      setCfg(loaded);
    }
  }, []);

  const run = useServerFn(probeBackend);

  const update = <K extends keyof BackendConfig>(k: K, v: BackendConfig[K]) => {
    setCfg((s) => ({ ...s, [k]: v }));
    setDirty(true);
    setSaved(false);
  };

  const save = () => {
    saveBackendConfig(cfg);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const resolvedEndpoints = useMemo(
    () => OFFICIAL_ENDPOINTS.map((ep) => ({ def: ep, url: endpointUrl(cfg, ep) })),
    [cfg],
  );

  const doProbe = async () => {
    if (!cfg.API_BASE_URL) return;
    setRunning(true);
    setResults(null);
    try {
      const r = (await run({
        data: {
          endpoints: OFFICIAL_ENDPOINTS.map((ep) => ({
            key: ep.key,
            label: ep.label,
            method: ep.method,
            url: endpointUrl(cfg, ep),
            requirement: ep.requirement,
            body: ep.probeBody,
          })),
          apiKey: cfg.API_KEY || undefined,
          extensionId: cfg.EXTENSION_ID || undefined,
          clientVersion: cfg.CLIENT_VERSION || undefined,
        },
      })) as ProbeResult[];
      setResults(r);
    } catch (e) {
      setResults([{
        key: "error", label: "Erro geral", requirement: "required",
        url: cfg.API_BASE_URL, method: "N/A",
        status: null, ok: false, responded: false, ms: 0,
        error: (e as Error).message,
        tests: [], authRequired: null,
      }]);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    if (!autoProbed && cfg.API_BASE_URL && !running && !results) {
      setAutoProbed(true);
      void doProbe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.API_BASE_URL, autoProbed]);



  const summary = useMemo(() => {
    if (!results) return null;
    const responded = results.filter((r) => r.responded);
    const missing = results.filter((r) => !r.responded);
    const requiredMissing = missing.filter((r) => r.requirement === "required");
    return { total: results.length, responded: responded.length, missing: missing.length, requiredMissing };
  }, [results]);

  return (
    <AppShell
      title="Backend Oficial"
      subtitle="Configuração + diagnóstico da conexão da EXT1 com o backend existente. Nada aqui altera o backend."
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={save} disabled={!dirty} className="gap-1.5">
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Salvo" : "Salvar"}
          </Button>
          <Button size="sm" onClick={doProbe} disabled={running || !cfg.API_BASE_URL} className="gap-1.5">
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {running ? "Testando…" : "Testar conexão"}
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        {/* ============ CONFIG PANEL ============ */}
        <Card className="glass h-fit border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ServerCog className="h-4 w-4 text-primary" /> Configuração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow
              icon={<Power className="h-4 w-4 text-emerald-300" />}
              title="Modo Backend Oficial"
              description="EXT1 usará exclusivamente os endpoints existentes."
              checked={cfg.enabled}
              onChange={(v) => update("enabled", v)}
            />
            <ToggleRow
              icon={<FlaskConical className="h-4 w-4 text-violet-300" />}
              title="Modo Teste"
              description="Permite editar URL/versão sem tocar na EXT1."
              checked={cfg.testMode}
              onChange={(v) => update("testMode", v)}
            />

            <div className="space-y-2 border-t border-border/40 pt-3">
              <FieldRow label="API_BASE_URL" value={cfg.API_BASE_URL}
                placeholder="https://xxx.supabase.co"
                readOnly={!cfg.testMode}
                onChange={(v) => update("API_BASE_URL", v)} />
              <FieldRow label="PUBLIC_API_URL" value={cfg.PUBLIC_API_URL}
                placeholder="https://xxx.lovable.app"
                readOnly={!cfg.testMode}
                onChange={(v) => update("PUBLIC_API_URL", v)} />
              <FieldRow label="EXTENSION_ID" value={cfg.EXTENSION_ID}
                placeholder="abcd… (Chrome Web Store ID)"
                readOnly={!cfg.testMode}
                onChange={(v) => update("EXTENSION_ID", v)} />
              <FieldRow label="CLIENT_VERSION" value={cfg.CLIENT_VERSION}
                placeholder="2.2.7"
                readOnly={!cfg.testMode}
                onChange={(v) => update("CLIENT_VERSION", v)} />
              <FieldRow label="PRODUCT_SLUG" value={cfg.PRODUCT_SLUG}
                placeholder="mr-sem-limites"
                readOnly={!cfg.testMode}
                onChange={(v) => update("PRODUCT_SLUG", v)} />
              <FieldRow label="API_KEY (anon)" value={cfg.API_KEY}
                placeholder="opcional — só para probes autenticados"
                readOnly={!cfg.testMode}
                sensitive
                onChange={(v) => update("API_KEY", v)} />
            </div>

            <p className="rounded border border-border/40 bg-background/40 p-2 text-[10px] leading-relaxed text-muted-foreground">
              Configuração salva apenas em <code className="font-mono">localStorage</code> da Factory
              (chave <code className="font-mono">mr-factory:backend-config</code>). Nada é gravado
              na EXT1, no backend ou em qualquer tabela.
            </p>
          </CardContent>
        </Card>

        {/* ============ DIAGNOSTIC ============ */}
        <div className="space-y-3">
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Cloud className="h-4 w-4 text-cyan-300" /> Endpoints oficiais ({OFFICIAL_ENDPOINTS.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {!cfg.API_BASE_URL && (
                <div className="rounded border border-amber-500/40 bg-amber-500/10 p-2 text-amber-200">
                  Informe <code className="font-mono">API_BASE_URL</code> antes de testar.
                </div>
              )}
              <ul className="space-y-1.5">
                {resolvedEndpoints.map(({ def, url }) => {
                  const r = results?.find((x) => x.key === def.key);
                  return (
                    <li key={def.key} className="rounded border border-border/40 bg-background/40 p-2">
                      <div className="flex items-center gap-2">
                        <StatusDot r={r} running={running} />
                        <span className="font-semibold">{def.label}</span>
                        <Badge variant="outline"
                          className={`ml-1 border-border/40 text-[9px] ${
                            def.requirement === "required" ? "text-rose-200" : "text-muted-foreground"
                          }`}>
                          {def.requirement === "required" ? "obrigatório" : "opcional"}
                        </Badge>
                        <span className="ml-auto font-mono text-[10px] text-muted-foreground">{def.method}</span>
                        {r && (
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {r.status ?? "—"} · {r.ms}ms
                          </span>
                        )}
                      </div>
                      <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{url}</p>
                      {r?.error && <p className="mt-0.5 text-[10px] text-rose-300">{r.error}</p>}
                      {r?.tests && r.tests.length > 0 && (
                        <div className="mt-1.5 grid grid-cols-4 gap-1">
                          {r.tests.map((t) => (
                            <div key={t.test}
                              className={`rounded border p-1 text-center text-[9px] ${
                                t.responded
                                  ? t.ok
                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                                    : "border-amber-500/40 bg-amber-500/10 text-amber-200"
                                  : "border-rose-500/40 bg-rose-500/10 text-rose-200"
                              }`}
                              title={t.error ?? ""}>
                              <div className="font-semibold uppercase tracking-wider">{t.test}</div>
                              <div className="font-mono">{t.status ?? "×"} · {t.ms}ms</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {r?.authRequired !== undefined && r?.authRequired !== null && (
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Autenticação: {r.authRequired
                            ? <span className="text-amber-300">exigida (401/403 sem apikey)</span>
                            : <span className="text-emerald-300">não exigida</span>}
                        </p>
                      )}
                      {r?.bodyPreview && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-[10px] text-muted-foreground">resposta JSON ({r.bodyPreview.length} chars)</summary>
                          <pre className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded bg-background/60 p-1.5 font-mono text-[10px]">
                            {r.bodyPreview}
                          </pre>
                        </details>
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Report */}
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Relatório</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {!results ? (
                <p className="text-muted-foreground">Nenhum diagnóstico executado ainda.</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    <Stat label="Encontrados" value={results.length} />
                    <Stat label="Responderam" value={summary?.responded ?? 0} tone="ok" />
                    <Stat label="Sem resposta" value={summary?.missing ?? 0} tone={summary?.missing ? "warn" : undefined} />
                    <Stat label="Obrigatórios ausentes"
                      value={summary?.requiredMissing.length ?? 0}
                      tone={summary?.requiredMissing.length ? "fail" : "ok"} />
                  </div>
                  <ScrollArea className="max-h-52 rounded border border-border/40 bg-background/40 p-2">
                    <ul className="space-y-1 font-mono text-[11px]">
                      {results.map((r) => (
                        <li key={r.key} className="flex items-center gap-2">
                          {r.responded
                            ? <Check className="h-3 w-3 text-emerald-400" />
                            : <X className="h-3 w-3 text-rose-400" />}
                          <span>{r.label}</span>
                          <span className="ml-auto text-muted-foreground">
                            {r.status ?? "sem resposta"} · {r.ms}ms
                            {r.requirement === "required" ? " · obrigatório" : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                  {summary?.requiredMissing.length ? (
                    <div className="flex items-start gap-2 rounded border border-rose-500/40 bg-rose-500/10 p-2 text-[11px] text-rose-200">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>
                        Endpoints obrigatórios sem resposta: {" "}
                        <strong>{summary.requiredMissing.map((r) => r.label).join(", ")}</strong>.
                        A EXT1 não conseguirá autenticar até estes responderem.
                      </span>
                    </div>
                  ) : (
                    <p className="rounded border border-emerald-500/30 bg-emerald-500/5 p-2 text-[11px] text-emerald-200">
                      Todos os endpoints obrigatórios responderam.
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <RealTests cfg={cfg} />
        </div>
      </div>
    </AppShell>
  );
}

function ToggleRow({
  icon, title, description, checked, onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded border border-border/40 bg-background/40 p-2.5">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[11px] leading-tight text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function FieldRow({
  label, value, placeholder, readOnly, onChange, sensitive,
}: {
  label: string;
  value: string;
  placeholder?: string;
  readOnly?: boolean;
  sensitive?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</Label>
      <Input
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        type={sensitive ? "password" : "text"}
        onChange={(e) => onChange(e.target.value)}
        className={`h-8 font-mono text-[11px] ${readOnly ? "opacity-60" : ""}`}
      />
    </div>
  );
}

function StatusDot({ r, running }: { r?: ProbeResult; running: boolean }) {
  if (!r) {
    return running
      ? <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      : <span className="h-2.5 w-2.5 rounded-full border border-border/60" />;
  }
  if (r.ok) return <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" />;
  if (r.responded) return <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_theme(colors.amber.400)]" />;
  return <span className="h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_6px_theme(colors.rose.400)]" />;
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "ok" | "warn" | "fail" }) {
  const color =
    tone === "ok" ? "text-emerald-300"
    : tone === "warn" ? "text-amber-300"
    : tone === "fail" ? "text-rose-300"
    : "text-foreground";
  return (
    <div className="rounded border border-border/40 bg-background/40 p-2 text-center">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}
