/**
 * SectionBg — wraps each homepage section with alternating dark/light backgrounds.
 * Odd sections (1, 3, 5…) = dark; Even sections (2, 4…) = light.
 * Each has a static topology dot-mesh overlay — no animation, GPU-safe.
 */
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function TopologyOverlay({ variant }: { variant: "dark" | "light" }) {
  const id = React.useId().replace(/:/g, "");
  const dotColor =
    variant === "dark" ? "rgba(23,183,155,0.15)" : "rgba(23,183,155,0.10)";
  const lineColor =
    variant === "dark" ? "rgba(23,183,155,0.08)" : "rgba(23,183,155,0.06)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={`d-${id}`}
            x="0"
            y="0"
            width="38"
            height="38"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill={dotColor} />
          </pattern>
          <pattern
            id={`t-${id}`}
            x="0"
            y="0"
            width="76"
            height="76"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,38 Q19,19 38,38 Q57,57 76,38"
              stroke={lineColor}
              strokeWidth="0.7"
              fill="none"
            />
            <path
              d="M38,0 Q57,19 38,38 Q19,57 38,76"
              stroke={lineColor}
              strokeWidth="0.5"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#d-${id})`} />
        <rect width="100%" height="100%" fill={`url(#t-${id})`} />
      </svg>
    </div>
  );
}

type SectionBgProps = {
  children: React.ReactNode;
  /** 1-based index: odd = dark, even = light */
  index: number;
  className?: string;
  id?: string;
};

export function SectionBg({ children, index, className, id }: SectionBgProps) {
  const variant: "dark" | "light" = index % 2 === 1 ? "dark" : "light";

  return (
    <div
      id={id}
      className={cn(
        "relative",
        variant === "dark"
          ? "section-dark-bg"
          : "section-light-bg",
        className,
      )}
    >
      <TopologyOverlay variant={variant} />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
