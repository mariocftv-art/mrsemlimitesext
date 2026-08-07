import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { RealTestLab } from "@/components/real-test/real-test-lab";

export const Route = createFileRoute("/real-test")({ component: RealTestPage });

function RealTestPage() {
  return (
    <AppShell 
      title="Real Test Lab — Modo Execução Real" 
      subtitle="Laboratório de ativação e validação de runtime em tempo real."
    >
      <RealTestLab />
    </AppShell>
  );
}
