import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  FileJson,
  Home,
  ImageIcon,
  Info,
  Layout,
  Maximize2,
  MessageSquare,
  Minimize2,
  Puzzle,
  RefreshCcw,
  Settings2,
  ShieldAlert,
  SquareStack,
} from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getExtensionById, type ExtensionRecord, type NeonTone } from "@/factory";

export const Route = createFileRoute("/preview/$id")({
  loader: ({ params }): { ext: ExtensionRecord } => {
    const ext = getExtensionById(params.id);
    if (!ext) throw notFound();
    return { ext };
  },
  component: PreviewWorkspace,
});

const glow: Record<NeonTone, string> = {
  cyan: "var(--neon-cyan)",
  violet: "var(--neon-violet)",
  magenta: "var(--neon-magenta)",
  lime: "var(--neon-lime)",
};

const statusMeta = {
  production: { label: "Produção", dot: "🟢" },
  development: { label: "Desenvolvimento", dot: "🟡" },
  testing: { label: "Testes", dot: "🔵" },
  archived: { label: "Arquivada", dot: "⚪" },
} as const;

const TABS = [
  { value: "home", label: "Home", icon: Home },
  { value: "chat", label: "Chat", icon: MessageSquare },
  { value: "popup", label: "Popup", icon: Layout },
  { value: "sidepanel", label: "Sidepanel", icon: SquareStack },
  { value: "config", label: "Configuração", icon: Settings2 },
  { value: "assets", label: "Assets", icon: ImageIcon },
  { value: "manifest", label: "Manifest", icon: FileJson },
  { value: "info", label: "Informações", icon: Info },
] as const;

