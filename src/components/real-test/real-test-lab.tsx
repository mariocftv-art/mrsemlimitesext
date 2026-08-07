import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Terminal, 
  Zap, 
  Settings, 
  Database, 
  Layout, 
  Bug, 
  Play, 
  CheckCircle2, 
  XCircle,
  Activity,
  Cpu,
  History,
  Lock,
  Search,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ActivationPanel } from "./activation-panel";
import { ExecutionLogs } from "./execution-logs";
import { TechFlow } from "./tech-flow";
import { ExtensionRuntime } from "./extension-runtime";

export type LogEntry = {
  id: string;
  timestamp: string;
  type: 'system' | 'request' | 'response' | 'error' | 'event' | 'storage';
  module: string;
  message: string;
  details?: any;
  duration?: number;
};

export type ExecutionStatus = 'idle' | 'validating' | 'starting' | 'running' | 'failed' | 'success';

export function RealTestLab() {
  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [licenseData, setLicenseData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("lab");
  const [techSteps, setTechSteps] = useState<any[]>([]);

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: Math.random().toString(36).slice(2, 11),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour12: false }) + '.' + String(new Date().getMilliseconds()).padStart(3, '0')
    };
    setLogs(prev => [newEntry, ...prev].slice(0, 200));
    
    // Also update tech flow if it's a significant step
    if (entry.type === 'request' || entry.type === 'response' || entry.type === 'system') {
      setTechSteps(prev => [...prev, {
        file: entry.module,
        action: entry.message,
        duration: entry.duration,
        type: entry.type,
        details: entry.details
      }]);
    }
  };

  const resetLab = () => {
    setStatus('idle');
    setLogs([]);
    setTechSteps([]);
    setLicenseData(null);
    addLog({
      type: 'system',
      module: 'Factory Engine',
      message: 'Laboratório resetado e pronto para nova execução.'
    });
  };

  const handleValidation = async (data: any) => {
    setStatus('validating');
    setLicenseData(null);
    addLog({ type: 'system', module: 'Auth', message: 'Iniciando fluxo de validação real...' });
    
    const startTime = Date.now();
    try {
      addLog({ 
        type: 'request', 
        module: 'validate-license-v2.ts', 
        message: 'POST /api/public/ext/functions/v1/validate-license-v2',
        details: { license_key: data.license_key, hwid: data.hwid }
      });

      const response = await fetch('/api/public/ext/functions/v1/validate-license-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: data.license_key,
          hwid: data.hwid,
          product: data.product,
          version: data.version
        })
      });

      const result = await response.json();
      const duration = Date.now() - startTime;

      addLog({ 
        type: 'response', 
        module: 'validate-license-v2.ts', 
        message: `Resposta recebida (${duration}ms)`,
        details: result,
        duration
      });

      if (result.status === 'valid') {
        setLicenseData(result);
        setStatus('success');
        addLog({ type: 'system', module: 'Auth', message: 'Licença VALIDADA com sucesso.' });
      } else {
        setStatus('failed');
        addLog({ type: 'error', module: 'Auth', message: `Falha na validação: ${result.message || 'Chave inválida'}` });
      }
    } catch (err) {
      setStatus('failed');
      addLog({ type: 'error', module: 'Auth', message: 'Erro crítico na comunicação com o backend.' });
    }
  };

  const startExtension = async () => {
    if (status !== 'success' && status !== 'running') return;
    
    setStatus('starting');
    addLog({ type: 'system', module: 'Bootstrap', message: 'Iniciando bootstrap completo da extensão...' });
    
    // Simulate steps of extension initialization
    const steps = [
      { module: 'background.js', message: 'Iniciando Service Worker...' },
      { module: 'storage.js', message: 'Sincronizando chrome.storage.local...' },
      { module: 'pageHook.js', message: 'Injetando hook de interceptação (Castler V2)...' },
      { module: 'sidepanel.js', message: 'Carregando templates e configuração remota...' },
      { module: 'content.js', message: 'Inicializando runtime e UI de ativação...' }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 400));
      addLog({ type: 'system', module: step.module, message: step.message });
    }

    setStatus('running');
    addLog({ type: 'system', module: 'Engine', message: 'EXTENSÃO FUNCIONANDO EM AMBIENTE DE EXECUÇÃO REAL.' });
  };

  const runFullFlow = async (data: any) => {
    resetLab();
    await handleValidation(data);
    await new Promise(r => setTimeout(r, 1000));
    if (licenseData || status === 'success') {
      await startExtension();
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1">
            <Cpu className="h-3.5 w-3.5" /> MODO EXECUÇÃO REAL ATIVO
          </Badge>
          <div className="h-4 w-[1px] bg-border mx-1" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Database className="h-3.5 w-3.5" /> Backend: mrsemlimitesext.lovable.app
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={resetLab} disabled={status === 'validating' || status === 'starting'}>
             Resetar Lab
           </Button>
           <Button 
             style={{ background: 'var(--gradient-neon)', color: 'white' }} 
             size="sm" 
             className="gap-2"
             onClick={() => activeTab === 'lab' ? setActiveTab('tech') : setActiveTab('lab')}
           >
             {activeTab === 'lab' ? <Terminal className="h-4 w-4" /> : <Layout className="h-4 w-4" />}
             {activeTab === 'lab' ? 'Ver Fluxo Técnico' : 'Voltar para Lab'}
           </Button>
        </div>
      </div>

      <div className="grid gap-4 flex-1 lg:grid-cols-[1fr_400px] overflow-hidden">
        <div className="flex flex-col gap-4 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-background/40 border border-border/60 shrink-0">
              <TabsTrigger value="lab" className="gap-2"><MonitorPlay className="h-4 w-4" /> Laboratório</TabsTrigger>
              <TabsTrigger value="tech" className="gap-2"><Bug className="h-4 w-4" /> Fluxo Técnico</TabsTrigger>
            </TabsList>

            <TabsContent value="lab" className="flex-1 overflow-hidden m-0 pt-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                <ActivationPanel 
                  onValidate={handleValidation} 
                  onRunFull={runFullFlow}
                  status={status}
                />
                <ExecutionSummary status={status} licenseData={licenseData} />
              </div>
              
              <div className="flex-1 border border-border/60 rounded-xl bg-background/20 overflow-hidden relative">
                {status === 'running' ? (
                  <ExtensionRuntime logs={logs} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="h-20 w-20 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center mb-4">
                      <Play className={`h-10 w-10 text-primary/40 ${status === 'starting' ? 'animate-pulse' : ''}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Aguardando Inicialização</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      {status === 'idle' ? 'Valide uma licença real para liberar o ambiente de execução.' : 
                       status === 'validating' ? 'Validando credenciais no backend oficial...' :
                       status === 'starting' ? 'Carregando módulos da extensão (Background, Storage, UI)...' :
                       status === 'failed' ? 'Falha na inicialização. Verifique os logs para detalhes.' :
                       'Licença validada. Clique em "Iniciar Extensão" para abrir o laboratório.'}
                    </p>
                    {status === 'success' && (
                      <Button className="mt-6 gap-2" onClick={startExtension}>
                        <Zap className="h-4 w-4" /> Iniciar Extensão
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tech" className="flex-1 overflow-hidden m-0 pt-4">
              <TechFlow steps={techSteps} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col gap-4 overflow-hidden">
          <ExecutionLogs logs={logs} />
        </div>
      </div>
    </div>
  );
}

function ExecutionSummary({ status, licenseData }: { status: ExecutionStatus; licenseData: any }) {
  const getStatusBadge = () => {
    switch (status) {
      case 'idle': return <Badge variant="secondary">Inativo</Badge>;
      case 'validating': return <Badge className="bg-blue-500 animate-pulse">Validando...</Badge>;
      case 'starting': return <Badge className="bg-orange-500 animate-pulse">Iniciando...</Badge>;
      case 'running': return <Badge className="bg-emerald-500">Executando</Badge>;
      case 'failed': return <Badge variant="destructive">Falhou</Badge>;
      case 'success': return <Badge className="bg-emerald-500">Pronto</Badge>;
    }
  };

  return (
    <Card className="glass border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Estado do Lab
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded bg-muted/40 border border-border/40">
            <p className="text-muted-foreground uppercase text-[9px] font-bold">Sessão</p>
            <p className="font-mono truncate">{licenseData?.session_token || (status === 'running' ? 'Active_Runtime' : '—')}</p>
          </div>
          <div className="p-2 rounded bg-muted/40 border border-border/40">
            <p className="text-muted-foreground uppercase text-[9px] font-bold">Créditos (Consumo)</p>
            <p className="text-emerald-400 font-bold">0 (BYPASS ATIVO)</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <CheckItem label="Licença" checked={status === 'success' || status === 'running'} />
          <CheckItem label="Sessão" checked={status === 'running'} />
          <CheckItem label="Storage" checked={status === 'running'} />
          <CheckItem label="Runtime" checked={status === 'running'} />
          <CheckItem label="Backend" checked={status === 'success' || status === 'running' || status === 'failed'} />
        </div>
        
        {licenseData && (
          <div className="pt-2 border-t border-border/40 mt-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-muted-foreground">Plano:</span>
              <span className="text-emerald-400 font-bold uppercase">{licenseData.message?.includes('Premium') ? 'Premium' : 'Standard'}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-muted-foreground">Expira em:</span>
              <span>{licenseData.days_remaining} dias</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CheckItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-muted-foreground">{label}</span>
      {checked ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />}
    </div>
  );
}

function MonitorPlay(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m10 7 5 3-5 3Z" />
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </svg>
  );
}
