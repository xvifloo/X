"use client";

import * as React from "react";
import { Activity, Box, Cpu, Database, Globe, Lock, Zap } from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal, SectionShell } from "@/components/home/section-shell";
import { cn } from "@/lib/utils";

type NodeKey = "typoo" | "xviGet" | "kleava";

const NODE_META: Record<
  NodeKey,
  { accent: string; muted: string; glow: string; badge: string; tag: string }
> = {
  typoo: {
    accent: "var(--brand)",
    muted: "var(--brand-muted)",
    glow: "var(--brand-glow)",
    badge: "badge-live",
    tag: "Live",
  },
  xviGet: {
    accent: "var(--accent-blue)",
    muted: "var(--accent-blue-muted)",
    glow: "var(--accent-blue-glow)",
    badge: "badge-active",
    tag: "Building",
  },
  kleava: {
    accent: "var(--accent-violet)",
    muted: "var(--accent-violet-muted)",
    glow: "var(--accent-violet-glow)",
    badge: "badge-upcoming",
    tag: "Research",
  },
};

const PLATFORM_LAYERS = [
  { id: "identity", label: "Identity & Auth", Icon: Lock, col: 1 },
  { id: "analytics", label: "Analytics", Icon: Activity, col: 2 },
  { id: "content", label: "Content API", Icon: Database, col: 3 },
  { id: "compute", label: "Edge Compute", Icon: Cpu, col: 4 },
  { id: "delivery", label: "Global CDN", Icon: Globe, col: 5 },
  { id: "infra", label: "Core Infra", Icon: Zap, col: 6 },
] as const;

const PRODUCT_CARDS: Array<{
  key: NodeKey;
  pos: [number, number]; // % [cx, cy] in the SVG 400×340 space
  layer: (typeof PLATFORM_LAYERS)[number]["id"];
}> = [
  { key: "typoo", pos: [100, 80], layer: "identity" },
  { key: "xviGet", pos: [200, 80], layer: "compute" },
  { key: "kleava", pos: [300, 80], layer: "analytics" },
];

function FloatingIndicator({
  label,
  value,
  accent,
  style,
}: {
  label: string;
  value: string;
  accent: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="pointer-events-none absolute flex items-center gap-2 rounded-lg border border-border/60 bg-background/80 px-3 py-1.5 backdrop-blur-md"
      style={style}
    >
      <span className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-[0.6rem] font-medium" style={{ color: accent }}>
        {value}
      </span>
    </div>
  );
}

