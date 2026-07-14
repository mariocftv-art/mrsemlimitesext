import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { useStore } from "@/mock/store";
import { useTable, formatDate, exportCsv } from "@/lib/table-utils";

export const Route = createFileRoute("/activations")({ component: ActivationsPage });

const resultTone: Record<string, string> = {
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  fail: "bg-red-500/15 text-red-400 border-red-500/30",
  blocked: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
};

function ActivationsPage() {
  const activations = useStore((s) => s.activations);
  const customers = useStore((s) => s.customers);
  const licenses = useStore((s) => s.licenses);
  const [result, setResult] = useState("all");
  const [ver, setVer] = useState("all");

  const custMap = useMemo(() => Object.fromEntries(customers.map((c) => [c.id, c.name])), [customers]);
  const licMap = useMemo(() => Object.fromEntries(licenses.map((l) => [l.id, l.key])), [licenses]);
  const versions = useMemo(() => Array.from(new Set(activations.map((a) => a.version))), [activations]);

  const t = useTable(activations, {
    pageSize: 12,
    filter: (a) => (result === "all" || a.result === result) && (ver === "all" || a.version === ver),
    search: (a, q) =>
      a.hwid.toLowerCase().includes(q) ||
      a.ip.toLowerCase().includes(q) ||
      a.os.toLowerCase().includes(q) ||
      (custMap[a.customerId || ""] || "").toLowerCase().includes(q) ||
      (licMap[a.licenseId || ""] || "").toLowerCase().includes(q),
  });

  return (
    <AppShell
      title="Ativações"
      subtitle="Registro completo de tentativas de ativação com resultado, IP e versão."
    >
      <Card className="glass border-border/60">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Buscar HWID, IP, sistema, cliente, licença..."
              value={t.q} onChange={(e) => t.setQ(e.target.value)}
              className="h-9 max-w-sm"
            />
            <Select value={result} onValueChange={setResult}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Resultado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos resultados</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="fail">Falha</SelectItem>
                <SelectItem value="blocked">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ver} onValueChange={setVer}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Versão" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas versões</SelectItem>
                {versions.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button
              size="sm" variant="outline" className="ml-auto"
              onClick={() => exportCsv("ativacoes.csv", activations.map((a) => ({
                data: a.ts, cliente: custMap[a.customerId || ""] || "",
                licenca: licMap[a.licenseId || ""] || "",
                hwid: a.hwid, ip: a.ip, sistema: a.os, versao: a.version, resultado: a.result,
              })))}
            >
              <Download className="mr-1 h-4 w-4" /> Exportar
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Licença</TableHead>
                  <TableHead>HWID</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Sistema</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {t.pageRows.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">Nenhuma ativação.</TableCell></TableRow>
                )}
                {t.pageRows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="text-xs">{formatDate(a.ts)}</TableCell>
                    <TableCell className="text-sm">{custMap[a.customerId || ""] || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{licMap[a.licenseId || ""] || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{a.hwid}</TableCell>
                    <TableCell className="font-mono text-xs">{a.ip}</TableCell>
                    <TableCell className="text-xs">{a.os}</TableCell>
                    <TableCell className="text-xs">{a.version}</TableCell>
                    <TableCell><Badge variant="outline" className={resultTone[a.result]}>{a.result}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t.total} ativação(ões) · página {t.page} de {t.totalPages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={t.page <= 1} onClick={() => t.setPage(t.page - 1)}>Anterior</Button>
              <Button size="sm" variant="outline" disabled={t.page >= t.totalPages} onClick={() => t.setPage(t.page + 1)}>Próxima</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
