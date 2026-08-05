import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Eraser,
  Filter,
  FlaskConical,
  Loader2,
  MessageSquare,
  Play,
  RotateCcw,
  Search,
  Send,
  Square,
  Trash2,
  WifiOff,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ExtensionRecord } from "@/factory";

// =========================================================
// Types
// =========================================================

type LicenseState = "active" | "trial" | "expired" | "blocked" | "pending";
type LovableState = "idle" | "running" | "stopped" | "approved" | "awaiting";
type ChatState = "idle" | "sending" | "received" | "error" | "offline" | "timeout" | "loading";

type SimEvent = {
  id: string;
  ts: number;
  type: string;
  description: string;
};

type StorageMap = Record<string, string>;

type SimState = {
  license: LicenseState;
  lovable: LovableState;
  chat: ChatState;
  events: SimEvent[];
  chromeStorage: StorageMap;
  localStorage: StorageMap;
  sessionStorage: StorageMap;
  storageUpdatedAt: number;
};

const initialSim = (ext: ExtensionRecord): SimState => ({
  license: "active",
  lovable: "idle",
  chat: "idle",
  events: [
    {
      id: crypto.randomUUID(),
      ts: Date.now(),
      type: "system",
      description: `Simulação iniciada para ${ext.name} v${ext.version}`,
    },
  ],
  chromeStorage: {
    "license.key": "LVB-XXXXX-XXXXX-XXXXX",
    "user.plan": "premium",
    "settings.theme": "dark",
  },
  localStorage: {
    "ui.lastRoute": "/home",
    "ui.tour": "completed",
  },
  sessionStorage: {
    "session.token": "sim-session-****",
  },
  storageUpdatedAt: Date.now(),
});

// =========================================================
// License visuals
// =========================================================

