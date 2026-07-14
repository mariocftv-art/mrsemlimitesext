import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Puzzle,
  Package,
  KeyRound,
  Users,
  MonitorSmartphone,
  Zap,
  ScrollText,
  Ban,
  ShieldOff,
  GitBranch,
  Download,
  Cable,
  Settings,
  UserCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const groups = [
  {
    label: "Visão Geral",
    items: [{ title: "Dashboard", url: "/", icon: LayoutDashboard }],
  },
  {
    label: "Catálogo",
    items: [
      { title: "Extensões", url: "/extensions", icon: Puzzle },
      { title: "Produtos", url: "/products", icon: Package },
      { title: "Versões", url: "/versions", icon: GitBranch },
      { title: "Downloads", url: "/downloads", icon: Download },
    ],
  },
  {
    label: "Comercial",
    items: [
      { title: "Licenças", url: "/licenses", icon: KeyRound },
      { title: "Clientes", url: "/customers", icon: Users },
    ],
  },
  {
    label: "Operação",
    items: [
      { title: "Dispositivos", url: "/devices", icon: MonitorSmartphone },
      { title: "Ativações", url: "/activations", icon: Zap },
      { title: "Logs", url: "/logs", icon: ScrollText },
    ],
  },
  {
    label: "Segurança",
    items: [
      { title: "Bloqueios", url: "/blocks", icon: Ban },
      { title: "Blacklist", url: "/blacklist", icon: ShieldOff },
    ],
  },
  {
    label: "Sistema",
    items: [
      { title: "API", url: "/api-docs", icon: Cable },
      { title: "Configurações", url: "/settings", icon: Settings },
      { title: "Perfil", url: "/profile", icon: UserCircle },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3 px-2 py-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "var(--gradient-neon)", boxShadow: "var(--shadow-neon)" }}
          >
            <Puzzle className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground">
                MR MÁXIMA
              </span>
              <span className="neon-text text-sm font-bold tracking-wide">EXTENSIONS</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active =
                    item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={
                          active
                            ? "bg-sidebar-accent text-sidebar-primary before:absolute before:left-0 before:top-1/2 before:h-6 before:w-[3px] before:-translate-y-1/2 before:rounded-r before:bg-primary before:content-['']"
                            : ""
                        }
                      >
                        <Link to={item.url} className="relative flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
