import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "cyan",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  tone?: "cyan" | "violet" | "magenta" | "lime";
}) {
  const glow: Record<string, string> = {
    cyan: "var(--neon-cyan)",
    violet: "var(--neon-violet)",
    magenta: "var(--neon-magenta)",
    lime: "var(--neon-lime)",
  };
  return (
    <Card className="glass relative overflow-hidden border-border/60">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-3xl"
        style={{ background: glow[tone] }}
      />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {delta && (
              <p className="mt-1 text-xs text-muted-foreground">
                <span style={{ color: glow[tone] }}>{delta}</span>
              </p>
            )}
          </div>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background/40"
            style={{ boxShadow: `0 0 20px -8px ${glow[tone]}` }}
          >
            <Icon className="h-5 w-5" style={{ color: glow[tone] }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PagePlaceholder({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: ReactNode;
}) {
  return (
    <Card className="glass border-border/60">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ background: "var(--gradient-neon)", boxShadow: "var(--shadow-neon)" }}
        >
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="max-w-md space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
