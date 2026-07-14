import { createFileRoute } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/editor")({ component: EditorPage });

function EditorPage() {
  return (
    <AppShell
      title="Editor"
      subtitle="Editor visual da extensão: metadados, manifest, popup, sidepanel e assets."
    >
      <PagePlaceholder
        icon={Pencil}
        title="Editor da Extensão"
        description="Estrutura pronta. Cada extensão poderá ser editada isoladamente sem afetar as demais."
      />
    </AppShell>
  );
}
