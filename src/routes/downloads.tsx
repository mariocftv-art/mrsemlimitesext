import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/downloads")({ component: Downloads });

function Downloads() {
  return (
    <AppShell title="Downloads" subtitle="Histórico de downloads por versão, cliente e dispositivo.">
      <PagePlaceholder icon={Download} title="Registros de download" description="Aguardando backend." />
    </AppShell>
  );
}
