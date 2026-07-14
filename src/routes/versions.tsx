import { createFileRoute } from "@tanstack/react-router";
import { GitBranch } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/versions")({ component: Versions });

function Versions() {
  return (
    <AppShell title="Versões" subtitle="Controle de versões por extensão, changelog e rollback.">
      <PagePlaceholder
        icon={GitBranch}
        title="Sistema de atualizações"
        description="Versão, changelog, download, obrigatoriedade e rollback por extensão."
      />
    </AppShell>
  );
}
