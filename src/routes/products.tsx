import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/products")({ component: Products });

function Products() {
  return (
    <AppShell title="Produtos" subtitle="Cada extensão é um produto vendável.">
      <PagePlaceholder
        icon={Package}
        title="Catálogo de produtos"
        description="Nome, descrição, versão, ícone, banner, categoria, preço, status e última atualização. Ativo após conexão com o backend."
      />
    </AppShell>
  );
}
