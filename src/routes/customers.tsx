import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/customers")({ component: Customers });

function Customers() {
  return (
    <AppShell title="Clientes" subtitle="Nome, contato, empresa, licenças, produtos, dispositivos e histórico.">
      <PagePlaceholder icon={Users} title="Base de clientes" description="Ativo após conexão com o backend." />
    </AppShell>
  );
}
