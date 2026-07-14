import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Database, FlaskConical, RotateCcw, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useStore, loadStateInto, clearStore, resetStore } from "@/mock/store";
import { seedHeavy } from "@/mock/seed";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const counts = useStore((s) => ({
    licenses: s.licenses.length,
    customers: s.customers.length,
    devices: s.devices.length,
    activations: s.activations.length,
    blacklist: s.blacklist.length,
    logs: s.logs.length,
  }));
  const [testMode, setTestMode] = useState(
    typeof window !== "undefined" && window.localStorage.getItem("mrsl.testMode") === "1",
  );

  const enableTestMode = () => {
    loadStateInto(seedHeavy());
    window.localStorage.setItem("mrsl.testMode", "1");
    setTestMode(true);
    toast.success("MODO TESTE ativado — dados de demonstração carregados");
  };

  const clearAll = () => {
    clearStore();
    window.localStorage.removeItem("mrsl.testMode");
    setTestMode(false);
    toast.success("Todos os dados de teste foram apagados");
  };

  const restoreDefault = () => {
    resetStore();
    window.localStorage.removeItem("mrsl.testMode");
    setTestMode(false);
    toast.success("Dados padrão restaurados");
  };

  return (
    <AppShell title="Configurações" subtitle="Parâmetros globais e ambiente de testes.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass border-border/60">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: "var(--gradient-neon)", boxShadow: "var(--shadow-neon)" }}
            >
              <FlaskConical className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Ambiente de testes</CardTitle>
              <p className="text-xs text-muted-foreground">
                Popular o painel com dados de demonstração antes da conexão com o backend.
              </p>
            </div>
            <span
              className={`ml-auto rounded-full border px-2 py-0.5 text-[11px] ${
                testMode
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                  : "border-border/60 text-muted-foreground"
              }`}
            >
              {testMode ? "MODO TESTE ATIVO" : "modo padrão"}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ao ativar, o painel é preenchido com <span className="text-foreground">50 clientes</span>,{" "}
              <span className="text-foreground">120 licenças</span>,{" "}
              <span className="text-foreground">90 dispositivos</span>,{" "}
              <span className="text-foreground">300 ativações</span>,{" "}
              <span className="text-foreground">12 bloqueios</span> e{" "}
              <span className="text-foreground">40 logs</span> — determinísticos e persistidos localmente.
              Todas as ações (criar, editar, excluir, renovar, transferir, bloquear, exportar, filtrar, paginar,
              seleção múltipla) funcionam exatamente como funcionarão quando o backend estiver ligado.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <Stat label="Licenças" value={counts.licenses} />
              <Stat label="Clientes" value={counts.customers} />
              <Stat label="Dispositivos" value={counts.devices} />
              <Stat label="Ativações" value={counts.activations} />
              <Stat label="Blacklist" value={counts.blacklist} />
              <Stat label="Logs" value={counts.logs} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={enableTestMode}
                style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
              >
                <Zap className="mr-2 h-4 w-4" /> MODO TESTE
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Limpar dados de teste
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apagar TODOS os dados MOCK?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação limpa licenças, clientes, dispositivos, ativações, blacklist e logs
                      persistidos no navegador. As senhas dos administradores são preservadas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAll}>Apagar tudo</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="outline" onClick={restoreDefault}>
                <RotateCcw className="mr-2 h-4 w-4" /> Restaurar dados padrão
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Nenhuma chamada de rede. Todos os dados vivem em <span className="font-mono">localStorage</span> ·
              chave <span className="font-mono">mrsl.state.v1</span>.
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/60">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-secondary/40">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Estado do backend</CardTitle>
              <p className="text-xs text-muted-foreground">
                Configurações do sistema serão liberadas quando o backend for conectado.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row k="Modo atual" v="MOCK local (offline)" />
            <Row k="Persistência" v="localStorage" />
            <Row k="Backend" v="não conectado" />
            <Row k="Autenticação admin" v="senha local (SHA-256 + salt)" />
            <Row k="Sessão" v="mrsl.admin.session" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-2">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2 last:border-none">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-mono text-xs">{v}</span>
    </div>
  );
}
