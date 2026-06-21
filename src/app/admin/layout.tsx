import Link from "next/link";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  Users,
} from "lucide-react";

import { requireAdminSession } from "@/lib/auth/rbac";
import { FULL_ADMIN_ROLES, hasAnyRole } from "@/lib/auth/rbac";
import { SignOutButton } from "@/components/admin/sign-out-button";

type NavItem = {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  exact?: boolean;
  requiresFullAdmin?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/cms", label: "CMS", Icon: FileText },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/users", label: "Users", Icon: Users, requiresFullAdmin: true },
  { href: "/admin/analytics", label: "Analytics", Icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", Icon: Settings, requiresFullAdmin: true },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  const roles = session.user?.roles ?? [];
  const isFullAdmin = hasAnyRole(roles, FULL_ADMIN_ROLES);

  return (
    <div className="flex min-h-svh w-full bg-[var(--background)] text-foreground">
      <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-[var(--surface-1)] md:flex md:flex-col">
        <div className="border-b border-border/50 px-5 py-5">
          <p className="font-heading text-lg font-semibold tracking-tight">
            Xvi<span className="text-[var(--brand)]">Floo</span> Admin
          </p>
          <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
            Control panel
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.filter((item) => !item.requiresFullAdmin || isFullAdmin).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <item.Icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border/50 p-4">
          <p className="truncate text-sm font-medium">{session.user?.name ?? session.user?.email}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{session.user?.email}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {roles.map((role) => (
              <span
                key={role}
                className="rounded-full bg-[var(--brand-muted)] px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-[var(--brand)]"
              >
                {role}
              </span>
            ))}
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden px-5 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
