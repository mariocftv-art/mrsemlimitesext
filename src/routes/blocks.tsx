import { createFileRoute } from "@tanstack/react-router";
import { Ban } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/blocks")({ component: Blocks });

function Blocks() {
  return (
    <AppShell title="Bloqueios" subtitle="Licenças e dispositivos bloqueados.">
      <PagePlaceholder icon={Ban} title="Registro de bloqueios" description="Aguardando backend." />
    </AppShell>
  );
}
