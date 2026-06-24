"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type XviTypooLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const heights: Record<NonNullable<XviTypooLogoProps["size"]>, number> = {
  sm: 22,
  md: 28,
  lg: 36,
};

const textSizes: Record<NonNullable<XviTypooLogoProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

export function XviTypooLogo({ className, size = "md" }: XviTypooLogoProps) {
  const h = heights[size];
  const [imgFailed, setImgFailed] = React.useState(false);

  return (
    <span className={cn("inline-flex items-center", className)}>
      {imgFailed ? (
        <span className={cn("font-heading font-semibold tracking-tight", textSizes[size])}>
          <span className="text-foreground">Xvi</span>
          <span className="text-[var(--brand)]">Typoo</span>
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/XviTypooTxtL.svg"
          alt="XviTypoo"
          height={h}
          className="h-auto object-contain"
          style={{ height: h, width: "auto" }}
          onError={() => setImgFailed(true)}
        />
      )}
    </span>
  );
}
