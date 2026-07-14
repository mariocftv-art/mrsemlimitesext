import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { useStore, blacklistActions } from "@/mock/store";
import type { BlacklistEntry, BlacklistType } from "@/mock/types";
import { useTable, formatDate } from "@/lib/table-utils";
import { getSessionEmail } from "@/mock/admin";

export const Route = createFileRoute("/blacklist")({ component: BlacklistPage });

const typeTone: Record<string, string> = {
  hwid: "border-violet-500/30 bg-violet-500/15 text-violet-400",
  ip: "border-cyan-500/30 bg-cyan-500/15 text-cyan-400",
  license: "border-fuchsia-500/30 bg-fuchsia-500/15 text-fuchsia-400",
  customer: "border-yellow-500/30 bg-yellow-500/15 text-yellow-400",
};

function BlacklistPage() {
  const blacklist = useStore((s) => s.blacklist);
  const [typeFilter, setTypeFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<BlacklistEntry | null>(null);

  const t = useTable(blacklist, {
    pageSize: 10,
    filter: (b) => typeFilter === "all" || b.type === typeFilter,
    search: (b, q) =>
      b.value.toLowerCase().includes(q) ||
      b.reason.toLowerCase().includes(q) ||
      b.adminId.toLowerCase().includes(q),
  });

  return (
    <AppShell
      title="Blacklist"
      subtitle="Bloquear HWID, IP, licença ou cliente com motivo e administrador responsável."
      actions={
        <Button
          size="sm" onClick={() => { setEditing(null); setOpenForm(true); }}
          style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
        >
          <Plus className="mr-1 h-4 w-4" /> Novo bloqueio
        </Button>
      }
    >
      <Card className="glass border-border/60">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Buscar valor, motivo, administrador..."
              value={t.q} onChange={(e) => t.setQ(e.target.value)}
              className="h-9 max-w-sm"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos tipos</SelectItem>
                <SelectItem value="hwid">HWID</SelectItem>
                <SelectItem value="ip">IP</SelectItem>
                <SelectItem value="license">Licença</SelectItem>
                <SelectItem value="customer">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {t.pageRows.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">Nenhum bloqueio.</TableCell></TableRow>
                )}
                {t.pageRows.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell><Badge variant="outline" className={typeTone[b.type]}>{b.type}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{b.value}</TableCell>
                    <TableCell className="text-sm">{b.reason}</TableCell>
                    <TableCell className="text-xs">{b.adminId}</TableCell>
                    <TableCell className="text-xs">{formatDate(b.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8"
                          onClick={() => { setEditing(b); setOpenForm(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400"
                          onClick={() => { blacklistActions.remove(b.id); toast.success("Bloqueio removido"); }}>
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
            <span>{t.total} bloqueio(s) · página {t.page} de {t.totalPages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={t.page <= 1} onClick={() => t.setPage(t.page - 1)}>Anterior</Button>
              <Button size="sm" variant="outline" disabled={t.page >= t.totalPages} onClick={() => t.setPage(t.page + 1)}>Próxima</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <BlacklistForm open={openForm} onOpenChange={setOpenForm} entry={editing} />
    </AppShell>
  );
}

function BlacklistForm({
  open, onOpenChange, entry,
}: { open: boolean; onOpenChange: (o: boolean) => void; entry: BlacklistEntry | null }) {
  const [type, setType] = useState<BlacklistType>("hwid");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  useMemo(() => {
    setType((entry?.type as BlacklistType) || "hwid");
    setValue(entry?.value || "");
    setReason(entry?.reason || "");
  }, [entry]);

  const submit = () => {
    if (!value) return toast.error("Informe o valor a bloquear.");
    if (entry) {
      blacklistActions.update(entry.id, { type, value, reason });
      toast.success("Bloqueio atualizado");
    } else {
      blacklistActions.create({ type, value, reason });
      toast.success("Bloqueio criado");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{entry ? "Editar bloqueio" : "Novo bloqueio"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as BlacklistType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hwid">HWID</SelectItem>
                <SelectItem value="ip">IP</SelectItem>
                <SelectItem value="license">Licença</SelectItem>
                <SelectItem value="customer">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Valor</Label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Motivo</Label>
            <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <p className="text-xs text-muted-foreground">
            Responsável: <span className="font-medium">{getSessionEmail() || "sistema"}</span>
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>{entry ? "Salvar" : "Bloquear"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
