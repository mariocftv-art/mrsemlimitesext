import { useState, useEffect } from "react";
import { ShieldCheck, Key, User, Smartphone, Package, History, Zap, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExecutionStatus } from "./real-test-lab";

export function ActivationPanel({ 
  onValidate, 
  onRunFull, 
  status 
}: { 
  onValidate: (data: any) => void;
  onRunFull: (data: any) => void;
  status: ExecutionStatus;
}) {
  const [formData, setFormData] = useState({
    email: "teste@mrsemlimites.com",
    license_key: "",
    hwid: "HWID-MR-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    product: "EXT5",
    version: "17.0.0"
  });

  const isLoading = status === 'validating' || status === 'starting';

  return (
    <Card className="glass border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" /> Ativação Real
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-muted-foreground">License Key</Label>
            <div className="relative">
              <Key className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input 
                className="h-9 pl-7 text-xs bg-muted/20 border-primary/40 focus:border-primary font-mono ring-offset-background placeholder:text-muted-foreground/50"
                value={formData.license_key}
                placeholder="Insira sua chave (ex: XXXXX-XXXXX-...)"
                onChange={e => setFormData(prev => ({ ...prev, license_key: e.target.value.toUpperCase() }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-muted-foreground">HWID (Automático)</Label>
            <div className="relative">
              <Smartphone className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input 
                className="h-8 pl-7 text-xs bg-muted/40 border-border/40 font-mono"
                value={formData.hwid}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-muted-foreground">Produto</Label>
            <div className="relative">
              <Package className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input 
                className="h-8 pl-7 text-xs bg-muted/20 border-border/40"
                value={formData.product}
                onChange={e => setFormData(prev => ({ ...prev, product: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase text-muted-foreground">Versão</Label>
            <div className="relative">
              <History className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input 
                className="h-8 pl-7 text-xs bg-muted/20 border-border/40"
                value={formData.version}
                onChange={e => setFormData(prev => ({ ...prev, version: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            className="flex-1 h-10 text-xs font-bold border-primary/30 hover:border-primary/60"
            onClick={() => onValidate(formData)}
            disabled={isLoading || !formData.license_key}
          >
            {status === 'validating' ? "Validando..." : "Verificar Chave"}
          </Button>
          <Button 
            className="flex-1 h-10 text-xs gap-1.5 font-bold shadow-lg shadow-primary/20"
            style={{ background: 'var(--gradient-neon)', color: 'white' }}
            onClick={() => onRunFull(formData)}
            disabled={isLoading || !formData.license_key}
          >
            <Zap className="h-3 w-3 fill-current" /> Iniciar Teste Real
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
