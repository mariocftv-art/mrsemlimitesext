import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useServerFn } from "@tanstack/react-start";
import { purchaseLicense } from "@/lib/checkout.functions";
import { toast } from "sonner";
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  ArrowLeft, 
  ShoppingBag,
  ShieldCheck,
  Zap,
  Package
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    payment_method: "pix" as "pix" | "card",
  });
  const [licenseKey, setLicenseKey] = useState("");

  const doPurchase = useServerFn(purchaseLicense);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep("processing");

    try {
      // Simula um pequeno delay de checkout
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const result = await doPurchase({
        data: {
          name: formData.name,
          email: formData.email,
          payment_method: formData.payment_method,
          duration_days: 30
        }
      });

      if (result.success && result.license) {
        setLicenseKey(result.license.license_key);
        setStep("success");
        toast.success("Licença gerada com sucesso!");
      } else {
        throw new Error(result.error || "Erro ao processar checkout");
      }
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro no checkout");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <AppShell title="Checkout Sucesso" subtitle="Sua licença está pronta">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Compra Realizada!</h2>
          <p className="mb-8 text-center text-muted-foreground">
            Abaixo está sua chave de licença premium para o <strong>MR Sem Limites EXT7</strong>.
            <br />
            Ela também foi enviada para <strong>{formData.email}</strong>.
          </p>

          <Card className="glass w-full max-w-md border-primary/40">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Sua Chave de Acesso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative group">
                <div className="flex items-center justify-center rounded-lg border border-primary/20 bg-background/60 p-6 text-center font-mono text-xl font-bold tracking-[0.2em] text-primary">
                  {licenseKey}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    navigator.clipboard.writeText(licenseKey);
                    toast.success("Chave copiada!");
                  }}
                >
                  Copiar
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Link to="/extensions" className="w-full">
                <Button className="w-full gap-2">
                  Ir para Minhas Extensões <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Checkout Premium" subtitle="Adquira sua licença do MR Sem Limites EXT7">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="glass border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" /> Dados do Comprador
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    placeholder="Seu nome" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={step === "processing"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail para Recebimento</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={step === "processing"}
                  />
                  <p className="text-[10px] text-muted-foreground">Sua chave será enviada imediatamente após a confirmação do pagamento.</p>
                </div>

                <div className="space-y-4">
                  <Label>Forma de Pagamento</Label>
                  <RadioGroup 
                    value={formData.payment_method} 
                    onValueChange={(v: any) => setFormData(prev => ({ ...prev, payment_method: v }))}
                    className="grid grid-cols-2 gap-4"
                    disabled={step === "processing"}
                  >
                    <div>
                      <RadioGroupItem value="pix" id="pix" className="peer sr-only" />
                      <Label
                        htmlFor="pix"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Smartphone className="mb-3 h-6 w-6" />
                        PIX Instantâneo
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="card" id="card" className="peer sr-only" />
                      <Label
                        htmlFor="card"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <CreditCard className="mb-3 h-6 w-6" />
                        Cartão de Crédito
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col border-t border-border/20 pt-6">
                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg font-bold gap-2"
                  style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
                  disabled={step === "processing"}
                >
                  {step === "processing" ? (
                    <>Processando Pagamento...</>
                  ) : (
                    <>Finalizar Compra — R$ 49,90 <Zap className="h-5 w-5 fill-current" /></>
                  )}
                </Button>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Pagamento 100% seguro processado via API MR Reseller
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="glass sticky top-4 border-primary/20">
            <CardHeader>
              <CardTitle className="text-base uppercase tracking-widest text-primary">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4 border border-primary/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/20">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">MR Sem Limites EXT7</p>
                  <p className="text-xs text-muted-foreground">Licença Premium Vitalícia (Motor v17.8.6)</p>
                </div>
                <div className="ml-auto font-bold text-sm">R$ 49,90</div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ 49,90</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxas</span>
                  <span className="text-green-500">Isento</span>
                </div>
                <div className="flex justify-between border-t border-border/20 pt-2 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">R$ 49,90</span>
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-[10px] text-amber-200/70">
                <strong>Atenção:</strong> A chave será gerada imediatamente após a aprovação do PIX ou confirmação do cartão. Não feche a página após o pagamento.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
