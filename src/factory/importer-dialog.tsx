import { useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileArchive,
  FolderOpen,
  Loader2,
  Sparkles,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { createExtension, updateExtension } from "./storage";
import {
  analyzeFolder,
  analyzeZip,
  formatBytes,
  type ImportReport,
} from "./engine/importer";

// Extended input type for folder selection
type FolderInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  webkitdirectory?: string;
  directory?: string;
};

export function ImportExtensionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [creating, setCreating] = useState(false);
  const zipRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setReport(null);
    setBusy(false);
    setCreating(false);
    if (zipRef.current) zipRef.current.value = "";
    if (folderRef.current) folderRef.current.value = "";
  };

  const handleZip = async (file: File) => {
    setBusy(true);
    try {
      const r = await analyzeZip(file);
      setReport(r);
      toast.success(`ZIP analisado: ${r.totalFiles} arquivo(s).`);
    } catch (e) {
      toast.error(`Falha ao analisar ZIP: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const handleFolder = async (files: FileList) => {
    setBusy(true);
    try {
      const r = await analyzeFolder(files);
      setReport(r);
      toast.success(`Pasta analisada: ${r.totalFiles} arquivo(s).`);
    } catch (e) {
      toast.error(`Falha ao analisar pasta: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const createProject = () => {
    if (!report) return;
    setCreating(true);
    try {
      const name = report.manifest?.name?.trim() || report.sourceName.replace(/\.zip$/i, "");
      const description =
        report.manifest?.description?.trim() ||
        `Importada a partir de ${report.source === "zip" ? "ZIP" : "pasta"}: ${report.sourceName}`;

      const rec = createExtension({
        name,
        description,
        tone: "cyan",
        version: report.manifest?.version || "0.1.0",
        notes: buildNotes(report),
      });

      updateExtension(rec.id, {
        manifest: {
          manifestVersion: (report.manifest?.manifest_version === 2 ? 2 : 3) as 2 | 3,
          permissions: report.manifest?.permissions ?? [],
          hostPermissions: report.manifest?.host_permissions ?? [],
          hasPopup: !!report.detected.popup,
          hasSidepanel: !!report.detected.sidepanel,
          hasBackground: report.detected.background.length > 0,
          hasContentScripts: report.detected.contentScripts.length > 0,
        },
        status: "development",
      });

      toast.success(`Projeto ${rec.code} criado a partir de ${report.sourceName}.`);
      onOpenChange(false);
      reset();
    } catch (e) {
      toast.error(`Falha ao criar projeto: ${(e as Error).message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Importar Extensão
          </DialogTitle>
          <DialogDescription>
            Analisa a estrutura de uma extensão pronta (ZIP ou pasta). Nenhum arquivo é modificado,
            convertido ou copiado — apenas leitura.
          </DialogDescription>
        </DialogHeader>

        {!report && (
          <div className="grid gap-3 md:grid-cols-2">
            <ImportChoice
              icon={FileArchive}
              title="Importar ZIP"
              description="Arquivo .zip contendo manifest.json na raiz."
              onClick={() => zipRef.current?.click()}
              busy={busy}
            />
            <ImportChoice
              icon={FolderOpen}
              title="Importar pasta"
              description="Selecione a pasta descompactada da extensão."
              onClick={() => folderRef.current?.click()}
              busy={busy}
            />
            <input
              ref={zipRef}
              type="file"
              accept=".zip,application/zip"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleZip(e.target.files[0])}
            />
            <input
              ref={folderRef}
              type="file"
              className="hidden"
              multiple
              onChange={(e) => e.target.files && e.target.files.length > 0 && handleFolder(e.target.files)}
              {...({ webkitdirectory: "", directory: "" } as Partial<FolderInputProps>)}
            />
          </div>
        )}

        {busy && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analisando estrutura…
          </div>
        )}

        {report && !busy && <ReportView report={report} />}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {report && (
            <>
              <Button variant="outline" onClick={reset} disabled={creating}>
                Analisar outra
              </Button>
              <Button
                onClick={createProject}
                disabled={creating}
                className="gap-1.5"
                style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
              >
                <Sparkles className="h-4 w-4" />
                {creating ? "Criando…" : "Criar Projeto"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportChoice({
  icon: Icon,
  title,
  description,
  onClick,
  busy,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
  busy: boolean;
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onClick}
      className="group flex flex-col items-start gap-2 rounded-xl border border-border/60 bg-background/40 p-5 text-left transition-all hover:border-primary/60 hover:bg-primary/5 disabled:opacity-50"
    >
      <Icon className="h-6 w-6 text-primary" />
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );
}

function ReportView({ report }: { report: ImportReport }) {
  const tone =
    report.score >= 90 ? "text-emerald-300 border-emerald-500/40 bg-emerald-500/10" :
    report.score >= 75 ? "text-cyan-300 border-cyan-500/40 bg-cyan-500/10" :
    report.score >= 60 ? "text-amber-300 border-amber-500/40 bg-amber-500/10" :
    "text-rose-300 border-rose-500/40 bg-rose-500/10";

  return (
    <div className="space-y-4">
      <Card className={`border ${tone}`}>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="text-3xl font-bold">{report.score}%</div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{report.scoreLabel}</p>
            <p className="text-xs opacity-80">
              {report.sourceName} · {report.totalFiles} arquivo(s) · {formatBytes(report.totalSize)}
            </p>
            <Progress value={report.score} className="mt-2 h-1.5" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <MetaCard title="Manifest">
          <MetaRow k="Nome" v={report.manifest?.name ?? "—"} />
          <MetaRow k="Versão" v={report.manifest?.version ?? "—"} />
          <MetaRow k="Manifest Version" v={String(report.manifest?.manifest_version ?? "—")} />
          <MetaRow k="Descrição" v={report.manifest?.description ?? "—"} />
        </MetaCard>
        <MetaCard title="Estrutura detectada">
          <MetaRow k="Popup" v={report.detected.popup ?? "—"} />
          <MetaRow k="Sidepanel" v={report.detected.sidepanel ?? "—"} />
          <MetaRow k="Background" v={report.detected.background.join(", ") || "—"} />
          <MetaRow k="Content Scripts" v={String(report.detected.contentScripts.length)} />
          <MetaRow k="Ícones" v={String(report.detected.icons.length)} />
          <MetaRow k="Assets" v={String(report.detected.assets.length)} />
          <MetaRow k="HTML / JS / CSS" v={`${report.detected.html.length} / ${report.detected.js.length} / ${report.detected.css.length}`} />
        </MetaCard>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Verificações
        </p>
        <div className="grid gap-1.5 md:grid-cols-2">
          {report.checks.map((c: any) => (
            <div
              key={c.key}
              className="flex items-start gap-2 rounded-lg border border-border/40 bg-background/40 px-3 py-2 text-xs"
            >
              {c.status === "ok" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />}
              {c.status === "warn" && <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />}
              {c.status === "missing" && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />}
              <div className="min-w-0">
                <p className="font-medium">{c.label}</p>
                {c.detail && <p className="truncate text-muted-foreground">{c.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {(report.manifest?.permissions?.length || report.manifest?.host_permissions?.length) && (
        <div className="rounded-lg border border-border/60 bg-background/40 p-3 text-xs">
          <p className="mb-1 font-semibold">Permissões</p>
          <div className="flex flex-wrap gap-1">
            {report.manifest?.permissions?.map((p) => (
              <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>
            ))}
            {report.manifest?.host_permissions?.map((p) => (
              <Badge key={p} variant="outline" className="border-amber-500/40 text-amber-300 text-[10px]">{p}</Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Arquivos ({report.files.filter((f) => !f.isDir).length})
        </p>
        <ScrollArea className="h-[180px] rounded-lg border border-border/60 bg-background/60">
          <table className="w-full text-[11px]">
            <tbody>
              {report.files.filter((f) => !f.isDir).map((f) => (
                <tr key={f.path} className="border-t border-border/30">
                  <td className="px-3 py-1 font-mono">{f.path}</td>
                  <td className="px-3 py-1 text-right font-mono text-muted-foreground">
                    {formatBytes(f.size)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Nenhum arquivo é modificado, movido ou copiado. Ao clicar em <b>Criar Projeto</b>, apenas
        o cadastro (nome, versão, manifest, estrutura) é registrado na Factory.
      </p>
    </div>
  );
}

function MetaCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-border/60">
      <CardContent className="space-y-1 p-4">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{title}</p>
        <div className="space-y-1 text-xs">{children}</div>
      </CardContent>
    </Card>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="max-w-[65%] truncate text-right font-medium">{v}</span>
    </div>
  );
}

function buildNotes(r: ImportReport): string {
  const lines = [
    `Importada de ${r.source === "zip" ? "ZIP" : "pasta"}: ${r.sourceName}`,
    `Score: ${r.score}% (${r.scoreLabel})`,
    `Arquivos: ${r.totalFiles} · Tamanho: ${formatBytes(r.totalSize)}`,
  ];
  if (r.manifest?.manifest_version) lines.push(`Manifest V${r.manifest.manifest_version}`);
  if (r.detected.popup) lines.push(`Popup: ${r.detected.popup}`);
  if (r.detected.sidepanel) lines.push(`Sidepanel: ${r.detected.sidepanel}`);
  if (r.detected.background.length) lines.push(`Background: ${r.detected.background.join(", ")}`);
  return lines.join("\n");
}
