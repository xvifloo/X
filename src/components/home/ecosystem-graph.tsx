"use client";

import { cn } from "@/lib/utils";

type NodeStatus = "live" | "building" | "research";

type Node = {
  id: string;
  label: string;
  sub: string;
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

const ACCENT_MUTED: Record<Node["accent"], string> = {
  brand: "var(--brand-muted)",
  blue: "var(--accent-blue-muted)",
  violet: "var(--accent-violet-muted)",
};

const ROOT = { x: 200, y: 196 };

const NODES: Node[] = [
  { id: "typoo",  label: "XviTypoo",  sub: "Typing Platform",   x: 82,  y: 90,  status: "live",     accent: "brand"  },
  { id: "xviGet", label: "XviGet",   sub: "Widget Engine",      x: 318, y: 90,  status: "building", accent: "blue"   },
  { id: "kleava", label: "Kleava AI",sub: "Intelligence Layer", x: 200, y: 325, status: "research", accent: "violet" },
];

const STATUS_LABEL: Record<NodeStatus, string> = {
  live: "Live",
  building: "Beta",
  research: "R&D",
};

// Rounded hexagon path: regular hex with corner radius r_corner
function roundedHex(cx: number, cy: number, r: number, rCorner = 5): string {
  const points = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

  let d = "";
  for (let i = 0; i < 6; i++) {
    const prev = points[(i + 5) % 6];
    const cur = points[i];
    const next = points[(i + 1) % 6];

    const dxIn = cur.x - prev.x;
    const dyIn = cur.y - prev.y;
    const lenIn = Math.hypot(dxIn, dyIn);
    const dxOut = next.x - cur.x;
    const dyOut = next.y - cur.y;
    const lenOut = Math.hypot(dxOut, dyOut);

    const rc = Math.min(rCorner, lenIn / 2, lenOut / 2);
    const startX = cur.x - (dxIn / lenIn) * rc;
    const startY = cur.y - (dyIn / lenIn) * rc;
    const endX = cur.x + (dxOut / lenOut) * rc;
    const endY = cur.y + (dyOut / lenOut) * rc;

    if (i === 0) d += `M ${startX},${startY}`;
    else d += ` L ${startX},${startY}`;
    d += ` Q ${cur.x},${cur.y} ${endX},${endY}`;
  }
  d += " Z";
  return d;
}

export function EcosystemGraph({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 400 408"
        className="relative z-10 mx-auto w-full max-w-md"
        aria-label="XviFloo ecosystem topology"
        role="img"
      >
        <defs>
          <radialGradient id="eg-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
          {NODES.map((n) => (
            <radialGradient key={n.id} id={`eg-glow-${n.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={ACCENT_VAR[n.accent]} stopOpacity="0.32" />
              <stop offset="100%" stopColor={ACCENT_VAR[n.accent]} stopOpacity="0" />
            </radialGradient>
          ))}
          <linearGradient id="eg-scan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--brand)" stopOpacity="0" />
            <stop offset="50%"  stopColor="var(--brand)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="eg-clip"><rect x="0" y="0" width="400" height="408" rx="20" /></clipPath>
        </defs>

        {/* Depth grid */}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`hg-${i}`} x1="0" y1={(i + 1) * 38} x2="400" y2={(i + 1) * 38}
            stroke="var(--line-subtle)" strokeWidth="0.35" opacity="0.35" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`vg-${i}`} x1={(i + 1) * 38} y1="0" x2={(i + 1) * 38} y2="408"
            stroke="var(--line-subtle)" strokeWidth="0.35" opacity="0.35" />
        ))}

        {/* Scan sweep beam */}
        <rect x="0" y="-50" width="400" height="90" fill="url(#eg-scan)" clipPath="url(#eg-clip)" opacity="0.8">
          <animateTransform attributeName="transform" type="translate"
            values="0 0;0 500" dur="4.5s" repeatCount="indefinite" />
        </rect>

        {/* Orbit rings around root */}
        <circle cx={ROOT.x} cy={ROOT.y} r="148" fill="none"
          stroke="var(--line-subtle)" strokeWidth="0.7" strokeDasharray="1 9"
          className="orbit-ring" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        <circle cx={ROOT.x} cy={ROOT.y} r="112" fill="none"
          stroke="var(--line-subtle)" strokeWidth="0.5" strokeDasharray="4 7"
          className="orbit-ring-reverse" style={{ transformBox: "fill-box", transformOrigin: "center" }} opacity="0.45" />

        {/* Ambient center glow */}
        <circle cx={ROOT.x} cy={ROOT.y} r="72" fill="url(#eg-center)" />

        {/* Edges + bidirectional packets */}
        {NODES.map((node, i) => {
          const pid = `eg-edge-${node.id}`;
          const accent = ACCENT_VAR[node.accent];
          return (
            <g key={node.id}>
              <path id={pid} d={`M ${ROOT.x} ${ROOT.y} L ${node.x} ${node.y}`}
                fill="none" stroke={accent} strokeWidth="0.4" opacity="0.14" />
              <path d={`M ${ROOT.x} ${ROOT.y} L ${node.x} ${node.y}`}
                fill="none" stroke={accent} strokeWidth="0.9"
                strokeDasharray="4 5" opacity="0.55"
                style={{ animation: `line-flow 2.4s linear infinite`, animationDelay: `${i * 0.4}s` }} />
              {/* Forward packet */}
              <circle r="2.4" fill={accent} opacity="0.92">
                <animateMotion dur={`${3 + i * 0.6}s`} repeatCount="indefinite"
                  begin={`${i * 0.8}s`} keyPoints="0;1" keyTimes="0;1">
                  <mpath href={`#${pid}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0"
                  keyTimes="0;0.1;0.85;1" dur={`${3 + i * 0.6}s`}
                  repeatCount="indefinite" begin={`${i * 0.8}s`} />
              </circle>
              {/* Return packet */}
              <circle r="1.5" fill={accent} opacity="0.55">
                <animateMotion dur={`${3.8 + i * 0.5}s`} repeatCount="indefinite"
                  begin={`${1.6 + i * 0.6}s`} keyPoints="1;0" keyTimes="0;1">
                  <mpath href={`#${pid}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;0.55;0.55;0"
                  keyTimes="0;0.1;0.85;1" dur={`${3.8 + i * 0.5}s`}
                  repeatCount="indefinite" begin={`${1.6 + i * 0.6}s`} />
              </circle>
            </g>
          );
        })}

        {/* ROOT — rounded hexagon (stays hex, high corner radius = smooth) */}
        <g className="group">
          <circle cx={ROOT.x} cy={ROOT.y} r="52" fill="url(#eg-center)" opacity="0.9" />
          {/* Outer scanning ring */}
          <path d={roundedHex(ROOT.x, ROOT.y, 34, 10)}
            fill="none" stroke="var(--brand)" strokeWidth="0.8"
            strokeDasharray="2 4" opacity="0.4"
            style={{ transformBox:"fill-box", transformOrigin:"center", animation:"orbit-spin 22s linear infinite" }} />
          {/* Main body */}
          <path d={roundedHex(ROOT.x, ROOT.y, 26, 8)}
            fill="var(--background)" stroke="var(--brand)" strokeWidth="1.6"
            className="transition-transform duration-500 group-hover:scale-105"
            style={{ transformBox:"fill-box", transformOrigin:"center" }} />
          <circle cx={ROOT.x} cy={ROOT.y} r="3.8" fill="var(--brand)" />
          <text x={ROOT.x} y={ROOT.y - 38} textAnchor="middle"
            fill="var(--foreground)" fontSize="11" fontWeight="700"
            fontFamily="var(--font-display, sans-serif)" letterSpacing="-0.3">
            XviFloo
          </text>
          <text x={ROOT.x} y={ROOT.y + 46} textAnchor="middle"
            fill="var(--muted-foreground)" fontSize="6.5"
            fontFamily="var(--font-mono, monospace)" letterSpacing="1.8"
            style={{ textTransform: "uppercase" }}>
            Platform Core
          </text>
        </g>

        {/* PRODUCT NODES — circles (not hexagons) */}
        {NODES.map((node) => {
          const accent = ACCENT_VAR[node.accent];
          const muted   = ACCENT_MUTED[node.accent];
          const R = 20;

          const ringProps =
            node.status === "live"
              ? { style: { animation: "pulse-ring 2.8s ease-in-out infinite" } }
              : node.status === "building"
              ? { style: { transformBox: "fill-box" as const, transformOrigin: "center" as const, animation: "orbit-spin 12s linear infinite" },
                  strokeDasharray: "3 4" }
              : { opacity: 0.3, strokeDasharray: "1 6" };

          return (
            <g key={node.id} className="group cursor-default">
              {/* Glow halo */}
              <circle cx={node.x} cy={node.y} r={R + 18}
                fill={`url(#eg-glow-${node.id})`} opacity="0.7"
                className="transition-opacity duration-500 group-hover:opacity-100" />

              {/* Status orbit ring */}
              <circle cx={node.x} cy={node.y} r={R + 9}
                fill="none" stroke={accent} strokeWidth="0.9"
                opacity={node.status === "live" ? 0.5 : 0.4}
                {...ringProps} />

              {/* Main circle body */}
              <circle cx={node.x} cy={node.y} r={R}
                fill="var(--background)" stroke={accent} strokeWidth="1.4" />

              {/* Inner glow fill */}
              <circle cx={node.x} cy={node.y} r={R - 4} fill={muted} opacity="0.5" />

              {/* Center dot */}
              <circle cx={node.x} cy={node.y} r="3" fill={accent} />

              {/* Label above */}
              <text x={node.x} y={node.y - 32} textAnchor="middle"
                fill="var(--foreground)" fontSize="9.5" fontWeight="600"
                fontFamily="var(--font-display, sans-serif)" letterSpacing="-0.2">
                {node.label}
              </text>
              {/* Sub-label */}
              <text x={node.x} y={node.y - 21} textAnchor="middle"
                fill="var(--muted-foreground)" fontSize="5.8"
                fontFamily="var(--font-mono, monospace)" letterSpacing="0.4">
                {node.sub}
              </text>

              {/* Status badge below */}
              <rect x={node.x - 17} y={node.y + R + 4} width="34" height="11" rx="5.5" fill={muted} />
              <text x={node.x} y={node.y + R + 12} textAnchor="middle"
                fill={accent} fontSize="5.5"
                fontFamily="var(--font-mono, monospace)" letterSpacing="0.9"
                style={{ textTransform: "uppercase" }}>
                {STATUS_LABEL[node.status]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
