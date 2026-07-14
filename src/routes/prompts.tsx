import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareCode } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/prompts")({ component: PromptsPage });

function PromptsPage() {
  return (
    <AppShell title="Prompts Premium" subtitle="Biblioteca de prompts premium por extensão.">
      <PagePlaceholder
        icon={MessageSquareCode}
        title="Prompts Premium"
        description="Estrutura preparada. Cada extensão terá seu próprio conjunto de prompts."
      />
    </AppShell>
  );
}