const licenseMeta: Record<LicenseState, { label: string; dot: string; tone: string; message: string }> = {
  active: { label: "Licença Ativa", dot: "🟢", tone: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10", message: "Todos os recursos liberados." },
  trial: { label: "Trial", dot: "🟡", tone: "text-amber-300 border-amber-500/40 bg-amber-500/10", message: "Período de teste ativo — 7 dias restantes." },
  expired: { label: "Expirada", dot: "🔴", tone: "text-rose-300 border-rose-500/40 bg-rose-500/10", message: "Renove sua licença para continuar." },
  blocked: { label: "Bloqueada", dot: "⚫", tone: "text-zinc-300 border-zinc-500/40 bg-zinc-500/10", message: "Licença bloqueada pelo administrador." },
  pending: { label: "Aguardando Ativação", dot: "🔵", tone: "text-sky-300 border-sky-500/40 bg-sky-500/10", message: "Insira sua chave para ativar." },
};

const chatMeta: Record<ChatState, { label: string; icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  idle: { label: "Ocioso", icon: CircleDot, tone: "text-muted-foreground" },
  sending: { label: "Enviando…", icon: Send, tone: "text-sky-300" },
  received: { label: "Resposta recebida", icon: CheckCircle2, tone: "text-emerald-300" },
  error: { label: "Erro", icon: XCircle, tone: "text-rose-300" },
  offline: { label: "Sem internet", icon: WifiOff, tone: "text-amber-300" },
  timeout: { label: "Timeout", icon: AlertTriangle, tone: "text-orange-300" },
  loading: { label: "Carregando…", icon: Loader2, tone: "text-sky-300" },
};

// =========================================================
// Root component
// =========================================================

export function LabWorkspace({ ext }: { ext: ExtensionRecord }) {
  const [sim, setSim] = useState<SimState>(() => initialSim(ext));

  const push = (type: string, description: string) => {
    setSim((s) => ({
      ...s,
      events: [
        { id: crypto.randomUUID(), ts: Date.now(), type, description },
        ...s.events,
      ].slice(0, 500),
    }));
  };

  const setLicense = (v: LicenseState) => {
    setSim((s) => ({ ...s, license: v }));
    push("license", `Estado da licença alterado para: ${licenseMeta[v].label}`);
  };

  const setLovable = (v: LovableState, label: string) => {
    setSim((s) => ({ ...s, lovable: v }));
    push("lovable", label);
    // Sons cadastrados (simulados) — sem lovable.dev
    if (v === "approved" || v === "awaiting") {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = v === "approved" ? 880 : 440;
        g.gain.value = 0.05;
        o.connect(g).connect(ctx.destination);
        o.start();
        setTimeout(() => { o.stop(); ctx.close(); }, 180);
      } catch { /* silencioso */ }
    }
  };

  const setChat = (v: ChatState, label: string) => {
    setSim((s) => ({ ...s, chat: v }));
    push("chat", label);
  };

  const clearStorage = () => {
    setSim((s) => ({
      ...s,
      chromeStorage: {},
      localStorage: {},
      sessionStorage: {},
      storageUpdatedAt: Date.now(),
    }));
    push("storage", "Armazenamento simulado limpo.");
    toast.success("Storage simulado limpo.");
  };

  const reset = () => {
    setSim(initialSim(ext));
    toast.success("Simulação resetada.");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <SimSidebar sim={sim} setLicense={setLicense} setLovable={setLovable} setChat={setChat} reset={reset} />
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-fuchsia-500/40 bg-fuchsia-500/10 px-3 py-2 text-xs text-fuchsia-200">
          <span className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Modo Simulação — nenhuma requisição real é executada.
          </span>
          <Badge variant="outline" className="border-fuchsia-400/40 text-fuchsia-200">
            laboratório
          </Badge>
        </div>

        <Tabs defaultValue="stage">
          <TabsList className="flex-wrap bg-background/40">
            <TabsTrigger value="stage" className="text-xs">Preview simulado</TabsTrigger>
            <TabsTrigger value="storage" className="text-xs">Storage</TabsTrigger>
            <TabsTrigger value="events" className="text-xs">Eventos</TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs">Checklist</TabsTrigger>
          </TabsList>

          <TabsContent value="stage">
            <SimulatedStage ext={ext} sim={sim} />
          </TabsContent>
          <TabsContent value="storage">
            <StoragePanel sim={sim} clear={clearStorage} />
          </TabsContent>
          <TabsContent value="events">
            <EventsPanel sim={sim} setSim={setSim} />
          </TabsContent>
          <TabsContent value="checklist">
            <ChecklistPanel ext={ext} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// =========================================================
// Sidebar
// =========================================================

function SimSidebar({
  sim,
  setLicense,
  setLovable,
  setChat,
  reset,
}: {
  sim: SimState;
  setLicense: (v: LicenseState) => void;
  setLovable: (v: LovableState, label: string) => void;
  setChat: (v: ChatState, label: string) => void;
  reset: () => void;
}) {
  return (
    <Card className="glass h-fit border-border/60">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-fuchsia-300" />
          <p className="text-sm font-semibold">Simulações</p>
        </div>

        <Section title="Licença">
          <div className="grid gap-1.5">
            {(Object.keys(licenseMeta) as LicenseState[]).map((k) => (
              <Button
                key={k}
                variant={sim.license === k ? "default" : "outline"}
                size="sm"
                className="h-8 justify-start gap-2 text-xs"
                onClick={() => setLicense(k)}
              >
                <span>{licenseMeta[k].dot}</span> {licenseMeta[k].label}
              </Button>
            ))}
          </div>
        </Section>

        <Separator />

        <Section title="Lovable">
          <div className="grid gap-1.5">
            <Button variant="outline" size="sm" className="h-8 justify-start gap-2 text-xs" onClick={() => setLovable("running", "▶ Iniciar geração")}>
              <Play className="h-3.5 w-3.5" /> Iniciar geração
            </Button>
            <Button variant="outline" size="sm" className="h-8 justify-start gap-2 text-xs" onClick={() => setLovable("stopped", "⏹ Parar geração")}>
              <Square className="h-3.5 w-3.5" /> Parar geração
            </Button>
            <Button variant="outline" size="sm" className="h-8 justify-start gap-2 text-xs" onClick={() => setLovable("approved", "✔ Resposta concluída (coin)")}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Resposta concluída
            </Button>
            <Button variant="outline" size="sm" className="h-8 justify-start gap-2 text-xs" onClick={() => setLovable("awaiting", "⚠ Pedido de aprovação (alert)")}>
              <AlertTriangle className="h-3.5 w-3.5" /> Pedido de aprovação
            </Button>
          </div>
        </Section>

        <Separator />

        <Section title="Chat">
          <div className="grid grid-cols-2 gap-1.5">
            <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => setChat("sending", "Mensagem enviada")}>Enviada</Button>
            <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => setChat("received", "Resposta recebida")}>Recebida</Button>
            <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => setChat("error", "Erro no chat")}>Erro</Button>
            <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => setChat("offline", "Sem internet")}>Offline</Button>
            <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => setChat("timeout", "Timeout")}>Timeout</Button>
            <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => setChat("loading", "Carregando…")}>Loading</Button>
          </div>
        </Section>

        <Separator />

        <Button variant="destructive" size="sm" className="w-full gap-2 text-xs" onClick={reset}>
          <RotateCcw className="h-3.5 w-3.5" /> Resetar Simulação
        </Button>
      </CardContent>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

// =========================================================
// Simulated stage
// =========================================================

