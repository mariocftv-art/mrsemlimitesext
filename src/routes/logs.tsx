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

export const Route = createFileRoute("/logs")({ component: LogsPage });

const actionTone = (a: string) =>
  a.startsWith("license.") ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-400"
    : a.startsWith("customer.") ? "border-fuchsia-500/30 bg-fuchsia-500/15 text-fuchsia-400"
    : a.startsWith("device.") ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
    : a.startsWith("blacklist.") ? "border-red-500/30 bg-red-500/15 text-red-400"
    : a.startsWith("auth.") ? "border-violet-500/30 bg-violet-500/15 text-violet-400"
    : "border-muted bg-muted/10 text-muted-foreground";

function LogsPage() {
  const logs = useStore((s) => s.logs);
  const [group, setGroup] = useState("all");
  const [admin, setAdmin] = useState("all");

  const admins = useMemo(() => Array.from(new Set(logs.map((l) => l.adminId))), [logs]);
  const groups = ["auth", "license", "customer", "device", "blacklist", "activation", "system"];

  const t = useTable(logs, {
    pageSize: 15,
    filter: (l) =>
      (group === "all" || l.action.startsWith(group + ".")) &&
      (admin === "all" || l.adminId === admin),
    search: (l, q) =>
      l.action.toLowerCase().includes(q) ||
      (l.target || "").toLowerCase().includes(q) ||
      (l.note || "").toLowerCase().includes(q) ||
      l.adminId.toLowerCase().includes(q),
  });

  return (
    <AppShell
      title="Logs"
      subtitle="Histórico completo de ações administrativas com data, hora e responsável."
    >
      <Card className="glass border-border/60">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Buscar ação, alvo, nota, administrador..."
              value={t.q} onChange={(e) => t.setQ(e.target.value)}
              className="h-9 max-w-sm"
            />
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Grupo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos grupos</SelectItem>
                {groups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={admin} onValueChange={setAdmin}>
              <SelectTrigger className="h-9 w-64"><SelectValue placeholder="Administrador" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos administradores</SelectItem>
                {admins.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button
              size="sm" variant="outline" className="ml-auto"
              onClick={() => exportCsv("logs.csv", logs.map((l) => ({
                data: l.ts, acao: l.action, alvo: l.target || "", nota: l.note || "", administrador: l.adminId,
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
                  <TableHead>Ação</TableHead>
                  <TableHead>Alvo</TableHead>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Nota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {t.pageRows.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">Sem registros.</TableCell></TableRow>
                )}
                {t.pageRows.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="text-xs">{formatDate(l.ts)}</TableCell>
                    <TableCell><Badge variant="outline" className={actionTone(l.action)}>{l.action}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{l.target || "—"}</TableCell>
                    <TableCell className="text-xs">{l.adminId}</TableCell>
                    <TableCell className="text-xs">{l.note || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t.total} registro(s) · página {t.page} de {t.totalPages}</span>
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