function PreviewWorkspace() {
  const { ext } = Route.useLoaderData() as { ext: ExtensionRecord };
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("home");
  const [full, setFull] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const refresh = () => {
    setReloadKey((k) => k + 1);
    toast.success("Preview atualizado.");
  };

  const screenshot = async () => {
    if (!stageRef.current) return;
    try {
      const dataUrl = await toPng(stageRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0b0b12",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${ext.code}-${tab}-preview.png`;
      a.click();
      toast.success("Screenshot capturado.");
    } catch {
      toast.error("Falha ao capturar screenshot.");
    }
  };

  const content = (
    <div
      key={reloadKey}
      className={`grid gap-4 ${full ? "grid-cols-1" : "lg:grid-cols-[280px_1fr]"}`}
    >
      {!full && <SidePanel ext={ext} />}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          <span className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Modo Preview — nenhuma ação é enviada ao backend.
          </span>
          <Badge variant="outline" className="border-amber-400/40 text-amber-200">
            somente visual
          </Badge>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <TabsList className="flex-wrap bg-background/40">
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="gap-1.5 text-xs">
                  <t.icon className="h-3.5 w-3.5" /> {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" onClick={refresh} className="h-8 gap-1.5 text-xs">
                <RefreshCcw className="h-3.5 w-3.5" /> Atualizar
              </Button>
              <Button variant="outline" size="sm" onClick={screenshot} className="h-8 gap-1.5 text-xs">
                <Camera className="h-3.5 w-3.5" /> Screenshot
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFull((f) => !f)}
                className="h-8 gap-1.5 text-xs"
              >
                {full ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                {full ? "Sair" : "Tela cheia"}
              </Button>
            </div>
          </div>

          <div
            ref={stageRef}
            className="mt-3 min-h-[560px] rounded-xl border border-border/60 bg-background/40 p-4"
            style={{ boxShadow: `0 0 60px -30px ${glow[ext.tone]}` }}
          >
            <TabsContent value="home"><HomePreview ext={ext} /></TabsContent>
            <TabsContent value="chat"><ChatPreview ext={ext} /></TabsContent>
            <TabsContent value="popup"><PopupPreview ext={ext} /></TabsContent>
            <TabsContent value="sidepanel"><SidepanelPreview ext={ext} /></TabsContent>
            <TabsContent value="config"><ConfigPreview ext={ext} /></TabsContent>
            <TabsContent value="assets"><AssetsPreview ext={ext} /></TabsContent>
            <TabsContent value="manifest"><ManifestPreview ext={ext} /></TabsContent>
            <TabsContent value="info"><InfoPreview ext={ext} /></TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );

  return (
    <AppShell
      title={`Preview · ${ext.name}`}
      subtitle="Visualização fiel da interface — sem executar lógica, sem chamar backend."
      actions={
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/extensions" })} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
      }
    >
      {content}
    </AppShell>
  );
}

// ============================================================
// Sidebar (metadados)
// ============================================================

function SidePanel({ ext }: { ext: ExtensionRecord }) {
  const status = statusMeta[ext.status];
  const lastBuild = ext.builds[ext.builds.length - 1];
  return (
    <Card
      className="glass h-fit border-border/60"
      style={{ boxShadow: `0 0 40px -28px ${glow[ext.tone]}` }}
    >
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60"
            style={{ background: "var(--gradient-surface)" }}
          >
            {ext.assets.logo ? (
              <img src={ext.assets.logo} alt="" className="h-full w-full object-cover" />
            ) : (
              <Puzzle className="h-5 w-5" style={{ color: glow[ext.tone] }} />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{ext.name}</p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {ext.code} · v{ext.version}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-xs">
          <Row k="Status" v={`${status.dot} ${status.label}`} />
          <Row k="Versão" v={ext.version} />
          <Row k="Última Build" v={lastBuild ? `v${lastBuild.version}` : "—"} />
          <Row k="Slug" v={ext.slug} mono />
          <Row k="Código" v={ext.code} mono />
          <Row k="Pasta" v={ext.id} mono />
        </div>

        <Separator />

        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Descrição</p>
          <p className="text-xs leading-relaxed">{ext.description}</p>
        </div>

        {ext.notes && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Observações</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{ext.notes}</p>
            </div>
          </>
        )}

        <Button asChild variant="outline" size="sm" className="w-full text-xs">
          <Link to="/extensions">Voltar às extensões</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{k}</span>
      <span className={mono ? "font-mono" : ""}>{v}</span>
    </div>
  );
}

// ============================================================
// Previews (visuais, sem lógica)
// ============================================================

function StageHeader({ ext, title, subtitle }: { ext: ExtensionRecord; title: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 border-b border-border/40 pb-3">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-md"
        style={{ background: "var(--gradient-surface)" }}
      >
        {ext.assets.logo ? (
          <img src={ext.assets.logo} alt="" className="h-full w-full rounded-md object-cover" />
        ) : (
          <Puzzle className="h-4 w-4" style={{ color: glow[ext.tone] }} />
        )}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function HomePreview({ ext }: { ext: ExtensionRecord }) {
  return (
    <div>
      <StageHeader ext={ext} title={`${ext.name} · Home`} subtitle="Visão inicial da extensão" />
      <div
        className="rounded-xl border border-border/60 p-6"
        style={{ background: `radial-gradient(circle at top left, ${glow[ext.tone]}22, transparent 60%)` }}
      >
        <h2 className="text-xl font-bold">{ext.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{ext.description}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          {["Ativa", `v${ext.version}`, statusMeta[ext.status].label].map((v, i) => (
            <div key={i} className="rounded-lg border border-border/40 bg-background/40 p-3">
              <p className="text-lg font-semibold" style={{ color: glow[ext.tone] }}>
                {v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatPreview({ ext }: { ext: ExtensionRecord }) {
  const messages = [
    { role: "user", text: "Como usar esta extensão?" },
    { role: "assistant", text: `Olá! Sou o assistente da ${ext.name}. Posso ajudar com qualquer dúvida.` },
    { role: "user", text: "Gerar um prompt premium." },
    { role: "assistant", text: "Aqui está um exemplo de prompt otimizado…" },
  ];
  return (
    <div>
      <StageHeader ext={ext} title="Chat" subtitle="Simulação visual da conversa" />
      <div className="flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/60 bg-background/60"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-4 py-2 text-sm text-muted-foreground">
        Digite sua mensagem… <span className="ml-auto text-[10px]">(preview)</span>
      </div>
    </div>
  );
}

function PopupPreview({ ext }: { ext: ExtensionRecord }) {
  return (
    <div>
      <StageHeader ext={ext} title="Popup" subtitle="Preview do popup (350×500)" />
      <div className="flex justify-center">
        <div
          className="w-[350px] overflow-hidden rounded-xl border border-border/60 bg-background"
          style={{ boxShadow: `0 0 40px -20px ${glow[ext.tone]}` }}
        >
          <div
            className="flex items-center gap-2 border-b border-border/60 p-3"
            style={{ background: `linear-gradient(90deg, ${glow[ext.tone]}22, transparent)` }}
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md"
              style={{ background: glow[ext.tone] }}
            >
              <Puzzle className="h-4 w-4 text-black" />
            </div>
            <p className="text-sm font-semibold">{ext.name}</p>
            <span className="ml-auto text-[10px] text-muted-foreground">v{ext.version}</span>
          </div>
          <div className="space-y-2 p-4 text-xs">
            <div className="rounded-lg border border-border/40 bg-background/40 p-3">
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium">{statusMeta[ext.status].dot} {statusMeta[ext.status].label}</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-background/40 p-3">
              <p className="text-muted-foreground">Licença</p>
              <p className="font-medium">•••• •••• •••• XXXX</p>
            </div>
            <Button className="w-full" style={{ background: glow[ext.tone], color: "#000" }}>
              Abrir Sidepanel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidepanelPreview({ ext }: { ext: ExtensionRecord }) {
  return (
    <div>
      <StageHeader ext={ext} title="Sidepanel" subtitle="Preview do painel lateral (400px)" />
      <div className="flex justify-center">
        <div
          className="flex h-[500px] w-[400px] flex-col overflow-hidden rounded-xl border border-border/60 bg-background"
          style={{ boxShadow: `0 0 60px -30px ${glow[ext.tone]}` }}
        >
          <div className="border-b border-border/60 p-3">
            <p className="text-sm font-semibold">{ext.name}</p>
            <p className="text-[10px] text-muted-foreground">Sidepanel · v{ext.version}</p>
          </div>
          <div className="flex-1 space-y-2 overflow-auto p-3 text-xs">
            {["Prompts", "Componentes", "Assets", "Animações", "Configurações"].map((s) => (
              <div key={s} className="rounded-lg border border-border/40 bg-background/40 p-3">
                <p className="font-medium">{s}</p>
                <p className="text-muted-foreground">Área simulada da seção.</p>
              </div>
            ))}
          </div>
          <div className="border-t border-border/60 p-2 text-center text-[10px] text-muted-foreground">
            MR MÁXIMA · preview
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigPreview({ ext }: { ext: ExtensionRecord }) {
  return (
    <div>
      <StageHeader ext={ext} title="Configuração" subtitle="Preferências simuladas" />
      <div className="grid gap-2 text-sm">
        {[
          ["Idioma", "Português (BR)"],
          ["Tema", "Escuro"],
          ["Notificações", "Ativadas"],
          ["Som", "Habilitado"],
          ["Auto-atualização", "Ativada"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-4 py-2"
          >
            <span className="text-muted-foreground">{k}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
        <p className="mt-2 text-[11px] text-muted-foreground">
          Nenhuma preferência é salva neste preview — {ext.code}.
        </p>
      </div>
    </div>
  );
}

function AssetsPreview({ ext }: { ext: ExtensionRecord }) {
  const items = [
    { k: "Logo", v: ext.assets.logo },
    { k: "Banner", v: ext.assets.banner },
    { k: "Icon 16", v: ext.assets.icon16 },
    { k: "Icon 48", v: ext.assets.icon48 },
    { k: "Icon 128", v: ext.assets.icon128 },
  ];
  return (
    <div>
      <StageHeader ext={ext} title="Assets" subtitle="Imagens registradas no cadastro" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.k}
            className="flex flex-col items-center gap-2 rounded-lg border border-border/40 bg-background/40 p-3"
          >
            <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded border border-border/40 bg-background/60">
              {it.v ? (
                <img src={it.v} alt="" className="h-full w-full object-contain" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">{it.k}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManifestPreview({ ext }: { ext: ExtensionRecord }) {
  const preview = {
    manifest_version: ext.manifest.manifestVersion,
    name: ext.name,
    version: ext.version,
    description: ext.description,
    permissions: ext.manifest.permissions,
    host_permissions: ext.manifest.hostPermissions ?? [],
    action: ext.manifest.hasPopup ? { default_popup: "popup.html" } : undefined,
    side_panel: ext.manifest.hasSidepanel ? { default_path: "sidepanel.html" } : undefined,
    background: ext.manifest.hasBackground ? { service_worker: "background.js" } : undefined,
  };
  return (
    <div>
      <StageHeader ext={ext} title="Manifest" subtitle="manifest.json (preview)" />
      <pre className="max-h-[420px] overflow-auto rounded-lg border border-border/60 bg-background/60 p-4 text-[11px] leading-relaxed">
{JSON.stringify(preview, null, 2)}
      </pre>
    </div>
  );
}

function InfoPreview({ ext }: { ext: ExtensionRecord }) {
  return (
    <div>
      <StageHeader ext={ext} title="Informações" subtitle="Ficha técnica" />
      <div className="grid gap-2 text-sm md:grid-cols-2">
        <Info2 k="Nome" v={ext.name} />
        <Info2 k="Código" v={ext.code} />
        <Info2 k="Slug" v={ext.slug} />
        <Info2 k="Versão" v={ext.version} />
        <Info2 k="Status" v={`${statusMeta[ext.status].dot} ${statusMeta[ext.status].label}`} />
        <Info2 k="Pasta" v={ext.sourceDir} />
        <Info2 k="Criada em" v={ext.createdAt} />
        <Info2 k="Atualizada em" v={ext.updatedAt} />
        <Info2 k="Manifest v" v={String(ext.manifest.manifestVersion)} />
        <Info2 k="Permissões" v={ext.manifest.permissions.join(", ") || "—"} />
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Todos os dados são somente leitura neste preview.
      </p>
    </div>
  );
}

function Info2({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-background/40 p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
      <p className="mt-1 truncate font-medium">{v}</p>
    </div>
  );
}
