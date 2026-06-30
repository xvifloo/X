"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function useInView<T extends HTMLElement>(threshold = 0.12, rootMargin = "0px 0px -8% 0px") {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}

export function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!active) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [active, duration, target]);

  return value;
}

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn("reveal", inView && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * Splits a heading into two visual halves:
 *   • First half — plain foreground (white/dark)
 *   • Second half — animated 3-colour gradient (brand teal → blue → violet)
 *
 * Splitting at roughly halfway through the word list keeps both halves
 * balanced regardless of the actual copy. Each half is rendered as a
 * separate inline block so the break always falls between words.
 */
function SplitHeading({ text, isHero }: { text: string; isHero: boolean }) {
  const words = text.split(" ");
  const splitAt = Math.max(1, Math.floor(words.length / 2));
  const firstHalf = words.slice(0, splitAt).join(" ");
  const secondHalf = words.slice(splitAt).join(" ");

  const cls = cn(isHero ? "text-display" : "text-display-sm", "text-balance font-heading");

  return (
    <h2 className={cls}>
      <span className="text-foreground">{firstHalf} </span>
      <span className="section-gradient-text">{secondHalf}</span>
    </h2>
  );
}

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "hero";
  align?: "left" | "center";
};

export function SectionShell({
  id,
  eyebrow,
  heading,
  subheading,
  children,
  className,
  variant = "default",
  align = "left",
}: SectionShellProps) {
  const isHero = variant === "hero";

  return (
    <section id={id} className={cn("section-pad scroll-mt-20", className)}>
      <div className="section-inner">
        <Reveal>
          <header
            className={cn(
              "mb-14 space-y-4",
              align === "center" && "mx-auto max-w-3xl text-center",
              align !== "center" && "max-w-4xl",
            )}
          >
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <SplitHeading text={heading} isHero={isHero} />
            {subheading && (
              <p
                className={cn(
                  "text-pretty leading-relaxed text-[#778B88]",
                  isHero ? "max-w-2xl text-lg md:text-xl" : "max-w-2xl text-base md:text-lg",
                  align === "center" && "mx-auto",
                )}
              >
                {subheading}
              </p>
            )}
          </header>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
