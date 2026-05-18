import { NavLink } from "react-router-dom";
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
import { cn } from "@/lib/utils";
import { selectAuthUser } from "@/context/slice/authSlice";
import { useSelector } from "react-redux";

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

export function Sidebar() {
  const user = useSelector(selectAuthUser);

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-sidebar-foreground">Praetion AI</h1>
          <p className="text-xs text-sidebar-foreground/60">Super Admin</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus:outline-0",
                isActive
                  ? "bg-[linear-gradient(135deg,_hsl(217_91%_24%)_0%,_hsl(217_91%_32%)_100%)] text-white font-bold"
                  : "text-[#454545] hover:bg-[var(--hover-sidebar)]"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <p className="mt-1 text-sm font-semibold text-sidebar-primary">{user?.brandName || "Super Admin"}</p>
          {user && (
            <p className="mt-1 text-xs text-sidebar-foreground/60 capitalize">Super Admin</p>
          )}
        </div>
      </div>
    </aside>
  );
}
