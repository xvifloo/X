"use client";

import { Bot, Boxes, Brain, Store } from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal, SectionShell } from "@/components/home/section-shell";
import { cn } from "@/lib/utils";

const VISION_ICONS = {
  xvifloo: Boxes,
  xviGet: Brain,
  kleava: Bot,
  commerce: Store,
} as const;

const VISION_STYLE = {
  xvifloo: {
    iconColor: "text-[var(--brand)]",
    chipBg: "bg-[var(--brand-muted)]",
    hoverBg: "hover:bg-[var(--brand-muted)]",
  },
  xviGet: {
    iconColor: "text-[var(--accent-blue)]",
    chipBg: "bg-[var(--accent-blue-muted)]",
    hoverBg: "hover:bg-[var(--accent-blue-muted)]",
  },
  kleava: {
    iconColor: "text-[var(--accent-violet)]",
    chipBg: "bg-[var(--accent-violet-muted)]",
    hoverBg: "hover:bg-[var(--accent-violet-muted)]",
  },
  commerce: {
    iconColor: "text-[var(--brand)]",
    chipBg: "bg-[var(--brand-muted)]",
    hoverBg: "hover:bg-[var(--brand-muted)]",
  },
} as const;

export function VisionSection() {
  const { dict } = useI18n();
  const section = dict.home.vision;
  const items = section.items;
  const keys = Object.keys(items) as Array<keyof typeof items>;

  return (
    <SectionShell
      id="vision"
      eyebrow={section.eyebrow}
      heading={section.heading}
      subheading={section.subheading}
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/50 md:grid-cols-2">
        {keys.map((key, index) => {
          const item = items[key];
          const Icon = VISION_ICONS[key];
          const style = VISION_STYLE[key];

          return (
            <Reveal key={key} delay={index * 80}>
              <article
                className={cn(
                  "group h-full bg-background p-8 transition-colors duration-500 md:p-10",
                  style.hoverBg,
                )}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl transition-colors duration-500",
                      style.chipBg,
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 transition-transform duration-500 group-hover:scale-110",
                        style.iconColor,
                      )}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
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
