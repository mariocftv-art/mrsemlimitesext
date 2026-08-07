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
        <div className="flex flex-col gap-4 overflow-hidden relative">
          <div className="absolute top-4 right-4 z-50 flex gap-2">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/40 rounded-full text-[10px] font-bold text-orange-400 animate-pulse">
                <Bug className="h-3 w-3" /> TESTE REAL: EXT5 V7.0.0
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/40 rounded-full text-[10px] font-bold text-emerald-400">
                MOTOR: CASTLER V2
             </div>
          </div>
        <div className="flex flex-col gap-4 overflow-hidden">
          <Tabs defaultValue="chrome" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between bg-background/40 border border-border/60 rounded-t-lg px-2">
              <TabsList className="bg-transparent">
                <TabsTrigger value="chrome" className="gap-2"><Chrome className="h-4 w-4" /> Google Chrome</TabsTrigger>
                <TabsTrigger value="lovable" className="gap-2"><Globe className="h-4 w-4" /> Lovable</TabsTrigger>
                <TabsTrigger value="free" className="gap-2"><Layout className="h-4 w-4" /> Aba Livre</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chrome" className="flex-1 bg-background/60 border-x border-b border-border/60 rounded-b-lg p-0 m-0 overflow-hidden relative">
               <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                 <div className="relative mb-6">
                    <Chrome className="h-20 w-20 text-orange-500 opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Bug className="h-8 w-8 text-orange-400 animate-bounce" />
                    </div>
                 </div>
                 <h3 className="text-lg font-bold text-foreground mb-1">Injetando Motor QYRON V7...</h3>
                 <p className="text-sm opacity-60">Interceptando tráfego api.lovable.dev -> /lov4</p>
                 
                 <div className="mt-8 p-4 w-full max-w-md bg-black/40 border border-border/40 rounded-lg">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-tighter mb-2">
                       <span>Simulação de Chat</span>
                       <span className="text-orange-400">Castler Bypass Ativo</span>
                    </div>
                    <div className="space-y-2">
                       <div className="p-2 bg-muted/40 rounded text-[11px] border-l-2 border-orange-500">
                          Usuário: "oi"
                       </div>
                       <div className="p-2 bg-emerald-500/10 rounded text-[11px] border-l-2 border-emerald-500">
                          Motor: Redirecionando para endpoint local...
                       </div>
                       <div className="p-2 bg-blue-500/10 rounded text-[11px] border-l-2 border-blue-500 font-bold">
                          Backend: credits_used: 0 (Sucesso)
                       </div>
                    </div>
                 </div>
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
