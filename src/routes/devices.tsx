import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Ban, CheckCircle2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { useStore, deviceActions } from "@/mock/store";
import { useTable, formatDate } from "@/lib/table-utils";

export const Route = createFileRoute("/devices")({ component: DevicesPage });

function DevicesPage() {
  const devices = useStore((s) => s.devices);
  const licenses = useStore((s) => s.licenses);
  const customers = useStore((s) => s.customers);
  const [statusFilter, setStatusFilter] = useState("all");
  const [osFilter, setOsFilter] = useState("all");
  const [openNew, setOpenNew] = useState(false);

  const osList = useMemo(() => Array.from(new Set(devices.map((d) => d.os))), [devices]);
  const licMap = useMemo(() => Object.fromEntries(licenses.map((l) => [l.id, l.key])), [licenses]);
  const custMap = useMemo(() => Object.fromEntries(customers.map((c) => [c.id, c.name])), [customers]);

  const t = useTable(devices, {
    pageSize: 10,
    filter: (d) =>
      (statusFilter === "all" || d.status === statusFilter) &&
      (osFilter === "all" || d.os === osFilter),
    search: (d, q) =>
      d.hwid.toLowerCase().includes(q) ||
      d.os.toLowerCase().includes(q) ||
      d.browser.toLowerCase().includes(q) ||
      (custMap[d.customerId || ""] || "").toLowerCase().includes(q),
  });

  return (
    <AppShell
      title="Dispositivos"
      subtitle="HWID, sistema, navegador, licença vinculada e cliente."
      actions={
        <Button
          size="sm" onClick={() => setOpenNew(true)}
          style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
        >
          <Plus className="mr-1 h-4 w-4" /> Novo dispositivo
        </Button>
      }
    >
      <Card className="glass border-border/60">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Buscar HWID, sistema, navegador, cliente..."
              value={t.q} onChange={(e) => t.setQ(e.target.value)}
              className="h-9 max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="blocked">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={osFilter} onValueChange={setOsFilter}>
              <SelectTrigger className="h-9 w-48"><SelectValue placeholder="Sistema" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {osList.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>HWID</TableHead>
                  <TableHead>SO</TableHead>
                  <TableHead>Navegador</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Licença</TableHead>
                  <TableHead>1ª ativação</TableHead>
                  <TableHead>Último acesso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {t.pageRows.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">Sem dispositivos.</TableCell></TableRow>
                )}
                {t.pageRows.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono text-xs">{d.hwid}</TableCell>
                    <TableCell className="text-sm">{d.os}</TableCell>
                    <TableCell className="text-sm">{d.browser}</TableCell>
                    <TableCell className="text-sm">{custMap[d.customerId || ""] || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{licMap[d.licenseId || ""] || "—"}</TableCell>
                    <TableCell className="text-xs">{formatDate(d.firstSeen)}</TableCell>
                    <TableCell className="text-xs">{formatDate(d.lastSeen)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={d.status === "active"
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                          : "border-red-500/30 bg-red-500/15 text-red-400"}
                      >
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {d.status === "blocked" ? (
                          <Button size="icon" variant="ghost" className="h-8 w-8"
                            title="Liberar" onClick={() => { deviceActions.unblock(d.id); toast.success("Liberado"); }}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="icon" variant="ghost" className="h-8 w-8"
                            title="Bloquear" onClick={() => { deviceActions.block(d.id); toast.success("Bloqueado"); }}>
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-8 w-8"
                          title="Resetar vínculo" onClick={() => { deviceActions.reset(d.id); toast.success("Resetado"); }}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400"
                          title="Excluir" onClick={() => { deviceActions.remove(d.id); toast.success("Excluído"); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t.total} dispositivo(s) · página {t.page} de {t.totalPages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={t.page <= 1} onClick={() => t.setPage(t.page - 1)}>Anterior</Button>
              <Button size="sm" variant="outline" disabled={t.page >= t.totalPages} onClick={() => t.setPage(t.page + 1)}>Próxima</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <NewDeviceDialog open={openNew} onOpenChange={setOpenNew} />
    </AppShell>
  );
}

function NewDeviceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const customers = useStore((s) => s.customers);
  const licenses = useStore((s) => s.licenses);
  const [hwid, setHwid] = useState("");
  const [os, setOs] = useState("Windows 11");
  const [browser, setBrowser] = useState("Chrome 141");
  const [licenseId, setLicenseId] = useState("");
  const [customerId, setCustomerId] = useState("");

  const submit = () => {
    deviceActions.create({
      hwid: hwid || undefined,
      os, browser,
      licenseId: licenseId || null,
      customerId: customerId || null,
    });
    toast.success("Dispositivo criado");
    onOpenChange(false);
    setHwid("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo dispositivo</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">HWID (opcional, será gerado)</Label>
            <Input value={hwid} onChange={(e) => setHwid(e.target.value)} className="font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">SO</Label><Input value={os} onChange={(e) => setOs(e.target.value)} /></div>
            <div className="space-y-1"><Label className="text-xs">Navegador</Label><Input value={browser} onChange={(e) => setBrowser(e.target.value)} /></div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Cliente</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Licença</Label>
            <Select value={licenseId} onValueChange={setLicenseId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>{licenses.map((l) => <SelectItem key={l.id} value={l.id}>{l.key}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
