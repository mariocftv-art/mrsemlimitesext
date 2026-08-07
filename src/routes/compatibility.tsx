import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileArchive,
  FileJson,
  FileText,
  FolderOpen,
  Loader2,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  compareImport,
  compareRecord,
  exportJSON,
  exportMarkdown,
  FACTORY_STANDARD,
  type CompatCheck,
  type CompatReport,
  type CompatStatus,
} from "@/factory/engine/comparator";
import { analyzeFolder, analyzeZip, type ImportReport } from "@/factory/engine/importer";
import { getAllExtensions, subscribe, type ExtensionRecord } from "@/factory";

export const Route = createFileRoute("/compatibility")({
  component: CompatibilityCenter,
});

// Extended input type for folder selection
type FolderInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  webkitdirectory?: string;
  directory?: string;
};

function useFactoryExtensions() {
  return useSyncExternalStore(subscribe, getAllExtensions, getAllExtensions);
}

function CompatibilityCenter() {
  const extensions = useFactoryExtensions();
  const [selectedId, setSelectedId] = useState<string>(extensions[0]?.id ?? "");
  const [importReport, setImportReport] = useState<ImportReport | null>(null);
  const [busy, setBusy] = useState(false);
  const zipRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const ext = extensions.find((e) => e.id === selectedId) ?? extensions[0];

  const report = useMemo<CompatReport | null>(() => {
    if (!ext) return null;
    return importReport ? compareImport(ext, importReport) : compareRecord(ext);
  }, [ext, importReport]);

  const handleZip = async (file: File) => {
    setBusy(true);
    try {
      const r = await analyzeZip(file);
      setImportReport(r);
      toast.success("ZIP analisado — comparação profunda ativada.");
    } catch (e) {
      toast.error(`Falha: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const handleFolder = async (files: FileList) => {
    setBusy(true);
    try {
      const r = await analyzeFolder(files);
      setImportReport(r);
      toast.success("Pasta analisada — comparação profunda ativada.");
    } catch (e) {
      toast.error(`Falha: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const download = (name: string, mime: string, content: string) => {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportReport = (format: "json" | "md" | "pdf") => {
    if (!report) return;
    if (format === "pdf") {
      toast.info("Exportação em PDF — Em breve.");
      return;
    }
    const base = `${report.extension.code}-compat`;
    if (format === "json") download(`${base}.json`, "application/json", exportJSON(report));
    else download(`${base}.md`, "text/markdown", exportMarkdown(report));
    toast.success(`Relatório ${format.toUpperCase()} exportado.`);
  };

  return (
    <AppShell
      title="Centro de Compatibilidade"
      subtitle="Compara cada extensão contra o padrão da Factory. Apenas análise — nada é modificado."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => zipRef.current?.click()} disabled={busy}>
            <FileArchive className="h-4 w-4" /> Analisar ZIP
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => folderRef.current?.click()} disabled={busy}>
            <FolderOpen className="h-4 w-4" /> Analisar Pasta
          </Button>
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
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-[260px]">
          <Select value={ext?.id ?? ""} onValueChange={setSelectedId}>
            <SelectTrigger className="h-9 bg-secondary/40">
              <SelectValue placeholder="Selecionar extensão" />
            </SelectTrigger>
            <SelectContent>
              {extensions.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.code} · {e.name} · v{e.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {importReport && (
          <Badge variant="outline" className="border-cyan-500/40 text-cyan-300">
            Comparação profunda ativa · {importReport.sourceName}
          </Badge>
        )}
        {importReport && (
          <Button variant="ghost" size="sm" onClick={() => setImportReport(null)}>
            Voltar à análise por cadastro
          </Button>
        )}
        {busy && (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> analisando…
          </span>
        )}
      </div>

      {!ext || !report ? (
        <Card className="glass border-border/60">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center text-sm text-muted-foreground">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Nenhuma extensão para analisar.
          </CardContent>
        </Card>
      ) : (
        <ReportSurface report={report} onExport={exportReport} />
      )}
    </AppShell>
  );
}

// ============================================================
// Surface
// ============================================================

function statusTone(s: CompatStatus) {
  return s === "ok"
    ? "text-emerald-300 border-emerald-500/40 bg-emerald-500/10"
    : s === "warn"
    ? "text-amber-300 border-amber-500/40 bg-amber-500/10"
    : "text-rose-300 border-rose-500/40 bg-rose-500/10";
}

function statusDot(s: CompatStatus) {
  return s === "ok" ? "🟢 Compatível" : s === "warn" ? "🟡 Requer adaptação" : "🔴 Incompatível";
}

function ReportSurface({
  report,
  onExport,
}: {
  report: CompatReport;
  onExport: (format: "json" | "md" | "pdf") => void;
}) {
  return (
    <div className="space-y-4">
      <Card className={`border ${statusTone(report.scoreStatus)}`}>
        <CardContent className="flex flex-wrap items-center gap-4 p-5">
          <div className="text-4xl font-bold">{report.score}%</div>
          <div className="flex-1 min-w-[240px]">
            <p className="text-sm font-semibold">{report.scoreLabel}</p>
            <p className="text-xs opacity-80">
              {statusDot(report.scoreStatus)} · {report.extension.code} · v{report.extension.version}
              {report.source === "import" && ` · ${report.totals.files} arquivo(s)`}
            </p>
            <Progress value={report.score} className="mt-2 h-1.5" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onExport("json")}>
              <FileJson className="h-4 w-4" /> JSON
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onExport("md")}>
              <FileText className="h-4 w-4" /> Markdown
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onExport("pdf")}>
              <Download className="h-4 w-4" /> PDF (Em breve)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap bg-background/40">
          <TabsTrigger value="overview" className="text-xs">Visão geral</TabsTrigger>
          <TabsTrigger value="diffs" className="text-xs">Diferenças</TabsTrigger>
          <TabsTrigger value="suggestions" className="text-xs">Sugestões</TabsTrigger>
          <TabsTrigger value="preparation" className="text-xs">Preparação</TabsTrigger>
          {report.source === "import" && <TabsTrigger value="files" className="text-xs">Arquivos</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="mt-3">
          <OverviewTab report={report} />
        </TabsContent>
        <TabsContent value="diffs" className="mt-3">
          <DiffsTab report={report} />
        </TabsContent>
        <TabsContent value="suggestions" className="mt-3">
          <SuggestionsTab report={report} />
        </TabsContent>
        <TabsContent value="preparation" className="mt-3">
          <PreparationTab report={report} />
        </TabsContent>
        {report.source === "import" && (
          <TabsContent value="files" className="mt-3">
            <FilesTab report={report} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function OverviewTab({ report }: { report: CompatReport }) {
  const grouped = report.checks.reduce<Record<string, CompatCheck[]>>((acc: any, c: any) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {});
  const catLabels: Record<string, string> = {
    manifest: "Manifest",
    structure: "Estrutura",
    assets: "Assets",
    permissions: "Permissões",
    meta: "Metadados",
  };
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Object.entries(grouped).map(([cat, items]) => (
        <Card key={cat} className="border-border/60">
          <CardContent className="space-y-2 p-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{catLabels[cat] ?? cat}</p>
            {items.map((c: any) => (
              <CheckRow key={c.key} c={c} />
            ))}
          </CardContent>
        </Card>
      ))}
      {report.source === "import" && (
        <Card className="border-border/60 md:col-span-2">
          <CardContent className="grid grid-cols-2 gap-3 p-4 text-sm md:grid-cols-4">
            <Stat label="Arquivos" value={report.totals.files} />
            <Stat label="Ausentes" value={report.totals.missing} tone="text-amber-300" />
            <Stat label="Extras" value={report.totals.extras} tone="text-cyan-300" />
            <Stat label="Pastas" value={report.folders.length} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-background/40 p-3 text-center">
      <p className={`text-2xl font-bold ${tone ?? ""}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function CheckRow({ c }: { c: CompatCheck }) {
  const Icon = c.status === "ok" ? CheckCircle2 : c.status === "warn" ? AlertTriangle : XCircle;
  const color = c.status === "ok" ? "text-emerald-400" : c.status === "warn" ? "text-amber-400" : "text-rose-400";
  return (
    <div className="flex items-start gap-2 rounded-md border border-border/30 bg-background/40 px-2.5 py-2 text-xs">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{c.label}</p>
        <p className="truncate text-muted-foreground">
          <span className="opacity-70">Factory:</span> {c.factory} · <span className="opacity-70">Extensão:</span> {c.actual}
        </p>
      </div>
    </div>
  );
}

function DiffsTab({ report }: { report: CompatReport }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60">
      <table className="w-full text-xs">
        <thead className="bg-background/60 text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Item</th>
            <th className="px-3 py-2 text-left font-medium">Factory</th>
            <th className="px-3 py-2 text-left font-medium">Extensão</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {report.checks.map((c: any) => (
            <tr key={c.key} className="border-t border-border/40">
              <td className="px-3 py-2 font-medium">{c.label}</td>
              <td className="px-3 py-2 font-mono text-emerald-200/80">{c.factory}</td>
              <td className="px-3 py-2 font-mono text-cyan-200/80">{c.actual}</td>
              <td className="px-3 py-2">
                <Badge variant="outline" className={statusTone(c.status)}>
                  {c.status.toUpperCase()}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SuggestionsTab({ report }: { report: CompatReport }) {
  if (report.suggestions.length === 0) {
    return (
      <Card className="border-emerald-500/40 bg-emerald-500/5">
        <CardContent className="p-6 text-center text-sm text-emerald-200">
          <CheckCircle2 className="mx-auto mb-2 h-6 w-6" />
          Nenhuma sugestão — extensão totalmente alinhada ao padrão da Factory.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-2">
      {report.suggestions.map((s: any, i: number) => (
        <div
          key={i}
          className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p>{s}</p>
        </div>
      ))}
    </div>
  );
}

function PreparationTab({ report }: { report: CompatReport }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Passos previstos para adaptar esta extensão ao padrão da Factory nas próximas fases.
        <b> Nenhum arquivo é alterado agora.</b>
      </p>
      <ol className="space-y-2">
        {report.preparation.map((p: any, i: number) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/60 text-[11px] font-mono">
              {i + 1}
            </span>
            <p>{p}</p>
          </li>
        ))}
      </ol>
      <Card className="border-border/60 bg-background/40">
        <CardContent className="space-y-1 p-4 text-xs">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Padrão da Factory</p>
          <p><b>Manifest:</b> V{FACTORY_STANDARD.manifestVersion}</p>
          <p><b>Arquivos obrigatórios:</b> {FACTORY_STANDARD.requiredFiles.join(", ")}</p>
          <p><b>Pastas recomendadas:</b> {FACTORY_STANDARD.recommendedFolders.join(", ")}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function FilesTab({ report }: { report: CompatReport }) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <FileList title="Existentes" tone="text-emerald-300" items={report.existingFiles} />
      <FileList title="Ausentes (Factory)" tone="text-amber-300" items={report.missingFiles} emptyLabel="Nada ausente." />
      <FileList title="Extras" tone="text-cyan-300" items={report.extraFiles} emptyLabel="Sem extras." />
    </div>
  );
}

function FileList({
  title,
  tone,
  items,
  emptyLabel,
}: {
  title: string;
  tone: string;
  items: string[];
  emptyLabel?: string;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <p className={`mb-2 text-xs font-semibold ${tone}`}>{title} ({items.length})</p>
        <ScrollArea className="h-[280px]">
          {items.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">{emptyLabel ?? "—"}</p>
          ) : (
            <ul className="space-y-1 pr-3 text-[11px] font-mono">
              {items.map((f) => <li key={f} className="truncate">{f}</li>)}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// mark Upload used to avoid unused import warning in strict environments
void Upload;
