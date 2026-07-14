import { createFileRoute } from "@tanstack/react-router";
import { Puzzle, Upload, Lock, CheckCircle2, Circle } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/extensions")({
  component: ExtensionsPage,
});

const slots = [
  {
    id: "ext-01",
    name: "Extensão 1",
    status: "aguardando ZIP",
    color: "cyan",
    phase: "Fase 1 · Análise",
  },
  {
    id: "ext-02",
    name: "Extensão 2",
    status: "bloqueada",
    color: "violet",
    phase: "Aguarda conclusão da Extensão 1",
  },
  {
    id: "ext-03",
    name: "Extensão 3",
    status: "bloqueada",
    color: "magenta",
    phase: "Aguarda conclusão da Extensão 2",
  },
];

function ExtensionsPage() {
  return (
    <AppShell
      title="Extensões"
      subtitle="Uma extensão por vez. Cada slot é isolado e utiliza o mesmo backend."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {slots.map((slot) => {
          const glow: Record<string, string> = {
            cyan: "var(--neon-cyan)",
            violet: "var(--neon-violet)",
            magenta: "var(--neon-magenta)",
          };
          const locked = slot.status === "bloqueada";
          return (
            <Card
              key={slot.id}
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
                  <Badge
                    variant="outline"
                    className="border-border/60 text-[10px] uppercase tracking-widest"
                  >
                    {slot.id}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{slot.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{slot.phase}</p>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <ChecklistItem done={false} label="ZIP recebido" />
                  <ChecklistItem done={false} label="Análise técnica" />
                  <ChecklistItem done={false} label="Relatório aprovado" />
                  <ChecklistItem done={false} label="Integração ao backend" />
                  <ChecklistItem done={false} label="Publicação" />
                </div>

                <Button
                  disabled={locked}
                  className="w-full gap-2"
                  variant={locked ? "secondary" : "default"}
                  style={
                    locked
                      ? undefined
                      : { background: "var(--gradient-neon)", color: "var(--primary-foreground)" }
                  }
                >
                  <Upload className="h-4 w-4" />
                  {locked ? "Bloqueada" : "Enviar ZIP"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}

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
