"use client";

import * as React from "react";
import { Activity, Box, Cpu, Database, Globe, Lock, Radio, Zap } from "lucide-react";

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
  { id: "identity", label: "Identity & Auth", Icon: Lock },
  { id: "analytics", label: "Analytics", Icon: Activity },
  { id: "content", label: "Content API", Icon: Database },
  { id: "compute", label: "Edge Compute", Icon: Cpu },
  { id: "delivery", label: "Global CDN", Icon: Globe },
  { id: "infra", label: "Core Infra", Icon: Zap },
] as const;

const PRODUCT_CARDS: Array<{
  key: NodeKey;
  cx: number;
  layer: (typeof PLATFORM_LAYERS)[number]["id"];
}> = [
  { key: "typoo", cx: 100, layer: "identity" },
  { key: "xviGet", cx: 220, layer: "compute" },
  { key: "kleava", cx: 340, layer: "analytics" },
];

// Fixed diagram coordinate space — kept constant regardless of viewport so
// the layout never simply "stretches"; the SVG is capped by a max-width
// wrapper instead, and extra width on large screens is used for the side
// telemetry columns rendered alongside it (see EcosystemSection below).
const W = 440;
const H = 260;
const PRODUCT_CY = 60;
const PLATFORM_Y = 170;
const LAYER_SPACING = W / (PLATFORM_LAYERS.length + 1);

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
      className="pointer-events-none absolute hidden items-center gap-2 rounded-lg border border-border/60 bg-background/85 px-3 py-1.5 backdrop-blur-md sm:flex"
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

