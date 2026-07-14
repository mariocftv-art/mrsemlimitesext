import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/security")({ component: SecurityPage });

function SecurityPage() {
  return (
    <AppShell title="Segurança" subtitle="Regras de segurança da Factory (não altera segurança interna da extensão).">
      <PagePlaceholder
        icon={ShieldCheck}
        title="Segurança da Factory"
        description="Estrutura preparada. Regras de assinatura, checksum e integridade de pacote."
      />
    </AppShell>
  );
}
