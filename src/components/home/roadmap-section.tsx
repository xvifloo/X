"use client";

import * as React from "react";
import { CheckCircle2, Circle, Clock, Loader2, Zap } from "lucide-react";

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

const MILESTONE_CAPABILITIES: Record<ProductKey, Record<string, string[]>> = {
  xviGet: {
    planning: ["Scope definition", "Architecture spec", "API contract"],
    research: ["Widget runtime analysis", "Performance benchmarks", "Embed protocol"],
    development: ["Core engine", "JS runtime", "Publish API", "Developer SDK"],
    alpha: ["Internal preview", "Partner access", "Feedback loops"],
    beta: ["Public preview", "Docs site", "Sandbox environment"],
    stable: ["General availability", "SLA guarantees", "Enterprise plan"],
  },
  kleava: {
    research: ["LLM evaluation", "Context architecture", "Safety review"],
    core: ["Inference engine", "API surface", "Rate limiting"],
    memory: ["Long-term memory", "Retrieval system", "Context windows"],
    desktop: ["macOS client", "Windows client", "System integrations"],
    beta: ["Invite-only access", "Feedback collection"],
    release: ["Public launch", "Subscription model", "Enterprise tier"],
  },
};

const MILESTONE_GOALS: Record<ProductKey, Record<string, string>> = {
  xviGet: {
    planning:
      "Defined the technical scope, designed the public API surface, and aligned on the widget embed protocol.",
    research:
      "Evaluated JavaScript runtime options and identified the optimal architecture for low-latency widget delivery.",
    development:
      "Actively building the core widget engine, SDK, and publish pipeline. This is the current main effort.",
    alpha: "Ship a private alpha to select partners and validate the developer experience.",
    beta: "Open a public beta with sandbox access, full documentation, and feedback tooling.",
    stable:
      "Full public availability with SLA guarantees, versioned API stability, and enterprise support.",
  },
  kleava: {
    research:
      "Completed a broad evaluation of model architectures and safety requirements for a contextual AI assistant.",
    core: "Building the inference layer, API surface, and core conversational engine at production scale.",
    memory:
      "Designing the long-term memory and retrieval system that makes Kleava contextually aware over time.",
    desktop:
      "Native desktop clients for macOS and Windows with deep system integration and local processing.",
    beta: "Invite-only access for early users and structured feedback before the public launch.",
    release: "Public launch with a clear subscription model, enterprise pricing, and ecosystem integration.",
  },
};

function StatusIcon({ status, accent }: { status: MilestoneStatus; accent: string }) {
  if (status === "done")
    return (
      <CheckCircle2
        className="size-4.5 shrink-0"
        style={{ color: accent }}
        aria-label="Complete"
      />
    );
  if (status === "active")
    return (
      <Loader2
        className="size-4.5 shrink-0 animate-spin"
        style={{ color: accent }}
        aria-label="In progress"
      />
    );
  return (
    <Circle className="size-4.5 shrink-0 text-border" aria-label="Upcoming" />
  );
}