function TelemetryColumn({
  items,
  align,
}: {
  items: Array<{ label: string; value: string; accent: string }>;
  align: "start" | "end";
}) {
  return (
    <div
      className={cn(
        "hidden flex-col gap-3 xl:flex",
        align === "end" && "items-end text-right",
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="w-full max-w-[10rem] rounded-xl border border-border/50 bg-[var(--surface-1)] px-4 py-3"
        >
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted-foreground">
            {item.label}
          </p>
          <p
            className="mt-1 font-mono text-lg font-semibold tabular-nums"
            style={{ color: item.accent }}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function ArchDiagram({ active, setActive }: { active: NodeKey; setActive: (k: NodeKey) => void }) {
  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      {/* Floating live indicators — hidden on very small screens to avoid
          ever overlapping the diagram content. */}
      <FloatingIndicator
        label="Uptime"
        value="99.9%"
        accent="var(--brand)"
        style={{ top: "2%", right: "0%" }}
      />
      <FloatingIndicator
        label="Latency"
        value="12 ms"
        accent="var(--accent-blue)"
        style={{ bottom: "4%", left: "0%" }}
      />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        aria-label="XviFloo infrastructure diagram"
        role="img"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="arch-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
          {(["typoo", "xviGet", "kleava"] as NodeKey[]).map((k) => (
            <radialGradient key={k} id={`ng-${k}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={NODE_META[k].accent} stopOpacity="0.22" />
              <stop offset="100%" stopColor={NODE_META[k].accent} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="node-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          {(["typoo", "xviGet", "kleava"] as NodeKey[]).map((k) => (
            <marker
              key={k}
              id={`arrow-${k}`}
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <circle cx="3" cy="3" r="2" fill={NODE_META[k].accent} />
            </marker>
          ))}
        </defs>

        {/* Ambient center glow */}
        <ellipse cx={W / 2} cy={PLATFORM_Y} rx="160" ry="44" fill="url(#arch-center)" />

        {/* Platform rail */}
        <rect
          x="18"
          y={PLATFORM_Y - 16}
          width={W - 36}
          height="32"
          rx="16"
          fill="var(--surface-2)"
          stroke="var(--line-subtle)"
          strokeWidth="1"
        />
        <rect
          x="18"
          y={PLATFORM_Y - 16}
          width={W - 36}
          height="32"
          rx="16"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="0.5"
          opacity="0.25"
        />

        <text
          x="32"
          y={PLATFORM_Y - 24}
          className="fill-muted-foreground"
          fontSize="7"
          letterSpacing="1.5"
          style={{ fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase" }}
        >
          XviFloo Platform Core
        </text>

        {/* Layer nodes on the rail — labels sit clearly below the rail with
            generous clearance so they never collide with its border. */}
        {PLATFORM_LAYERS.map((layer, i) => {
          const cx = (i + 1) * LAYER_SPACING;
          const cy = PLATFORM_Y;
          return (
            <g key={layer.id}>
              <circle cx={cx} cy={cy} r="8" fill="var(--surface-1)" stroke="var(--border)" strokeWidth="0.8" />
              <circle cx={cx} cy={cy} r="3" fill="var(--brand)" opacity="0.55" />
              <text
                x={cx}
                y={cy + 28}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="5.4"
                style={{ fontFamily: "var(--font-mono, monospace)" }}
              >
                {layer.label}
              </text>
            </g>
          );
        })}

        {/* Product nodes and their connections to the platform */}
        {PRODUCT_CARDS.map(({ key, cx, layer }) => {
          const cy = PRODUCT_CY;
          const meta = NODE_META[key];
          const isActive = active === key;
          const layerIndex = PLATFORM_LAYERS.findIndex((l) => l.id === layer);
          const lcx = (layerIndex + 1) * LAYER_SPACING;
          const pathId = `edge-${key}`;
          const connectorTop = cy + 20;
          const connectorBottom = PLATFORM_Y - 16;

          return (
            <g key={key} className="cursor-pointer" onClick={() => setActive(key)}>
              {/* Glow beneath node */}
              <ellipse
                cx={cx}
                cy={cy + 16}
                rx="26"
                ry="9"
                fill={`url(#ng-${key})`}
                filter="url(#node-blur)"
                opacity={isActive ? 1 : 0.4}
                className="transition-opacity duration-500"
              />

              {/* Connector — gentle S-curve down to its platform layer */}
              <path
                id={pathId}
                d={`M ${cx} ${connectorTop} C ${cx} ${connectorTop + 38} ${lcx} ${connectorBottom - 30} ${lcx} ${connectorBottom}`}
                fill="none"
                stroke={meta.accent}
                strokeWidth={isActive ? 1.3 : 0.6}
                strokeDasharray={isActive ? "none" : "3 4"}
                opacity={isActive ? 0.8 : 0.32}
                markerEnd={`url(#arrow-${key})`}
                className="transition-all duration-700"
              />

              {/* Traveling data packet */}
              <circle r="2" fill={meta.accent} opacity={isActive ? 1 : 0.45}>
                <animateMotion
                  dur={`${2.6 + (key === "typoo" ? 0 : key === "xviGet" ? 0.5 : 1)}s`}
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
                  dur={`${2.6 + (key === "typoo" ? 0 : key === "xviGet" ? 0.5 : 1)}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* "Product" tag — sits clearly above the card with a fixed gap */}
              <rect x={cx - 26} y={cy - 44} width="52" height="13" rx="5" fill={meta.muted} />
              <text
                x={cx}
                y={cy - 35}
                textAnchor="middle"
                fontSize="5.2"
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fill: meta.accent,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Product
              </text>

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
                className="fill-foreground"
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
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fill: meta.accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
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
            </g>
          );
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

  const leftTelemetry = [
    { label: "Active nodes", value: "9", accent: "var(--brand)" },
    { label: "Edge regions", value: "14", accent: "var(--accent-blue)" },
  ];
  const rightTelemetry = [
    { label: "Sync status", value: "Live", accent: meta.accent },
    { label: "Data packets/s", value: "2.4k", accent: "var(--accent-violet)" },
  ];

  return (
    <SectionShell
      id="ecosystem"
      eyebrow={section.eyebrow}
      heading={section.heading}
      subheading={section.subheading}
    >
      <div className="space-y-8">
        {/* Main architecture diagram — on xl+ screens, the extra width is
            used for live telemetry side columns rather than just scaling
            the diagram itself larger. */}
        <Reveal>
          <div className="grid-overlay relative overflow-hidden rounded-[1.75rem] border border-border/50 bg-[var(--surface-glass)] p-6 backdrop-blur-2xl md:p-8">
            <div className="relative mb-6 flex items-center justify-between">
              <span className="eyebrow-blue">
                <Box className="size-3" />
                Infrastructure topology
              </span>
              <span className="flex items-center gap-2">
                <Radio className="size-3 text-[var(--brand)]" aria-hidden="true" />
                <span className="status-dot" />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Live system
                </span>
              </span>
            </div>

            <div className="relative grid items-center gap-6 xl:grid-cols-[10rem_1fr_10rem]">
              <TelemetryColumn items={leftTelemetry} align="start" />
              <ArchDiagram active={active} setActive={setActive} />
              <TelemetryColumn items={rightTelemetry} align="end" />
            </div>
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
              <div className="flex flex-col items-start gap-4 md:items-end md:justify-between">
                <span className={cn("badge-status", meta.badge)}>{activeNode.status}</span>
                <div className="grid grid-cols-2 gap-3 text-left md:text-right">
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
