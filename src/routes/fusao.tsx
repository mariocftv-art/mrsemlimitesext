import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { Boxes, UploadCloud, ShieldCheck, Wand2, Download, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  analyzeExtension,
  fuseExtension,
  type AnalyzeResult,
  type FusionResult,
} from "@/factory/engine/fusion";

export const Route = createFileRoute("/fusao")({ component: FusaoPage });

const DEFAULT_BACKEND = "https://mrsemlimites.lovable.app";

function FusaoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);
  const [result, setResult] = useState<FusionResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Config editável na tela de revisão.
  const [backend, setBackend] = useState(DEFAULT_BACKEND);
  const [extraHost, setExtraHost] = useState("");
  const [newName, setNewName] = useState("");
  const [newVersion, setNewVersion] = useState("");
  const [author, setAuthor] = useState("MR Sem Limites");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(f: File | null) {
    setErr(null); setResult(null); setAnalysis(null); setFile(f);
    if (!f) return;
    try {
      setBusy(true);
      const ab = await f.arrayBuffer();
      setBuf(ab);
      const a = await analyzeExtension(ab, backend);
      setAnalysis(a);
      if (a.manifestName) setNewName(a.manifestName);
      if (a.manifestVersion) setNewVersion(a.manifestVersion);
    } catch (e: any) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onFuse() {
    if (!buf) return;
    setErr(null); setBusy(true);
    try {
      const extra = extraHost.trim() ? [extraHost.trim()] : [];
      const res = await fuseExtension(buf, {
        newBackendBase: backend.trim() || DEFAULT_BACKEND,
        extraOldBases: extra,
        renames: (analysis?.manifestName && newName && analysis.manifestName !== newName)
          ? [{ from: analysis.manifestName, to: newName }] : [],
        newManifestName: newName || undefined,
        newVersion: newVersion || undefined,
        watermark: { author: author || "MR Sem Limites" },
      });
      setResult(res);
    } catch (e: any) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!result?.zip) return;
    const base = (newName || file?.name?.replace(/\.zip$/i, "") || "extensao").replace(/[^a-z0-9_-]+/gi, "-");
    const url = URL.createObjectURL(result.zip);
    const a = document.createElement("a");
    a.href = url; a.download = `${base}_fundida.zip`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  return (
    <AppShell title="Fusão de Extensões" subtitle="Troca o backend/banco antigo pelo da MR Sem Limites sem mexer no motor.">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Coluna 1: upload + config */}
        <div className="space-y-4">
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/40 p-8 text-center transition hover:border-primary/60"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e: DragEvent) => e.preventDefault()}
            onDrop={(e: DragEvent) => { e.preventDefault(); onPick(e.dataTransfer.files?.[0] ?? null); }}
          >
            <UploadCloud className="mb-2 h-8 w-8 text-primary" />
            <p className="text-sm font-medium">{file ? file.name : "Arraste o .zip da extensão ou clique"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Nada é enviado pra fora — tudo roda no seu navegador.</p>
            <input ref={inputRef} type="file" accept=".zip" className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => onPick(e.target.files?.[0] ?? null)} />
          </div>

          <div className="space-y-3 rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold"><Boxes className="h-4 w-4 text-primary" /> Configuração</div>
            <div className="space-y-1">
              <Label htmlFor="be">Backend novo (destino)</Label>
              <Input id="be" value={backend} onChange={(e: ChangeEvent<HTMLInputElement>) => setBackend(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nm">Nome novo</Label>
                <Input id="nm" value={newName} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)} placeholder="Nome da extensão" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="vs">Versão</Label>
                <Input id="vs" value={newVersion} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewVersion(e.target.value)} placeholder="1.0.0" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="xh">Backend extra a trocar (opcional)</Label>
              <Input id="xh" value={extraHost} onChange={(e: ChangeEvent<HTMLInputElement>) => setExtraHost(e.target.value)} placeholder="https://algum-banco.supabase.co" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="au">Assinatura (marca d'água)</Label>
              <Input id="au" value={author} onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Coluna 2: revisão */}
        <div className="space-y-4">
          {err && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {err}
            </div>
          )}

          {analysis && (
            <div className="space-y-3 rounded-xl border border-border/60 bg-card/40 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Revisão</div>
              <Row label="Extensão" value={analysis.manifestName ?? "—"} />
              <Row label="Versão atual" value={`${analysis.manifestVersion ?? "—"} (manifest v${analysis.manifestVersionNumber ?? "?"})`} />
              <div>
                <p className="text-xs text-muted-foreground">Backends antigos detectados (serão trocados)</p>
                {analysis.oldBackends.length ? (
                  <ul className="mt-1 space-y-1">
                    {analysis.oldBackends.map((h) => (
                      <li key={h} className="rounded bg-destructive/10 px-2 py-1 font-mono text-xs text-destructive">{h}</li>
                    ))}
                  </ul>
                ) : <p className="mt-1 text-xs text-amber-500">Nenhum detectado — informe em "Backend extra" se souber.</p>}
              </div>
              {analysis.infraHosts.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Infra preservada (não muda)</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{analysis.infraHosts.join(", ")}</p>
                </div>
              )}
              <Row label="branding.config.js" value={analysis.brandingConfig ? "sim (troca de marca fácil)" : "não"} />
              {analysis.warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-500">⚠ {w}</p>
              ))}
              <Button className="w-full" disabled={busy} onClick={onFuse}>
                <Wand2 className="mr-2 h-4 w-4" /> {busy ? "Fundindo..." : "Fundir extensão"}
              </Button>
            </div>
          )}

          {result && (
            <div className="space-y-3 rounded-xl border border-primary/40 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary"><ShieldCheck className="h-4 w-4" /> {result.message}</div>
              {result.report && (
                <>
                  <Row label="Backend novo" value={result.report.newBackend} />
                  <Row label="Arquivos alterados" value={`${result.report.filesChanged} de ${result.report.filesTotal}`} />
                  {result.report.renames.length > 0 && <Row label="Renomeado" value={result.report.renames.join(", ")} />}
                </>
              )}
              {result.warnings.map((w, i) => <p key={i} className="text-xs text-amber-500">⚠ {w}</p>)}
              <Button className="w-full" onClick={download}><Download className="mr-2 h-4 w-4" /> Baixar ZIP fundido</Button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
