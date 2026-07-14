import { createFileRoute } from "@tanstack/react-router";
import { Cable } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/api-docs")({ component: ApiDocs });

const endpoints = [
  { m: "POST", p: "/api/public/ext/login", d: "Troca chave por token de sessão do device" },
  { m: "POST", p: "/api/public/ext/validate", d: "Valida chave + device" },
  { m: "POST", p: "/api/public/ext/activate", d: "Primeira ativação (registra device)" },
  { m: "POST", p: "/api/public/ext/heartbeat", d: "Sinal periódico" },
  { m: "GET", p: "/api/public/ext/version", d: "Versão atual + flag mandatory" },
  { m: "GET", p: "/api/public/ext/update", d: "Info de atualização" },
  { m: "POST", p: "/api/public/ext/renew", d: "Renovação" },
  { m: "POST", p: "/api/public/ext/block", d: "Bloqueio (admin)" },
  { m: "GET", p: "/api/public/ext/blacklist-check", d: "Consulta blacklist" },
];

function ApiDocs() {
  const tone: Record<string, string> = {
    GET: "var(--neon-cyan)",
    POST: "var(--neon-violet)",
  };
  return (
    <AppShell title="API" subtitle="Endpoints REST próprios da plataforma. Serão implementados após ativação do backend.">
      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cable className="h-4 w-4" /> Endpoints previstos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {endpoints.map((e) => (
            <div
              key={e.p}
              className="flex items-center gap-3 rounded-md border border-border/40 bg-background/40 p-3 text-sm"
            >
              <Badge
                className="min-w-14 justify-center font-mono text-[10px]"
                style={{ background: tone[e.m], color: "var(--primary-foreground)" }}
              >
                {e.m}
              </Badge>
              <code className="font-mono text-xs text-foreground">{e.p}</code>
              <span className="ml-auto text-xs text-muted-foreground">{e.d}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
