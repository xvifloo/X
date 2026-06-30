"use client";

import * as React from "react";
import { CheckCircle2, Circle, Loader2, Zap, Clock } from "lucide-react";

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
  xviGet: { accent: "#17B79B", muted: "color-mix(in srgb, #17B79B 14%, transparent)", glow: "color-mix(in srgb, #17B79B 40%, transparent)" },
  kleava: { accent: "var(--accent-violet)", muted: "var(--accent-violet-muted)", glow: "var(--accent-violet-glow)" },
};

const MILESTONE_CAPABILITIES: Record<ProductKey, Record<string, string[]>> = {
  xviGet: {
    planning:    ["Scope definition", "Architecture spec", "API contract"],
    research:    ["Widget runtime analysis", "Performance benchmarks", "Embed protocol"],
    development: ["Core engine", "JS runtime", "Publish API", "Developer SDK"],
    alpha:       ["Internal preview", "Partner access", "Feedback loops"],
    beta:        ["Public preview", "Docs site", "Sandbox"],
    stable:      ["General availability", "SLA guarantees", "Enterprise"],
  },
  kleava: {
    research: ["LLM evaluation", "Context architecture", "Safety review"],
    core:     ["Inference engine", "API surface", "Rate limiting"],
    memory:   ["Long-term memory", "Retrieval system", "Context windows"],
    desktop:  ["macOS client", "Windows client", "System integrations"],
    beta:     ["Invite-only access", "Feedback collection"],
    release:  ["Public launch", "Subscription model", "Enterprise tier"],
  },
};

const MILESTONE_GOALS: Record<ProductKey, Record<string, string>> = {
  xviGet: {
    planning:    "Defined the technical scope, designed the public API surface, and aligned on the widget embed protocol.",
    research:    "Evaluated JavaScript runtime options and identified the optimal architecture for low-latency widget delivery.",
    development: "Actively building the core widget engine, SDK, and publish pipeline — the current main effort.",
    alpha:       "Ship a private alpha to select partners and validate the developer experience end-to-end.",
    beta:        "Open a public beta with sandbox access, full documentation, and structured feedback tooling.",
    stable:      "Full public availability with SLA guarantees, versioned API stability, and enterprise support.",
  },
  kleava: {
    research: "Completed a broad evaluation of model architectures and safety requirements for a contextual AI assistant.",
    core:     "Building the inference layer, API surface, and core conversational engine at production scale.",
    memory:   "Designing the long-term memory and retrieval system that makes Kleava contextually aware over time.",
    desktop:  "Native desktop clients for macOS and Windows with deep system integration and local processing.",
    beta:     "Invite-only access for early users and structured feedback before the public launch.",
    release:  "Public launch with a clear subscription model, enterprise pricing, and ecosystem integration.",
  },
};

// ── Status icon ───────────────────────────────────────────────────────────────
function StatusIcon({ status, accent }: { status: MilestoneStatus; accent: string }) {
  if (status === "done") return <CheckCircle2 className="size-4 shrink-0" style={{ color: accent }} />;
  if (status === "active") return <Loader2 className="size-4 shrink-0 animate-spin" style={{ color: accent }} />;
  return <Circle className="size-4 shrink-0 text-border" />;
}

// ── Circular progress gauge ───────────────────────────────────────────────────
function CircularGauge({ value, accent }: { value: number; accent: string }) {
  const R = 28;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative size-20 shrink-0">
      <svg viewBox="0 0 64 64" className="size-20 -rotate-90">
        <circle cx="32" cy="32" r={R} fill="none" stroke="var(--surface-2)" strokeWidth="5" />
        <circle cx="32" cy="32" r={R} fill="none" stroke={accent} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - (value / 100) * C}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 5px ${accent}66)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-sm font-bold tabular-nums">{value}%</span>
        <span className="font-mono text-[0.48rem] uppercase tracking-[0.08em] text-[#778B88]">done</span>
      </div>
    </div>
  );
}

