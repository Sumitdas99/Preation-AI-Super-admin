import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "@/context/slice/authSlice";
import {
  LayoutDashboard,
  AlertTriangle,
  Package,
  Shield,
  FileSearch,
  Settings,
  UserCheck,
  UsersRound,
  Boxes,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { name: "Super Admin Console", href: "/super-admin-console", icon: LayoutDashboard },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Brand Pack Manager", href: "/super-admin/brand-packs", icon: Boxes },
  { name: "Violations", href: "/violations", icon: AlertTriangle },
  { name: "Evidence Packs", href: "/evidence", icon: Package },
  // { name: "Policies", href: "/policies", icon: Shield },
  { name: "Audit Log", href: "/audit", icon: FileSearch },
  { name: "Brand Admin Requests", href: "/brand-admin-requests", icon: UserCheck },
  { name: "Brand Admin Management", href: "/user-management", icon: UsersRound },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector(selectAuthUser);
  const location = useLocation();

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-display text-base font-bold text-sidebar-foreground">Praetion AI</span>
                <span className="text-xs text-sidebar-foreground/60">Super Admin</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarMenu className="gap-1.5">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href));

              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <NavLink to={item.href}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between rounded-lg bg-sidebar-accent p-3">
          <div>
            <p className="text-sm font-semibold text-sidebar-primary">
              {user?.brandName || "Super Admin"}
            </p>
            {user && (
              <p className="mt-0.5 text-xs text-sidebar-foreground/60 capitalize">
                Super Admin
              </p>
            )}
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
