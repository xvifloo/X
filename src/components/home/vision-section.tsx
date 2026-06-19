"use client";

import * as React from "react";
import { Bot, Boxes, Brain, ChevronRight, Cpu, ShoppingBag, Sparkles, Store, Zap } from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal, SectionShell } from "@/components/home/section-shell";
import { cn } from "@/lib/utils";

const TIMELINE = [
  {
    phase: "Now",
    label: "Foundation",
    description: "XviFloo platform core, identity, analytics, and XviTypoo — the first live product.",
    accent: "var(--brand)",
    muted: "var(--brand-muted)",
    products: ["XviTypoo · Live"],
    done: true,
  },
  {
    phase: "Near",
    label: "Engine era",
    description: "XviGet ships as a public widget engine. Kleava AI enters closed beta.",
    accent: "var(--accent-blue)",
    muted: "var(--accent-blue-muted)",
    products: ["XviGet Engine · Beta", "Kleava AI · Preview"],
    done: false,
  },
  {
    phase: "Future",
    label: "AI era",
    description: "Kleava AI becomes a full ecosystem intelligence layer, deeply integrated across every product.",
    accent: "var(--accent-violet)",
    muted: "var(--accent-violet-muted)",
    products: ["Kleava AI · GA", "AI across ecosystem"],
    done: false,
  },
  {
    phase: "Horizon",
    label: "Commerce era",
    description: "A POS and inventory product built on the same platform core — retail, meet the ecosystem.",
    accent: "var(--brand)",
    muted: "var(--brand-muted)",
    products: ["XviFloo Commerce · Research"],
    done: false,
  },
] as const;

const VISION_ITEMS = [
  {
    key: "xvifloo",
    Icon: Boxes,
    accent: "var(--brand)",
    muted: "var(--brand-muted)",
    glow: "var(--brand-glow)",
    tag: "Platform",
  },
  {
    key: "xviGet",
    Icon: Cpu,
    accent: "var(--accent-blue)",
    muted: "var(--accent-blue-muted)",
    glow: "var(--accent-blue-glow)",
    tag: "Engine",
  },
  {
    key: "kleava",
    Icon: Bot,
    accent: "var(--accent-violet)",
    muted: "var(--accent-violet-muted)",
    glow: "var(--accent-violet-glow)",
    tag: "AI",
  },
  {
    key: "commerce",
    Icon: Store,
    accent: "var(--brand)",
    muted: "var(--brand-muted)",
    glow: "var(--brand-glow)",
    tag: "Commerce",
  },
] as const;

function FuturePathSVG() {
  return (
    <svg viewBox="0 0 560 120" className="w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        {VISION_ITEMS.map((item) => (
          <radialGradient key={item.key} id={`vg-${item.key}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={item.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={item.accent} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* Connecting paths between nodes */}
      {([
        ["70", "60", "190", "60", "var(--brand)"],
        ["210", "60", "330", "60", "var(--accent-blue)"],
        ["350", "60", "470", "60", "var(--accent-violet)"],
      ] as const).map(([x1, y1, x2, y2, color], i) => (
        <g key={i}>
          <line
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.35"
          />
          <circle r="2" fill={color} opacity="0.8">
            <animateMotion
              dur={`${2 + i * 0.4}s`}
              repeatCount="indefinite"
              path={`M ${x1} ${y1} L ${x2} ${y2}`}
            />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1"
              dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Node circles */}
      {VISION_ITEMS.map((item, i) => {
        const cx = 70 + i * 140;
        const cy = 60;
        return (
          <g key={item.key}>
            <circle cx={cx} cy={cy} r="34" fill={`url(#vg-${item.key})`} />
            <circle
              cx={cx} cy={cy} r="22"
              fill="var(--surface-1)"
              stroke={item.accent}
              strokeWidth="1.2"
            />
            <text
              x={cx} y={cy + 42}
              textAnchor="middle"
              fontSize="8"
              style={{ fontFamily: "var(--font-mono, monospace)", fill: item.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              {item.tag}
            </text>
          </g>
        );
      })}

      {/* "Future" label at the end */}
      <text x="490" y="64" fontSize="8"
        style={{ fontFamily: "var(--font-mono, monospace)", fill: "var(--muted-foreground)", letterSpacing: "0.1em" }}>
        →∞
      </text>
    </svg>
  );
}

