import { createFileRoute } from "@tanstack/react-router";
import { ShieldOff } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/blacklist")({ component: Blacklist });

function Blacklist() {
  return (
    <AppShell title="Blacklist" subtitle="Devices, IPs e chaves banidos permanentemente.">
      <PagePlaceholder icon={ShieldOff} title="Blacklist global" description="Aguardando backend." />
    </AppShell>
  );
}