function SimulatedStage({ ext, sim }: { ext: ExtensionRecord; sim: SimState }) {
  const lic = licenseMeta[sim.license];
  const chat = chatMeta[sim.chat];
  const ChatIcon = chat.icon;

  return (
    <div className="mt-3 space-y-4 rounded-xl border border-border/60 bg-background/40 p-4">
      <div className={`rounded-lg border p-4 ${lic.tone}`}>
        <p className="text-xs uppercase tracking-widest opacity-80">Status da licença</p>
        <p className="mt-1 text-lg font-semibold">{lic.dot} {lic.label}</p>
        <p className="mt-1 text-xs opacity-80">{lic.message}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Popup simulado */}
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Popup simulado</p>
          <p className="text-sm font-semibold">{ext.name}</p>
          <p className="text-[11px] text-muted-foreground">v{ext.version}</p>
          <div className="mt-3 space-y-2 text-xs">
            {sim.license === "expired" && (
              <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-2 text-rose-200">
                🔴 Licença expirada. Recursos bloqueados.
              </div>
            )}
            {sim.license === "blocked" && (
              <div className="rounded-md border border-zinc-500/40 bg-zinc-500/10 p-2 text-zinc-200">
                ⚫ Extensão bloqueada.
              </div>
            )}
            {sim.license === "pending" && (
              <div className="rounded-md border border-sky-500/40 bg-sky-500/10 p-2 text-sky-200">
                🔵 Insira sua chave de ativação.
              </div>
            )}
            {sim.license === "trial" && (
              <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-amber-200">
                🟡 Trial — 7 dias restantes.
              </div>
            )}
            {sim.license === "active" && (
              <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-2 text-emerald-200">
                🟢 Todos os recursos liberados.
              </div>
            )}
          </div>
        </div>

        {/* Lovable status */}
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Estado do Lovable</p>
          <p className="text-sm font-semibold capitalize">{sim.lovable}</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background/60">
            <div
              className={`h-full transition-all ${
                sim.lovable === "running" ? "w-2/3 bg-sky-400" :
                sim.lovable === "approved" ? "w-full bg-emerald-400" :
                sim.lovable === "awaiting" ? "w-1/2 bg-amber-400" :
                sim.lovable === "stopped" ? "w-1/3 bg-rose-400" : "w-0"
              }`}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {sim.lovable === "idle" && "Ocioso — pronto para simular."}
            {sim.lovable === "running" && "Geração em andamento (simulada)."}
            {sim.lovable === "stopped" && "Geração interrompida."}
            {sim.lovable === "approved" && "✔ Resposta concluída."}
            {sim.lovable === "awaiting" && "⚠ Aguardando aprovação."}
          </p>
        </div>
      </div>

      {/* Chat simulado */}
      <div className="rounded-xl border border-border/60 bg-background p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Chat simulado</p>
          <span className={`flex items-center gap-1.5 text-xs ${chat.tone}`}>
            <ChatIcon className={`h-3.5 w-3.5 ${sim.chat === "loading" || sim.chat === "sending" ? "animate-spin" : ""}`} />
            {chat.label}
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl bg-primary px-3 py-2 text-primary-foreground">Olá, tudo bem?</div>
          </div>
          {sim.chat === "received" && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl border border-border/60 bg-background/60 px-3 py-2">Sim! Como posso ajudar?</div>
            </div>
          )}
          {sim.chat === "error" && (
            <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-2 text-xs text-rose-200">
              <MessageSquare className="mr-1 inline h-3.5 w-3.5" /> Falha ao enviar mensagem.
            </div>
          )}
          {sim.chat === "offline" && (
            <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-200">
              <WifiOff className="mr-1 inline h-3.5 w-3.5" /> Sem conexão.
            </div>
          )}
          {sim.chat === "timeout" && (
            <div className="rounded-md border border-orange-500/40 bg-orange-500/10 p-2 text-xs text-orange-200">
              <AlertTriangle className="mr-1 inline h-3.5 w-3.5" /> A resposta demorou demais.
            </div>
          )}
          {(sim.chat === "loading" || sim.chat === "sending") && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                <Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" /> digitando…
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================
// Storage
// =========================================================

function StoragePanel({ sim, clear }: { sim: SimState; clear: () => void }) {
  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Última alteração: {new Date(sim.storageUpdatedAt).toLocaleString("pt-BR")}
        </p>
        <Button variant="destructive" size="sm" className="gap-1.5 text-xs" onClick={clear}>
          <Trash2 className="h-3.5 w-3.5" /> Limpar armazenamento simulado
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <StorageCard title="chrome.storage" tone="text-sky-300" data={sim.chromeStorage} />
        <StorageCard title="localStorage" tone="text-emerald-300" data={sim.localStorage} />
        <StorageCard title="sessionStorage" tone="text-fuchsia-300" data={sim.sessionStorage} />
      </div>
    </div>
  );
}

