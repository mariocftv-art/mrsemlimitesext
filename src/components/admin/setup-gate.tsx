import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, KeyRound, LogIn, ShieldCheck } from "lucide-react";
import {
  ADMIN_EMAILS,
  type AdminEmail,
  clearAdminPassword,
  endSession,
  getSessionEmail,
  isFirstRun,
  pendingAdmins,
  setPassword,
  startSession,
  verifyPassword,
} from "@/mock/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Mode = "loading" | "setup" | "login" | "ok";

export function AdminSetupGate({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("loading");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (getSessionEmail()) setMode("ok");
    else if (isFirstRun()) setMode("setup");
    else setMode("login");
  }, []);

  if (mode === "loading") return null;
  if (mode === "ok") return <>{children}</>;
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {mode === "setup" ? (
        <SetupCard onDone={() => setMode("login")} onSkip={() => setMode("login")} />
      ) : (
        <LoginCard onDone={() => setMode("ok")} onReset={() => setMode("setup")} />
      )}
    </div>
  );
}

function SetupCard({ onDone, onSkip }: { onDone: () => void; onSkip: () => void }) {
  const emails = useMemo(() => pendingAdmins(), []);
  const [pw, setPw] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    for (const email of emails) {
      if (!pw[email] || pw[email].length < 8) {
        toast.error(`Senha de ${email} precisa ter no mínimo 8 caracteres`);
        return;
      }
      if (pw[email] !== confirm[email]) {
        toast.error(`Confirmação não confere para ${email}`);
        return;
      }
    }
    setBusy(true);
    try {
      for (const email of emails) {
        await setPassword(email as AdminEmail, pw[email]);
      }
      toast.success("Senhas configuradas. Faça login para continuar.");
      onDone();
    } finally {
      setBusy(false);
    }
  };


  return (
    <Card className="glass w-full max-w-lg border-border/60">
      <CardHeader className="space-y-2 text-center">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: "var(--gradient-neon)", boxShadow: "var(--shadow-neon)" }}
        >
          <ShieldCheck className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle>Configuração inicial</CardTitle>
        <p className="text-sm text-muted-foreground">
          Defina a senha {emails.length > 1 ? "dos administradores pendentes" : "do administrador pendente"}.
          Não existe senha padrão.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {emails.map((email) => (
          <div key={email} className="space-y-2 rounded-lg border border-border/60 p-3">
            <p className="text-sm font-medium">{email}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Nova senha</Label>
                <Input
                  type="password"
                  value={pw[email] || ""}
                  onChange={(e) => setPw({ ...pw, [email]: e.target.value })}
                  placeholder="min. 8 caracteres"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Confirmar</Label>
                <Input
                  type="password"
                  value={confirm[email] || ""}
                  onChange={(e) => setConfirm({ ...confirm, [email]: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          onClick={submit}
          disabled={busy}
          className="w-full"
          style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
        >
          <KeyRound className="mr-2 h-4 w-4" /> Salvar senhas
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="w-full text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Já configurei antes · ir para o login
        </button>
      </CardContent>
    </Card>
  );
}

function LoginCard({ onDone, onReset }: { onDone: () => void; onReset: () => void }) {
  const [email, setEmail] = useState<AdminEmail>(ADMIN_EMAILS[0]);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      const ok = await verifyPassword(email, password);
      if (!ok) {
        toast.error("Senha incorreta.");
        return;
      }
      startSession(email);
      toast.success(`Bem-vindo, ${email}`);
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="glass w-full max-w-md border-border/60">
      <CardHeader className="space-y-2 text-center">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: "var(--gradient-neon)", boxShadow: "var(--shadow-neon)" }}
        >
          <LogIn className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle>Entrar no painel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs">Administrador</Label>
          <Select value={email} onValueChange={(v) => setEmail(v as AdminEmail)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ADMIN_EMAILS.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Senha</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <Button
          onClick={submit}
          disabled={busy}
          className="w-full"
          style={{ background: "var(--gradient-neon)", color: "var(--primary-foreground)" }}
        >
          Entrar
        </Button>
        <button
          type="button"
          onClick={() => {
            endSession();
            onReset();
          }}
          className="w-full text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Resetar credenciais (voltar à configuração inicial)
        </button>
      </CardContent>
    </Card>
  );
}
