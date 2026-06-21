import { Activity, Globe2, MousePointerClick, TrendingUp } from "lucide-react";

import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/auth/rbac";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

async function loadAnalytics() {
  const now = new Date();
  const since30d = new Date(now.getTime() - 30 * DAY_MS);

  // Counts are reliable single-aggregate queries — kept exactly like this
  // (mirrors the pattern already used on the dashboard's "Events (24h)" card).
  const [total, last24h, last7d, last30d, recentEvents] = await Promise.all([
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.count({ where: { occurredAt: { gte: new Date(now.getTime() - DAY_MS) } } }),
    prisma.analyticsEvent.count({ where: { occurredAt: { gte: new Date(now.getTime() - 7 * DAY_MS) } } }),
    prisma.analyticsEvent.count({ where: { occurredAt: { gte: since30d } } }),
    // Aggregation (top events, daily counts, locale split) is done in plain
    // JS over a bounded 30-day window rather than via Prisma's groupBy/orderBy
    // aggregate syntax — this keeps the query shape simple and predictable
    // across Prisma client versions instead of relying on subtler groupBy
    // ordering behaviour.
    prisma.analyticsEvent.findMany({
      where: { occurredAt: { gte: since30d } },
      select: { eventName: true, occurredAt: true, locale: true, path: true },
      orderBy: { occurredAt: "desc" },
      take: 5000,
    }),
  ]);

  const eventCounts = new Map<string, number>();
  const localeCounts = new Map<string, number>();
  const pathCounts = new Map<string, number>();
  const dailyCounts = new Map<string, number>();

  for (const ev of recentEvents) {
    eventCounts.set(ev.eventName, (eventCounts.get(ev.eventName) ?? 0) + 1);
    const locale = ev.locale ?? "অজানা";
    localeCounts.set(locale, (localeCounts.get(locale) ?? 0) + 1);
    if (ev.path) pathCounts.set(ev.path, (pathCounts.get(ev.path) ?? 0) + 1);
    const dayKey = startOfDay(ev.occurredAt).toISOString().slice(0, 10);
    dailyCounts.set(dayKey, (dailyCounts.get(dayKey) ?? 0) + 1);
  }

  const topEvents = [...eventCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const topPaths = [...pathCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const localeBreakdown = [...localeCounts.entries()].sort((a, b) => b[1] - a[1]);

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const day = startOfDay(new Date(now.getTime() - (13 - i) * DAY_MS));
    const key = day.toISOString().slice(0, 10);
    return { key, label: key.slice(5), count: dailyCounts.get(key) ?? 0 };
  });
  const maxDaily = Math.max(1, ...last14Days.map((d) => d.count));

  return { total, last24h, last7d, last30d, topEvents, topPaths, localeBreakdown, last14Days, maxDaily };
}

export default async function AdminAnalyticsPage() {
  await requireAdminSession();
  const data = await loadAnalytics();

  const summaryCards = [
    { label: "মোট ইভেন্ট", value: data.total, Icon: Activity },
    { label: "গত ২৪ ঘণ্টা", value: data.last24h, Icon: TrendingUp },
    { label: "গত ৭ দিন", value: data.last7d, Icon: TrendingUp },
    { label: "গত ৩০ দিন", value: data.last30d, Icon: TrendingUp },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        সাইটের প্রথম-পক্ষ (first-party) অ্যানালিটিক্স — গত ৩০ দিনের সর্বোচ্চ ৫,০০০টি ইভেন্টের উপর ভিত্তি করে।
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border/60 bg-[var(--surface-1)] p-5">
            <card.Icon className="size-5 text-[var(--brand)]" aria-hidden="true" />
            <p className="mt-4 font-mono text-2xl font-semibold tabular-nums">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      {/* 14-day trend */}
      <div className="mt-8 rounded-2xl border border-border/60 bg-[var(--surface-1)] p-6">
        <h2 className="font-heading text-base font-semibold">গত ১৪ দিনের ট্রেন্ড</h2>
        <div className="mt-5 flex items-end gap-1.5" style={{ height: "120px" }}>
          {data.last14Days.map((day) => (
            <div key={day.key} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-sm bg-[var(--brand)] transition-all"
                style={{
                  height: `${Math.max(4, (day.count / data.maxDaily) * 100)}px`,
                  opacity: day.count === 0 ? 0.15 : 0.85,
                }}
                title={`${day.label}: ${day.count}`}
              />
              <span className="font-mono text-[0.55rem] text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Top events */}
        <div className="rounded-2xl border border-border/60 bg-[var(--surface-1)] p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-semibold">
            <MousePointerClick className="size-4 text-[var(--brand)]" aria-hidden="true" />
            শীর্ষ ইভেন্ট
          </h2>
          <ul className="mt-4 space-y-2.5">
            {data.topEvents.length === 0 && (
              <li className="text-sm text-muted-foreground">এখনো কোনো ইভেন্ট রেকর্ড হয়নি।</li>
            )}
            {data.topEvents.map(([name, count]) => (
              <li key={name} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-mono text-xs text-muted-foreground">{name}</span>
                <span className="shrink-0 font-mono text-sm font-medium tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top pages */}
        <div className="rounded-2xl border border-border/60 bg-[var(--surface-1)] p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-semibold">
            <Globe2 className="size-4 text-[var(--brand)]" aria-hidden="true" />
            শীর্ষ পেজ
          </h2>
          <ul className="mt-4 space-y-2.5">
            {data.topPaths.length === 0 && (
              <li className="text-sm text-muted-foreground">এখনো কোনো পেজভিউ রেকর্ড হয়নি।</li>
            )}
            {data.topPaths.map(([path, count]) => (
              <li key={path} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-mono text-xs text-muted-foreground">{path}</span>
                <span className="shrink-0 font-mono text-sm font-medium tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Locale breakdown */}
      <div className="mt-8 rounded-2xl border border-border/60 bg-[var(--surface-1)] p-6">
        <h2 className="font-heading text-base font-semibold">ভাষা অনুযায়ী বিভাজন</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {data.localeBreakdown.length === 0 && (
            <p className="text-sm text-muted-foreground">এখনো কোনো ডেটা নেই।</p>
          )}
          {data.localeBreakdown.map(([locale, count]) => (
            <div
              key={locale}
              className="rounded-xl border border-border/60 bg-[var(--surface-2)] px-4 py-2.5"
            >
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                {locale}
              </p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
