"use client";

import { cn } from "@/lib/utils";

type NodeStatus = "live" | "building" | "research";

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  status: NodeStatus;
  accent: "brand" | "blue" | "violet";
};

const ACCENT_VAR: Record<Node["accent"], string> = {
  brand: "var(--brand)",
  blue: "var(--accent-blue)",
  violet: "var(--accent-violet)",
};

const ROOT = { x: 200, y: 200 };

const NODES: Node[] = [
  { id: "typoo", label: "XviTypoo", x: 84, y: 96, status: "live", accent: "brand" },
  { id: "xviGet", label: "XviGet", x: 316, y: 96, status: "building", accent: "blue" },
  { id: "kleava", label: "Kleava AI", x: 200, y: 336, status: "research", accent: "violet" },
];

const STATUS_LABEL: Record<NodeStatus, string> = {
  live: "Live",
  building: "Building",
  research: "Research",
};

function NodeRing({ node, r }: { node: Node; r: number }) {
  const accent = ACCENT_VAR[node.accent];

  if (node.status === "live") {
    return (
      <circle
        cx={node.x}
        cy={node.y}
        r={r + 6}
        fill="none"
        stroke={accent}
        strokeWidth="1"
        opacity="0.45"
        style={{ animation: "pulse-ring 2.8s ease-in-out infinite" }}
      />
    );
  }

  if (node.status === "building") {
    return (
      <circle
        cx={node.x}
        cy={node.y}
        r={r + 6}
        fill="none"
        stroke={accent}
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.5"
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: "orbit-spin 14s linear infinite",
        }}
      />
    );
  }

  return (
    <circle
      cx={node.x}
      cy={node.y}
      r={r + 6}
      fill="none"
      stroke={accent}
      strokeWidth="1"
      strokeDasharray="1 5"
      opacity="0.35"
    />
  );
}

export function EcosystemGraph({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="glow-orb pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 400 400"
        className="relative z-10 mx-auto w-full max-w-md"
        aria-label="XviFloo ecosystem architecture: XviFloo at the center, connected to XviTypoo, XviGet, and Kleava AI"
        role="img"
      >
        <defs>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
          {NODES.map((n) => (
            <radialGradient key={n.id} id={`glow-${n.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={ACCENT_VAR[n.accent]} stopOpacity="0.35" />
              <stop offset="100%" stopColor={ACCENT_VAR[n.accent]} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Decorative orbit rings around the whole diagram */}
        <circle
          cx={ROOT.x}
          cy={ROOT.y}
          r="150"
          fill="none"
          stroke="var(--line-subtle)"
          strokeWidth="1"
          strokeDasharray="1 7"
          className="orbit-ring"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        <circle
          cx={ROOT.x}
          cy={ROOT.y}
          r="118"
          fill="none"
          stroke="var(--line-subtle)"
          strokeWidth="1"
          className="orbit-ring-reverse"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          opacity="0.5"
        />

        {NODES.map((node, i) => {
          const pathId = `edge-${node.id}`;
          return (
            <g key={node.id}>
              <path
                id={pathId}
                d={`M ${ROOT.x} ${ROOT.y} L ${node.x} ${node.y}`}
                fill="none"
                stroke={ACCENT_VAR[node.accent]}
                strokeWidth="0.5"
                opacity="0.18"
              />
              <path
                d={`M ${ROOT.x} ${ROOT.y} L ${node.x} ${node.y}`}
                fill="none"
                stroke={ACCENT_VAR[node.accent]}
                strokeWidth="1"
                strokeDasharray="5 5"
                opacity="0.55"
                style={{ animation: `line-flow 2.6s linear infinite`, animationDelay: `${i * 0.35}s` }}
              />
              <circle r="2" fill={ACCENT_VAR[node.accent]}>
                <animateMotion
                  dur={`${3.2 + i * 0.6}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.7}s`}
                  keyPoints="0;1"
                  keyTimes="0;1"
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;0.9;0.9;0"
                  keyTimes="0;0.1;0.85;1"
                  dur={`${3.2 + i * 0.6}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.7}s`}
                />
              </circle>
            </g>
          );
        })}

        {/* Root node */}
        <g className="group">
          <circle cx={ROOT.x} cy={ROOT.y} r="44" fill="url(#node-glow)" opacity="0.9" />
          <circle
            cx={ROOT.x}
            cy={ROOT.y}
            r="24"
            className="fill-background stroke-[var(--brand)] transition-transform duration-500 group-hover:scale-110"
            strokeWidth="2"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
          <circle cx={ROOT.x} cy={ROOT.y} r="3.5" fill="var(--brand)" />
          <text
            x={ROOT.x}
            y={ROOT.y - 34}
            textAnchor="middle"
            className="fill-foreground font-heading text-[13px] font-semibold"
          >
            XviFloo
          </text>
          <text
            x={ROOT.x}
            y={ROOT.y + 42}
            textAnchor="middle"
            className="fill-muted-foreground font-mono text-[8px] uppercase tracking-[0.18em]"
          >
            Platform core
          </text>
        </g>

        {NODES.map((node) => {
          const accent = ACCENT_VAR[node.accent];
          return (
            <g key={node.id} className="group cursor-default">
              <circle
                cx={node.x}
                cy={node.y}
                r="30"
                fill={`url(#glow-${node.id})`}
                className="transition-opacity duration-500 group-hover:opacity-100"
                opacity="0.65"
              />
              <NodeRing node={node} r={16} />
              <circle
                cx={node.x}
                cy={node.y}
                r="16"
                className="fill-background transition-transform duration-500 group-hover:scale-110"
                stroke={accent}
                strokeWidth="1.5"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
              <circle cx={node.x} cy={node.y} r="2.5" fill={accent} />
              <text
                x={node.x}
                y={node.y - 26}
                textAnchor="middle"
                className="fill-foreground font-heading text-[11px] font-semibold transition-opacity"
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + 30}
                textAnchor="middle"
                className="font-mono text-[8px] uppercase tracking-[0.18em]"
                fill={accent}
              >
                {STATUS_LABEL[node.status]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
