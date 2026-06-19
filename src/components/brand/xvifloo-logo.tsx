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

  // Note: SVG ডার্ক/লাইট—দুইটাই আলাদা।
  // Site/app এ `.dark` ক্লাস টগল করা হয়, তাই এখানে CSS-based switching করা হয়েছে।
  return (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <span
        className="shrink-0 drop-shadow-[0_0_10px_var(--brand-glow)] transition-transform duration-500 group-hover:scale-105"
        style={{ width: dim, height: dim, display: "inline-flex" }}
        aria-hidden="true"
      >
        <span className="block dark:hidden" style={{ width: dim, height: dim }}>
          {/* Light SVG */}
          <svg
            viewBox="0 0 59.6387 23.0638"
            width={dim}
            height={dim}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
            dangerouslySetInnerHTML={{
              __html:
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                (require("@/../../public/XviFlooSgn-Lgt.svg") as string) ?? "",
            }}
          />
        </span>
        <span className="hidden dark:block" style={{ width: dim, height: dim }}>
          {/* Dark SVG */}
          <svg
            viewBox="0 0 59.6387 23.0638"
            width={dim}
            height={dim}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
            dangerouslySetInnerHTML={{
              __html:
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                (require("@/../../public/XviFlooSgn-Drk.svg") as string) ?? "",
            }}
          />
        </span>

      </span>

      {variant === "full" && (
        <span className={cn("font-heading font-semibold tracking-tight", sizes[size].text)}>
          <span className="text-foreground">Xvi</span>
          <span className="text-[var(--brand)]">Floo</span>
        </span>
      )}
    </span>
  );
}

