import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  FileCode,
  FileJson,
  FlaskConical,
  FolderTree,
  Home,
  ImageIcon,
  Info,
  Layout,
  Maximize2,
  Minimize2,
  MessageSquare,
  Package,
  Puzzle,
  RefreshCcw,
  Settings2,
  ShieldAlert,
  SquareStack,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { LabWorkspace } from "@/factory/lab";


import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  getExtensionById,
  useExtensionScan,
  type ExtensionRecord,
  type FileEntry,
  type NeonTone,
} from "@/factory";

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
  amber: "#f59e0b",
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
  { value: "files", label: "Arquivos", icon: FolderTree },
  { value: "deps", label: "Dependências", icon: Package },
  { value: "manifest", label: "Manifest", icon: FileJson },
  { value: "info", label: "Informações", icon: Info },
  { value: "lab", label: "Laboratório", icon: FlaskConical },
] as const;


function PreviewWorkspace() {
  const { ext } = Route.useLoaderData() as { ext: ExtensionRecord };
  const navigate = useNavigate();
  const scan = useExtensionScan(ext);
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
      {!full && <SidePanel ext={ext} scan={scan} />}

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
            <TabsContent value="assets"><AssetsPreview ext={ext} scan={scan} /></TabsContent>
            <TabsContent value="files"><FilesPreview ext={ext} scan={scan} /></TabsContent>
            <TabsContent value="deps"><DepsPreview ext={ext} scan={scan} /></TabsContent>
            <TabsContent value="manifest"><ManifestPreview ext={ext} scan={scan} /></TabsContent>
            <TabsContent value="info"><InfoPreview ext={ext} scan={scan} /></TabsContent>
            <TabsContent value="lab"><LabWorkspace ext={ext} /></TabsContent>
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

function SidePanel({
  ext,
  scan,
}: {
  ext: ExtensionRecord;
  scan: import("@/factory").ExtensionScanBundle;
}) {
  const status = statusMeta[ext.status];
  const lastBuild = ext.builds[ext.builds.length - 1];
  const scannedBuild = scan.builds[scan.builds.length - 1];
  const logo =
    ext.assets.logo ??
    scan.assets.logo ??
    scan.assets.icon128 ??
    scan.assets.icon48;
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
            {logo ? (
              <img src={logo} alt="" className="h-full w-full object-cover" />
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
          <Row k="Versão manifest" v={scan.manifestVersion ?? "—"} />
          <Row k="Versão app.config" v={scan.appConfigVersion ?? "—"} />
          <Row
            k="Sincronismo"
            v={
              scan.versionStatus === "match"
                ? "🟢 iguais"
                : scan.versionStatus === "diverge"
                  ? "🔴 divergentes"
                  : "—"
            }
          />
          <Row
            k="Última Build"
            v={lastBuild ? `v${lastBuild.version}` : scannedBuild?.filename ?? "Nenhuma"}
          />
          <Row k="Arquivos" v={String(scan.files.length)} />
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

function AssetsPreview({
  ext,
  scan,
}: {
  ext: ExtensionRecord;
  scan: import("@/factory").ExtensionScanBundle;
}) {
  const named: { k: string; v?: string }[] = [
    { k: "Logo", v: scan.assets.logo ?? ext.assets.logo },
    { k: "Banner", v: scan.assets.banner ?? ext.assets.banner },
    { k: "Chat BG", v: scan.assets.chatBg },
    { k: "Icon 16", v: scan.assets.icon16 ?? ext.assets.icon16 },
    { k: "Icon 32", v: scan.assets.icon32 },
    { k: "Icon 48", v: scan.assets.icon48 ?? ext.assets.icon48 },
    { k: "Icon 64", v: scan.assets.icon64 },
    { k: "Icon 96", v: scan.assets.icon96 },
    { k: "Icon 128", v: scan.assets.icon128 ?? ext.assets.icon128 },
    { k: "Icon 256", v: scan.assets.icon256 },
    { k: "Icon 512", v: scan.assets.icon512 },
  ];
  return (
    <div className="space-y-6">
      <StageHeader
        ext={ext}
        title="Assets"
        subtitle={`Detectados diretamente em ${scan.sourceDir}`}
      />

      <section>
        <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Logos, banners e ícones
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {named.map((it) => (
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
              <p className="truncate text-[9px] text-muted-foreground/70">
                {it.v ? "encontrado" : "ausente"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {scan.assets.images.length > 0 && (
        <section>
          <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            Todas as imagens ({scan.assets.images.length})
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {scan.assets.images.map((f) => (
              <div
                key={f.path}
                className="flex flex-col items-center gap-1 rounded-lg border border-border/40 bg-background/40 p-2"
              >
                <div className="flex h-16 w-full items-center justify-center overflow-hidden rounded bg-background/60">
                  <img src={f.url} alt="" className="h-full w-full object-contain" />
                </div>
                <p className="w-full truncate text-[10px]">{f.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {scan.assets.sounds.length > 0 && (
        <section>
          <p className="mb-2 flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Volume2 className="h-3 w-3" /> Sons ({scan.assets.sounds.length})
          </p>
          <div className="space-y-2">
            {scan.assets.sounds.map((f) => (
              <div
                key={f.path}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/40 p-2 text-xs"
              >
                <span className="font-mono">{f.path}</span>
                <audio controls src={f.url} className="ml-auto h-8" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FilesPreview({
  ext,
  scan,
}: {
  ext: ExtensionRecord;
  scan: import("@/factory").ExtensionScanBundle;
}) {
  const grouped = groupByDir(scan.files);
  const dirs = Object.keys(grouped).sort();
  return (
    <div>
      <StageHeader
        ext={ext}
        title="Arquivos"
        subtitle={`${scan.files.length} arquivo(s) em ${dirs.length} diretório(s)`}
      />
      <ScrollArea className="max-h-[560px] rounded-lg border border-border/60 bg-background/60 p-3">
        <ul className="space-y-4 text-xs">
          {dirs.map((d) => (
            <li key={d}>
              <p className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                <FolderTree className="h-3 w-3" /> {d || "(raiz)"}
              </p>
              <ul className="ml-4 space-y-0.5">
                {grouped[d].map((f) => (
                  <li key={f.path} className="flex items-center gap-2">
                    <FileCode className="h-3 w-3 text-muted-foreground" />
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate font-mono hover:text-primary"
                    >
                      {f.name}
                    </a>
                    <Badge
                      variant="outline"
                      className="ml-auto border-border/40 px-1 py-0 text-[9px] uppercase tracking-widest"
                    >
                      {f.category}
                    </Badge>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}

function DepsPreview({
  ext,
  scan,
}: {
  ext: ExtensionRecord;
  scan: import("@/factory").ExtensionScanBundle;
}) {
  const pkg = scan.packageJson;
  return (
    <div className="space-y-4">
      <StageHeader
        ext={ext}
        title="Dependências"
        subtitle={pkg ? "package.json detectado" : "package.json não encontrado"}
      />
      {!pkg ? (
        <Card className="border-border/60">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Esta extensão não possui <code className="font-mono">package.json</code>.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-2 md:grid-cols-3">
            <Info2 k="Nome" v={pkg.name ?? "—"} />
            <Info2 k="Versão" v={pkg.version ?? "—"} />
            <Info2 k="Type" v={pkg.type ?? "commonjs"} />
          </div>

          <DepsBlock title="Scripts" map={pkg.scripts} />
          <DepsBlock title="Dependencies" map={pkg.dependencies} />
          <DepsBlock title="DevDependencies" map={pkg.devDependencies} />
          <DepsBlock title="PeerDependencies" map={pkg.peerDependencies} />
        </>
      )}
    </div>
  );
}

function DepsBlock({
  title,
  map,
}: {
  title: string;
  map?: Record<string, string>;
}) {
  const entries = Object.entries(map ?? {});
  return (
    <section>
      <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        {title} ({entries.length})
      </p>
      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">—</p>
      ) : (
        <div className="rounded-lg border border-border/40 bg-background/40 p-3">
          <table className="w-full text-xs">
            <tbody className="divide-y divide-border/30">
              {entries.map(([k, v]) => (
                <tr key={k}>
                  <td className="py-1 pr-4 font-mono">{k}</td>
                  <td className="py-1 font-mono text-muted-foreground">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ManifestPreview({
  ext,
  scan,
}: {
  ext: ExtensionRecord;
  scan: import("@/factory").ExtensionScanBundle;
}) {
  const real = scan.manifest;
  const preview =
    real ?? {
      manifest_version: ext.manifest.manifestVersion,
      name: ext.name,
      version: ext.version,
      description: ext.description,
      permissions: ext.manifest.permissions,
      host_permissions: ext.manifest.hostPermissions ?? [],
    };
  return (
    <div>
      <StageHeader
        ext={ext}
        title="Manifest"
        subtitle={real ? "manifest.json (lido do disco)" : "manifest.json não encontrado — usando cadastro"}
      />
      <pre className="max-h-[520px] overflow-auto rounded-lg border border-border/60 bg-background/60 p-4 text-[11px] leading-relaxed">
        {JSON.stringify(preview, null, 2)}
      </pre>
    </div>
  );
}

function InfoPreview({
  ext,
  scan,
}: {
  ext: ExtensionRecord;
  scan: import("@/factory").ExtensionScanBundle;
}) {
  return (
    <div>
      <StageHeader ext={ext} title="Informações" subtitle="Ficha técnica lida da pasta" />
      <div className="grid gap-2 text-sm md:grid-cols-2">
        <Info2 k="Nome" v={ext.name} />
        <Info2 k="Código" v={ext.code} />
        <Info2 k="Slug" v={ext.slug} />
        <Info2 k="Versão (registry)" v={ext.version} />
        <Info2 k="Versão (manifest)" v={scan.manifestVersion ?? "—"} />
        <Info2 k="Versão (app.config)" v={scan.appConfigVersion ?? "—"} />
        <Info2
          k="Sincronismo"
          v={
            scan.versionStatus === "match"
              ? "🟢 iguais"
              : scan.versionStatus === "diverge"
                ? "🔴 divergentes"
                : "—"
          }
        />
        <Info2 k="Status" v={`${statusMeta[ext.status].dot} ${statusMeta[ext.status].label}`} />
        <Info2 k="Pasta" v={ext.sourceDir} />
        <Info2 k="Arquivos" v={String(scan.files.length)} />
        <Info2 k="Popup" v={scan.hasPopup ? "🟢 sim" : "🔴 não"} />
        <Info2 k="Sidepanel" v={scan.hasSidepanel ? "🟢 sim" : "🔴 não"} />
        <Info2 k="Background" v={scan.hasBackground ? "🟢 sim" : "🔴 não"} />
        <Info2 k="Content scripts" v={scan.hasContentScripts ? "🟢 sim" : "🔴 não"} />
        <Info2 k="Build script" v={scan.hasBuildScript ? "🟢 sim" : "🔴 não"} />
        <Info2 k="package.json" v={scan.hasPackageJson ? "🟢 sim" : "🔴 não"} />
        <Info2
          k="Permissões"
          v={(scan.manifest?.permissions ?? ext.manifest.permissions).join(", ") || "—"}
        />
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

function groupByDir(files: FileEntry[]): Record<string, FileEntry[]> {
  return files.reduce<Record<string, FileEntry[]>>((acc, f) => {
    (acc[f.dir] ||= []).push(f);
    return acc;
  }, {});
}
