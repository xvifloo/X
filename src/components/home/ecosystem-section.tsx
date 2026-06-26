"use client";

import * as React from "react";
import {
  BarChart3, Cpu, Database, Globe, Lock, Radio, Server,
} from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal, SectionShell } from "@/components/home/section-shell";
import { cn } from "@/lib/utils";

type NodeKey = "typoo" | "xviGet" | "kleava";

const NODE_META: Record<NodeKey, {
  accent: string; muted: string; glow: string; badge: string; tag: string;
}> = {
  typoo:  { accent: "var(--brand)",         muted: "var(--brand-muted)",         glow: "var(--brand-glow)",         badge: "badge-live",     tag: "Live"     },
  xviGet: { accent: "var(--accent-blue)",   muted: "var(--accent-blue-muted)",   glow: "var(--accent-blue-glow)",   badge: "badge-active",   tag: "Building" },
  kleava: { accent: "var(--accent-violet)", muted: "var(--accent-violet-muted)", glow: "var(--accent-violet-glow)", badge: "badge-upcoming", tag: "Research" },
};

const PLATFORM_LAYERS = [
  { id: "identity",  label: "Identity",   Icon: Lock     },
  { id: "analytics", label: "Analytics",  Icon: BarChart3},
  { id: "content",   label: "Content API",Icon: Database },
  { id: "compute",   label: "Edge Compute",Icon: Cpu     },
  { id: "delivery",  label: "Global CDN", Icon: Globe    },
  { id: "infra",     label: "Core Infra", Icon: Server   },
] as const;

const PRODUCT_CARDS: Array<{ key: NodeKey; cx: number; layer: string }> = [
  { key: "typoo",  cx: 100, layer: "identity" },
  { key: "xviGet", cx: 220, layer: "compute"  },
  { key: "kleava", cx: 340, layer: "analytics"},
];

const W = 440; const H = 275;
const PRODUCT_CY = 68; const PLATFORM_Y = 185;
const LAYER_SPACING = W / (PLATFORM_LAYERS.length + 1);

