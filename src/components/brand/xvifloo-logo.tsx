import { cn } from "@/lib/utils";

type XviFlooLogoProps = {
  className?: string;
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { mark: 28, text: "text-base" },
  md: { mark: 34, text: "text-lg" },
  lg: { mark: 42, text: "text-xl" },
};

export function XviFlooLogo({
  className,
  variant = "full",
  size = "md",
}: XviFlooLogoProps) {
  const dim = sizes[size].mark;

  return (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="shrink-0 drop-shadow-[0_0_10px_var(--brand-glow)] transition-transform duration-500 group-hover:scale-105"
      >
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="10"
          className="fill-[var(--brand-muted)] stroke-[var(--brand)]"
          strokeWidth="1"
        />
        <path
          d="M12 28L20 12L28 28"
          className="stroke-[var(--brand)]"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 23H25"
          className="stroke-foreground/70"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="32" cy="10" r="3" className="fill-[var(--brand)]" />
      </svg>
      {variant === "full" && (
        <span className={cn("font-heading font-semibold tracking-tight", sizes[size].text)}>
          <span className="text-foreground">Xvi</span>
          <span className="text-[var(--brand)]">Floo</span>
        </span>
      )}
    </span>
  );
}
