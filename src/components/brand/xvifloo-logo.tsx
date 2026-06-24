"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type XviFlooLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const heights: Record<NonNullable<XviFlooLogoProps["size"]>, number> = {
  sm: 14,
  md: 18,
  lg: 22,
};

// Text fallback sizes when SVG is missing
const textSizes: Record<NonNullable<XviFlooLogoProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

export function XviFlooLogo({ className, size = "md" }: XviFlooLogoProps) {
  const h = heights[size];
  const [imgFailed, setImgFailed] = React.useState(false);

  return (
    <span
      className={cn(
        "inline-flex items-center transition-opacity duration-300 hover:opacity-80",
        className,
      )}
    >
      {imgFailed ? (
        // Styled text fallback when SVG is not present
        <span
          className={cn(
            "font-heading font-semibold tracking-tight",
            textSizes[size],
          )}
        >
          <span className="text-foreground">Xvi</span>
          <span className="text-[var(--brand)]">Floo</span>
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/XviFloo-TxtL.svg"
          alt="XviFloo"
          height={h}
          className="h-auto object-contain"
          style={{ height: `${h}px`, width: "auto" }}
          onError={() => setImgFailed(true)}
        />
      )}
    </span>
  );
}
