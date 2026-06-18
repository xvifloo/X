"use client";

import {
  Bot,
  Gauge,
  Lightbulb,
  Shield,
  Workflow,
  Zap,
} from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal, SectionShell } from "@/components/home/section-shell";

const FEATURE_ICONS = {
  innovation: Lightbulb,
  productivity: Zap,
  automation: Workflow,
  ai: Bot,
  privacy: Shield,
  performance: Gauge,
} as const;

export function FeaturesSection() {
  const { dict } = useI18n();
  const section = dict.home.features;
  const items = section.items;
  const keys = Object.keys(items) as Array<keyof typeof items>;

  return (
    <SectionShell
      id="features"
      eyebrow={section.eyebrow}
      heading={section.heading}
      subheading={section.subheading}
      align="center"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {keys.map((key, index) => {
          const item = items[key];
          const Icon = FEATURE_ICONS[key];

          return (
            <Reveal key={key} delay={index * 60}>
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
    </SectionShell>
  );
}
