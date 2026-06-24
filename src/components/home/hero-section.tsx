"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { EcosystemGraph } from "@/components/home/ecosystem-graph";
import { Reveal, useCountUp, useInView } from "@/components/home/section-shell";

function HeroStat({
  label,
  value,
  suffix,
  active,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  active: boolean;
  delay: number;
}) {
  const count = useCountUp(value, active);

  return (
    <Reveal delay={delay} className="space-y-1">
      <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums md:text-3xl">
        {count}
        <span className="text-[var(--brand)]">{suffix}</span>
      </p>
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
    </Reveal>
  );
}

export function HeroSection() {
  const { dict } = useI18n();
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  const hero = dict.home.hero;

  // Split heading: first half is white, second half is gradient.
  // Splitting on the first word boundary after 40% of the heading length
  // keeps both halves roughly balanced regardless of copy length.
  const words = hero.heading.split(" ");
  const splitAt = Math.max(1, Math.floor(words.length / 2));
  const headingFirst = words.slice(0, splitAt).join(" ");
  const headingSecond = words.slice(splitAt).join(" ");

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-7rem)] items-center overflow-hidden px-4 pb-16 pt-12 sm:px-6 md:px-8 md:pb-24 md:pt-14"
    >
      {/* Blueprint grid — fades radially from center */}
      <div
        className="grid-overlay pointer-events-none absolute inset-0 opacity-50"
        style={{
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 20%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 20%, black 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="glow-orb pointer-events-none absolute -right-16 top-1/3 size-[26rem] opacity-40"
        aria-hidden="true"
      />
      {/* Secondary accent orb */}
      <div
        className="glow-orb-violet pointer-events-none absolute -left-20 bottom-1/4 size-64 opacity-25"
        aria-hidden="true"
      />

      <div
        ref={ref}
        className="relative z-10 mx-auto grid w-full max-w-[90rem] items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-8 xl:gap-12"
      >
        <div className="space-y-8">
          {/* Eyebrow */}
          <Reveal delay={0}>
            <span className="eyebrow">
              <span className="status-dot" aria-hidden="true" />
              {hero.eyebrow}
            </span>
          </Reveal>

          {/* Heading — first half foreground, second half gradient */}
          <Reveal delay={80}>
            <h1 className="text-display">
              <span className="block text-foreground">{headingFirst}</span>
              <span className="hero-gradient-text block">{headingSecond}</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              {hero.subheading}
            </p>
          </Reveal>

          {/* CTA buttons — futuristic treatment */}
          <Reveal delay={240}>
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary — brand fill, animated border glow on hover, chevron arrow */}
              <Link
                href="#ecosystem"
                className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full bg-[var(--brand)] px-7 text-[0.95rem] font-medium text-white shadow-[0_0_0_1px_var(--brand)] transition-all duration-500 hover:shadow-[0_0_32px_-4px_var(--brand-glow-strong),0_0_0_1px_var(--brand)]"
              >
                {/* Animated shimmer sweep inside button */}
                <span
                  className="pointer-events-none absolute inset-0 translate-x-[-100%] skew-x-[-18deg] bg-white/15 transition-transform duration-700 group-hover:translate-x-[120%]"
                  aria-hidden="true"
                />
                <span className="relative">{hero.primaryCta}</span>
                <ChevronRight
                  className="relative size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>

              {/* Secondary — glass outline, brand color on hover */}
              <Link
                href="#roadmap"
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-border/70 bg-transparent px-7 text-[0.95rem] font-medium text-foreground/80 transition-all duration-500 hover:border-[var(--brand)]/50 hover:bg-[var(--brand-muted)] hover:text-[var(--brand)]"
              >
                {hero.secondaryCta}
                <ArrowRight
                  className="size-4 opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>

          {/* Stats strip */}
          <Reveal delay={320}>
            <div className="glass-panel grid grid-cols-2 gap-6 rounded-2xl px-6 py-5 sm:grid-cols-4">
              <HeroStat
                label={hero.stats.products.label}
                value={hero.stats.products.value}
                suffix={hero.stats.products.suffix}
                active={inView}
                delay={340}
              />
              <HeroStat
                label={hero.stats.languages.label}
                value={hero.stats.languages.value}
                suffix={hero.stats.languages.suffix}
                active={inView}
                delay={380}
              />
              <HeroStat
                label={hero.stats.platforms.label}
                value={hero.stats.platforms.value}
                suffix={hero.stats.platforms.suffix}
                active={inView}
                delay={420}
              />
              <HeroStat
                label={hero.stats.future.label}
                value={hero.stats.future.value}
                suffix={hero.stats.future.suffix}
                active={inView}
                delay={460}
              />
            </div>
          </Reveal>
        </div>

        {/* Live Architecture card — right column */}
        <Reveal delay={200} className="lg:order-last">
          <LiveArchitectureCard />
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-6 hidden justify-center md:flex">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em]">Scroll</span>
          <span className="relative h-9 w-px overflow-hidden bg-border/50">
            <span
              className="absolute inset-x-0 top-0 h-1/2 bg-[var(--brand)]"
              style={{ animation: "float-slow 2.4s ease-in-out infinite" }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}

function LiveArchitectureCard() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-border/50 bg-[var(--surface-glass)] p-1 shadow-[var(--shadow-panel)] backdrop-blur-2xl">
      {/* Animated border glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-muted) 0%, transparent 50%, var(--accent-violet-muted) 100%)",
          opacity: 0.6,
        }}
        aria-hidden="true"
      />

      <div className="relative rounded-[1.4rem] bg-background/60 p-5 md:p-6">
        {/* Card header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-[var(--brand-muted)]">
              <Sparkles className="size-3 text-[var(--brand)]" aria-hidden="true" />
            </div>
            <span className="eyebrow-blue text-[0.62rem]">Live Architecture</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Animated status indicators */}
            <div className="flex items-center gap-1.5">
              {["var(--brand)", "var(--accent-blue)", "var(--accent-violet)"].map(
                (color, i) => (
                  <span
                    key={i}
                    className="size-1.5 rounded-full"
                    style={{
                      backgroundColor: color,
                      animation: `ping-soft 2.2s ease-in-out ${i * 0.5}s infinite`,
                    }}
                    aria-hidden="true"
                  />
                ),
              )}
            </div>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted-foreground">
              v2.0
            </span>
          </div>
        </div>

        {/* Topology graph */}
        <EcosystemGraph className="mx-auto max-w-sm lg:max-w-none" />

        {/* Footer strip */}
        <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-3">
          <div className="flex items-center gap-2">
            <span className="status-dot" aria-hidden="true" />
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">
              System operational
            </span>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: "Nodes", value: "9" },
              { label: "Uptime", value: "99.9%" },
            ].map((item) => (
              <div key={item.label} className="text-right">
                <p className="font-mono text-[0.65rem] font-semibold text-[var(--brand)]">
                  {item.value}
                </p>
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.1em] text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
