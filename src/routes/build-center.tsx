import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllExtensions } from "@/factory";
import { getExtensionBuildInfo } from "@/factory/build.functions";
import { useServerFn } from "@tanstack/react-start";
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Package, 
  Activity, 
  Calendar, 
  Fingerprint,
  Info
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/build-center")({
  component: BuildInspectorPage,
});

function BuildInspectorPage() {
  const extensions = getAllExtensions();
  const [selectedId, setSelectedId] = useState(extensions[0]?.id || "");
  const getBuildInfo = useServerFn(getExtensionBuildInfo);

  const { data: build, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["build-info", selectedId],
    queryFn: () => getBuildInfo({ data: { id: selectedId } }),
    enabled: !!selectedId,
  });

  const selectedExt = extensions.find(e => e.id === selectedId);

  return (
    <AppShell 
      title="Build Inspector" 
      subtitle="Auditoria profissional de compilação, versionamento e integridade dos pacotes."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/40 bg-background/40 p-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Selecionar Extensão:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {extensions.map((ext) => (
              <Button
                key={ext.id}
                variant={selectedId === ext.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedId(ext.id)}
                className="h-8"
              >
                {ext.code} - {ext.name}
              </Button>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto h-8 w-8" 
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
          >
            <RefreshCcw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : build && !("error" in build) ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-primary" />
                  Sincronização em Tempo Real
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SyncItem 
                  label="Manifest Sincronizado" 
                  isValid={build.status.manifestSynced} 
                  value={`v${build.manifestVersion}`}
                />
                <SyncItem 
                  label="ZIP Sincronizado" 
                  isValid={build.status.zipSynced} 
                  value="OK"
                />
                <SyncItem 
                  label="Factory Sincronizada" 
                  isValid={build.status.factorySynced} 
                  value={`v${selectedExt?.version}`}
                />
                <SyncItem 
                  label="Build Válido (SHA256)" 
                  isValid={build.status.buildValid} 
                  value="Integridade OK"
                />
                
                {selectedExt?.version !== build.manifestVersion && (
                  <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                    <XCircle className="mb-1 h-4 w-4" />
                    <strong>ERRO DE DIVERGÊNCIA:</strong> A versão do Manifest (v{build.manifestVersion}) não coincide com a versão da Factory (v{selectedExt?.version}). Download bloqueado até sincronização.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-primary" />
                  Metadados Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MetaRow icon={Fingerprint} label="Build ID" value={build.buildId} />
                <MetaRow icon={Calendar} label="Data Compilação" value={new Date(build.timestamp).toLocaleString("pt-BR")} />
                <MetaRow icon={Fingerprint} label="UUID" value={build.uuid} mono />
                <MetaRow icon={Package} label="SHA256" value={build.sha256.slice(0, 32) + "..."} mono />
                <MetaRow icon={Info} label="Source Path" value={build.sourceDir} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <XCircle className="mb-4 h-12 w-12 text-destructive" />
              <h3 className="text-lg font-bold">Erro de Build</h3>
              <p className="text-muted-foreground">Não foi possível ler os metadados da extensão selecionada.</p>
              {build && "error" in build && <p className="mt-2 text-xs font-mono">{build.error}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function SyncItem({ label, isValid, value }: { label: string; isValid: boolean; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 p-3">
      <div className="flex items-center gap-2">
        {isValid ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <XCircle className="h-4 w-4 text-destructive" />
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Badge variant={isValid ? "outline" : "destructive"} className={isValid ? "border-emerald-500/40 text-emerald-400" : ""}>
        {isValid ? "✓ " : "✗ "} {value}
      </Badge>
    </div>
  );
}

function MetaRow({ icon: Icon, label, value, mono }: { icon: any; label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className={`mt-0.5 text-sm ${mono ? "font-mono text-xs break-all" : "font-medium"}`}>{value}</p>
    </div>
  );
}
