"use client";

import * as React from "react";

/**
 * Lightweight static topology background.
 * No canvas, no requestAnimationFrame — pure CSS + SVG.
 * Alternating dark/light sections get their topology overlay
 * from the SectionBg component rendered inside each section.
 *
 * This component only provides the fixed ambient layer
 * (gradient blobs, no animation that burns CPU).
 */
export function SiteAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Ambient radial blobs — static, no animation */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 18% -10%, var(--brand-muted), transparent 60%), radial-gradient(ellipse 60% 45% at 100% 10%, color-mix(in srgb, #17b79b 6%, transparent), transparent 55%), radial-gradient(ellipse 70% 60% at 50% 120%, color-mix(in srgb, #17b79b 5%, transparent), transparent 60%)",
        }}
      />

      {/* Film grain pass */}
      <div className="noise-layer absolute inset-0" />

      {/* Soft top/bottom vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--background) 35%, transparent) 0%, transparent 12%, transparent 88%, color-mix(in srgb, var(--background) 55%, transparent) 100%)",
        }}
      />
    </div>
  );
}

/**
 * Topology dot-mesh overlay rendered as an inline SVG pattern.
 * Used inside each alternating section background.
 * Static — no animation. GPU-friendly for low-end phones.
 */
export function TopologyOverlay({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const id = React.useId().replace(/:/g, "");
  const dotColor = variant === "dark" ? "rgba(23,183,155,0.18)" : "rgba(23,183,155,0.12)";
  const lineColor = variant === "dark" ? "rgba(23,183,155,0.10)" : "rgba(23,183,155,0.07)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          {/* Dot grid pattern */}
          <pattern
            id={`dots-${id}`}
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill={dotColor} />
          </pattern>
          {/* Diagonal topology lines */}
          <pattern
            id={`topo-${id}`}
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,40 Q20,20 40,40 Q60,60 80,40"
              stroke={lineColor}
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M0,60 Q20,40 40,60 Q60,80 80,60"
              stroke={lineColor}
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M40,0 Q60,20 40,40 Q20,60 40,80"
              stroke={lineColor}
              strokeWidth="0.5"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${id})`} />
        <rect width="100%" height="100%" fill={`url(#topo-${id})`} />
      </svg>
    </div>
  );
}
