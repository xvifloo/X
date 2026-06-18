import { cn } from "@/lib/utils";

type XviTypooLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = { sm: 32, md: 48, lg: 64 };

export function XviTypooLogo({ className, size = "md" }: XviTypooLogoProps) {
  const dim = sizes[size];

  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0 drop-shadow-[0_0_10px_var(--brand-glow)]", className)}
    >
      <rect
        x="6"
        y="10"
        width="52"
        height="44"
        rx="12"
        className="fill-[var(--brand-muted)] stroke-[var(--brand)]"
        strokeWidth="1.5"
      />
      <rect
        x="14"
        y="20"
        width="10"
        height="10"
        rx="2.5"
        className="fill-background stroke-border"
        strokeWidth="1"
      />
      <rect
        x="27"
        y="20"
        width="10"
        height="10"
        rx="2.5"
        className="fill-background stroke-border"
        strokeWidth="1"
      />
      <rect
        x="40"
        y="20"
        width="10"
        height="10"
        rx="2.5"
        className="fill-[var(--brand)]"
      />
      <path
        d="M14 38H50"
        className="stroke-foreground/30"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 44H38"
        className="stroke-[var(--brand)]"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="44" r="3" className="fill-[var(--brand)]" />
    </svg>
  );
}
