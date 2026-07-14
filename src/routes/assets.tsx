import { createFileRoute } from "@tanstack/react-router";
import { ImageIcon } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ASSET_KINDS, listAssets } from "@/factory";

export const Route = createFileRoute("/assets")({ component: AssetsPage });

function AssetsPage() {
  const all = listAssets();
  return (
    <AppShell
      title="Assets"
      subtitle="Biblioteca central de logos, banners, ícones, imagens e sons por extensão."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ASSET_KINDS.map((k) => {
          const items = all.filter((a) => a.kind === k.kind);
          return (
            <Card key={k.kind} className="glass border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="h-4 w-4 text-primary" /> {k.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {items.length === 0
                  ? "Nenhum item cadastrado. Estrutura pronta para upload."
                  : `${items.length} item(ns)`}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
