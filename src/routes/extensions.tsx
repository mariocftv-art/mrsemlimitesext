import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Archive,
  ArchiveRestore,
  Bug,
  Copy,
  Download,
  Eye,
  FolderOpen,
  GitBranch,
  Hammer,
  ImageIcon,
  MessageCircle,
  Pencil,
  Plus,
  Puzzle,
  Search,
  Trash2,
  Upload,
} from "lucide-react";

const SUPPORT_WHATSAPP_URL =
  "https://wa.me/5511962579428?text=" +
  encodeURIComponent("Olá! Preciso de suporte com a extensão MR Sem Limites.");
const openSupport = () => window.open(SUPPORT_WHATSAPP_URL, "_blank", "noopener");
import { ImportExtensionDialog } from "@/factory/importer-dialog";

import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  archiveExtension,
  createExtension,
  deleteCustomExtension,
  duplicateExtension,
  getAllExtensions,
  restoreExtension,
  scanExtension,
  subscribe,
  updateExtension,
  type ExtensionRecord,
  type ExtensionStatus,
  type NeonTone,
} from "@/factory";

export const Route = createFileRoute("/extensions")({
  component: ExtensionsPage,
});

const glow: Record<NeonTone, string> = {
  cyan: "var(--neon-cyan)",
  violet: "var(--neon-violet)",
  magenta: "var(--neon-magenta)",
  lime: "var(--neon-lime)",
};

const statusMeta: Record<ExtensionStatus, { label: string; dot: string; color: string }> = {
  production: { label: "Produção", dot: "🟢", color: "var(--neon-lime)" },
  development: { label: "Desenvolvimento", dot: "🟡", color: "#facc15" },
  testing: { label: "Testes", dot: "🔵", color: "var(--neon-cyan)" },
  archived: { label: "Arquivada", dot: "⚪", color: "#94a3b8" },
};

const EXT1_ZIP_URL = "/MR%20Sem%20Limites%20EXT1.zip";
const EXT2_ZIP_URL = "/__l5e/assets-v1/ce8b8538-9670-4dc9-80ef-8143186ab254/MR Sem Limites EXT2.zip";
const EXT3_ZIP_URL = "/__l5e/assets-v1/e5691ba7-8515-4004-bb77-b0df44b06628/MR-Sem-Limites-EXT3-v3.2.6.zip";
const EXT4_ZIP_URL = "/__l5e/assets-v1/a9e2a317-8481-456e-9dc6-5df018c0cc59/MR Sem Limite Manus.zip";
const EXT5_ZIP_URL = "/__l5e/assets-v1/2ffef2a8-2f3c-45f7-9860-08ef3b160b13/MR-Sem-Limites-EXT5-v5.4.5.zip";

type Filter = "all" | ExtensionStatus;
type Sort = "name" | "version" | "updated" | "status";

function useFactoryExtensions() {
  return useSyncExternalStore(
    subscribe,
    () => getAllExtensions(),
    () => getAllExtensions(),
  );
}

