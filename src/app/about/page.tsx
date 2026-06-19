"use client";

import Link from "next/link";
import { ArrowRight, Layers, Lightbulb, Telescope, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal } from "@/components/home/section-shell";
import { SiteShell } from "@/components/site/site-shell";

const PRINCIPLE_ICONS = {
  shared: Layers,
  craft: Lightbulb,
  transparent: Telescope,
  longTerm: Timer,
} as const;

export default function AboutPage() {
  const { dict } = useI18n();
  const section = dict.about;
  const principleKeys = Object.keys(section.principles) as Array<keyof typeof section.principles>;

  return (
    <SiteShell>
      <section className="section-pad relative overflow-hidden">
        <div
          className="grid-overlay pointer-events-none absolute inset-0 opacity-50"
          style={{
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, black 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-4xl text-center">
          <Reveal>
            <p className="eyebrow mx-auto justify-center">{section.eyebrow}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-display-sm mx-auto mt-5 max-w-3xl">{section.heading}</h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {section.subheading}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <div className="glass-panel rounded-[1.75rem] p-8 md:p-12">
              <p className="eyebrow-blue">{section.mission.title}</p>
              <p className="mt-4 max-w-3xl text-xl leading-relaxed tracking-tight md:text-2xl">
                {section.mission.body}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <p className="eyebrow">{section.principlesEyebrow}</p>
              <h2 className="text-display-sm mt-4">{section.principlesHeading}</h2>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {principleKeys.map((key, index) => {
              const item = section.principles[key];
              const Icon = PRINCIPLE_ICONS[key];
              return (
                <Reveal key={key} delay={index * 70}>
                  <article className="card-elevated group h-full p-7">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--brand-muted)] transition-colors duration-500 group-hover:bg-[var(--brand)]">
                      <Icon
                        className="size-5 text-[var(--brand)] transition-colors duration-500 group-hover:text-white"
                        aria-hidden="true"
                      />
                    </span>
                    <h3 className="mt-6 font-heading text-lg font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto w-full max-w-4xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-border/50 bg-gradient-to-br from-[var(--brand-muted)] via-background to-background p-10 text-center md:p-14">
              <div
                className="glow-orb pointer-events-none absolute -right-16 -top-16 size-64 opacity-50"
                aria-hidden="true"
              />
              <h2 className="text-display-sm relative mx-auto max-w-xl">{section.ctaHeading}</h2>
              <p className="relative mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                {section.ctaBody}
              </p>
              <Button asChild size="lg" className="relative mt-8 h-12 rounded-full px-7">
                <Link href="/contact">
                  {section.ctaButton}
                  <ArrowRight data-icon="inline-end" className="transition-transform duration-300 group-hover/button:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