// ── Topology SVG ──────────────────────────────────────────────────────────────
function ArchDiagram({ active, setActive }: { active: NodeKey; setActive: (k: NodeKey) => void }) {
  return (
    <div className="relative mx-auto w-full max-w-[42rem] lg:max-w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full"
        aria-label="XviFloo infrastructure diagram" role="img" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="arch-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#17B79B" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#17B79B" stopOpacity="0" />
          </radialGradient>
          {(["typoo","xviGet","kleava"] as NodeKey[]).map((k) => (
            <radialGradient key={k} id={`ng-${k}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={NODE_META[k].accent} stopOpacity="0.26" />
              <stop offset="100%" stopColor={NODE_META[k].accent} stopOpacity="0" />
            </radialGradient>
          ))}
          {(["typoo","xviGet","kleava"] as NodeKey[]).map((k) => (
            <marker key={k} id={`arrow-${k}`} markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <circle cx="2.5" cy="2.5" r="1.5" fill={NODE_META[k].accent} />
            </marker>
          ))}
        </defs>

        {/* Ambient platform glow */}
        <ellipse cx={W/2} cy={PLATFORM_Y} rx="180" ry="46" fill="url(#arch-center)" />

        {/* Platform rail */}
        <rect x="14" y={PLATFORM_Y - 17} width={W - 28} height="34" rx="17"
          fill="var(--surface-2)" stroke="var(--line-subtle)" strokeWidth="1" />
        <rect x="14" y={PLATFORM_Y - 17} width={W - 28} height="34" rx="17"
          fill="none" stroke="#17B79B" strokeWidth="0.6" opacity="0.3" />
        <text x="28" y={PLATFORM_Y - 25} fill="var(--muted-foreground)" fontSize="7"
          letterSpacing="1.4" style={{ fontFamily: "var(--font-mono,monospace)", textTransform: "uppercase" }}>
          XviFloo Platform Core
        </text>

        {/* Layer nodes */}
        {PLATFORM_LAYERS.map((layer, i) => {
          const cx = (i + 1) * LAYER_SPACING;
          return (
            <g key={layer.id}>
              <circle cx={cx} cy={PLATFORM_Y} r="8" fill="var(--surface-1)" stroke="var(--border)" strokeWidth="0.8" />
              <circle cx={cx} cy={PLATFORM_Y} r="3" fill="#17B79B" opacity="0.55" />
              <text x={cx} y={PLATFORM_Y + 28} textAnchor="middle" fill="var(--muted-foreground)"
                fontSize="5.2" style={{ fontFamily: "var(--font-mono,monospace)" }}>
                {layer.label}
              </text>
            </g>
          );
        })}

        {/* Product nodes */}
        {PRODUCT_CARDS.map(({ key, cx }, _) => {
          const meta = NODE_META[key];
          const isActive = active === key;
          const layerIdx = PLATFORM_LAYERS.findIndex((l) => l.id === PRODUCT_CARDS.find((p) => p.key === key)?.layer);
          const lcx = (layerIdx + 1) * LAYER_SPACING;
          const pathId = `edge-${key}`;
          const connBottom = PLATFORM_Y - 17;
          const connTop = PRODUCT_CY + 22;

          return (
            <g key={key} className="cursor-pointer" onClick={() => setActive(key)}>
              {/* Glow */}
              <ellipse cx={cx} cy={PRODUCT_CY + 14} rx="28" ry="10"
                fill={`url(#ng-${key})`}
                opacity={isActive ? 1 : 0.5}
                className="transition-opacity duration-500" />

              {/* Connector */}
              <path id={pathId}
                d={`M ${cx} ${connTop} C ${cx} ${connTop + 42} ${lcx} ${connBottom - 32} ${lcx} ${connBottom}`}
                fill="none" stroke={meta.accent}
                strokeWidth={isActive ? 1.4 : 0.7}
                strokeDasharray={isActive ? "none" : "3 4"}
                opacity={isActive ? 0.85 : 0.3}
                markerEnd={`url(#arrow-${key})`}
                className="transition-all duration-700" />

              {/* Traveling packet */}
              <circle r="2.2" fill={meta.accent} opacity={isActive ? 1 : 0.5}>
                <animateMotion dur={`${2.6 + (_) * 0.55}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1">
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1"
                  dur={`${2.6 + (_) * 0.55}s`} repeatCount="indefinite" />
              </circle>

              {/* "Product" label */}
              <rect x={cx - 24} y={PRODUCT_CY - 46} width="48" height="13" rx="5" fill={meta.muted} />
              <text x={cx} y={PRODUCT_CY - 37} textAnchor="middle" fill={meta.accent}
                fontSize="5" style={{ fontFamily:"var(--font-mono,monospace)", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                Product
              </text>

              {/* Node card */}
              <rect x={cx - 35} y={PRODUCT_CY - 22} width="70" height="44" rx="11"
                fill={isActive ? meta.muted : "var(--surface-1)"}
                stroke={isActive ? meta.accent : "var(--border)"}
                strokeWidth={isActive ? 1.4 : 0.8}
                className="transition-all duration-500"
                style={{ filter: isActive ? `drop-shadow(0 0 10px ${meta.glow})` : "none" }} />
              <text x={cx} y={PRODUCT_CY - 3} textAnchor="middle" fill="var(--foreground)"
                fontSize="8.5" fontWeight="600" style={{ fontFamily:"var(--font-display,sans-serif)" }}>
                {key === "typoo" ? "XviTypoo" : key === "xviGet" ? "XviGet" : "Kleava AI"}
              </text>
              <text x={cx} y={PRODUCT_CY + 10} textAnchor="middle" fill={meta.accent}
                fontSize="6" style={{ fontFamily:"var(--font-mono,monospace)", textTransform:"uppercase", letterSpacing:"0.08em" }}>
                {meta.tag}
              </text>

              {/* Active pulse */}
              {isActive && (
                <circle cx={cx} cy={PRODUCT_CY} r="32" fill="none"
                  stroke={meta.accent} strokeWidth="0.7" opacity="0.35"
                  style={{ animation: "pulse-ring 2.6s ease-in-out infinite" }} />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────
export function EcosystemSection() {
  const { dict } = useI18n();
  const section = dict.home.ecosystem;
  const [active, setActive] = React.useState<NodeKey>("typoo");

  const meta = NODE_META[active];
  const activeNode = section.nodes[active];
  const nodeKeys: NodeKey[] = ["typoo", "xviGet", "kleava"];

  return (
    <SectionShell id="ecosystem" eyebrow={section.eyebrow} heading={section.heading} subheading={section.subheading}>
      <div className="space-y-8">

        {/* Topology panel */}
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border/40 p-5 md:p-7"
            style={{
              background: "color-mix(in srgb, var(--surface-glass) 80%, transparent)",
              backdropFilter: "blur(20px)",
            }}>
            {/* Topology section title */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#17B79B" }}>
                  Infrastructure Topology
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="size-3.5 text-[var(--brand)]" aria-hidden="true" />
                <span className="status-dot" />
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
                  Live system
                </span>
              </div>
            </div>

            {/* On xl+ screens: side telemetry columns flank the diagram */}
            <div className="grid items-center gap-4 xl:grid-cols-[9rem_1fr_9rem]">
              {/* Left telemetry */}
              <div className="hidden flex-col gap-3 xl:flex">
                {[
                  { label: "Active nodes", value: "9",   accent: "#17B79B" },
                  { label: "Edge regions", value: "14",  accent: "var(--accent-blue)" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border/40 bg-[var(--surface-1)] px-4 py-3">
                    <p className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
                    <p className="mt-1 font-mono text-xl font-bold tabular-nums" style={{ color: item.accent }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <ArchDiagram active={active} setActive={setActive} />

              {/* Right telemetry */}
              <div className="hidden flex-col items-end gap-3 xl:flex">
                {[
                  { label: "Sync status",    value: "Live",  accent: meta.accent },
                  { label: "Data packets/s", value: "2.4k",  accent: "var(--accent-violet)" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border/40 bg-[var(--surface-1)] px-4 py-3 text-right">
                    <p className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">{item.label}</p>
                    <p className="mt-1 font-mono text-xl font-bold" style={{ color: item.accent }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Product selector cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {nodeKeys.map((key, i) => {
            const m = NODE_META[key];
            const node = section.nodes[key];
            const isActive = active === key;
            return (
              <Reveal key={key} delay={i * 70}>
                <button type="button" onClick={() => setActive(key)} onMouseEnter={() => setActive(key)}
                  className="group w-full rounded-2xl border p-5 text-left transition-all duration-500"
                  style={isActive ? {
                    borderColor: m.accent,
                    background: `linear-gradient(135deg, ${m.muted} 0%, var(--surface-1) 100%)`,
                    boxShadow: `0 0 36px -12px ${m.glow}`,
                  } : { borderColor: "var(--border)", background: "var(--surface-1)" }}>

                  <div className="flex items-start justify-between gap-2">
                    <p className="font-heading text-base font-semibold tracking-tight transition-colors duration-300"
                      style={{ color: isActive ? m.accent : undefined }}>
                      {node.name}
                    </p>
                    <span className={cn("badge-status shrink-0", m.badge)}>{node.status}</span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {node.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-border/60">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: key === "typoo" ? "100%" : key === "xviGet" ? "47%" : "28%",
                          background: `linear-gradient(90deg, ${m.accent}, color-mix(in srgb, ${m.accent} 60%, white))`,
                        }} />
                    </div>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em]"
                      style={{ color: isActive ? m.accent : "var(--muted-foreground)" }}>
                      {m.tag}
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>

        {/* Active product detail */}
        <Reveal delay={100}>
          <div className="overflow-hidden rounded-2xl border p-6 transition-all duration-700 md:p-8"
            style={{
              borderColor: `${meta.accent}30`,
              background: `linear-gradient(135deg, ${meta.muted} 0%, var(--background) 65%)`,
            }}>
            <div className="grid gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {section.root} / {activeNode.name}
                </p>
                <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight transition-colors duration-500"
                  style={{ color: meta.accent }}>
                  {activeNode.name}
                </h3>
                <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
                  {activeNode.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 self-center text-right md:text-right">
                {[
                  { label: "API",    value: "v2.0"   },
                  { label: "Region", value: "Global" },
                  { label: "SLA",    value: "99.9%"  },
                  { label: "Auth",   value: "OAuth2" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-mono text-sm font-semibold" style={{ color: meta.accent }}>{value}</p>
                    <p className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
