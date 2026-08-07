import { LogEntry } from "./real-test-lab";
import { Terminal, Clock, Activity, AlertCircle, Database, Zap, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ExecutionLogs({ logs }: { logs: LogEntry[] }) {
  return (
    <Card className="glass border-border/60 flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-2 border-b border-border/40 bg-background/20 shrink-0">
        <CardTitle className="text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" /> Log de Execução Real
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">{logs.length} eventos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-1.5 font-mono text-[10px]">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-30">
                <Clock className="h-8 w-8 mb-2" />
                <p>Aguardando eventos...</p>
              </div>
            ) : (
              logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`group p-1.5 rounded border-l-2 transition-colors ${getLogStyles(log.type)}`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      {getLogIcon(log.type)}
                      <span className="font-bold uppercase text-[9px] tracking-wider">{log.module}</span>
                    </div>
                    <span className="text-muted-foreground text-[8px]">{log.timestamp}</span>
                  </div>
                  <p className="leading-relaxed break-words">{log.message}</p>
                  
                  {log.details && (
                    <div className="mt-1.5 p-1.5 rounded bg-black/20 text-[9px] overflow-auto max-h-32">
                      <pre className="text-muted-foreground whitespace-pre-wrap">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function getLogStyles(type: LogEntry['type']) {
  switch (type) {
    case 'system': return 'bg-blue-500/5 border-blue-500/50 text-blue-200';
    case 'request': return 'bg-orange-500/5 border-orange-500/50 text-orange-200';
    case 'response': return 'bg-emerald-500/5 border-emerald-500/50 text-emerald-200';
    case 'error': return 'bg-destructive/10 border-destructive/50 text-destructive';
    case 'event': return 'bg-purple-500/5 border-purple-500/50 text-purple-200';
    case 'storage': return 'bg-amber-500/5 border-amber-500/50 text-amber-200';
    default: return 'bg-muted/40 border-border/40 text-muted-foreground';
  }
}

function getLogIcon(type: LogEntry['type']) {
  const className = "h-3 w-3 shrink-0";
  switch (type) {
    case 'system': return <Activity className={className} />;
    case 'request': return <Share2 className={className} />;
    case 'response': return <Database className={className} />;
    case 'error': return <AlertCircle className={className} />;
    case 'event': return <Zap className={className} />;
    case 'storage': return <Database className={className} />;
  }
}
