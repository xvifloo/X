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
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <header
            className={cn(
              "mb-16 space-y-5 md:mb-20",
              align === "center" && "mx-auto max-w-4xl text-center",
              !isHero && "max-w-3xl",
            )}
          >
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2
              className={cn(
                isHero ? "text-display" : "text-display-sm",
                "text-balance",
              )}
            >
              {heading}
            </h2>
            {subheading && (
              <p
                className={cn(
                  "text-pretty leading-relaxed text-muted-foreground",
                  isHero ? "max-w-2xl text-lg md:text-xl" : "text-base md:text-lg",
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
