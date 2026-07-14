import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FolderOpen, Hammer, Package } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllExtensions,
  scanExtension,
  type NeonTone,
} from "@/factory";

export const Route = createFileRoute("/build-center")({ component: BuildCenterPage });

const glow: Record<NeonTone, string> = {
  cyan: "var(--neon-cyan)",
  violet: "var(--neon-violet)",
  magenta: "var(--neon-magenta)",
  lime: "var(--neon-lime)",
};

function BuildCenterPage() {
  const items = getAllExtensions();
  return (
    <AppShell
      title="Build Center"
      subtitle="Cada card lê o disco em tempo real. Nenhum mock."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((e) => {
          const scan = scanExtension(e.sourceDir);
          const registered = e.builds ?? [];
          const scanned = scan.builds;
          const total = registered.length + scanned.length;
          return (
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
                <Badge
                  variant="outline"
                  className="border-border/60 text-[10px] uppercase tracking-widest"
                >
                  {e.code} · v{e.version}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Script de build</span>
                  <span>{scan.hasBuildScript ? "🟢 detectado" : "🔴 ausente"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">package.json</span>
                  <span>{scan.hasPackageJson ? "🟢 presente" : "🔴 ausente"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Builds encontradas</span>
                  <span>{total}</span>
                </div>

                {total === 0 ? (
                  <p className="rounded-md border border-border/40 bg-background/40 p-2 text-center text-muted-foreground">
                    Nenhuma build gerada.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {scanned.map((b) => (
                      <li
                        key={b.path}
                        className="flex items-center gap-2 rounded-md border border-border/40 bg-background/40 p-2"
                      >
                        <Package className="h-3.5 w-3.5 text-primary" />
                        <span className="truncate font-mono">{b.filename}</span>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="ml-auto h-6 px-2 text-[10px]"
                        >
                          <a href={b.url} download>
                            <Download className="mr-1 h-3 w-3" /> baixar
                          </a>
                        </Button>
                      </li>
                    ))}
                    {registered.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center gap-2 rounded-md border border-border/40 bg-background/40 p-2"
                      >
                        <Package className="h-3.5 w-3.5 text-primary" />
                        <span className="truncate font-mono">{b.filename}</span>
                        <span className="ml-auto text-muted-foreground">
                          v{b.version} · {b.builtAt}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-2 pt-1">
                  <Button asChild size="sm" variant="outline" className="h-7 flex-1 text-[11px]">
                    <Link to="/preview/$id" params={{ id: e.id }}>
                      <FolderOpen className="mr-1 h-3 w-3" /> Preview
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="h-7 flex-1 text-[11px]">
                    <Link to="/live/$id" params={{ id: e.id }}>Live</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