function CircularGauge({ value, accent }: { value: number; accent: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative size-20 shrink-0">
      <svg viewBox="0 0 64 64" className="size-20 -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--surface-2)" strokeWidth="5" />
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
          style={{ filter: `drop-shadow(0 0 6px ${accent}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-sm font-bold tabular-nums">{value}%</span>
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.1em] text-muted-foreground">
          done
        </span>
      </div>
    </div>
  );
}

function MilestoneCard({
  milestone,
  product,
  accent,
  isActive,
  onClick,
}: {
  milestone: Milestone;
  product: ProductKey;
  accent: Accent;
  isActive: boolean;
  onClick: () => void;
}) {
  const caps = MILESTONE_CAPABILITIES[product][milestone.key] ?? [];
  const goal = MILESTONE_GOALS[product][milestone.key] ?? "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border p-5 text-left transition-all duration-500",
        isActive
          ? "border-current shadow-lg"
          : "border-border/50 bg-[var(--surface-1)] hover:border-border hover:shadow-[var(--shadow-card)]",
      )}
      style={
        isActive
          ? {
              borderColor: `${accent.accent}50`,
              backgroundColor: accent.muted,
              boxShadow: `0 0 40px -16px ${accent.glow}`,
            }
          : {}
      }
      aria-pressed={isActive}
    >
      <div className="flex items-start gap-3">
        <StatusIcon status={milestone.status} accent={accent.accent} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className="font-heading text-sm font-semibold tracking-tight transition-colors"
              style={{ color: isActive ? accent.accent : undefined }}
            >
              {milestone.label}
            </p>
            <span
              className="font-mono text-[0.6rem] tabular-nums"
              style={{ color: isActive ? accent.accent : "var(--muted-foreground)" }}
            >
              {milestone.progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${milestone.progress}%`,
                background:
                  milestone.progress > 0
                    ? `linear-gradient(90deg, ${accent.accent}, color-mix(in srgb, ${accent.accent} 60%, white))`
                    : "transparent",
              }}
            />
          </div>

          {/* Expanded content */}
          <div
            className="overflow-hidden transition-all duration-500"
            style={{ maxHeight: isActive ? "200px" : "0px" }}
          >
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{goal}</p>
            {caps.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {caps.map((cap) => (
                  <span
                    key={cap}
                    className="rounded-md px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.1em] transition-colors"
                    style={{
                      backgroundColor: isActive ? `${accent.accent}18` : "var(--surface-2)",
                      color: isActive ? accent.accent : "var(--muted-foreground)",
                      border: `1px solid ${isActive ? `${accent.accent}30` : "var(--border)"}`,
                    }}
                  >
                    {cap}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function RoadmapNetworkPath({
  milestones,
  accent,
  activeKey,
  onSelect,
}: {
  milestones: Milestone[];
  accent: Accent;
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  const W = 760;
  const H = 120;
  const Y = 60;
  const count = milestones.length;
  const spacing = W / (count + 1);
  const positions = milestones.map((_, i) => (i + 1) * spacing);

  return (
    <div className="mx-auto w-full max-w-[44rem] overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full min-w-[640px]"
        role="img"
        aria-label="Roadmap progress network"
      >
        <defs>
          <radialGradient id="roadmap-node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={accent.accent} stopOpacity="0" />
          </radialGradient>
          <marker id="roadmap-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <circle cx="3" cy="3" r="1.6" fill={accent.accent} />
          </marker>
        </defs>

        {/* Base rail connecting every node — faint, always present */}
        <line
          x1={positions[0]}
          y1={Y}
          x2={positions[positions.length - 1]}
          y2={Y}
          stroke="var(--line-subtle)"
          strokeWidth="2"
        />

        {/* Segment-by-segment progress overlay + traveling packets */}
        {positions.slice(0, -1).map((x, i) => {
          const next = positions[i + 1];
          const milestone = milestones[i];
          const segId = `roadmap-seg-${milestone.key}`;
          const isLit = milestone.status === "done" || milestone.status === "active";

          return (
            <g key={milestone.key}>
              <line
                id={segId}
                x1={x}
                y1={Y}
                x2={next}
                y2={Y}
                stroke={accent.accent}
                strokeWidth="2.5"
                strokeDasharray={milestone.status === "done" ? "none" : "5 5"}
                opacity={isLit ? 0.8 : 0}
                markerEnd={milestone.status === "done" ? "url(#roadmap-arrow)" : undefined}
                style={{ transition: "opacity 0.6s ease" }}
              />
              {isLit && (
                <circle r="2.6" fill={accent.accent}>
                  <animateMotion
                    dur="2.2s"
                    repeatCount="indefinite"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    path={`M ${x} ${Y} L ${next} ${Y}`}
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.1;0.85;1"
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {milestones.map((milestone, i) => {
          const x = positions[i];
          const isActive = activeKey === milestone.key;
          const isDone = milestone.status === "done";
          const isInProgress = milestone.status === "active";

          return (
            <g
              key={milestone.key}
              className="cursor-pointer"
              onClick={() => onSelect(milestone.key)}
            >
              <circle cx={x} cy={Y} r="22" fill="url(#roadmap-node-glow)" opacity={isActive ? 1 : 0.4} />

              {isInProgress && (
                <circle
                  cx={x}
                  cy={Y}
                  r="14"
                  fill="none"
                  stroke={accent.accent}
                  strokeWidth="1"
                  strokeDasharray="2 3"
                  opacity="0.6"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    animation: "orbit-spin 10s linear infinite",
                  }}
                />
              )}

              <circle
                cx={x}
                cy={Y}
                r="9"
                fill={isDone ? accent.accent : isInProgress ? accent.muted : "var(--surface-1)"}
                stroke={accent.accent}
                strokeWidth={isDone ? 0 : 1.6}
                strokeDasharray={milestone.status === "upcoming" ? "2 2" : "none"}
                opacity={milestone.status === "upcoming" ? 0.55 : 1}
                style={{
                  filter: isActive ? `drop-shadow(0 0 10px ${accent.glow})` : "none",
                  transition: "all 0.4s ease",
                }}
              />

              {isDone && (
                <path
                  d={`M ${x - 3.2} ${Y} l 2 2.2 l 4.4 -4.8`}
                  fill="none"
                  stroke="white"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              <text
                x={x}
                y={Y + 32}
                textAnchor="middle"
                fontSize="9"
                fontWeight={isActive ? 700 : 500}
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fill: isActive ? accent.accent : "var(--muted-foreground)",
                  transition: "fill 0.3s ease",
                }}
              >
                {milestone.label}
              </text>

              {isActive && (
                <circle
                  cx={x}
                  cy={Y}
                  r="18"
                  fill="none"
                  stroke={accent.accent}
                  strokeWidth="0.8"
                  opacity="0.4"
                  style={{ animation: "pulse-ring 2.4s ease-in-out infinite" }}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function RoadmapSection() {
  const { dict } = useI18n();
  const section = dict.home.roadmap;
  const [product, setProduct] = React.useState<ProductKey>("xviGet");
  const [activeKey, setActiveKey] = React.useState<string>("development");

  const current = product === "xviGet" ? section.products.xviGet : section.products.kleava;
  const accent = PRODUCT_ACCENT[product];

  const overall = Math.round(
    current.milestones.reduce((s, m) => s + m.progress, 0) / current.milestones.length,
  );

  const doneCount = current.milestones.filter((m) => m.status === "done").length;

  // Reset active milestone when product switches
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
      {/* Product tab switcher */}
      <Reveal>
        <div className="mx-auto mb-12 inline-flex rounded-full border border-border/60 bg-[var(--surface-1)] p-1">
          {(["xviGet", "kleava"] as const).map((key) => {
            const isActive = product === key;
            const a = PRODUCT_ACCENT[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setProduct(key)}
                className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
                style={
                  isActive
                    ? {
                        backgroundColor: a.accent,
                        color: "white",
                        boxShadow: `0 0 24px -6px ${a.glow}`,
                      }
                    : { color: "var(--muted-foreground)" }
                }
              >
                {section.products[key].name}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Network-style progress path — visually ties the roadmap to the
          ecosystem architecture diagram above it on the page. */}
      <Reveal delay={40}>
        <div className="grid-overlay relative mb-10 overflow-hidden rounded-[1.75rem] border border-border/50 bg-[var(--surface-glass)] p-6 backdrop-blur-2xl md:p-8">
          <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="eyebrow-blue">
              <Zap className="size-3" />
              Build path
            </span>
            <span className="flex items-center gap-2">
              <span className="status-dot" />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                {current.name}
              </span>
            </span>
          </div>
          <RoadmapNetworkPath
            milestones={current.milestones}
            accent={accent}
            activeKey={activeKey}
            onSelect={setActiveKey}
          />
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Milestone cards column */}
          <div className="space-y-3">
            {current.milestones.map((milestone) => (
              <MilestoneCard
                key={milestone.key}
                milestone={milestone}
                product={product}
                accent={accent}
                isActive={activeKey === milestone.key}
                onClick={() => setActiveKey(milestone.key)}
              />
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="space-y-4">
            {/* Overall gauge card */}
            <div
              className="glass-panel rounded-2xl p-6 transition-all duration-700"
              style={{ borderColor: `${accent.accent}20` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {section.completion}
                  </p>
                  <p
                    className="mt-1 font-heading text-2xl font-bold tracking-tight transition-colors duration-700"
                    style={{ color: accent.accent }}
                  >
                    {current.name}
                  </p>
                </div>
                <CircularGauge value={overall} accent={accent.accent} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/40 pt-4">
                <div>
                  <p className="font-mono text-lg font-bold tabular-nums" style={{ color: accent.accent }}>
                    {doneCount}/{current.milestones.length}
                  </p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
                    Stages done
                  </p>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold" style={{ color: accent.accent }}>
                    {current.milestones.filter((m) => m.status === "active").length}
                  </p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
                    Active now
                  </p>
                </div>
              </div>
            </div>

            {/* Status legend */}
            <div className="glass-panel rounded-2xl p-5">
              <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                Status legend
              </p>
              <div className="space-y-3">
                {(["done", "active", "upcoming"] as const).map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <StatusIcon status={s} accent={accent.accent} />
                    <span className="text-sm text-muted-foreground">{section.statusLabels[s]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Future note */}
            <div
              className="rounded-2xl border p-5"
              style={{
                borderColor: `${accent.accent}20`,
                background: `linear-gradient(135deg, ${accent.muted} 0%, var(--background) 100%)`,
              }}
            >
              <div className="flex items-start gap-3">
                <Zap className="mt-0.5 size-4 shrink-0" style={{ color: accent.accent }} />
                <div>
                  <p className="text-sm font-medium">Roadmap is public</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    We show real progress, not just promises. Every milestone above reflects actual
                    engineering status.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl border p-5"
              style={{
                borderColor: `${accent.accent}15`,
                background: accent.muted,
              }}
            >
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0" style={{ color: accent.accent }} />
                <div>
                  <p className="text-sm font-medium">Updated continuously</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Progress reflects the latest engineering sync. No stale estimates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
