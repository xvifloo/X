"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── LOGO SCALE CONTROL ───────────────────────────────────────────────────────
// Change this single value to proportionally resize the logo everywhere it
// appears (navbar, footer, admin sidebar, sign-in page, etc.)
// 0.85 = slightly smaller than default  |  1.0 = base size  |  1.2 = larger
const LOGO_SCALE = 0.85;
// ─────────────────────────────────────────────────────────────────────────────

type XviFlooLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const BASE_HEIGHTS: Record<NonNullable<XviFlooLogoProps["size"]>, number> = {
  sm: 18,
  md: 24,
  lg: 30,
};

const TEXT_SIZES: Record<NonNullable<XviFlooLogoProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

export function XviFlooLogo({ className, size = "md" }: XviFlooLogoProps) {
  const h = Math.round(BASE_HEIGHTS[size] * LOGO_SCALE);
  const [imgFailed, setImgFailed] = React.useState(false);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center transition-opacity duration-300 hover:opacity-80",
        className,
      )}
    >
      {imgFailed ? (
        <span className={cn("font-heading font-semibold tracking-tight", TEXT_SIZES[size])}>
          <span className="text-foreground">Xvi</span>
          <span className="text-[var(--brand)]">Floo</span>
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/xviFlooCm.svg"
          alt="XviFloo"
          height={h}
          style={{ height: h, width: "auto", display: "block" }}
          onError={() => setImgFailed(true)}
        />
      )}
    </span>
  );
}
