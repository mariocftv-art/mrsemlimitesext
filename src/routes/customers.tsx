import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Edit, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useStore, customerActions } from "@/mock/store";
import type { Customer } from "@/mock/types";
import { useTable, formatDate } from "@/lib/table-utils";

export const Route = createFileRoute("/customers")({ component: CustomersPage });

function CustomersPage() {
  const customers = useStore((s) => s.customers);
  const licenses = useStore((s) => s.licenses);
  const devices = useStore((s) => s.devices);

  const [editing, setEditing] = useState<Customer | null>(null);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [openNew, setOpenNew] = useState(false);

  const t = useTable(customers, {
    pageSize: 10,
    search: (c, q) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.document.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q),
  });

  const licenseCount = (id: string) => licenses.filter((l) => l.customerId === id).length;
  const deviceCount = (id: string) => devices.filter((d) => d.customerId === id).length;

  return (
    <AppShell
      title="Clientes"
      subtitle="Nome, contato, empresa, licenças, produtos, dispositivos e histórico."
      actions={
        <Button
          size="sm"
          onClick={() => setOpenNew(true)}
          style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
        >
          <Plus className="mr-1 h-4 w-4" /> Novo cliente
        </Button>
      }
    >
      <Card className="glass border-border/60">
        <CardContent className="space-y-4 p-4">
          <Input
            placeholder="Pesquisar por nome, e-mail, empresa, CPF/CNPJ, telefone..."
            value={t.q}
            onChange={(e) => t.setQ(e.target.value)}
            className="h-9 max-w-md"
          />
          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Licenças</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {t.pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
                {t.pageRows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-sm">{c.email}</TableCell>
                    <TableCell className="text-sm">{c.phone}</TableCell>
                    <TableCell className="text-sm">{c.company}</TableCell>
                    <TableCell className="text-xs font-mono">{c.document}</TableCell>
                    <TableCell>{licenseCount(c.id)}</TableCell>
                    <TableCell>{deviceCount(c.id)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={c.status === "active"
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                          : "border-muted bg-muted/10 text-muted-foreground"}
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewing(c)}>
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(c)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-400"
                          onClick={() => {
                            if (confirm(`Excluir cliente "${c.name}"?`)) {
                              customerActions.remove(c.id);
                              toast.success("Cliente excluído");
                            }
                          }}
                        >
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
            <span>{t.total} cliente(s) · página {t.page} de {t.totalPages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={t.page <= 1} onClick={() => t.setPage(t.page - 1)}>Anterior</Button>
              <Button size="sm" variant="outline" disabled={t.page >= t.totalPages} onClick={() => t.setPage(t.page + 1)}>Próxima</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomerForm open={openNew} onOpenChange={setOpenNew} customer={null} />
      <CustomerForm open={!!editing} onOpenChange={(o) => !o && setEditing(null)} customer={editing} />
      <CustomerDetail open={!!viewing} onOpenChange={(o) => !o && setViewing(null)} customer={viewing} />
    </AppShell>
  );
}

function CustomerForm({
  open, onOpenChange, customer,
}: { open: boolean; onOpenChange: (o: boolean) => void; customer: Customer | null }) {
  const [form, setForm] = useState<Partial<Customer>>({});
  useMemo(() => setForm(customer || { status: "active" }), [customer]);
  const update = (k: keyof Customer, v: string) => setForm({ ...form, [k]: v });

  const submit = () => {
    if (!form.name || !form.email) return toast.error("Nome e e-mail obrigatórios.");
    if (customer) {
      customerActions.update(customer.id, form);
      toast.success("Cliente atualizado");
    } else {
      customerActions.create(form);
      toast.success("Cliente criado");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{customer ? "Editar cliente" : "Novo cliente"}</DialogTitle></DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nome"><Input value={form.name || ""} onChange={(e) => update("name", e.target.value)} /></Field>
          <Field label="E-mail"><Input value={form.email || ""} onChange={(e) => update("email", e.target.value)} /></Field>
          <Field label="Telefone"><Input value={form.phone || ""} onChange={(e) => update("phone", e.target.value)} /></Field>
          <Field label="Empresa"><Input value={form.company || ""} onChange={(e) => update("company", e.target.value)} /></Field>
          <Field label="CPF/CNPJ"><Input value={form.document || ""} onChange={(e) => update("document", e.target.value)} /></Field>
          <Field label="Ativo">
            <div className="flex h-9 items-center">
              <Switch
                checked={form.status === "active"}
                onCheckedChange={(v) => update("status", (v ? "active" : "inactive") as any)}
              />
            </div>
          </Field>
        </div>
        <Field label="Observações">
          <Textarea rows={3} value={form.notes || ""} onChange={(e) => update("notes", e.target.value)} />
        </Field>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>{customer ? "Salvar" : "Criar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CustomerDetail({
  open, onOpenChange, customer,
}: { open: boolean; onOpenChange: (o: boolean) => void; customer: Customer | null }) {
  const licenses = useStore((s) => s.licenses).filter((l) => l.customerId === customer?.id);
  const devices = useStore((s) => s.devices).filter((d) => d.customerId === customer?.id);
  const activations = useStore((s) => s.activations).filter((a) => a.customerId === customer?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{customer?.name}</DialogTitle></DialogHeader>
        {customer && (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-2">
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p><span className="text-muted-foreground">E-mail:</span> {customer.email}</p>
                <p><span className="text-muted-foreground">Telefone:</span> {customer.phone}</p>
                <p><span className="text-muted-foreground">Empresa:</span> {customer.company}</p>
                <p><span className="text-muted-foreground">Doc:</span> {customer.document}</p>
                <p><span className="text-muted-foreground">Criado:</span> {formatDate(customer.createdAt)}</p>
                <p><span className="text-muted-foreground">Status:</span> {customer.status}</p>
              </div>
              {customer.notes && (
                <div className="rounded border border-border/40 bg-background/40 p-2 text-sm">{customer.notes}</div>
              )}
              <Section title={`Licenças (${licenses.length})`}>
                {licenses.map((l) => (
                  <div key={l.id} className="rounded border border-border/40 bg-background/40 p-2 font-mono text-xs">
                    {l.key} · {l.status} · exp {formatDate(l.expiresAt)}
                  </div>
                ))}
                {!licenses.length && <p className="text-xs text-muted-foreground">Nenhuma licença.</p>}
              </Section>
              <Section title={`Dispositivos (${devices.length})`}>
                {devices.map((d) => (
                  <div key={d.id} className="rounded border border-border/40 bg-background/40 p-2 text-xs">
                    <span className="font-mono">{d.hwid}</span> · {d.os} · {d.browser}
                  </div>
                ))}
                {!devices.length && <p className="text-xs text-muted-foreground">Nenhum dispositivo.</p>}
              </Section>
              <Section title={`Histórico de ativações (${activations.length})`}>
                {activations.slice(0, 15).map((a) => (
                  <div key={a.id} className="rounded border border-border/40 bg-background/40 p-2 text-xs">
                    {formatDate(a.ts)} · {a.result} · {a.hwid}
                  </div>
                ))}
                {!activations.length && <p className="text-xs text-muted-foreground">Sem ativações.</p>}
              </Section>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
