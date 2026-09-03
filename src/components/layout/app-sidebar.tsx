import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Puzzle,
  Pencil,
  Hammer,
  Download,
  GitBranch,
  ImageIcon,
  MonitorPlay,
  Sparkles,
  Component,
  MessageSquareCode,
  Wrench,
  ShieldCheck,
  ShieldQuestion,
  ServerCog,
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
    label: "Fábrica",
    items: [
      { title: "Minhas Extensões", url: "/extensions", icon: Puzzle },
      { title: "EXT Growth", url: "/ext-growth", icon: Puzzle },
      { title: "Teste Real", url: "/real-test", icon: MonitorPlay },
      { title: "Compatibilidade", url: "/compatibility", icon: ShieldQuestion },
      { title: "Editor", url: "/editor", icon: Pencil },
      { title: "Build Center", url: "/build-center", icon: Hammer },
      { title: "Downloads", url: "/downloads", icon: Download },
      { title: "Versões", url: "/versions", icon: GitBranch },
    ],
  },
  {
    label: "Biblioteca",
    items: [
      { title: "Assets", url: "/assets", icon: ImageIcon },
      { title: "Animações", url: "/animations", icon: Sparkles },
      { title: "Componentes", url: "/components", icon: Component },
      { title: "Prompts Premium", url: "/prompts", icon: MessageSquareCode },
    ],
  },
  {
    label: "Sistema",
    items: [
      { title: "Ferramentas", url: "/tools", icon: Wrench },
      { title: "Backend Oficial", url: "/backend", icon: ServerCog },
      { title: "Segurança", url: "/security", icon: ShieldCheck },
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
              <span className="neon-text text-sm font-bold tracking-wide">EXTENSION FACTORY</span>
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
