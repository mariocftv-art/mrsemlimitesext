import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <AppShell title="Configurações" subtitle="Parâmetros globais da plataforma.">
      <PagePlaceholder icon={Settings} title="Configurações do sistema" description="Aguardando backend." />
    </AppShell>
  );
}
