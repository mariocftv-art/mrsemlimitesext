import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/animations")({ component: AnimationsPage });

function AnimationsPage() {
  return (
    <AppShell title="Animações" subtitle="Biblioteca de animações reutilizáveis entre extensões.">
      <PagePlaceholder
        icon={Sparkles}
        title="Biblioteca de Animações"
        description="Estrutura preparada. Animações Lottie / CSS ficarão disponíveis por extensão."
      />
    </AppShell>
  );
}
