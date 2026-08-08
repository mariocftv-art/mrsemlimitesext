import { useState, useEffect } from "react";
import { LogEntry } from "./real-test-lab";
import { Chrome, Layout, PanelRight, ShieldCheck, Zap, Terminal, Database, Bug, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function ExtensionRuntime({ logs }: { logs: LogEntry[] }) {
  const [activeRuntimeTab, setActiveRuntimeTab] = useState("popup");

  return (
    <div className="flex flex-col h-full bg-background/20 relative">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Badge className="bg-emerald-500/10 border-emerald-500/40 text-emerald-400 gap-1.5 animate-pulse">
          <Activity className="h-3 w-3" /> INTERCEPTAÇÃO ATIVA
        </Badge>
      </div>

      <Tabs value={activeRuntimeTab} onValueChange={setActiveRuntimeTab} className="flex-1 flex flex-col">
        <div className="bg-background/40 border-b border-border/60 px-2 shrink-0">
          <TabsList className="bg-transparent h-10 gap-4">
            <TabsTrigger value="popup" className="gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1">
              <PanelRight className="h-3.5 w-3.5" /> Popup
            </TabsTrigger>
            <TabsTrigger value="sidepanel" className="gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1">
              <Layout className="h-3.5 w-3.5" /> Sidepanel
            </TabsTrigger>
            <TabsTrigger value="background" className="gap-2 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1">
              <Terminal className="h-3.5 w-3.5" /> Background
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="popup" className="flex-1 overflow-hidden m-0 p-4">
          <div className="h-full flex items-center justify-center">
             <div className="w-[300px] bg-[#0a0a0b] border border-border/40 rounded-xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-border/20 flex items-center justify-between">
                   <span className="text-[10px] font-bold tracking-widest text-primary uppercase">MR SEM LIMITES</span>
                   <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </div>
                <div className="p-6 text-center space-y-4">
                   <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-white mb-1">IBCT SEM LIMITES Ativo</h4>
                      <p className="text-[11px] text-muted-foreground">Sistema em execução real (Runtime Sandbox)</p>
                   </div>
                   <div className="pt-4 grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 bg-white/5 rounded border border-white/10">
                         <p className="text-muted-foreground mb-1 uppercase text-[8px] font-bold">Motor</p>
                         <p className="text-emerald-400 font-bold">V17.9 Stable</p>
                      </div>
                      <div className="p-2 bg-white/5 rounded border border-white/10">
                         <p className="text-muted-foreground mb-1 uppercase text-[8px] font-bold">Bypass</p>
                         <p className="text-emerald-400 font-bold">Castler V2</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </TabsContent>

        <TabsContent value="sidepanel" className="flex-1 overflow-hidden m-0 flex">
          <div className="flex-1 border-r border-border/60 bg-background/40 p-4">
             <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                   <div className="h-8 w-8 bg-primary/20 rounded-lg border border-primary/40 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                   </div>
                   <div>
                      <h3 className="text-xs font-bold">Sidepanel Manager</h3>
                      <p className="text-[10px] text-muted-foreground">v17.9.0 (Production Build)</p>
                   </div>
                </div>
                
                <div className="space-y-2">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground">Módulos Carregados</p>
                   <div className="space-y-1">
                      <LoadedModule name="chat-engine.js" status="active" />
                      <LoadedModule name="template-renderer.js" status="active" />
                      <LoadedModule name="support-sync.js" status="active" />
                      <LoadedModule name="storage-bridge.js" status="active" />
                   </div>
                </div>
             </div>
          </div>
          <div className="w-[300px] bg-[#0a0a0b] p-4 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary">Templates</span>
                <Badge variant="outline" className="text-[8px] h-4">42 TOTAL</Badge>
             </div>
             <div className="space-y-2 overflow-auto">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="h-2 w-12 bg-white/20 rounded mb-2" />
                    <div className="h-1.5 w-full bg-white/10 rounded" />
                    <div className="mt-2 h-1.5 w-2/3 bg-white/10 rounded" />
                  </div>
                ))}
             </div>
          </div>
        </TabsContent>

        <TabsContent value="background" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <div className="p-4 font-mono text-[10px] space-y-1 text-emerald-400">
               <p className="text-blue-400 italic">{"//"} Chrome Service Worker Logs (Extension Runtime)</p>
               <p>[{new Date().toLocaleTimeString()}] SW: Initializing version 17.9.0...</p>
               <p>[{new Date().toLocaleTimeString()}] SW: Registering alarm 'heartbeat' (300s)</p>
               <p>[{new Date().toLocaleTimeString()}] SW: Connected to backend via WebSockets (Real-time enabled)</p>
               <p>[{new Date().toLocaleTimeString()}] SW: Intercepting request to *.lovable.dev...</p>
               {logs.filter(l => l.type === 'request' || l.type === 'response').map((log, i) => (
                 <p key={i} className={log.type === 'request' ? 'text-orange-400' : 'text-emerald-400'}>
                   [{log.timestamp}] SW: {log.type.toUpperCase()} {log.message}
                 </p>
               ))}
               <p className="animate-pulse">_</p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadedModule({ name, status }: { name: string; status: 'active' | 'loading' }) {
  return (
    <div className="flex items-center justify-between text-[11px] p-2 bg-muted/20 rounded border border-border/20">
      <span className="truncate">{name}</span>
      <Badge className="h-3 text-[7px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">ACTIVE</Badge>
    </div>
  );
}