function ExtensionsPage() {
  const extensions = useFactoryExtensions();
  const ext1 = extensions.find((e) => e.code === "EXT1");
  const ext1Zip = ext1?.packagedZip ?? EXT1_ZIP_URL;
  const [wizardOpen, setWizardOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<ExtensionRecord | null>(null);


  const downloadExt1 = () => {
    downloadZip(ext1Zip, "MR Sem Limites EXT1.zip");
  };

  return (
    <AppShell
      title="Minhas Extensões"
      subtitle="Cadastro isolado de cada extensão. Crie, edite, duplique e arquive."
      actions={
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setImportOpen(true)}
          >
            <Upload className="h-4 w-4" /> Importar Extensão
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
            onClick={() => setWizardOpen(true)}
          >
            <Plus className="h-4 w-4" /> Nova Extensão
          </Button>
        </div>
      }

    >
      <Card className="glass mb-4 border-primary/40">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold">EXT1 Download</p>
              <p className="text-xs text-muted-foreground">
                Baixe o ZIP, descompacte e no Chrome use “Carregar sem compactação” na pasta interna “MR Sem Limites EXT1”, onde está o manifest.json.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:w-auto">
              <Button className="gap-1.5 md:w-auto" onClick={downloadExt1}>
                <Download className="h-4 w-4" /> EXT1 Download
              </Button>
              <Button variant="outline" className="gap-1.5 border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10 md:w-auto" onClick={openSupport}>
                <MessageCircle className="h-4 w-4" /> Suporte
              </Button>
            </div>
          </CardContent>
        </Card>

      <Card className="glass mb-4 border-primary/40">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold">EXT2 Download</p>
              <p className="text-xs text-muted-foreground">
                Baixe o ZIP, descompacte e no Chrome use “Carregar sem compactação” na pasta interna “MR Sem Limite Ext 2”, onde está o manifest.json.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:w-auto">
              <Button
                className="gap-1.5 md:w-auto"
                onClick={() => {
                  downloadZip(EXT2_ZIP_URL, "MR Sem Limites EXT2.zip");
                  toast.success("Download da EXT2 iniciado.");
                }}
              >
                <Download className="h-4 w-4" /> EXT2 Download
              </Button>
              <Button variant="outline" className="gap-1.5 border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10 md:w-auto" onClick={openSupport}>
                <MessageCircle className="h-4 w-4" /> Suporte
              </Button>
            </div>
          </CardContent>
        </Card>

      <Card className="glass mb-4 border-primary/40">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold">EXT3 Download — Neo-Core Orbe IA</p>
              <p className="text-xs text-muted-foreground">
                Cópia da EXT2 com novo painel Neo-Core: relógio, timer de trabalho decrescente, Orbe IA interativa por voz. Mesma licença da EXT2.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:w-auto">
              <Button
                className="gap-1.5 md:w-auto"
                onClick={() => {
                  downloadZip(EXT3_ZIP_URL, "MR Sem Limites EXT3.zip");
                  toast.success("Download da EXT3 iniciado.");
                }}
              >
                <Download className="h-4 w-4" /> EXT3 Download
              </Button>
              <Button variant="outline" className="gap-1.5 border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10 md:w-auto" onClick={openSupport}>
                <MessageCircle className="h-4 w-4" /> Suporte
              </Button>
            </div>
          </CardContent>
        </Card>

      <Card className="glass mb-4 border-primary/40">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold">MR Sem Limite Manus — Download</p>
              <p className="text-xs text-muted-foreground">
                Ponte de API para o Manus com congelamento de contadores de crédito no cliente (Shadow Mode V17). Baixe o ZIP, descompacte e no Chrome use “Carregar sem compactação” na pasta interna “MR Sem Limite Manus”.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:w-auto">
              <Button
                className="gap-1.5 md:w-auto"
                onClick={() => {
                  downloadZip(EXT4_ZIP_URL, "MR Sem Limite Manus.zip");
                  toast.success("Download iniciado.");
                }}
              >
                <Download className="h-4 w-4" /> MR Sem Limite Manus

              </Button>
              <Button variant="outline" className="gap-1.5 border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10 md:w-auto" onClick={openSupport}>
                <MessageCircle className="h-4 w-4" /> Suporte
              </Button>
            </div>
          </CardContent>
        </Card>

      <Card className="glass mb-4 border-primary/40">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold">EXT5 — Instagram Publisher</p>
              <p className="text-xs text-muted-foreground">
                Todas as funcionalidades da EXT3 + aba <b>Instagram</b> com IA: descreva o post → gera imagem + legenda + hashtags → você aprova → publica direto no @linkmrstore. Inclui biblioteca de 20 prompts de imagem e 20 de vídeo.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:w-auto">
              <Button
                className="gap-1.5 md:w-auto"
                style={{ background: "linear-gradient(135deg,#f58529,#dd2a7b,#8134af,#515bd4)", color: "#fff" }}
                onClick={() => {
                  downloadZip(EXT5_ZIP_URL, "MR-Sem-Limites-EXT5-v5.4.5.zip");
                  toast.success("Download da EXT5 iniciado.");
                }}
              >
                <Download className="h-4 w-4" /> EXT5 v5.4.5 Download
              </Button>
              <Button variant="outline" className="gap-1.5 border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10 md:w-auto" onClick={openSupport}>
                <MessageCircle className="h-4 w-4" /> Suporte
              </Button>
            </div>
          </CardContent>
        </Card>




      <NewExtensionWizard open={wizardOpen} onOpenChange={setWizardOpen} />
      <ImportExtensionDialog open={importOpen} onOpenChange={setImportOpen} />

      {editing && (
        <EditExtensionDialog
          ext={editing}
          onOpenChange={(o) => !o && setEditing(null)}
        />
      )}
    </AppShell>
  );
}

