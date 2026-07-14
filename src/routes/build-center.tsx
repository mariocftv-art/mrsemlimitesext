import { createFileRoute } from "@tanstack/react-router";
import { Hammer } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listSummaries, type NeonTone } from "@/factory";

export const Route = createFileRoute("/build-center")({ component: BuildCenterPage });

const glow: Record<NeonTone, string> = {
  cyan: "var(--neon-cyan)",
  violet: "var(--neon-violet)",
  magenta: "var(--neon-magenta)",
  lime: "var(--neon-lime)",
};

function BuildCenterPage() {
  const items = listSummaries();
  return (
    <AppShell
      title="Build Center"
      subtitle="Empacote qualquer extensão da Factory. Cada build gera versão, tamanho e checksum."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((e) => (
          <Card
            key={e.id}
            className="glass border-border/60"
            style={{ boxShadow: `0 0 40px -28px ${glow[e.tone]}` }}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Hammer className="h-4 w-4" style={{ color: glow[e.tone] }} />
                {e.name}
              </CardTitle>
              <Badge variant="outline" className="border-border/60 text-[10px] uppercase tracking-widest">
                {e.code} · v{e.version}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>Motor de build reutiliza a fonte isolada em <code>extensions/{e.id}/</code>.</p>
              <p>Ações completas (Gerar / Regerar / Baixar / Histórico) ficam na página da extensão.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