// ── Vertical timeline row ─────────────────────────────────────────────────────
function MilestoneRow({
  milestone, accent, goals, caps,
  isActive, isLast, onClick,
}: {
  milestone: Milestone;
  accent: Accent;
  goals: Record<string, string>;
  caps: Record<string, string[]>;
  isActive: boolean;
  isLast: boolean;
  onClick: () => void;
}) {
  const goal = goals[milestone.key] ?? "";
  const chips = caps[milestone.key] ?? [];

  return (
    <div className="relative flex gap-5">
      {/* Left — vertical connector line + node dot */}
      <div className="flex flex-col items-center">
        {/* Node dot */}
        <button
          type="button"
          onClick={onClick}
          aria-pressed={isActive}
          className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-400"
          style={{
            borderColor: milestone.status === "upcoming" ? "var(--border)" : accent.accent,
            backgroundColor: milestone.status === "done" ? accent.accent : isActive ? accent.muted : "var(--background)",
            boxShadow: isActive ? `0 0 18px ${accent.glow}` : "none",
          }}
        >
          {milestone.status === "done" ? (
            <CheckCircle2 className="size-4 text-white" />
          ) : milestone.status === "active" ? (
            <Loader2 className="size-4 animate-spin" style={{ color: accent.accent }} />
          ) : (
            <Circle className="size-3.5 text-border" />
          )}
        </button>
        {/* Connector line below */}
        {!isLast && (
          <div
            className="w-px flex-1 transition-colors duration-500"
            style={{
              background:
                milestone.status === "done"
                  ? `linear-gradient(to bottom, ${accent.accent}, ${accent.accent}88)`
                  : milestone.status === "active"
                  ? `linear-gradient(to bottom, ${accent.accent}88, var(--border))`
                  : "var(--border)",
              minHeight: "2.5rem",
            }}
          />
        )}
      </div>

      {/* Right — content */}
      <div className={cn("min-w-0 flex-1 pb-6", isLast && "pb-0")}>
        <button
          type="button"
          onClick={onClick}
          className="w-full text-left"
        >
          <div className="flex items-center gap-2">
            <span
              className="font-heading text-[0.95rem] font-semibold tracking-tight transition-colors"
              style={{ color: isActive ? accent.accent : undefined }}
            >
              {milestone.label}
            </span>
            <span
              className="font-mono text-[0.6rem] tabular-nums"
              style={{ color: isActive ? accent.accent : "var(--muted-foreground)" }}
            >
              {milestone.progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5 h-2 overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${milestone.progress}%`,
                background: milestone.progress > 0
                  ? `linear-gradient(90deg, ${accent.accent}, color-mix(in srgb, ${accent.accent} 55%, white))`
                  : "transparent",
                boxShadow: milestone.progress > 0 ? `0 0 8px ${accent.glow}` : "none",
              }}
            />
          </div>
        </button>

        {/* Expanded detail — slides open */}
        <div
          className="overflow-hidden transition-all duration-500"
          style={{ maxHeight: isActive ? "400px" : "0" }}
        >
          <p className="mt-3 text-xs leading-relaxed text-[#778B88]">{goal}</p>
          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-md px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] transition-colors"
                  style={{
                    backgroundColor: isActive ? `${accent.accent}18` : "var(--surface-2)",
                    color: isActive ? accent.accent : "var(--muted-foreground)",
                    border: `1px solid ${isActive ? `${accent.accent}30` : "var(--border)"}`,
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export function RoadmapSection() {
  const { dict } = useI18n();
  const section = dict.home.roadmap;
  const [product, setProduct] = React.useState<ProductKey>("xviGet");
  const [activeKey, setActiveKey] = React.useState<string>("development");

  // Read ?product= from URL so footer links navigate directly to the right tab
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("product");
    if (p === "kleava") setProduct("kleava");
    else setProduct("xviGet");
  }, []);

  const current = section.products[product];
  const accent  = PRODUCT_ACCENT[product];
  const goals   = MILESTONE_GOALS[product];
  const caps    = MILESTONE_CAPABILITIES[product];

  const overall   = Math.round(current.milestones.reduce((s, m) => s + m.progress, 0) / current.milestones.length);
  const doneCount = current.milestones.filter((m) => m.status === "done").length;
  const activeCount = current.milestones.filter((m) => m.status === "active").length;

  React.useEffect(() => {
    const active = current.milestones.find((m) => m.status === "active");
    setActiveKey(active?.key ?? current.milestones[0].key);
  }, [product, current.milestones]);

  return (
    <SectionShell
      id="roadmap"
      eyebrow={section.eyebrow}
      heading={section.heading}
      subheading={section.subheading}
      align="center"
    >
      {/* Product tabs */}
      <Reveal>
        <div className="mx-auto mb-14 inline-flex rounded-full border border-border/60 bg-[var(--surface-1)] p-1">
          {(["xviGet", "kleava"] as const).map((key) => {
            const a = PRODUCT_ACCENT[key];
            const isActive = product === key;
            return (
              <button key={key} type="button" onClick={() => setProduct(key)}
                className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
                style={isActive
                  ? { backgroundColor: a.accent, color: "white", boxShadow: `0 0 20px -6px ${a.glow}` }
                  : { color: "var(--muted-foreground)" }}>
                {section.products[key].name}
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">

          {/* Left — vertical milestone timeline */}
          <div className="space-y-0">
            {current.milestones.map((milestone, i) => (
              <MilestoneRow
                key={milestone.key}
                milestone={milestone}
                accent={accent}
                goals={goals}
                caps={caps}
                isActive={activeKey === milestone.key}
                isLast={i === current.milestones.length - 1}
                onClick={() => setActiveKey(milestone.key)}
              />
            ))}
          </div>

          {/* Right — summary sidebar */}
          <div className="space-y-4">
            {/* Overall gauge */}
            <div
              className="glass-panel rounded-2xl p-6 transition-all duration-700"
              style={{ borderColor: `${accent.accent}20` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#778B88]">
                    {section.completion}
                  </p>
                  <p className="mt-1 font-heading text-xl font-bold tracking-tight transition-colors"
                    style={{ color: accent.accent }}>
                    {current.name}
                  </p>
                </div>
                <CircularGauge value={overall} accent={accent.accent} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/40 pt-4">
                <div>
                  <p className="font-mono text-lg font-bold tabular-nums" style={{ color: accent.accent }}>
                    {doneCount}/{current.milestones.length}
                  </p>
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-[#778B88]">Stages done</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold tabular-nums" style={{ color: accent.accent }}>
                    {activeCount}
                  </p>
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-[#778B88]">Active now</p>
                </div>
              </div>
            </div>

            {/* Status legend */}
            <div className="glass-panel rounded-2xl p-5">
              <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#778B88]">Legend</p>
              <div className="space-y-2.5">
                {(["done", "active", "upcoming"] as const).map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <StatusIcon status={s} accent={accent.accent} />
                    <span className="text-sm text-[#778B88] capitalize">{section.statusLabels[s]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live note */}
            <div className="rounded-2xl border p-4" style={{
              borderColor: `${accent.accent}20`,
              background: `linear-gradient(135deg, ${accent.muted} 0%, var(--background) 100%)`,
            }}>
              <div className="flex items-start gap-2.5">
                <Zap className="mt-0.5 size-3.5 shrink-0" style={{ color: accent.accent }} />
                <p className="text-xs leading-relaxed text-[#778B88]">
                  This roadmap shows <strong className="text-[#444444]">real engineering status</strong> — not marketing promises.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border p-4" style={{ borderColor: `${accent.accent}15`, background: accent.muted }}>
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-3.5 shrink-0" style={{ color: accent.accent }} />
                <p className="text-xs leading-relaxed text-[#778B88]">Updated continuously from the latest engineering sync.</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