function downloadZip(url: string, filename: string) {
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Falha no download: ${res.status}`);
      return res.blob();
    })
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success(`Download de ${filename} iniciado.`);
    })
    .catch((err) => toast.error(err instanceof Error ? err.message : "Falha no download."));
}

function ExtensionCard({ ext, onEdit }: { ext: ExtensionRecord; onEdit: () => void }) {
  const isSeed = ext.id === "ext-01";
  const status = statusMeta[ext.status];
  const scan = useMemo(() => scanExtension(ext.sourceDir), [ext.sourceDir]);
  const logo = ext.assets.logo ?? scan.assets.logo ?? scan.assets.icon128 ?? scan.assets.icon48;
  const banner = ext.assets.banner ?? scan.assets.banner ?? scan.assets.chatBg;
  const lastBuild = ext.builds[ext.builds.length - 1];
  const scannedBuild = scan.builds[scan.builds.length - 1];
  const buildLabel = lastBuild
    ? `v${lastBuild.version}`
    : scannedBuild
      ? scannedBuild.filename
      : "—";

  const handleArchive = () => {
    if (ext.status === "archived") {
      restoreExtension(ext.id);
      toast.success(`${ext.name} restaurada.`);
    } else {
      archiveExtension(ext.id);
      toast.success(`${ext.name} arquivada.`);
    }
  };

  const handleDuplicate = () => {
    const copy = duplicateExtension(ext.id);
    if (copy) toast.success(`Duplicada como ${copy.name}.`);
  };

  const handleDelete = () => {
    if (isSeed) {
      toast.error("A extensão seed não pode ser excluída.");
      return;
    }
    if (!confirm(`Excluir permanentemente "${ext.name}"?`)) return;
    if (deleteCustomExtension(ext.id)) toast.success("Extensão excluída.");
  };

  return (
    <Card
      className="glass relative overflow-hidden border-border/60"
      style={{ boxShadow: `0 0 40px -28px ${glow[ext.tone]}` }}
    >
      {banner && (
        <div
          className="h-20 w-full bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${banner})` }}
        />
      )}
      <CardContent className="relative space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60"
              style={{ background: "var(--gradient-surface)" }}
            >
              {logo ? (
                <img src={logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <Puzzle className="h-5 w-5" style={{ color: glow[ext.tone] }} />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold">{ext.name}</p>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {ext.code} · v{ext.version}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-border/60 text-[10px] uppercase tracking-widest"
            style={{ color: status.color }}
          >
            {status.dot} {status.label}
          </Badge>
        </div>

        {ext.code === "EXT1" && ext.packagedZip && (
          <Button className="w-full gap-1.5" onClick={() => downloadZip(ext.packagedZip!, "MR Sem Limites EXT1.zip")}>
            <Download className="h-4 w-4" /> EXT1 Download
          </Button>
        )}

        <p className="line-clamp-2 text-xs text-muted-foreground">{ext.description}</p>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <InfoRow k="Última Build" v={buildLabel} />
          <InfoRow k="Arquivos" v={String(scan.files.length)} />
          <InfoRow k="Atualizada em" v={ext.updatedAt} />
          <InfoRow k="Pasta" v={ext.id} mono />
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <ActionBtn icon={Eye} label="Live" asChild>
            <Link to="/live/$id" params={{ id: ext.id }}>Live</Link>
          </ActionBtn>
          <ActionBtn icon={Eye} label="Preview" asChild>
            <Link to="/preview/$id" params={{ id: ext.id }}>Preview</Link>
          </ActionBtn>
          <ActionBtn icon={Bug} label="Runtime" asChild>
            <Link to="/runtime/$id" params={{ id: ext.id }}>Runtime</Link>
          </ActionBtn>
          <ActionBtn icon={Pencil} label="Editar" onClick={onEdit} />
          <ActionBtn icon={FolderOpen} label="Projeto" asChild>
            <Link to="/editor" search={{}}>Projeto</Link>
          </ActionBtn>
          <ActionBtn icon={Hammer} label="Build" asChild>
            <Link to="/build-center">Build</Link>
          </ActionBtn>
          <ActionBtn icon={ImageIcon} label="Assets" asChild>
            <Link to="/assets">Assets</Link>
          </ActionBtn>
          <ActionBtn icon={GitBranch} label="Versões" asChild>
            <Link to="/versions">Versões</Link>
          </ActionBtn>
          <ActionBtn icon={Copy} label="Duplicar" onClick={handleDuplicate} />
          <ActionBtn
            icon={ext.status === "archived" ? ArchiveRestore : Archive}
            label={ext.status === "archived" ? "Restaurar" : "Arquivar"}
            onClick={handleArchive}
          />
          {ext.packagedZip && (
            <ActionBtn icon={Download} label="ZIP" onClick={() => downloadZip(ext.packagedZip!, `${ext.code}.zip`)} />
          )}
          {!isSeed && (
            <ActionBtn icon={Trash2} label="Excluir" onClick={handleDelete} destructive />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="rounded border border-border/40 bg-background/40 px-2 py-1.5">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{k}</p>
      <p className={`mt-0.5 truncate ${mono ? "font-mono" : ""}`}>{v}</p>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  asChild,
  children,
  destructive,
}: {
  icon: typeof Pencil;
  label: string;
  onClick?: () => void;
  asChild?: boolean;
  children?: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <Button
      asChild={asChild}
      onClick={onClick}
      variant="outline"
      size="sm"
      className={`h-8 gap-1 text-[11px] ${
        destructive ? "border-destructive/40 text-destructive hover:bg-destructive/10" : ""
      }`}
      title={label}
    >
      {asChild ? (
        (children as React.ReactElement)
      ) : (
        <span className="flex items-center gap-1">
          <Icon className="h-3.5 w-3.5" /> {label}
        </span>
      )}
    </Button>
  );
}

// ============================================================
// Wizard
// ============================================================

const TONES: { value: NeonTone; label: string; color: string }[] = [
  { value: "cyan", label: "Ciano", color: "var(--neon-cyan)" },
  { value: "violet", label: "Violeta", color: "var(--neon-violet)" },
  { value: "magenta", label: "Magenta", color: "var(--neon-magenta)" },
  { value: "lime", label: "Lima", color: "var(--neon-lime)" },
];

const WIZARD_STEPS = ["Nome", "Código", "Logo", "Cor", "Descrição", "Estrutura"] as const;

function NewExtensionWizard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [tone, setTone] = useState<NeonTone>("cyan");
  const [description, setDescription] = useState("");

  const reset = () => {
    setStep(0);
    setName("");
    setCode("");
    setLogo(undefined);
    setTone("cyan");
    setDescription("");
  };

  const close = () => {
    reset();
    onOpenChange(false);
  };

  const handleLogo = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const finish = () => {
    const rec = createExtension({
      name,
      code: code || undefined,
      description,
      tone,
      logo,
    });
    toast.success(
      `Extensão ${rec.code} criada. Estrutura registrada em extensions/${rec.id}/`,
    );
    close();
  };

  const canNext = () => {
    if (step === 0) return name.trim().length >= 2;
    if (step === 4) return description.trim().length >= 5;
    return true;
  };

  const progress = ((step + 1) / WIZARD_STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Extensão · Etapa {step + 1} de {WIZARD_STEPS.length}</DialogTitle>
          <DialogDescription>{WIZARD_STEPS[step]}</DialogDescription>
        </DialogHeader>

        <Progress value={progress} className="h-1.5" />

        <div className="min-h-[180px] py-3">
          {step === 0 && (
            <div className="space-y-2">
              <Label>Nome da extensão</Label>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: MR Cursor"
              />
              <p className="text-xs text-muted-foreground">
                Aparece no popup, sidepanel e loja. Mínimo 2 caracteres.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2">
              <Label>Código interno (opcional)</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex.: EXT2 (gerado automaticamente se vazio)"
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco para atribuir o próximo código livre.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Label>Logo (PNG/SVG, opcional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogo(e.target.files?.[0] ?? null)}
              />
              {logo && (
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt=""
                    className="h-16 w-16 rounded-lg border border-border/60 object-cover"
                  />
                  <Button variant="ghost" size="sm" onClick={() => setLogo(undefined)}>
                    Remover
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <Label>Cor principal</Label>
              <div className="grid grid-cols-4 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition ${
                      tone === t.value
                        ? "border-primary bg-primary/10"
                        : "border-border/60 hover:border-primary/40"
                    }`}
                  >
                    <span
                      className="h-8 w-8 rounded-full"
                      style={{ background: t.color, boxShadow: `0 0 20px ${t.color}` }}
                    />
                    <span className="text-xs">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="O que a extensão faz? (mínimo 5 caracteres)"
                rows={4}
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Será registrada no gerenciador com a estrutura padrão isolada:
              </p>
              <pre className="rounded-md border border-border/60 bg-background/40 p-3 text-[11px] leading-relaxed">
{`extensions/
  <ext-id>/
    assets/
    icons/
    build/
    docs/
    manifest/
    popup/
    sidepanel/`}
              </pre>
              <div className="rounded-md border border-border/40 bg-background/30 p-3 text-xs">
                <p><span className="text-muted-foreground">Nome:</span> {name}</p>
                <p><span className="text-muted-foreground">Código:</span> {code || "auto"}</p>
                <p><span className="text-muted-foreground">Cor:</span> {tone}</p>
                <p className="line-clamp-2"><span className="text-muted-foreground">Descrição:</span> {description}</p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Nenhum arquivo de EXT1 é copiado. A nova extensão nasce vazia.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => (step === 0 ? close() : setStep(step - 1))}
          >
            {step === 0 ? "Cancelar" : "Voltar"}
          </Button>
          {step < WIZARD_STEPS.length - 1 ? (
            <Button
              onClick={() => canNext() && setStep(step + 1)}
              disabled={!canNext()}
              style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
            >
              Próximo
            </Button>
          ) : (
            <Button
              onClick={finish}
              style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
            >
              Criar Extensão
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Edit Dialog (minimal)
// ============================================================

function EditExtensionDialog({
  ext,
  onOpenChange,
}: {
  ext: ExtensionRecord;
  onOpenChange: (o: boolean) => void;
}) {
  const [name, setName] = useState(ext.name);
  const [description, setDescription] = useState(ext.description);
  const [version, setVersion] = useState(ext.version);
  const [status, setStatus] = useState<ExtensionStatus>(ext.status);
  const [tone, setTone] = useState<NeonTone>(ext.tone);
  const [notes, setNotes] = useState(ext.notes ?? "");

  const save = () => {
    updateExtension(ext.id, { name, description, version, status, tone, notes });
    toast.success("Extensão atualizada.");
    onOpenChange(false);
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar {ext.code}</DialogTitle>
          <DialogDescription>Atualize metadados da extensão.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Versão</Label>
              <Input value={version} onChange={(e) => setVersion(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ExtensionStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">🟢 Produção</SelectItem>
                  <SelectItem value="development">🟡 Desenvolvimento</SelectItem>
                  <SelectItem value="testing">🔵 Testes</SelectItem>
                  <SelectItem value="archived">⚪ Arquivada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Cor</Label>
            <div className="flex gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTone(t.value)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    tone === t.value ? "border-primary" : "border-transparent"
                  }`}
                  style={{ background: t.color }}
                  title={t.label}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Descrição</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid gap-1.5">
            <Label>Observações</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={save}
            style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
