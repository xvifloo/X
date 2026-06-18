"use client";

import * as React from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal, SectionShell } from "@/components/home/section-shell";
import { cn } from "@/lib/utils";

type MilestoneStatus = "done" | "active" | "upcoming";
type ProductKey = "xviGet" | "kleava";

type Milestone = {
  key: string;
  label: string;
  progress: number;
  status: MilestoneStatus;
};

type Accent = { accent: string; muted: string; glow: string };

const PRODUCT_ACCENT: Record<ProductKey, Accent> = {
  xviGet: {
    accent: "var(--accent-blue)",
    muted: "var(--accent-blue-muted)",
    glow: "var(--accent-blue-glow)",
  },
  kleava: {
    accent: "var(--accent-violet)",
    muted: "var(--accent-violet-muted)",
    glow: "var(--accent-violet-glow)",
  },
};

function CircularGauge({ value, accent }: { value: number; accent: string }) {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold tabular-nums">
        {value}%
      </span>
    </div>
  );
}

function statusBadgeStyle(status: MilestoneStatus, accent: Accent): React.CSSProperties | undefined {
  if (status === "upcoming") return undefined;
  return { backgroundColor: accent.muted, color: accent.accent };
}

function HorizontalTimeline({
  name,
  milestones,
  statusLabels,
  completionLabel,
  accent,
}: {
  name: string;
  milestones: Milestone[];
  statusLabels: Record<MilestoneStatus, string>;
  completionLabel: string;
  accent: Accent;
}) {
  const [activeKey, setActiveKey] = React.useState(
    milestones.find((m) => m.status === "active")?.key ?? milestones[0].key,
  );

  const active = milestones.find((m) => m.key === activeKey) ?? milestones[0];
  const overall = Math.round(
    milestones.reduce((sum, item) => sum + item.progress, 0) / milestones.length,
  );
  const activeIndex = milestones.findIndex((m) => m.key === activeKey);
  const trackProgress =
    milestones.length > 1 ? (activeIndex / (milestones.length - 1)) * 100 : 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h3 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            {name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {completionLabel} <span className="font-medium text-foreground">{overall}%</span>
          </p>
        </div>
        <CircularGauge value={overall} accent={accent.accent} />
      </div>

      <div className="relative overflow-x-auto pb-4">
        <div className="relative min-w-[640px] px-2">
          <div
            className="absolute left-4 right-4 top-5 h-1.5 rounded-full bg-muted"
            aria-hidden="true"
          />
          <div
            className="absolute left-4 top-5 h-1.5 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `calc(${trackProgress}% - 1rem)`,
              background: `linear-gradient(90deg, ${accent.accent}, color-mix(in srgb, ${accent.accent} 55%, white))`,
            }}
            aria-hidden="true"
          />

          <ol className="relative flex justify-between">
            {milestones.map((milestone, index) => {
              const isActive = milestone.key === activeKey;
              const isDone = milestone.status === "done";

              return (
                <li key={milestone.key} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setActiveKey(milestone.key)}
                    className={cn(
                      "relative z-10 mb-4 size-3.5 rounded-full border-2 transition-all duration-500",
                      milestone.status === "upcoming" && "border-border bg-background",
                      isActive && "scale-125",
                    )}
                    style={
                      milestone.status !== "upcoming"
                        ? {
                            borderColor: accent.accent,
                            backgroundColor: isDone ? accent.accent : "var(--background)",
                            boxShadow:
                              milestone.status === "active"
                                ? `0 0 0 6px ${accent.muted}`
                                : undefined,
                          }
                        : undefined
                    }
                    aria-pressed={isActive}
                    aria-label={`${milestone.label}: ${milestone.progress}%`}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveKey(milestone.key)}
                    className={cn(
                      "max-w-[5.5rem] text-center text-[0.65rem] leading-tight transition-colors",
                      isActive ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {milestone.label}
                  </button>
                  <span className="mt-1 font-mono text-[0.6rem] text-muted-foreground/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 transition-all duration-500 md:p-8" key={active.key}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Milestone
            </p>
            <p className="mt-1 text-xl font-semibold tracking-tight">{active.label}</p>
          </div>
          <span
            className={cn("badge-status", active.status === "upcoming" && "badge-upcoming")}
            style={statusBadgeStyle(active.status, accent)}
          >
            {statusLabels[active.status]}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${active.progress}%`,
                background: `linear-gradient(90deg, ${accent.accent}, color-mix(in srgb, ${accent.accent} 60%, white))`,
              }}
            />
          </div>
          <span
            className="min-w-[3rem] text-right font-mono text-sm tabular-nums"
            style={{ color: accent.accent }}
          >
            {active.progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function RoadmapSection() {
  const { dict } = useI18n();
  const section = dict.home.roadmap;
  const [product, setProduct] = React.useState<ProductKey>("xviGet");

  const current =
    product === "xviGet" ? section.products.xviGet : section.products.kleava;
  const accent = PRODUCT_ACCENT[product];

  return (
    <SectionShell
      id="roadmap"
      eyebrow={section.eyebrow}
      heading={section.heading}
      subheading={section.subheading}
      align="center"
    >
      <Reveal>
        <div className="mx-auto mb-14 inline-flex rounded-full border border-border/60 p-1">
          {(["xviGet", "kleava"] as const).map((key) => {
            const isActive = product === key;
            const keyAccent = PRODUCT_ACCENT[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setProduct(key)}
                className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
                style={
                  isActive
                    ? { backgroundColor: keyAccent.accent, color: "white" }
                    : { color: "var(--muted-foreground)" }
                }
              >
                {section.products[key].name}
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={100}>
        <HorizontalTimeline
          key={product}
          name={current.name}
          milestones={current.milestones}
          statusLabels={section.statusLabels}
          completionLabel={section.completion}
          accent={accent}
        />
      </Reveal>
    </SectionShell>
  );
}
