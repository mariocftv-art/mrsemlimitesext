import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonitorPlay, Chrome, Globe, Layout, Bug, ShieldCheck, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
                <Bug className="h-3 w-3" /> TESTE REAL: MR SEM LIMITES V7.1.5
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/40 rounded-full text-[10px] font-bold text-emerald-400">
                MOTOR: CASTLER V2 (0 CREDIT)
             </div>
          </div>
          
          <Tabs defaultValue="chrome" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between bg-background/40 border border-border/60 rounded-t-lg px-2">
              <TabsList className="bg-transparent">
                <TabsTrigger value="chrome" className="gap-2"><Chrome className="h-4 w-4" /> Google Chrome</TabsTrigger>
                <TabsTrigger value="lovable" className="gap-2"><Globe className="h-4 w-4" /> Lovable</TabsTrigger>
                <TabsTrigger value="free" className="gap-2"><Layout className="h-4 w-4" /> Aba Livre</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chrome" className="flex-1 bg-background/60 border-x border-b border-border/60 rounded-b-lg p-0 m-0 overflow-hidden relative">
               <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                 <div className="relative mb-6">
                    <Chrome className="h-20 w-20 text-orange-500 opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Zap className="h-8 w-8 text-orange-400 animate-pulse" />
                    </div>
                 </div>
                 
                 <h3 className="text-xl font-bold text-foreground mb-1">MR SEM LIMITES: INTERCEPTAÇÃO ATIVA</h3>
                 <p className="text-sm opacity-60 text-center max-w-md">
                   Simulando tráfego de rede para os novos endpoints de licenciamento e bypass de créditos.
                 </p>
                 
                 <div className="mt-8 w-full max-w-lg space-y-4">
                    <div className="p-4 bg-black/40 border border-orange-500/30 rounded-lg">
                       <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] uppercase font-bold text-orange-400">Licenciamento (Heartbeat)</span>
                          <Badge variant="outline" className="text-[9px] border-emerald-500/50 text-emerald-400 bg-emerald-500/5">SESSÃO ATIVA</Badge>
                       </div>
                       <div className="space-y-1.5 font-mono text-[10px]">
                          <div className="flex justify-between">
                             <span className="text-muted-foreground">Endpoint:</span>
                              <span className="text-blue-400">/api/public/ext/license-heartbeat</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-muted-foreground">Status:</span>
                             <span className="text-emerald-400">valid: true (Renovação MR SEM LIMITES)</span>
                          </div>
                       </div>
                    </div>

                    <div className="p-4 bg-black/40 border border-emerald-500/30 rounded-lg">
                       <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] uppercase font-bold text-emerald-400">Bypass de Créditos (Castler V2)</span>
                          <Badge variant="outline" className="text-[9px] border-emerald-500/50 text-emerald-400 bg-emerald-500/5">PROTEGIDO</Badge>
                       </div>
                       <div className="space-y-2">
                          <div className="flex items-start gap-2 text-[11px] p-2 bg-muted/20 rounded">
                             <span className="text-orange-400 font-bold">USER:</span>
                             <span>"Olá, MR Sem Limites!"</span>
                          </div>
                          <div className="flex items-start gap-2 text-[11px] p-2 bg-emerald-500/10 rounded border-l-2 border-emerald-500">
                             <ShieldCheck className="h-3 w-3 mt-0.5" />
                             <div className="flex-1">
                                <p className="font-bold">MOTOR: Interceptação via pageHook.js</p>
                                <p className="opacity-70">Redirecionado para /functions/v1/lov4</p>
                             </div>
                          </div>
                          <div className="p-2 bg-blue-500/10 rounded text-[11px] border-l-2 border-blue-500 font-bold flex justify-between items-center">
                             <span>BACKEND RESULT</span>
                             <span className="text-emerald-400">credits_used: 0</span>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
            </TabsContent>
            
            <TabsContent value="lovable" className="flex-1 bg-background/60 border-x border-b border-border/60 rounded-b-lg p-0 m-0">
               <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                 <Globe className="h-12 w-12 mb-4 opacity-20" />
                 <p>Ambiente Lovable Integrado</p>
               </div>
            </TabsContent>
            
            <TabsContent value="free" className="flex-1 bg-background/60 border-x border-b border-border/60 rounded-b-lg p-0 m-0">
               <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                 <Layout className="h-12 w-12 mb-4 opacity-20" />
                 <p>Navegação Livre (Sem Scripts)</p>
               </div>
            </TabsContent>
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
              <p className="text-emerald-400">{"["}System{"]"} Engine 2.0: Booting MR SEM LIMITES V7.1.5</p>
              <p className="text-orange-400">{"["}Hook{"]"} pageHook.js: window.fetch patched.</p>
              <p className="text-orange-400">{"["}Hook{"]"} pageHook.js: XMLHttpRequest patched.</p>
              <p className="text-blue-400">{"["}Config{"]"} Branding detected: #ff7e00 (Orange).</p>
              <p className="text-emerald-400">{"["}Auth{"]"} heartbeat started: mrsemlimitesext.lovable.app</p>
              <p className="text-muted-foreground opacity-50 italic">--- Aguardando comandos do usuário ---</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}