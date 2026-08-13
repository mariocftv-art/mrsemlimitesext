import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Wallet, 
  Key, 
  RefreshCcw, 
  Users, 
  AlertCircle,
  Activity,
  History,
  ShieldCheck,
  Zap,
  ExternalLink
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getBalance, listLicenses, resetHwid } from "@/lib/reseller-api.functions";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [isResetting, setIsResetting] = useState<string | null>(null);
  
  const getBal = useServerFn(getBalance);
  const getLics = useServerFn(listLicenses);
  const doReset = useServerFn(resetHwid);

  const { data: balance, isLoading: loadingBalance } = useQuery({
    queryKey: ["reseller-balance"],
    queryFn: () => getBal({ data: undefined }),
  });

  const { data: licenses, isLoading: loadingLicenses, refetch: refetchLicenses } = useQuery({
    queryKey: ["reseller-licenses"],
    queryFn: () => getLics({ data: undefined }),
  });

  const handleResetHwid = async (licenseId: string) => {
    setIsResetting(licenseId);
    try {
      const res = await doReset({ data: { id: licenseId } });
      if (res.success) {
        toast.success("Hardware ID resetado com sucesso!");
        refetchLicenses();
      } else {
        toast.error("Erro ao resetar HWID: " + res.error);
      }
    } catch (err) {
      toast.error("Erro na comunicação com o servidor.");
    } finally {
      setIsResetting(null);
    }
  };

  return (
    <AppShell 
      title="Painel do Revendedor" 
      subtitle="Gerenciamento de créditos e licenças MR Sem Limites"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass border-primary/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="h-12 w-12 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Saldo Disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loadingBalance ? "..." : `R$ ${balance?.balance?.toLocaleString() || "0,00"}`}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Sincronizado com Supabase Reseller API</p>
          </CardContent>
        </Card>

        <Card className="glass border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Licenças Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingLicenses ? "..." : licenses?.licenses?.length || 0}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Total de vendas realizadas</p>
          </CardContent>
        </Card>

        <Card className="glass border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Status da API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-green-500 font-bold">
              <Activity className="h-5 w-5" /> ONLINE
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Endpoint Reseller v1 ativo</p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-primary uppercase tracking-widest">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link to="/checkout">
              <Button size="sm" className="h-8 gap-1.5" style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}>
                <Zap className="h-3 w-3 fill-current" /> Nova Venda
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="glass lg:col-span-2 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4 text-primary" /> Histórico de Licenças
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => refetchLicenses()} disabled={loadingLicenses}>
              <RefreshCcw className={`h-4 w-4 ${loadingLicenses ? 'animate-spin' : ''}`} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Comprador</th>
                    <th className="pb-3 font-medium">Chave</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">HWID</th>
                    <th className="pb-3 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {licenses?.licenses?.map((lic: any) => (
                    <tr key={lic.id} className="hover:bg-primary/5 transition-colors">
                      <td className="py-4">
                        <div className="font-medium">{lic.name}</div>
                        <div className="text-[10px] text-muted-foreground">{lic.email}</div>
                      </td>
                      <td className="py-4">
                        <code className="bg-background/60 px-2 py-1 rounded text-[10px] font-bold text-primary">
                          {lic.license_key}
                        </code>
                      </td>
                      <td className="py-4">
                        <Badge variant="outline" className={lic.status === 'active' ? 'border-green-500/50 text-green-400' : 'border-amber-500/50 text-amber-400'}>
                          {lic.status === 'active' ? 'ATIVO' : 'PENDENTE'}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {lic.hwid ? lic.hwid.substring(0, 12) + '...' : 'Não vinculado'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => handleResetHwid(lic.id)}
                          disabled={!lic.hwid || isResetting === lic.id}
                          title="Resetar Hardware ID"
                        >
                          <RefreshCcw className={`h-4 w-4 ${isResetting === lic.id ? 'animate-spin' : ''}`} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {(!licenses?.licenses || licenses.licenses.length === 0) && !loadingLicenses && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        Nenhuma licença encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Segurança Reseller
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3">
              <div className="p-3 rounded-lg bg-background/40 border border-border/40">
                <p className="font-bold text-primary mb-1">Backup de Chaves</p>
                <p className="text-muted-foreground">As chaves são enviadas automaticamente por e-mail, mas o backup local em Supabase é garantido.</p>
              </div>
              <div className="p-3 rounded-lg bg-background/40 border border-border/40">
                <p className="font-bold text-primary mb-1">Controle de HWID</p>
                <p className="text-muted-foreground">Cada licença é vinculada a um único navegador. Use o reset apenas em caso de formatação ou migração.</p>
              </div>
              <Button variant="outline" className="w-full text-[10px] h-8 gap-2 border-primary/20">
                <ExternalLink className="h-3 w-3" /> Ver Documentação API
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-amber-500/20 bg-amber-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-amber-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> AVISO DE SALDO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[10px] text-amber-200/70">
                Seu saldo é debitado em <strong>R$ 30,00</strong> por cada licença de 30 dias gerada. 
                Recargas via Dashboard Supabase.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
