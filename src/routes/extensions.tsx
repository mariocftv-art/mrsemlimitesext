import { createFileRoute, Link } from "@tanstack/react-router";
import ext1ZipAsset from "@/assets/ext1_v35.asset.json";
import ext2ZipAsset from "@/assets/ext2_v29_zip.asset.json";
import ext3ZipAsset from "@/assets/ext3_v29_zip.asset.json";
import ext4ZipAsset from "@/assets/ext4_v412.zip.asset.json";
import ext5ZipAsset from "@/assets/ext5_v1701.zip.asset.json";
import { useMemo, useState, useSyncExternalStore, useEffect } from "react";
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
  Pencil,
  Plus,
  Puzzle,
  Search,
  Trash2,
  Upload,
  Activity,
} from "lucide-react";
import { ImportExtensionDialog } from "@/factory/importer-dialog";
import { useServerFn } from "@tanstack/react-start";
import { getExtensionBuildInfo } from "@/factory/build.functions";

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
  orange: "#ff7e00",
};

const statusMeta: Record<ExtensionStatus, { label: string; dot: string; color: string }> = {
  production: { label: "Produção", dot: "🟢", color: "var(--neon-lime)" },
  development: { label: "Desenvolvimento", dot: "🟡", color: "#facc15" },
  testing: { label: "Testes", dot: "🔵", color: "var(--neon-cyan)" },
  archived: { label: "Arquivada", dot: "⚪", color: "#94a3b8" },
};

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
  const ext2 = extensions.find((e) => e.code === "EXT2");
  const ext3 = extensions.find((e) => e.code === "EXT3");
  const ext4 = extensions.find((e) => e.code === "EXT4");
  const ext5 = extensions.find((e) => e.code === "EXT5");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("updated");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<ExtensionRecord | null>(null);


  const filtered = useMemo(() => {
    let list = extensions.slice();
    if (filter !== "all") list = list.filter((e) => e.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "version":
          return b.version.localeCompare(a.version);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return b.updatedAt.localeCompare(a.updatedAt);
      }
    });
    return list;
  }, [extensions, filter, query, sort]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: extensions.length,
      production: 0,
      development: 0,
      testing: 0,
      archived: 0,
    };
    for (const e of extensions) c[e.status]++;
    return c;
  }, [extensions]);

  const downloadExt1 = () => {
    downloadZip("/ext1_v37.zip", "MR Sem Limites EXT1.zip");
  };

  const downloadExt2 = () => {
    downloadZip("/ext2_v4_zip.zip", "MR Sem Limite Ext 2 v4.0.zip");
  };

  const downloadExt3 = () => {
    downloadZip(ext3ZipAsset.url, "MR Sem Limites EXT3.zip");
  };

  const downloadExt4 = () => {
    downloadZip(ext4ZipAsset.url, "MR Sem Limites EXT4.zip");
  };

  const downloadExt5 = () => {
    downloadZip("/ext5_v1756_zip.zip", "MR Sem Limites EXT5 v17.5.6.zip");
  };

  return (
    <AppShell
      title="Minhas Extensões"
      subtitle="Cadastro isolado de cada extensão. Crie, edite, duplique e arquive."
      actions={
        <div className="flex gap-2">
          <Button
            size="sm"
            className="gap-1.5"
            style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
            onClick={() => setWizardOpen(true)}
          >
            <Plus className="h-4 w-4" /> Nova Extensão
          </Button>
          <Link to="/build-center">
            <Button size="sm" variant="outline" className="gap-1.5 border-primary/40 text-primary">
              <Activity className="h-4 w-4" /> Build Inspector
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ext1 && (
          <Card className="glass border-primary/40">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background/40">
                  <Puzzle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">EXTENSÃO UM 3.7.0</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{ext1.name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" className="w-full gap-1.5" onClick={downloadExt1}>
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Link to="/real-test" className="w-full">
                  <Button size="sm" variant="outline" className="w-full gap-1.5 border-primary/40 text-primary">
                    <Bug className="h-4 w-4" /> Real Test
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {ext2 && (
          <Card className="glass border-violet-500/40">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background/40">
                  <Puzzle className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">EXTENSÃO DOIS 4.0.0</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{ext2.name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  className="w-full gap-1.5" 
                  onClick={downloadExt2}
                  style={{ background: "var(--neon-violet)", color: "#fff" }}
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Link to="/real-test" className="w-full">
                  <Button size="sm" variant="outline" className="w-full gap-1.5 border-violet-500/40 text-violet-400">
                    <Bug className="h-4 w-4" /> Real Test
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {ext3 && (
          <Card className="glass border-magenta-500/40">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background/40">
                  <Puzzle className="h-5 w-5 text-magenta-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">EXTENSÃO TRÊS 2.9</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{ext3.name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  className="w-full gap-1.5" 
                  onClick={downloadExt3}
                  style={{ background: "var(--neon-magenta)", color: "#fff" }}
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Link to="/real-test" className="w-full">
                  <Button size="sm" variant="outline" className="w-full gap-1.5 border-magenta-500/40 text-magenta-400">
                    <Bug className="h-4 w-4" /> Real Test
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {ext4 && (
          <Card className="glass border-lime-500/40">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background/40">
                  <Puzzle className="h-5 w-5 text-lime-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">EXTENSÃO QUATRO 4.1.2</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{ext4.name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  className="w-full gap-1.5" 
                  onClick={downloadExt4}
                  style={{ background: "var(--neon-lime)", color: "#000" }}
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Link to="/real-test" className="w-full">
                  <Button size="sm" variant="outline" className="w-full gap-1.5 border-lime-500/40 text-lime-400">
                    <Bug className="h-4 w-4" /> Real Test
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        
        {ext5 && (
          <Card className="glass border-cyan-500/40">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background/40">
                  <Puzzle className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">EXTENSÃO CINCO 17.5.6</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{ext5.name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  className="w-full gap-1.5" 
                  onClick={downloadExt5}
                  style={{ background: "#00f2ff", color: "#000" }}
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Link to="/real-test" className="w-full">
                  <Button size="sm" variant="outline" className="w-full gap-1.5 border-cyan-500/40 text-cyan-400">
                    <Bug className="h-4 w-4" /> Real Test
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Seção removida conforme pedido: quadrados inferiores com cards detalhados foram removidos */}

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
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  toast.success("Download iniciado.");
}

function ExtensionCard({ ext }: { ext: ExtensionRecord; onEdit: () => void }) {
  const [manifestVersion, setManifestVersion] = useState<string | null>(null);
  const getBuildInfo = useServerFn(getExtensionBuildInfo);

  useEffect(() => {
    getBuildInfo({ data: { id: ext.id } }).then(info => {
      if (info && !("error" in info)) {
        setManifestVersion(info.manifestVersion);
      }
    });
  }, [ext.id]);

  const scan = useMemo(() => scanExtension(ext.sourceDir), [ext.sourceDir]);
  const logo = ext.assets.logo ?? scan.assets.logo ?? scan.assets.icon128 ?? scan.assets.icon48;
  const banner = ext.assets.banner ?? scan.assets.banner ?? scan.assets.chatBg;

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
                {ext.code} · v{manifestVersion || ext.version}
              </p>
              {manifestVersion && manifestVersion !== ext.version && (
                <Badge variant="destructive" className="mt-1 h-4 text-[8px] uppercase">Divergência de Versão</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          <ActionBtn icon={Download} label="Download" onClick={() => downloadZip(ext.packagedZip || "#", `${ext.name}.zip`)}>
            Download
          </ActionBtn>
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
  asChild,
  children,
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
      variant="outline"
      size="sm"
      className="h-8 gap-1 text-[11px]"
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
  { value: "orange", label: "Laranja", color: "#ff7e00" },
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
