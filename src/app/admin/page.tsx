import Link from "next/link";
import { Activity, FileText, Package, Users } from "lucide-react";

import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/auth/rbac";

async function loadStats() {
  const [userCount, contentCount, productCount, eventCount24h] = await Promise.all([
    prisma.user.count(),
    prisma.contentItem.count(),
    prisma.product.count(),
    prisma.analyticsEvent.count({
      where: { occurredAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    }),
  ]);
  return { userCount, contentCount, productCount, eventCount24h };
}

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const stats = await loadStats();

  const cards = [
    { label: "Total users", value: stats.userCount, Icon: Users, href: "/admin/users" },
    { label: "Content items", value: stats.contentCount, Icon: FileText, href: "/admin/cms" },
    { label: "Products", value: stats.productCount, Icon: Package, href: "/admin/products" },
    {
      label: "Events (24h)",
      value: stats.eventCount24h,
      Icon: Activity,
      href: "/admin/analytics",
    },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Signed in as {session.user?.email} · {(session.user?.roles ?? []).join(", ")}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-border/60 bg-[var(--surface-1)] p-5 transition-colors hover:border-[var(--brand)]/40"
          >
            <card.Icon className="size-5 text-[var(--brand)]" aria-hidden="true" />
            <p className="mt-4 font-mono text-2xl font-semibold tabular-nums">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border/60 bg-[var(--surface-1)] p-6">
        <h2 className="font-heading text-base font-semibold">Quick links</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link className="text-[var(--brand)] hover:underline" href="/admin/cms">
              Manage CMS content →
            </Link>
          </li>
          <li>
            <Link className="text-[var(--brand)] hover:underline" href="/admin/products">
              Manage ecosystem products →
            </Link>
          </li>
          <li>
            <Link className="text-[var(--brand)] hover:underline" href="/admin/users">
              Manage users &amp; roles →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
