import { createFileRoute, Link } from "@tanstack/react-router";
import ext1ZipAsset from "@/assets/ext1_v35.asset.json";
import ext2ZipAsset from "@/assets/ext2_v29_zip.asset.json";
import ext3ZipAsset from "@/assets/ext3_v29_zip.asset.json";
import ext4ZipAsset from "@/assets/ext4_v412.zip.asset.json";
import ext5ZipAsset from "@/assets/ext5_v1701.zip.asset.json";
import ext7ZipAsset from "@/assets/ext7_v1770_zip.asset.json";
import { useMemo, useState, useEffect } from "react";
import {
  Activity,
  Bug,
  Download,
  Plus,
  Puzzle,
  Pencil,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  getAllExtensions,
  subscribe,
  createExtension,
  updateExtension,
  scanExtension,
  type ExtensionRecord,
  type ExtensionStatus,
  type NeonTone,
} from "@/factory";
import { Badge } from "@/components/ui/badge";
import { useServerFn } from "@tanstack/react-start";
import { getExtensionBuildInfo } from "@/factory/build.functions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

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

type Filter = "all" | ExtensionStatus;

function useExtensions() {
  const [extensions, setExtensions] = useState(() => getAllExtensions());
  useEffect(() => subscribe(() => setExtensions(getAllExtensions())), []);
  return extensions;
}

function ExtensionsPage() {
  const extensions = useExtensions();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editing, setEditing] = useState<ExtensionRecord | null>(null);

  const ext1 = extensions.find((e) => e.code === "EXT1");
  const ext2 = extensions.find((e) => e.code === "EXT2");
  const ext3 = extensions.find((e) => e.code === "EXT3");
  const ext4 = extensions.find((e) => e.code === "EXT4");
  const ext5 = extensions.find((e) => e.code === "EXT5");
  const ext6 = extensions.find((e) => e.code === "EXT6");
  const ext7 = extensions.find((e) => e.code === "EXT7");

  const [filter, setFilter] = useState<Filter>("all");

  const downloadExt1 = () => {
    downloadZip("/api/public/ext/download/ext1_v37.zip", "MR Sem Limites EXT1 v3.7.0.zip");
  };

  const downloadExt2 = () => {
    downloadZip("/api/public/ext/download/ext2_v29_zip.zip", "MR Sem Limites EXT2 v4.1.5.zip");
  };

  const downloadExt3 = () => {
    downloadZip("/api/public/ext/download/ext3_v29_zip.zip", "MR Sem Limites EXT3 v2.9.zip");
  };

  const downloadExt4 = () => {
    downloadZip("/api/public/ext/download/ext4_v412_zip.zip", "MR Sem Limites EXT4 v4.1.2.zip");
  };

  const downloadExt5 = () => {
    downloadZip("/api/public/ext/download/ext5_v1729_zip.zip", "MR Sem Limites EXT5 v17.5.9.zip");
  };

  const downloadExt6 = () => {
    downloadZip("/api/public/ext/download/ext6_v1765_zip.zip", "MR Sem Limites EXT6 v17.6.5.zip");
  };

  const downloadExt7 = () => {
    downloadZip("/api/public/ext/download/ext-07/integrated/ext7_v1775_zip.zip", "MR Sem Limites EXT7 v17.7.5.zip");
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
                  <p className="text-sm font-bold">EXTENSÃO DOIS 4.1.5</p>
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
                  <p className="text-sm font-bold">EXTENSÃO CINCO 17.5.9</p>
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

        {ext6 && (
          <Card className="glass border-cyan-500/40">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background/40">
                  <Puzzle className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">EXTENSÃO SEIS 17.6.0</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{ext6.name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  className="w-full gap-1.5" 
                  onClick={downloadExt6}
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

        {ext7 && (
          <Card className="glass border-cyan-500/40">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background/40">
                  <Puzzle className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">EXTENSÃO SETE 17.7.5</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{ext7.name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  className="w-full gap-1.5" 
                  onClick={downloadExt7}
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

      <NewExtensionWizard open={wizardOpen} onOpenChange={setWizardOpen} />

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
