"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "h-8 w-auto",
  md: "h-10 w-auto",
  lg: "h-12 w-auto",
};

export function XviTypooLogo({ size = "md", className }: LogoProps) {
  // Assuming the correct logo file is named XviTypooLogo.svg and is in the /public folder
  return (
    <Image
      src="/XviTypooLogo.svg"
      alt="XviTypoo Logo"
      width={150}
      height={40}
      className={cn(SIZES[size], className)}
      priority
    />
  );
}