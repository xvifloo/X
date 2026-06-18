"use client";

import * as React from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal, SectionShell } from "@/components/home/section-shell";
import { cn } from "@/lib/utils";

type NodeKey = "typoo" | "xviGet" | "kleava";

const NODE_ORDER: NodeKey[] = ["typoo", "xviGet", "kleava"];

const NODE_POSITIONS: Record<NodeKey, { x: number; y: number }> = {
  typoo: { x: 18, y: 22 },
  xviGet: { x: 82, y: 22 },
  kleava: { x: 50, y: 78 },
};

const NODE_META: Record<NodeKey, { accent: string; muted: string; glow: string; badge: string }> = {
  typoo: {
    accent: "var(--brand)",
    muted: "var(--brand-muted)",
    glow: "var(--brand-glow)",
    badge: "badge-live",
  },
  xviGet: {
    accent: "var(--accent-blue)",
    muted: "var(--accent-blue-muted)",
    glow: "var(--accent-blue-glow)",
    badge: "badge-active",
  },
  kleava: {
    accent: "var(--accent-violet)",
    muted: "var(--accent-violet-muted)",
    glow: "var(--accent-violet-glow)",
    badge: "badge-upcoming",
  },
};

export function EcosystemSection() {
  const { dict } = useI18n();
  const section = dict.home.ecosystem;
  const [active, setActive] = React.useState<NodeKey>("typoo");

  const activeNode = section.nodes[active];
  const meta = NODE_META[active];

  return (
    <SectionShell
      id="ecosystem"
      eyebrow={section.eyebrow}
      heading={section.heading}
      subheading={section.subheading}
    >
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="glass-panel relative aspect-square w-full max-w-lg overflow-hidden rounded-[1.75rem] p-8">
            <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
              <defs>
                <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={meta.accent} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={meta.accent} stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="var(--line-subtle)"
                strokeWidth="0.3"
                strokeDasharray="0.6 3"
                className="orbit-ring"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />

              {NODE_ORDER.map((key) => {
                const pos = NODE_POSITIONS[key];
                const isActive = active === key;
                const nodeMeta = NODE_META[key];
                const pathId = `ecosystem-edge-${key}`;
                return (
                  <g key={key}>
                    <path
                      id={pathId}
                      d={`M 50 50 L ${pos.x} ${pos.y}`}
                      fill="none"
                      stroke={nodeMeta.accent}
                      strokeWidth={isActive ? "0.4" : "0.2"}
                      opacity={isActive ? 0.75 : 0.22}
                      className="transition-all duration-500"
                    />
                    <circle r="0.9" fill={nodeMeta.accent} opacity={isActive ? 0.9 : 0.4}>
                      <animateMotion
                        dur="3.4s"
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                      >
                        <mpath href={`#${pathId}`} />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        values="0;0.9;0.9;0"
                        keyTimes="0;0.1;0.85;1"
                        dur="3.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    {isActive && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="6"
                        fill="none"
                        stroke={nodeMeta.accent}
                        strokeWidth="0.3"
                        opacity="0.5"
                        style={{ animation: "pulse-ring 2.5s ease-in-out infinite" }}
                      />
                    )}
                  </g>
                );
              })}

              <circle cx="50" cy="50" r="14" fill="url(#hub-glow)" />
              <circle
                cx="50"
                cy="50"
                r="8"
                className="fill-background transition-colors duration-500"
                stroke={meta.accent}
                strokeWidth="0.5"
              />
            </svg>

            <div className="absolute inset-0">
              <button
                type="button"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 font-heading text-sm font-semibold"
                onMouseEnter={() => setActive("typoo")}
              >
                {section.root}
              </button>

              {NODE_ORDER.map((key) => {
                const pos = NODE_POSITIONS[key];
                const node = section.nodes[key];
                const isActive = active === key;
                const nodeMeta = NODE_META[key];

                return (
                  <button
                    key={key}
                    type="button"
                    onMouseEnter={() => setActive(key)}
                    onFocus={() => setActive(key)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-500"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      borderColor: isActive ? nodeMeta.accent : "var(--border)",
                      backgroundColor: isActive ? nodeMeta.muted : "var(--surface-2)",
                      color: isActive ? nodeMeta.accent : "var(--muted-foreground)",
                      boxShadow: isActive ? `0 0 24px ${nodeMeta.glow}` : "none",
                    }}
                  >
                    {node.name}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <article className="space-y-8">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {section.root} / {activeNode.name}
              </p>
              <h3 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                {activeNode.name}
              </h3>
              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                {activeNode.description}
              </p>
            </div>

            <span className={cn("badge-status", meta.badge)}>{activeNode.status}</span>

            <ul className="space-y-2 border-t border-border/50 pt-6">
              {NODE_ORDER.map((key) => {
                const node = section.nodes[key];
                const isActive = active === key;
                const nodeMeta = NODE_META[key];
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(key)}
                      onFocus={() => setActive(key)}
                      className="group flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-3 text-left transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? nodeMeta.muted : "transparent",
                        borderColor: isActive ? `${nodeMeta.accent}30` : "transparent",
                      }}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="size-1.5 rounded-full transition-colors duration-300"
                          style={{ backgroundColor: isActive ? nodeMeta.accent : "var(--border)" }}
                          aria-hidden="true"
                        />
                        <span
                          className="font-medium transition-colors"
                          style={{ color: isActive ? nodeMeta.accent : undefined }}
                        >
                          {node.name}
                        </span>
                      </span>
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                        {node.status}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </article>
        </Reveal>
      </div>
    </SectionShell>
  );
}
