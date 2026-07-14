import { createFileRoute } from "@tanstack/react-router";
import { Component } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/components")({ component: ComponentsPage });

function ComponentsPage() {
  return (
    <AppShell title="Componentes" subtitle="Componentes UI reutilizáveis das extensões.">
      <PagePlaceholder
        icon={Component}
        title="Biblioteca de Componentes"
        description="Estrutura preparada. Botões, painéis, modais compartilháveis entre extensões."
      />
    </AppShell>
  );
}
