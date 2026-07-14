import { createFileRoute } from "@tanstack/react-router";
import { ScrollText } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/logs")({ component: Logs });

function Logs() {
  return (
    <AppShell title="Logs" subtitle="Stream em tempo real de eventos de sistema e API.">
      <PagePlaceholder icon={ScrollText} title="Logs consolidados" description="Auditoria, API e sistema." />
    </AppShell>
  );
}
