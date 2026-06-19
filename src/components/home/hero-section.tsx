"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">
        {count}
        <span className="text-[var(--brand)]">{suffix}</span>
      </p>
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
    </Reveal>
  );
}

export function HeroSection() {
  const { dict } = useI18n();
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  const hero = dict.home.hero;

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-7rem)] items-center overflow-hidden px-6 pb-20 pt-14 md:px-8 md:pb-28 md:pt-16"
    >
      <div
        className="grid-overlay pointer-events-none absolute inset-0 opacity-60"
        style={{
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 20%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 20%, black 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="glow-orb pointer-events-none absolute -right-16 top-1/3 size-[26rem] opacity-45"
        aria-hidden="true"
      />

      <div
        ref={ref}
        className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12"
      >
        <div className="space-y-9">
          <Reveal delay={0}>
            <span className="eyebrow">
              <span className="status-dot" aria-hidden="true" />
              {hero.eyebrow}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-display max-w-4xl">
              {(() => {
                const dotIndex = hero.heading.search(/[.。]/);
                if (dotIndex < 0) {
                  return <span className="hero-gradient-text">{hero.heading}</span>;
                }
                return (
                  <>
                    <span className="block text-foreground">{hero.heading.slice(0, dotIndex + 1)}</span>
                    <span className="hero-gradient-text block">
                      {hero.heading.slice(dotIndex + 1).trim()}
                    </span>
                  </>
                );
              })()}
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              {hero.subheading}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-7 text-[0.95rem] shadow-[0_0_0_0_transparent] transition-shadow duration-500 hover:shadow-[0_0_44px_-6px_var(--brand-glow-strong)]"
              >
                <Link href="#ecosystem">
                  {hero.primaryCta}
                  <ArrowRight data-icon="inline-end" className="transition-transform duration-300 group-hover/button:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-border/80 bg-transparent px-7 text-[0.95rem] hover:border-[var(--brand)]/40 hover:bg-foreground/5"
              >
                <Link href="#roadmap">{hero.secondaryCta}</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="glass-panel grid grid-cols-2 gap-8 rounded-2xl px-6 py-6 sm:grid-cols-4">
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

        <Reveal delay={200} className="lg:order-last">
          <div className="glass-panel relative overflow-hidden rounded-[1.75rem] p-6 md:p-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="eyebrow-blue">
                <Sparkles className="size-3" aria-hidden="true" />
                Live architecture
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                v2.0
              </span>
            </div>
            <EcosystemGraph className="mx-auto max-w-sm lg:max-w-none" />
          </div>
        </Reveal>
      </div>

      <div className="absolute inset-x-0 bottom-6 hidden justify-center md:flex">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/70">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
          <span className="relative h-9 w-px overflow-hidden bg-border/70">
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
