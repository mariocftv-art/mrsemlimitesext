import { createFileRoute } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/activations")({ component: Activations });

function Activations() {
  return (
    <AppShell title="Ativações" subtitle="Todas as ativações registradas pela API.">
      <PagePlaceholder icon={Zap} title="Log de ativações" description="Aguardando backend." />
    </AppShell>
  );
}
