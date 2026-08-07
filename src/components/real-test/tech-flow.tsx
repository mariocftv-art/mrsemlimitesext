import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileCode, Clock, ArrowRight, Share2, Database, AlertCircle } from "lucide-react";

export function TechFlow({ steps }: { steps: any[] }) {
  return (
    <div className="flex flex-col h-full bg-background/40 border border-border/60 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/60 bg-background/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Fluxo Técnico de Execução</h3>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase">Apenas Produção</Badge>
      </div>
      
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow className="hover:bg-transparent text-[10px] uppercase tracking-wider text-muted-foreground">
              <TableHead className="w-[150px]">Arquivo/Módulo</TableHead>
              <TableHead>Ação / Função</TableHead>
              <TableHead className="w-[100px] text-right">Tempo</TableHead>
              <TableHead className="w-[100px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-mono text-[11px]">
            {steps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground opacity-50 italic">
                  Aguardando início do fluxo técnico...
                </TableCell>
              </TableRow>
            ) : (
              steps.map((step, i) => (
                <TableRow key={i} className="hover:bg-muted/10 border-border/20">
                  <TableCell className="font-bold text-blue-400">
                    <div className="flex items-center gap-1.5">
                      <FileCode className="h-3 w-3 opacity-50" />
                      {step.file}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 opacity-30" />
                      {step.action}
                      {step.details?.session_token && <Badge variant="outline" className="text-[8px] h-4 bg-emerald-500/5 border-emerald-500/30 text-emerald-400">SESSION_CREATED</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-orange-400 font-bold">
                    {step.duration ? `${step.duration}ms` : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {step.type === 'error' ? (
                      <AlertCircle className="h-3 w-3 text-destructive ml-auto" />
                    ) : (
                      <CheckIcon type={step.type} />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

function CheckIcon({ type }: { type: string }) {
  if (type === 'request') return <Share2 className="h-3 w-3 text-blue-400 ml-auto" />;
  if (type === 'response') return <Database className="h-3 w-3 text-emerald-400 ml-auto" />;
  return <Clock className="h-3 w-3 text-muted-foreground ml-auto" />;
}
