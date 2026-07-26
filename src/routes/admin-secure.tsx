import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ShieldCheck, RefreshCw, Lock, Download } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  listIntegrity,
  regenerateIntegrity,
  hardenExtension,
  type IntegrityInfo,
} from "@/lib/admin-secure.functions";
import { getSessionEmail } from "@/mock/admin";

export const Route = createFileRoute("/admin-secure")({ component: AdminSecurePage });

function AdminSecurePage() {
  const [rows, setRows] = useState<IntegrityInfo[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [hardenOut, setHardenOut] = useState<Record<string, string>>({});

  const list = useServerFn(listIntegrity);
  const regen = useServerFn(regenerateIntegrity);
  const harden = useServerFn(hardenExtension);

  const refresh = async () => {
    try { setRows(await list()); } catch (e) { toast.error(String((e as Error).message)); }
  };

  useEffect(() => {
    // Gate simples via sessão admin do painel (mesma do resto do app).
    if (typeof window !== "undefined" && !getSessionEmail()) {
      toast.error("Área restrita: faça login como administrador.");
    }
    refresh();
     
  }, []);

  const doRegen = async (extKey: string) => {
    setBusy(extKey + ":regen");
    try {
      const r = await regen({ data: { extKey } });
      toast.success(`Integridade regenerada (${r.fileCount} arquivos)`);
      await refresh();
    } catch (e) { toast.error(String((e as Error).message)); }
    finally { setBusy(null); }
  };

  const doHarden = async (extKey: string) => {
    setBusy(extKey + ":harden");
    try {
      const r = await harden({ data: { extKey } });
      setHardenOut((s) => ({ ...s, [extKey]: r.outDir }));
      toast.success(`Hardening ok — ${r.obfuscated}/${r.total} ofuscados`);
    } catch (e) { toast.error(String((e as Error).message)); }
    finally { setBusy(null); }
  };

  return (
    <AppShell title="Admin Secure" subtitle="Painel restrito de segurança — integridade, hardening e versão autorizada.">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle>Integridade das Extensões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground text-left">
                  <tr>
                    <th className="py-2">Extensão</th>
                    <th>Arquivos</th>
                    <th>Gerado</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.extKey} className="border-t">
                      <td className="py-2">
                        <div className="font-medium">{r.extKey}</div>
                        <div className="text-xs text-muted-foreground">{r.path}</div>
                      </td>
                      <td>
                        {r.present ? <Badge variant="secondary">{r.fileCount}</Badge> : <Badge variant="destructive">ausente</Badge>}
                      </td>
                      <td className="text-xs text-muted-foreground">{r.generatedAt ?? "—"}</td>
                      <td className="text-right space-x-2">
                        <Button size="sm" variant="outline" disabled={busy === r.extKey + ":regen"} onClick={() => doRegen(r.extKey)}>
                          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Regerar
                        </Button>
                        <Button size="sm" disabled={busy === r.extKey + ":harden"} onClick={() => doHarden(r.extKey)}>
                          <Lock className="h-3.5 w-3.5 mr-1" /> Harden
                        </Button>
                        {hardenOut[r.extKey] && (
                          <a href={hardenOut[r.extKey]} target="_blank" rel="noreferrer" className="inline-flex">
                            <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5 mr-1" /> Saída</Button>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notas</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• <strong>Regerar</strong> reescreve <code>manifest.integrity.json</code> após qualquer edição legítima.</p>
            <p>• <strong>Harden</strong> gera uma cópia minificada + ofuscada em <code>public/factory-builds/hardened/</code>, sem tocar no fonte.</p>
            <p>• EXT5 (Manus) fica intencionalmente fora do escopo.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
