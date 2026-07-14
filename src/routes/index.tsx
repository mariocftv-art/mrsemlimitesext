import { createFileRoute } from "@tanstack/react-router";
import {
  Puzzle,
  KeyRound,
  Users,
  MonitorSmartphone,
  Zap,
  Ban,
  Clock,
  GitBranch,
  Download,
  Activity,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const activationData = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  ativacoes: Math.round(40 + Math.sin(i / 2) * 20 + Math.random() * 30),
  downloads: Math.round(20 + Math.cos(i / 3) * 15 + Math.random() * 20),
}));

const liveLogs = [
  { t: "agora", type: "ativação", msg: "Device WIN-4A2 ativou LIC-000123", tone: "cyan" },
  { t: "12s", type: "heartbeat", msg: "Device MAC-9B1 sincronizou", tone: "lime" },
  { t: "48s", type: "bloqueio", msg: "Chave LIC-000091 bloqueada por admin", tone: "magenta" },
  { t: "1m", type: "renovação", msg: "LIC-000042 renovada por +365d", tone: "violet" },
  { t: "2m", type: "ativação", msg: "Device WIN-77C ativou LIC-000110", tone: "cyan" },
  { t: "3m", type: "download", msg: "Ext-01 v1.2.0 baixada por cliente #42", tone: "lime" },
];

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Visão geral em tempo real da plataforma MR Máxima Extensions"
      actions={
        <Button
          size="sm"
          className="hidden gap-1.5 md:inline-flex"
          style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
        >
          <Activity className="h-4 w-4" /> Ao vivo
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Extensões" value={3} delta="1 ativa" icon={Puzzle} tone="cyan" />
        <KpiCard label="Licenças" value={0} delta="aguardando cadastros" icon={KeyRound} tone="violet" />
        <KpiCard label="Clientes" value={0} delta="—" icon={Users} tone="magenta" />
        <KpiCard label="Dispositivos" value={0} delta="0 online" icon={MonitorSmartphone} tone="lime" />
        <KpiCard label="Ativações hoje" value={0} delta="—" icon={Zap} tone="cyan" />
        <KpiCard label="Bloqueios" value={0} delta="0 hoje" icon={Ban} tone="magenta" />
        <KpiCard label="Licenças expirando" value={0} delta="próximos 7d" icon={Clock} tone="violet" />
        <KpiCard label="Versões publicadas" value={0} delta="—" icon={GitBranch} tone="lime" />
        <KpiCard label="Downloads" value={0} delta="—" icon={Download} tone="cyan" />
        <KpiCard label="Uptime API" value="100%" delta="24h" icon={Activity} tone="lime" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="glass border-border/60 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Ativações & Downloads · últimos 14 dias</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Dados de demonstração — conectados ao backend após ativação da Cloud
              </p>
            </div>
            <Badge variant="outline" className="border-primary/40 text-primary">
              demo
            </Badge>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activationData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--neon-violet)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--neon-violet)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ativacoes"
                  stroke="var(--neon-cyan)"
                  fill="url(#g1)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="downloads"
                  stroke="var(--neon-violet)"
                  fill="url(#g2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Logs em tempo real
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {liveLogs.map((log, i) => {
              const colors: Record<string, string> = {
                cyan: "var(--neon-cyan)",
                violet: "var(--neon-violet)",
                magenta: "var(--neon-magenta)",
                lime: "var(--neon-lime)",
              };
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-md border border-border/40 bg-background/40 p-2.5 text-xs"
                >
                  <span
                    className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      background: colors[log.tone],
                      boxShadow: `0 0 8px ${colors[log.tone]}`,
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{log.msg}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {log.type} · {log.t}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="glass mt-6 border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Status da plataforma</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-md border border-border/40 bg-background/40 p-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Backend</p>
            <p className="mt-1 font-medium text-yellow-400">
              Aguardando ativação do Lovable Cloud
            </p>
          </div>
          <div className="rounded-md border border-border/40 bg-background/40 p-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Extensões</p>
            <p className="mt-1 font-medium">3 slots preparados (ext-01, ext-02, ext-03)</p>
          </div>
          <div className="rounded-md border border-border/40 bg-background/40 p-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Próximo passo</p>
            <p className="mt-1 font-medium neon-text">Envio do ZIP da Extensão 1</p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