function ArchDiagram({ active, setActive }: { active: NodeKey; setActive: (k: NodeKey) => void }) {
  const W = 400;
  const H = 320;
  const PLATFORM_Y = 220;
  const LAYER_SPACING = W / (PLATFORM_LAYERS.length + 1);

  return (
    <div className="relative w-full">
      {/* Floating live indicators */}
      <FloatingIndicator
        label="Uptime"
        value="99.9%"
        accent="var(--brand)"
        style={{ top: "6%", right: "4%" }}
      />
      <FloatingIndicator
        label="Latency"
        value="12 ms"
        accent="var(--accent-blue)"
        style={{ bottom: "22%", left: "3%" }}
      />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        aria-label="XviFloo infrastructure diagram"
        role="img"
      >
        <defs>
          <radialGradient id="arch-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
          {(["typoo", "xviGet", "kleava"] as NodeKey[]).map((k) => (
            <radialGradient key={k} id={`ng-${k}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={NODE_META[k].accent} stopOpacity="0.2" />
              <stop offset="100%" stopColor={NODE_META[k].accent} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="node-blur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          {/* Animated dash pattern for active edges */}
          <marker id="arrow-brand" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <circle cx="3" cy="3" r="1.5" fill="var(--brand)" />
          </marker>
        </defs>

        {/* Ambient center glow */}
        <ellipse cx={W / 2} cy={PLATFORM_Y} rx="140" ry="40" fill="url(#arch-center)" />

        {/* Platform rail */}
        <rect
          x="20"
          y={PLATFORM_Y - 18}
          width={W - 40}
          height="36"
          rx="18"
          fill="var(--surface-2)"
          stroke="var(--line-subtle)"
          strokeWidth="1"
        />
        <rect
          x="20"
          y={PLATFORM_Y - 18}
          width={W - 40}
          height="36"
          rx="18"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="0.5"
          opacity="0.25"
        />

        {/* Platform label */}
        <text
          x="34"
          y={PLATFORM_Y + 5}
          className="fill-muted-foreground font-mono"
          fontSize="7"
          letterSpacing="1.5"
          style={{ fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase" }}
        >
          XviFloo Platform Core
        </text>

        {/* Layer nodes on the rail */}
        {PLATFORM_LAYERS.map((layer, i) => {
          const cx = (i + 1) * LAYER_SPACING;
          const cy = PLATFORM_Y;
          const LIcon = layer.Icon;
          void LIcon;
          return (
            <g key={layer.id}>
              <circle cx={cx} cy={cy} r="9" fill="var(--surface-1)" stroke="var(--border)" strokeWidth="0.8" />
              <circle cx={cx} cy={cy} r="3.5" fill="var(--brand)" opacity="0.5" />
              <text
                x={cx}
                y={cy + 18}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="5.5"
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                {layer.label}
              </text>
            </g>
          );
        })}

        {/* Product nodes and their connections to the platform */}
        {PRODUCT_CARDS.map(({ key, pos }) => {
          const [cx, cy] = pos;
          const meta = NODE_META[key];
          const isActive = active === key;
          const layerIndex = PLATFORM_LAYERS.findIndex(
            (l) => l.id === PRODUCT_CARDS.find((pc) => pc.key === key)?.layer,
          );
          const lcx = (layerIndex + 1) * LAYER_SPACING;
          const pathId = `edge-${key}`;

          return (
            <g key={key} className="cursor-pointer" onClick={() => setActive(key)}>
              {/* Glow beneath node */}
              <ellipse
                cx={cx}
                cy={cy + 18}
                rx="28"
                ry="10"
                fill={`url(#ng-${key})`}
                filter="url(#node-blur)"
                opacity={isActive ? 1 : 0.4}
                className="transition-opacity duration-500"
              />

              {/* Vertical connector line */}
              <path
                id={pathId}
                d={`M ${cx} ${cy + 20} C ${cx} ${PLATFORM_Y - 70} ${lcx} ${PLATFORM_Y - 60} ${lcx} ${PLATFORM_Y - 20}`}
                fill="none"
                stroke={meta.accent}
                strokeWidth={isActive ? 1.2 : 0.5}
                strokeDasharray={isActive ? "none" : "3 4"}
                opacity={isActive ? 0.75 : 0.3}
                className="transition-all duration-700"
              />

              {/* Traveling data packet */}
              <circle r="2.2" fill={meta.accent} opacity={isActive ? 1 : 0.4}>
                <animateMotion
                  dur={`${2.8 + (key === "typoo" ? 0 : key === "xviGet" ? 0.5 : 1)}s`}
                  repeatCount="indefinite"
                  keyPoints="0;1"
                  keyTimes="0;1"
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.85;1"
                  dur={`${2.8 + (key === "typoo" ? 0 : key === "xviGet" ? 0.5 : 1)}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Node card */}
              <rect
                x={cx - 34}
                y={cy - 20}
                width="68"
                height="40"
                rx="10"
                fill={isActive ? meta.muted : "var(--surface-1)"}
                stroke={isActive ? meta.accent : "var(--border)"}
                strokeWidth={isActive ? 1.2 : 0.7}
                className="transition-all duration-500"
                style={{
                  filter: isActive ? `drop-shadow(0 0 12px ${meta.glow})` : "none",
                }}
              />
              <text
                x={cx}
                y={cy - 2}
                textAnchor="middle"
                className="fill-foreground font-heading"
                fontSize="8"
                fontWeight="600"
                style={{ fontFamily: "var(--font-display, sans-serif)" }}
              >
                {key === "typoo" ? "XviTypoo" : key === "xviGet" ? "XviGet" : "Kleava AI"}
              </text>
              <text
                x={cx}
                y={cy + 10}
                textAnchor="middle"
                fontSize="6"
                style={{ fontFamily: "var(--font-mono, monospace)", fill: meta.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}
              >
                {meta.tag}
              </text>

              {/* Active pulse ring */}
              {isActive && (
                <circle
                  cx={cx}
                  cy={cy}
                  r="30"
                  fill="none"
                  stroke={meta.accent}
                  strokeWidth="0.6"
                  opacity="0.35"
                  style={{ animation: "pulse-ring 2.6s ease-in-out infinite" }}
                />
              )}

              {/* Box label */}
              <rect x={cx - 28} y={cy - 40} width="56" height="14" rx="5" fill={meta.muted} />
              <text
                x={cx}
                y={cy - 30}
                textAnchor="middle"
                fontSize="5.5"
                style={{ fontFamily: "var(--font-mono, monospace)", fill: meta.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Product
              </text>
            </g>
          );
        })}

        {/* Box package icon stand-in using SVG primitives */}
        {PRODUCT_CARDS.map(({ key, pos }) => {
          const [cx, cy] = pos;
          void cx; void cy; void key;
          return null; // handled above
        })}
      </svg>
    </div>
  );
}

export function EcosystemSection() {
  const { dict } = useI18n();
  const section = dict.home.ecosystem;
  const [active, setActive] = React.useState<NodeKey>("typoo");

  const meta = NODE_META[active];
  const activeNode = section.nodes[active];
  const nodeKeys: NodeKey[] = ["typoo", "xviGet", "kleava"];

  return (
    <SectionShell
      id="ecosystem"
      eyebrow={section.eyebrow}
      heading={section.heading}
      subheading={section.subheading}
    >
      <div className="space-y-8">
        {/* Main architecture diagram */}
        <Reveal>
          <div className="glass-panel relative overflow-hidden rounded-[1.75rem] p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="eyebrow-blue">
                <Box className="size-3" />
                Infrastructure topology
              </span>
              <span className="flex items-center gap-2">
                <span className="status-dot" />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Live system
                </span>
              </span>
            </div>
            <ArchDiagram active={active} setActive={setActive} />
          </div>
        </Reveal>

        {/* Product selector + detail panel */}
        <div className="grid gap-6 md:grid-cols-3">
          {nodeKeys.map((key, i) => {
            const m = NODE_META[key];
            const node = section.nodes[key];
            const isActive = active === key;

            return (
              <Reveal key={key} delay={i * 80}>
                <button
                  type="button"
                  onClick={() => setActive(key)}
                  onMouseEnter={() => setActive(key)}
                  className={cn(
                    "group w-full rounded-2xl border p-5 text-left transition-all duration-500",
                    isActive
                      ? "border-current"
                      : "border-border/50 bg-[var(--surface-1)] hover:border-border",
                  )}
                  style={
                    isActive
                      ? {
                          borderColor: m.accent,
                          backgroundColor: m.muted,
                          boxShadow: `0 0 40px -12px ${m.glow}`,
                        }
                      : {}
                  }
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="font-heading text-lg font-semibold tracking-tight transition-colors"
                      style={{ color: isActive ? m.accent : undefined }}
                    >
                      {node.name}
                    </p>
                    <span
                      className={cn("badge-status", m.badge)}
                      style={
                        isActive && key !== "kleava"
                          ? { backgroundColor: m.muted, color: m.accent }
                          : undefined
                      }
                    >
                      {node.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {node.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className="h-1 flex-1 rounded-full"
                      style={{
                        background: isActive
                          ? `linear-gradient(90deg, ${m.accent}, transparent)`
                          : "var(--border)",
                      }}
                    />
                    <span
                      className="font-mono text-[0.6rem] uppercase tracking-[0.14em]"
                      style={{ color: isActive ? m.accent : "var(--muted-foreground)" }}
                    >
                      {m.tag}
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* Active product detail strip */}
        <Reveal delay={120}>
          <div
            className="overflow-hidden rounded-2xl border p-6 transition-all duration-700 md:p-8"
            style={{
              borderColor: `${meta.accent}30`,
              background: `linear-gradient(135deg, ${meta.muted} 0%, var(--background) 60%)`,
            }}
          >
            <div className="grid gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {section.root} / {activeNode.name}
                </p>
                <h3
                  className="mt-2 font-heading text-2xl font-semibold tracking-tight transition-colors duration-500"
                  style={{ color: meta.accent }}
                >
                  {activeNode.name}
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                  {activeNode.description}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between gap-4">
                <span className={cn("badge-status", meta.badge)}>{activeNode.status}</span>
                <div className="grid grid-cols-2 gap-3 text-right">
                  {[
                    { label: "API version", value: "v2.0" },
                    { label: "Region", value: "Global" },
                    { label: "SLA", value: "99.9%" },
                    { label: "Auth", value: "OAuth 2" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p
                        className="font-mono text-sm font-medium tabular-nums"
                        style={{ color: meta.accent }}
                      >
                        {value}
                      </p>
                      <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
