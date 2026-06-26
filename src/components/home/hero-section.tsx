"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { EcosystemGraph } from "@/components/home/ecosystem-graph";
import { Reveal } from "@/components/home/section-shell";

export function HeroSection() {
  const { dict } = useI18n();
  const hero = dict.home.hero;

  const words = hero.heading.split(" ");
  const splitAt = Math.max(1, Math.floor(words.length / 2));
  const headingFirst  = words.slice(0, splitAt).join(" ");
  const headingSecond = words.slice(splitAt).join(" ");

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden px-4 pb-12 pt-10 sm:px-6 md:px-8 md:pb-20 md:pt-14"
    >
      {/* Blueprint grid */}
      <div
        className="grid-overlay pointer-events-none absolute inset-0 opacity-45"
        style={{
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 25%, black 0%, transparent 68%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 25%, black 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />
      <div className="glow-orb pointer-events-none absolute -right-24 top-1/3 size-[28rem] opacity-35" aria-hidden="true" />
      <div className="glow-orb-violet pointer-events-none absolute -left-16 bottom-1/4 size-60 opacity-20" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-[92rem] items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-6 xl:gap-10">

        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="space-y-7">
          <Reveal delay={0}>
            <span className="eyebrow">
              <span className="status-dot" aria-hidden="true" />
              {hero.eyebrow}
            </span>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="text-display">
              <span className="block text-foreground">{headingFirst}</span>
              <span className="hero-gradient-text block">{headingSecond}</span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {hero.subheading}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-wrap items-center gap-3">
              {/* Primary CTA */}
              <Link
                href="#ecosystem"
                className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white shadow-[0_0_0_1px_var(--brand)] transition-all duration-500 hover:shadow-[0_0_28px_-4px_var(--brand-glow-strong)]"
              >
                <span className="pointer-events-none absolute inset-0 translate-x-[-100%] skew-x-[-16deg] bg-white/15 transition-transform duration-700 group-hover:translate-x-[120%]" aria-hidden="true" />
                <span className="relative">{hero.primaryCta}</span>
                <ChevronRight className="relative size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>

              {/* Secondary CTA */}
              <Link
                href="#roadmap"
                className="group inline-flex h-11 items-center gap-2 rounded-full border border-border/60 px-6 text-sm font-medium text-foreground/75 transition-all duration-400 hover:border-[var(--brand)]/45 hover:bg-[var(--brand-muted)] hover:text-[var(--brand)]"
              >
                {hero.secondaryCta}
                <ArrowRight className="size-3.5 opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* ── Right column — Live Architecture (no card wrapper) ──────── */}
        <Reveal delay={160} className="lg:order-last">
          <div className="relative">
            {/* Label row */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-[var(--brand)]" aria-hidden="true" />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--brand)]">
                  Live Architecture
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {["var(--brand)", "var(--accent-blue)", "var(--accent-violet)"].map((c, i) => (
                    <span key={i} className="size-1.5 rounded-full"
                      style={{ backgroundColor: c, animation: `ping-soft 2.2s ease-in-out ${i * 0.5}s infinite` }}
                      aria-hidden="true" />
                  ))}
                </div>
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted-foreground">v2.0</span>
              </div>
            </div>

            {/* Topology — rendered directly, no card */}
            <EcosystemGraph className="mx-auto w-full" />

            {/* Status footer */}
            <div className="mt-4 flex items-center justify-between border-t border-border/25 pt-4">
              <div className="flex items-center gap-2">
                <span className="status-dot" aria-hidden="true" />
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">
                  System operational
                </span>
              </div>
              <div className="flex items-center gap-4">
                {[{ label: "Nodes", value: "9" }, { label: "Uptime", value: "99.9%" }].map((item) => (
                  <div key={item.label} className="text-right">
                    <p className="font-mono text-[0.65rem] font-semibold text-[var(--brand)]">{item.value}</p>
                    <p className="font-mono text-[0.5rem] uppercase tracking-[0.1em] text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-5 hidden justify-center md:flex">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.32em]">Scroll</span>
          <span className="relative h-8 w-px overflow-hidden bg-border/40">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-[var(--brand)]"
              style={{ animation: "float-slow 2.4s ease-in-out infinite" }} />
          </span>
        </div>
      </div>
    </section>
  );
}