function StorageCard({ title, tone, data }: { title: string; tone: string; data: StorageMap }) {
  const entries = Object.entries(data);
  return (
    <Card className="border-border/60">
      <CardContent className="space-y-2 p-4">
        <p className={`text-xs font-semibold ${tone}`}>{title}</p>
        {entries.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">Vazio.</p>
        ) : (
          <div className="space-y-1 text-[11px]">
            {entries.map(([k, v]) => (
              <div key={k} className="rounded border border-border/40 bg-background/40 p-2">
                <p className="font-mono text-muted-foreground">{k}</p>
                <p className="mt-0.5 truncate font-mono">{v}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =========================================================
// Events console
// =========================================================

function EventsPanel({ sim, setSim }: { sim: SimState; setSim: React.Dispatch<React.SetStateAction<SimState>> }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");

  const types = useMemo(
    () => ["all", ...Array.from(new Set(sim.events.map((e) => e.type)))],
    [sim.events],
  );

  const filtered = sim.events.filter((e) => {
    if (type !== "all" && e.type !== type) return false;
    if (q && !e.description.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const clear = () => setSim((s) => ({ ...s, events: [] }));

  const seed = () => {
    const now = Date.now();
    const items: SimEvent[] = [
      { id: crypto.randomUUID(), ts: now, type: "popup", description: "Popup aberto" },
      { id: crypto.randomUUID(), ts: now + 1, type: "popup", description: "Popup fechado" },
      { id: crypto.randomUUID(), ts: now + 2, type: "sidepanel", description: "Sidepanel aberto" },
      { id: crypto.randomUUID(), ts: now + 3, type: "prompt", description: "Prompt enviado" },
      { id: crypto.randomUUID(), ts: now + 4, type: "prompt", description: "Resposta recebida" },
      { id: crypto.randomUUID(), ts: now + 5, type: "screenshot", description: "Screenshot criada" },
      { id: crypto.randomUUID(), ts: now + 6, type: "build", description: "Build iniciada" },
      { id: crypto.randomUUID(), ts: now + 7, type: "build", description: "Build concluída" },
      { id: crypto.randomUUID(), ts: now + 8, type: "error", description: "Erro simulado" },
    ];
    setSim((s) => ({ ...s, events: [...items.reverse(), ...s.events].slice(0, 500) }));
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar eventos…" className="h-8 pl-7 text-xs" />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-8 rounded-md border border-border/60 bg-background/40 px-2 text-xs"
          >
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={seed}>
          Semear exemplos
        </Button>
        <Button variant="destructive" size="sm" className="h-8 gap-1.5 text-xs" onClick={clear}>
          <Eraser className="h-3.5 w-3.5" /> Limpar
        </Button>
      </div>

      <div className="max-h-[420px] overflow-auto rounded-lg border border-border/60 bg-background/60">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-xs text-muted-foreground">Nenhum evento.</p>
        ) : (
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-background/80 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Horário</th>
                <th className="px-3 py-2 text-left font-medium">Tipo</th>
                <th className="px-3 py-2 text-left font-medium">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-t border-border/40">
                  <td className="px-3 py-1.5 font-mono text-muted-foreground">
                    {new Date(e.ts).toLocaleTimeString("pt-BR")}
                  </td>
                  <td className="px-3 py-1.5">
                    <Badge variant="outline" className="text-[10px]">{e.type}</Badge>
                  </td>
                  <td className="px-3 py-1.5">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// =========================================================
// Checklist
// =========================================================

function ChecklistPanel({ ext }: { ext: ExtensionRecord }) {
  const items = [
    { label: "Manifest", ok: !!ext.manifest && ext.manifest.manifestVersion >= 2 },
    { label: "Popup", ok: !!ext.manifest?.hasPopup },
    { label: "Sidepanel", ok: !!ext.manifest?.hasSidepanel },
    { label: "Assets", ok: !!(ext.assets.logo || ext.assets.banner || ext.assets.icon128) },
    { label: "Ícones", ok: !!(ext.assets.icon16 && ext.assets.icon48 && ext.assets.icon128) },
    { label: "Logo", ok: !!ext.assets.logo },
    { label: "Banner", ok: !!ext.assets.banner },
    { label: "Build", ok: (ext.builds?.length ?? 0) > 0 },
    { label: "Versão", ok: !!ext.version },
  ];
  return (
    <div className="mt-3 grid gap-2 md:grid-cols-2">
      {items.map((it) => (
        <div
          key={it.label}
          className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-4 py-2 text-sm"
        >
          <span>{it.label}</span>
          {it.ok ? (
            <span className="flex items-center gap-1.5 text-emerald-300 text-xs">
              <CheckCircle2 className="h-4 w-4" /> OK
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-300 text-xs">
              <AlertTriangle className="h-4 w-4" /> Pendente
            </span>
          )}
        </div>
      ))}
      <p className="col-span-full mt-1 text-[11px] text-muted-foreground">
        Verificação puramente visual — nenhuma validação real é executada.
      </p>
    </div>
  );
}
