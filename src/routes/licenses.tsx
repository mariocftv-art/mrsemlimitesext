import { createFileRoute } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/licenses")({ component: Licenses });

function Licenses() {
  return (
    <AppShell
      title="Licenças"
      subtitle="Gerar, renovar, bloquear, transferir, duplicar, resetar dispositivo, alterar validade."
      actions={
        <Button
          size="sm"
          disabled
          style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
        >
          Gerar chave
        </Button>
      }
    >
      <PagePlaceholder
        icon={KeyRound}
        title="Sistema de chaves"
        description="Relacionamento cliente ↔ produto ↔ licença ↔ dispositivos com histórico e auditoria completa."
      />
    </AppShell>
  );
}
