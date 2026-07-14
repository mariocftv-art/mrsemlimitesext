import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  Copy,
  Download,
  History,
  KeyRound,
  MoreHorizontal,
  Plus,
  RefreshCw,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useStore, licenseActions } from "@/mock/store";
import type { License } from "@/mock/types";
import { useTable, formatDate, exportCsv } from "@/lib/table-utils";

export const Route = createFileRoute("/licenses")({ component: LicensesPage });

const statusTone: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  blocked: "bg-red-500/15 text-red-400 border-red-500/30",
  expired: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  pending: "bg-sky-500/15 text-sky-400 border-sky-500/30",
};

function LicensesPage() {
  const licenses = useStore((s) => s.licenses);
  const customers = useStore((s) => s.customers);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const products = useMemo(() => Array.from(new Set(licenses.map((l) => l.product))), [licenses]);

  const customerMap = useMemo(
    () => Object.fromEntries(customers.map((c) => [c.id, c])),
    [customers],
  );

  const t = useTable(licenses, {
    pageSize: 8,
    filter: (l) =>
      (statusFilter === "all" || l.status === statusFilter) &&
      (productFilter === "all" || l.product === productFilter),
    search: (l, q) =>
      l.key.toLowerCase().includes(q) ||
      l.product.toLowerCase().includes(q) ||
      (customerMap[l.customerId || ""]?.name.toLowerCase().includes(q) ?? false),
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [historyOf, setHistoryOf] = useState<License | null>(null);
  const [transferOf, setTransferOf] = useState<License | null>(null);
  const [transferTo, setTransferTo] = useState("");

  const bulk = (fn: (l: License) => void, label: string) => {
    const rows = t.selectedRows();
    if (!rows.length) return toast.error("Selecione ao menos uma licença.");
    rows.forEach(fn);
    t.clearSelection();
    toast.success(`${label} aplicado a ${rows.length} licença(s).`);
  };

  return (
    <AppShell
      title="Licenças"
      subtitle="Gerar, renovar, bloquear, transferir, duplicar, resetar dispositivo, alterar validade."
      actions={
        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
        >
          <Plus className="mr-1 h-4 w-4" /> Nova licença
        </Button>
      }
    >
      <Card className="glass border-border/60">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Buscar por chave, produto ou cliente..."
              value={t.q}
              onChange={(e) => t.setQ(e.target.value)}
              className="h-9 max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="blocked">Bloqueada</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="h-9 w-56"><SelectValue placeholder="Produto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos produtos</SelectItem>
                {products.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="ml-auto flex gap-2">
              <Button
                size="sm" variant="outline"
                onClick={() =>
                  exportCsv("licencas.csv", licenses.map((l) => ({
                    chave: l.key, produto: l.product,
                    cliente: customerMap[l.customerId || ""]?.name || "",
                    status: l.status, criada: l.createdAt, expira: l.expiresAt, hwid: l.hwid || "",
                  })))
                }
              >
                <Download className="mr-1 h-4 w-4" /> Exportar
              </Button>
              {t.selected.size > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">Ações ({t.selected.size})</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Seleção múltipla</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => bulk((l) => licenseActions.renew(l.id, 30), "+30 dias")}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Renovar +30d
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulk((l) => licenseActions.block(l.id, "bulk"), "Bloqueio")}>
                      <Ban className="mr-2 h-4 w-4" /> Bloquear
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulk((l) => licenseActions.unblock(l.id), "Desbloqueio")}>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Desbloquear
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulk((l) => licenseActions.remove(l.id), "Exclusão")}>
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={t.pageRows.length > 0 && t.selected.size === t.pageRows.length}
                      onCheckedChange={() => t.toggleAll()}
                    />
                  </TableHead>
                  <TableHead>Chave</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criada</TableHead>
                  <TableHead>Expira</TableHead>
                  <TableHead>HWID</TableHead>
                  <TableHead className="w-14 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {t.pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                      Nenhuma licença encontrada.
                    </TableCell>
                  </TableRow>
                )}
                {t.pageRows.map((l, i) => (
                  <TableRow key={l.id} data-selected={t.selected.has(i)}>
                    <TableCell>
                      <Checkbox checked={t.selected.has(i)} onCheckedChange={() => t.toggleRow(i)} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{l.key}</TableCell>
                    <TableCell className="text-sm">{l.product}</TableCell>
                    <TableCell className="text-sm">
                      {customerMap[l.customerId || ""]?.name || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusTone[l.status]}>{l.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{formatDate(l.createdAt)}</TableCell>
                    <TableCell className="text-xs">{formatDate(l.expiresAt)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {l.hwid || <span className="text-muted-foreground">livre</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { licenseActions.renew(l.id, 30); toast.success("Renovada +30d"); }}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Renovar +30d
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { licenseActions.renew(l.id, 365); toast.success("Renovada +1 ano"); }}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Renovar +1 ano
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {l.status === "blocked" ? (
                            <DropdownMenuItem onClick={() => { licenseActions.unblock(l.id); toast.success("Desbloqueada"); }}>
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Desbloquear
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => { licenseActions.block(l.id); toast.success("Bloqueada"); }}>
                              <Ban className="mr-2 h-4 w-4" /> Bloquear
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => { licenseActions.resetHwid(l.id); toast.success("HWID resetado"); }}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Resetar HWID
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { licenseActions.duplicate(l.id); toast.success("Licença duplicada"); }}>
                            <Copy className="mr-2 h-4 w-4" /> Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setTransferOf(l); setTransferTo(""); }}>
                            <Send className="mr-2 h-4 w-4" /> Transferir
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setHistoryOf(l)}>
                            <History className="mr-2 h-4 w-4" /> Histórico
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => { licenseActions.remove(l.id); toast.success("Excluída"); }}
                            className="text-red-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t.total} licença(s) · página {t.page} de {t.totalPages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={t.page <= 1} onClick={() => t.setPage(t.page - 1)}>Anterior</Button>
              <Button size="sm" variant="outline" disabled={t.page >= t.totalPages} onClick={() => t.setPage(t.page + 1)}>Próxima</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateLicenseDialog open={createOpen} onOpenChange={setCreateOpen} />

      <Dialog open={!!historyOf} onOpenChange={(o) => !o && setHistoryOf(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Histórico — {historyOf?.key}</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-80">
            <ul className="space-y-2">
              {(historyOf?.history || []).map((h, i) => (
                <li key={i} className="rounded border border-border/40 bg-background/40 p-2 text-xs">
                  <p className="font-medium">{h.action}</p>
                  <p className="text-muted-foreground">{formatDate(h.ts)} · {h.by}</p>
                  {h.note && <p className="mt-1">{h.note}</p>}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!transferOf} onOpenChange={(o) => !o && setTransferOf(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Transferir licença</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Chave: <span className="font-mono">{transferOf?.key}</span></p>
            <Label className="text-xs">Novo cliente</Label>
            <Select value={transferTo} onValueChange={setTransferTo}>
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                {customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} — {c.email}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferOf(null)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!transferOf || !transferTo) return;
                licenseActions.transfer(transferOf.id, transferTo);
                toast.success("Licença transferida");
                setTransferOf(null);
              }}
            >Transferir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

const PAID_PRESETS = [
  { label: "30 dias", days: 30 },
  { label: "60 dias", days: 60 },
  { label: "90 dias", days: 90 },
  { label: "180 dias", days: 180 },
  { label: "365 dias", days: 365 },
];

const TRIAL_PRESETS = [
  { label: "30 minutos", minutes: 30 },
  { label: "1 hora", minutes: 60 },
  { label: "2 horas", minutes: 120 },
  { label: "6 horas", minutes: 360 },
  { label: "24 horas", minutes: 1440 },
];

function CreateLicenseDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const customers = useStore((s) => s.customers);
  const [tab, setTab] = useState<"paid" | "trial">("paid");
  const [product, setProduct] = useState("MR Sem Limites");
  const [customerId, setCustomerId] = useState("");
  const [qty, setQty] = useState("1");
  const [days, setDays] = useState("30");
  const [minutes, setMinutes] = useState("60");
  const [lastBatch, setLastBatch] = useState<string[]>([]);

  const reset = () => {
    setQty("1"); setDays("30"); setMinutes("60"); setCustomerId(""); setLastBatch([]);
  };

  const submit = () => {
    const n = Math.max(1, Math.min(100, Number(qty) || 1));
    const isTrial = tab === "trial";
    const ms = isTrial ? Number(minutes) * 60_000 : Number(days) * 86400_000;
    if (!ms || ms <= 0) return toast.error("Duração inválida.");
    const created: string[] = [];
    for (let i = 0; i < n; i++) {
      const base = licenseActions.generateKey();
      const key = isTrial ? `TRIAL-${base}` : base;
      const l = licenseActions.create({
        key,
        product: isTrial ? `${product} (TESTE)` : product,
        customerId: customerId || null,
        expiresAt: new Date(Date.now() + ms).toISOString(),
      });
      created.push(l.key);
    }
    setLastBatch(created);
    toast.success(
      isTrial
        ? `${n} teste(s) grátis gerado(s) (${minutes} min cada)`
        : `${n} licença(s) criada(s) (${days} dias cada)`,
    );
  };

  const copyBatch = () => {
    if (!lastBatch.length) return;
    navigator.clipboard.writeText(lastBatch.join("\n"));
    toast.success("Chaves copiadas");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova licença · geração em lote</DialogTitle>
        </DialogHeader>

        <div className="flex gap-1 rounded-lg border border-border/60 p-1">
          <button
            type="button"
            onClick={() => setTab("paid")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm transition ${tab === "paid" ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-muted/40"}`}
          >
            Licença paga
          </button>
          <button
            type="button"
            onClick={() => setTab("trial")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm transition ${tab === "trial" ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-muted/40"}`}
          >
            Teste grátis (admin)
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Quantidade (1–100)</Label>
              <Input type="number" min={1} max={100} value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Cliente (opcional)</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Produto</Label>
            <Input value={product} onChange={(e) => setProduct(e.target.value)} />
          </div>

          {tab === "paid" ? (
            <div className="space-y-2">
              <Label className="text-xs">Validade</Label>
              <div className="flex flex-wrap gap-2">
                {PAID_PRESETS.map((p) => (
                  <Button
                    key={p.days}
                    type="button"
                    size="sm"
                    variant={days === String(p.days) ? "default" : "outline"}
                    onClick={() => setDays(String(p.days))}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
              <Input type="number" min={1} value={days} onChange={(e) => setDays(e.target.value)} placeholder="dias personalizados" />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-xs">Duração do teste</Label>
              <div className="flex flex-wrap gap-2">
                {TRIAL_PRESETS.map((p) => (
                  <Button
                    key={p.minutes}
                    type="button"
                    size="sm"
                    variant={minutes === String(p.minutes) ? "default" : "outline"}
                    onClick={() => setMinutes(String(p.minutes))}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
              <Input type="number" min={1} value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="minutos personalizados" />
              <p className="text-[11px] text-muted-foreground">
                Chaves de teste têm prefixo <span className="font-mono">TRIAL-</span> e só podem ser geradas pelo admin.
              </p>
            </div>
          )}

          {lastBatch.length > 0 && (
            <div className="space-y-2 rounded-lg border border-border/60 bg-background/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {lastBatch.length} chave(s) geradas nesta sessão
                </span>
                <Button size="sm" variant="outline" onClick={copyBatch}>
                  <Copy className="mr-1 h-3.5 w-3.5" /> Copiar todas
                </Button>
              </div>
              <ScrollArea className="max-h-32">
                <ul className="space-y-1 font-mono text-[11px]">
                  {lastBatch.map((k) => <li key={k}>{k}</li>)}
                </ul>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button
            onClick={submit}
            style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
          >
            <Plus className="mr-1 h-4 w-4" />
            {tab === "trial" ? "Gerar testes" : "Gerar licenças"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
