/**
 * SectionBg is still exported for backward compat but
 * page.tsx now uses plain divs with section-light-bg / section-dark-bg classes.
 */
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SectionBgProps = {
  children: React.ReactNode;
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
        variant === "dark" ? "section-dark-bg" : "section-light-bg",
        className,
      )}
    >
      {children}
    </div>
  );
}