export function VisionSection() {
  const { dict } = useI18n();
  const section = dict.home.vision;
  const items = section.items;
  const keys = Object.keys(items) as Array<keyof typeof items>;

  return (
    <SectionShell
      id="vision"
      eyebrow={section.eyebrow}
      heading={section.heading}
      subheading={section.subheading}
    >
      <div className="space-y-10">
        {/* Future pathway visualization */}
        <Reveal>
          <div className="glass-panel relative overflow-hidden rounded-[1.75rem] p-6 md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-3.5 text-[var(--brand)]" aria-hidden="true" />
              <span className="eyebrow">Ecosystem evolution pathway</span>
            </div>
            <FuturePathSVG />

            {/* Phase labels */}
            <div className="mt-2 grid grid-cols-4 gap-2">
              {VISION_ITEMS.map((item, i) => (
                <div key={item.key} className="text-center">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em]"
                    style={{ color: item.accent }}>
                    {TIMELINE[i].phase}
                  </p>
                  <p className="text-xs text-muted-foreground">{TIMELINE[i].label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Evolution timeline cards */}
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute left-5 top-6 hidden w-px bg-gradient-to-b from-[var(--brand)] via-[var(--accent-violet)] to-transparent md:block"
            style={{ height: "calc(100% - 3rem)" }}
            aria-hidden="true"
          />

          <div className="space-y-4 md:pl-14">
            {TIMELINE.map((phase, i) => (
              <Reveal key={phase.phase} delay={i * 80}>
                <div
                  className={cn(
                    "relative rounded-2xl border p-5 transition-all duration-500 md:p-6",
                    phase.done
                      ? "border-[var(--brand)]/30"
                      : "border-border/50 bg-[var(--surface-1)]",
                  )}
                  style={phase.done ? { backgroundColor: phase.muted } : {}}
                >
                  {/* Timeline dot — desktop only */}
                  <div
                    className="absolute -left-[2.85rem] top-5 hidden size-2.5 rounded-full border-2 border-background md:block"
                    style={{ backgroundColor: phase.accent }}
                    aria-hidden="true"
                  />

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em]"
                          style={{ color: phase.accent }}
                        >
                          {phase.phase}
                        </span>
                        {phase.done && (
                          <span className="badge-status badge-live text-[0.58rem]">Current</span>
                        )}
                      </div>
                      <p className="mt-0.5 font-heading text-base font-semibold tracking-tight">
                        {phase.label}
                      </p>
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                        {phase.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {phase.products.map((p) => (
                        <span
                          key={p}
                          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.1em]"
                          style={{
                            borderColor: `${phase.accent}30`,
                            color: phase.accent,
                            backgroundColor: phase.muted,
                          }}
                        >
                          <ChevronRight className="size-2.5" aria-hidden="true" />
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Vision grid — the existing 4 items, made much more visual */}
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/30 md:grid-cols-2">
          {keys.map((key, index) => {
            const item = items[key];
            const vi = VISION_ITEMS[index];
            if (!vi) return null;
            const Icon = vi.Icon;

            return (
              <Reveal key={key} delay={index * 60}>
                <article
                  className="group relative h-full overflow-hidden bg-background p-8 transition-all duration-500 hover:bg-[var(--surface-1)] md:p-10"
                >
                  {/* Corner glow on hover */}
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle, ${vi.glow} 0%, transparent 70%)`,
                      filter: "blur(20px)",
                    }}
                    aria-hidden="true"
                  />

                  <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                      <span
                        className="flex size-12 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110"
                        style={{ backgroundColor: vi.muted }}
                      >
                        <Icon className="size-6 transition-colors duration-500" style={{ color: vi.accent }} aria-hidden="true" />
                      </span>
                      <div className="text-right">
                        <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="font-mono text-[0.58rem] uppercase tracking-[0.12em]" style={{ color: vi.accent }}>
                          {vi.tag}
                        </p>
                      </div>
                    </div>
                    <h3 className="font-heading text-xl font-semibold tracking-tight transition-colors duration-500 group-hover:text-foreground md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                    {/* Bottom accent line */}
                    <div
                      className="mt-6 h-px w-0 transition-all duration-700 group-hover:w-full"
                      style={{ background: `linear-gradient(90deg, ${vi.accent}, transparent)` }}
                      aria-hidden="true"
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
