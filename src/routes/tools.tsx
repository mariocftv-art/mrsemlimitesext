import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/tools")({ component: ToolsPage });

function ToolsPage() {
  return (
    <AppShell title="Ferramentas" subtitle="Ferramentas internas de manutenção da Factory.">
      <PagePlaceholder
        icon={Wrench}
        title="Ferramentas"
        description="Estrutura preparada. Utilitários como validação de manifest, checksum e diff virão aqui."
      />
    </AppShell>
  );
}
