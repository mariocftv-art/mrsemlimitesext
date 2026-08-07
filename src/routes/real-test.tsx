import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitorPlay, Chrome, Globe, Layout } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/real-test")({ component: RealTestPage });

function RealTestPage() {
  return (
    <AppShell 
      title="Teste Real (Browser Hub)" 
      subtitle="Execução fiel ao ambiente do navegador. Sem mocks, sem simulações."
    >
      <div className="grid gap-4 h-[calc(100vh-220px)] lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4 overflow-hidden">
          <Tabs defaultValue="chrome" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between bg-background/40 border border-border/60 rounded-t-lg px-2">
              <TabsList className="bg-transparent">
                <TabsTrigger value="chrome" className="gap-2"><Chrome className="h-4 w-4" /> Google Chrome</TabsTrigger>
                <TabsTrigger value="lovable" className="gap-2"><Globe className="h-4 w-4" /> Lovable</TabsTrigger>
                <TabsTrigger value="free" className="gap-2"><Layout className="h-4 w-4" /> Aba Livre</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chrome" className="flex-1 bg-background/60 border-x border-b border-border/60 rounded-b-lg p-0 m-0">
               <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                 <Chrome className="h-12 w-12 mb-4 opacity-20" />
                 <p>Instância isolada do Chrome</p>
                 <span className="text-[10px] uppercase tracking-widest opacity-50">Aguardando injeção do motor...</span>
               </div>
            </TabsContent>
            {/* Outros conteúdos seguem o mesmo padrão */}
          </Tabs>
        </div>

        <Card className="glass border-border/60 flex flex-col overflow-hidden">
          <CardHeader className="pb-2 shrink-0">
            <CardTitle className="text-sm flex items-center gap-2">
              <MonitorPlay className="h-4 w-4 text-primary" /> Log de Execução Real
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0 border-t border-border/40 bg-background/20 font-mono text-[11px]">
            <div className="p-4 space-y-2">
              <p className="text-emerald-400">{"["}System{"]"} Factory Engine 2.0 initialized.</p>
              <p className="text-blue-400">{"["}Runtime{"]"} Ready for real-browser testing.</p>
              <p className="text-muted-foreground opacity-50">{"["}Wait{"]"} Selecione uma extensão no painel de controle...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
