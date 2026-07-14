import { createFileRoute } from "@tanstack/react-router";
import { UserCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  return (
    <AppShell title="Perfil" subtitle="Sua conta e preferências.">
      <PagePlaceholder icon={UserCircle} title="Perfil do usuário" description="Ativo após autenticação do backend." />
    </AppShell>
  );
}
