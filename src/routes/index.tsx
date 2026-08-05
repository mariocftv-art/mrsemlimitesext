{/*
FASE 17 — ATIVAÇÃO EXT3 E BACKEND UNIFICADO
EXT3 adicionada à Factory. Backend configurado para aceitar chaves de 4 blocos (XXXXX-XXXXX-XXXXX-XXXXX).
Status: Motores sincronizados. Aguardando arquivos da EXT3 para integração final.
*/}
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Boxes,
  GitBranch,
  Hammer,
  Package,
  Plus,
  Puzzle,
  Sparkles,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { factoryStats, listSummaries, type NeonTone } from "@/factory";

export const Route = createFileRoute("/")({ component: FactoryDashboard });

const glow: Record<NeonTone, string> = {
  cyan: "var(--neon-cyan)",
  violet: "var(--neon-violet)",
  magenta: "var(--neon-magenta)",
  lime: "var(--neon-lime)",
};

const statusLabel: Record<string, string> = {
  production: "Produção",
  development: "Desenvolvimento",
  testing: "Testes",
  archived: "Arquivada",
};

function FactoryDashboard() {
  const stats = factoryStats();
  const extensions = listSummaries();

  return (
    <AppShell
      title="MR Extension Factory"
      subtitle="Fábrica profissional de extensões Chrome — visão geral"
      actions={
        <Button
          size="sm"
          className="gap-1.5"
          style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
        >
          <Plus className="h-4 w-4" /> Nova Extensão
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Extensões" value={stats.total} delta={`${stats.byStatus.production ?? 0} em produção`} icon={Puzzle} tone="cyan" />
        <KpiCard
          label="Última Build"
          value={stats.lastBuild ? stats.lastBuild.version : "—"}
          delta={stats.lastBuild ? stats.lastBuild.builtAt : "sem builds"}
          icon={Hammer}
          tone="violet"
        />
        <KpiCard
          label="Última Atualização"
          value={stats.lastUpdated ? stats.lastUpdated.name : "—"}
          delta={stats.lastUpdated ? stats.lastUpdated.updatedAt : "—"}
          icon={GitBranch}
          tone="magenta"
        />
        <KpiCard label="Módulos" value={13} delta="Factory ativa" icon={Boxes} tone="lime" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="glass border-border/60 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Minhas Extensões</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Cada extensão é isolada — arquivos, assets e builds separados.
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/extensions">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {extensions.map((e) => (
              <div
                key={e.id}
                className="rounded-lg border border-border/60 bg-background/40 p-4"
                style={{ boxShadow: `0 0 40px -28px ${glow[e.tone]}` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60"
                      style={{ background: "var(--gradient-surface)" }}
                    >
                      <Puzzle className="h-4 w-4" style={{ color: glow[e.tone] }} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{e.name}</p>
                      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                        {e.code} · v{e.version}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-border/60 text-[10px] uppercase tracking-widest">
                    {statusLabel[e.status] ?? e.status}
                  </Badge>
                </div>
                <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{e.description}</p>
              </div>
            ))}
            <Link
              to="/extensions"
              className="flex min-h-[104px] items-center justify-center rounded-lg border border-dashed border-border/60 bg-background/20 text-xs text-muted-foreground transition hover:border-primary/60 hover:text-primary"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Adicionar nova extensão
              </span>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" /> Módulos da Factory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-xs">
            {[
              ["Minhas Extensões", "/extensions"],
              ["Editor", "/editor"],
              ["Build Center", "/build-center"],
              ["Downloads", "/downloads"],
              ["Versões", "/versions"],
              ["Assets", "/assets"],
              ["Animações", "/animations"],
              ["Componentes", "/components"],
              ["Prompts Premium", "/prompts"],
              ["Ferramentas", "/tools"],
              ["Segurança", "/security"],
              ["Configurações", "/settings"],
            ].map(([label, url]) => (
              <Link
                key={url}
                to={url}
                className="flex items-center justify-between rounded-md border border-border/40 bg-background/40 px-3 py-2 transition hover:border-primary/60 hover:text-primary"
              >
                <span>{label}</span>
                <span className="text-muted-foreground">→</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass mt-6 border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-primary" /> Status da Factory
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <StatusTile label="Extensões isoladas" value={`${stats.total} slot(s) ativo(s)`} tone="ok" />
          <StatusTile label="Documentação" value="FACTORY_MASTER.md" tone="ok" icon={Package} />
        </CardContent>
      </Card>
    </AppShell>
  );
}

function StatusTile({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  tone: "ok" | "muted";
  icon?: typeof Package;
}) {
  return (
    <div className="rounded-md border border-border/40 bg-background/40 p-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-1 flex items-center gap-2 font-medium ${
          tone === "ok" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {Icon && <Icon className="h-4 w-4" />} {value}
      </p>
    </div>
  );
}
