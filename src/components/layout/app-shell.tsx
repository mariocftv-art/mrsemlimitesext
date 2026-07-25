import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl">
            <SidebarTrigger />

            <div className="hidden flex-1 items-center gap-2 md:flex">
              <div className="relative w-full max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar licença, cliente, device..."
                  className="h-9 border-border/60 bg-secondary/40 pl-9 text-sm"
                />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {actions}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--neon-cyan)]" />
              </Button>
              <SessionBadge />
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {children}
          </main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}

function SessionBadge() {
  return (
    <div className="flex items-center gap-2">
      <div className="hidden text-right text-xs leading-tight md:block">
        <p className="font-medium">MR Sem Limites</p>
        <p className="text-muted-foreground">painel liberado</p>
      </div>
      <Avatar className="h-8 w-8 border border-border/60">
        <AvatarFallback className="bg-secondary text-xs">MR</AvatarFallback>
      </Avatar>
    </div>
  );
}

