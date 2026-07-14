import { createFileRoute } from "@tanstack/react-router";
import { MonitorSmartphone } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/devices")({ component: Devices });

function Devices() {
  return (
    <AppShell title="Dispositivos" subtitle="Device ID, SO, Chrome, primeira ativação, última sincronização.">
      <PagePlaceholder icon={MonitorSmartphone} title="Dispositivos registrados" description="Aguardando backend." />
    </AppShell>
  );
}
