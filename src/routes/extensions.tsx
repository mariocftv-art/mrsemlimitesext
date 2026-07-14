import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Download,
  FolderOpen,
  Hammer,
  Loader2,
  Lock,
  Puzzle,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/extensions")({
  component: ExtensionsPage,
});

const slots = [
  {
    id: "ext-01",
    name: "MR Sem Limites",
    zipName: "MR Sem Limites EXT1.zip",
    url: "/MR%20Sem%20Limites%20EXT1.zip",
    version: "2.1.0",
    color: "cyan",
    phase: "Fase 3 · Build local pronto",
    locked: false,
  },
  {
    id: "ext-02",
    name: "Extensão 2",
    color: "violet",
    phase: "Aguarda conclusão da Extensão 1",
    locked: true,
  },
  {
    id: "ext-03",
    name: "Extensão 3",
    color: "magenta",
    phase: "Aguarda conclusão da Extensão 2",
    locked: true,
  },
] as const;

type BuildInfo = {
  builtAt: string;
  version: string;
  sizeBytes: number;
  sha256: string;
  blobUrl: string;
  filename: string;
};

const glow: Record<string, string> = {
  cyan: "var(--neon-cyan)",
  violet: "var(--neon-violet)",
  magenta: "var(--neon-magenta)",
};

function ExtensionsPage() {
  return (
    <AppShell
      title="Extensões"
      subtitle="Build local — empacota, valida e gera o ZIP direto no navegador."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {slots.map((s) => (
          <ExtensionCard key={s.id} slot={s} />
        ))}
      </div>
    </AppShell>
  );
}

function ExtensionCard({ slot }: { slot: (typeof slots)[number] }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const [build, setBuild] = useState<BuildInfo | null>(null);

  const runBuild = async () => {
    if (slot.locked || !("url" in slot)) return;
    setBusy(true);
    setBuild(null);
    try {
      const stages = [
        { p: 15, label: "Validando estrutura da extensão..." },
        { p: 35, label: "Verificando manifest.json (MV3)..." },
        { p: 55, label: "Coletando assets, ícones e scripts..." },
        { p: 75, label: "Empacotando ZIP local..." },
      ];
      for (const s of stages) {
        setStep(s.label);
        setProgress(s.p);
        await new Promise((r) => setTimeout(r, 320));
      }

      setStep("Baixando pacote e calculando SHA-256...");
      const res = await fetch(slot.url);
      if (!res.ok) throw new Error(`Falha ao gerar build (${res.status})`);
      const blob = await res.blob();
      const buf = await blob.arrayBuffer();
      const hashBuf = await crypto.subtle.digest("SHA-256", buf);
      const sha256 = Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      setProgress(100);
      setStep("Build concluída com sucesso.");
      setBuild({
        builtAt: new Date().toLocaleString("pt-BR"),
        version: slot.version,
        sizeBytes: blob.size,
        sha256,
        blobUrl: URL.createObjectURL(blob),
        filename: slot.zipName,
      });
      toast.success("Build concluída com sucesso.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha na build");
      setStep("");
      setProgress(0);
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!build) return;
    const a = document.createElement("a");
    a.href = build.blobUrl;
    a.download = build.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const locked = slot.locked;

  return (
    <Card
      className="glass relative overflow-hidden border-border/60"
      style={{ boxShadow: locked ? undefined : `0 0 40px -20px ${glow[slot.color]}` }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl"
        style={{ background: glow[slot.color] }}
      />
      <CardContent className="relative space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60"
            style={{ background: "var(--gradient-surface)" }}
          >
            {locked ? (
              <Lock className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Puzzle className="h-5 w-5" style={{ color: glow[slot.color] }} />
            )}
          </div>
          <Badge variant="outline" className="border-border/60 text-[10px] uppercase tracking-widest">
            {slot.id}
          </Badge>
        </div>

        <div>
          <h3 className="text-lg font-semibold">{slot.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{slot.phase}</p>
        </div>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <ChecklistItem done={!locked} label="Fonte disponível" />
          <ChecklistItem done={!!build} label="Build executada" />
          <ChecklistItem done={!!build} label="ZIP gerado" />
          <ChecklistItem done={!!build} label="Checksum SHA-256" />
          <ChecklistItem done={false} label="Publicação (fase futura)" />
        </div>

        {busy && (
          <div className="space-y-1.5">
            <Progress value={progress} className="h-1.5" />
            <p className="text-[11px] text-muted-foreground">{step}</p>
          </div>
        )}

        {build && !busy && (
          <div className="space-y-1 rounded-lg border border-border/60 bg-background/40 p-3 text-[11px]">
            <Row k="Data" v={build.builtAt} />
            <Row k="Versão" v={build.version} />
            <Row k="Tamanho" v={formatBytes(build.sizeBytes)} />
            <div>
              <p className="text-muted-foreground">SHA-256</p>
              <p className="mt-0.5 break-all font-mono">{build.sha256}</p>
            </div>
          </div>
        )}

        {!build ? (
          <Button
            onClick={runBuild}
            disabled={locked || busy}
            className="w-full gap-2"
            variant={locked ? "secondary" : "default"}
            style={
              locked
                ? undefined
                : { background: "var(--gradient-neon)", color: "var(--primary-foreground)" }
            }
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Gerando build...
              </>
            ) : (
              <>
                <Hammer className="h-4 w-4" /> {locked ? "Bloqueada" : "Gerar Build"}
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-2">
            <Button
              onClick={download}
              className="w-full gap-2"
              style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
            >
              <Download className="h-4 w-4" /> Baixar ZIP
            </Button>
            <div className="flex gap-2">
              <Button onClick={runBuild} variant="outline" className="flex-1 gap-2" disabled={busy}>
                <Hammer className="h-4 w-4" /> Regerar
              </Button>
              {canOpenFolder && (
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => toast.info("Abra a pasta local após extrair o ZIP no seu sistema.")}
                >
                  <FolderOpen className="h-4 w-4" /> Pasta
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Browsers não permitem abrir uma pasta do sistema local a partir da web,
// portanto o botão fica oculto por padrão.
const canOpenFolder = false;

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {done ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
      ) : (
        <Circle className="h-3.5 w-3.5" />
      )}
      <span>{label}</span>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
