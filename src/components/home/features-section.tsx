"use client";

import {
  Bot,
  Braces,
  Gauge,
  Globe,
  Layers,
  Lock,
  Shield,
  Workflow,
  Zap,
} from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal, SectionShell } from "@/components/home/section-shell";

const FEATURE_CONFIG = [
  {
    key: "innovation",
    Icon: Layers,
    accent: "var(--brand)",
    muted: "var(--brand-muted)",
    glow: "var(--brand-glow)",
    stat: "3",
    statLabel: "Products",
    tags: ["Platform", "Shared infra"],
  },
  {
    key: "productivity",
    Icon: Zap,
    accent: "var(--accent-blue)",
    muted: "var(--accent-blue-muted)",
    glow: "var(--accent-blue-glow)",
    stat: "∞",
    statLabel: "Possibilities",
    tags: ["Speed", "No friction"],
  },
  {
    key: "automation",
    Icon: Workflow,
    accent: "var(--accent-violet)",
    muted: "var(--accent-violet-muted)",
    glow: "var(--accent-violet-glow)",
    stat: "24/7",
    statLabel: "Operations",
    tags: ["Pipelines", "Cross-product"],
  },
  {
    key: "ai",
    Icon: Bot,
    accent: "var(--accent-violet)",
    muted: "var(--accent-violet-muted)",
    glow: "var(--accent-violet-glow)",
    stat: "Kleava",
    statLabel: "AI layer",
    tags: ["LLM", "Memory", "Context"],
  },
  {
    key: "privacy",
    Icon: Shield,
    accent: "var(--brand)",
    muted: "var(--brand-muted)",
    glow: "var(--brand-glow)",
    stat: "Zero",
    statLabel: "Data sales",
    tags: ["First-party", "GDPR ready"],
  },
  {
    key: "performance",
    Icon: Gauge,
    accent: "var(--accent-blue)",
    muted: "var(--accent-blue-muted)",
    glow: "var(--accent-blue-glow)",
    stat: "99.9%",
    statLabel: "Target SLA",
    tags: ["Edge CDN", "Sub-15ms"],
  },
] as const;

const CAPABILITY_STRIPS = [
  { Icon: Lock, label: "OAuth 2 / OpenID" },
  { Icon: Globe, label: "Global edge delivery" },
  { Icon: Braces, label: "REST + SDK APIs" },
  { Icon: Shield, label: "First-party analytics" },
  { Icon: Layers, label: "Unified design system" },
  { Icon: Bot, label: "AI integration layer" },
] as const;

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
      {/* Enterprise capability strip */}
      <Reveal>
        <div className="glass-panel mb-10 overflow-hidden rounded-2xl px-6 py-5">
          <p className="mb-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#778B88]">
            Platform capabilities
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CAPABILITY_STRIPS.map(({ Icon, label }) => (
              <div
                key={label}
                className="group flex items-center gap-2.5 rounded-xl border border-border/50 bg-[var(--surface-2)] px-3 py-2.5 transition-all duration-300 hover:border-[var(--brand)]/30 hover:bg-[var(--brand-muted)]"
              >
                <Icon
                  className="size-3.5 shrink-0 text-[var(--brand)] transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-[#778B88] group-hover:text-[#444444] transition-colors">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {keys.map((key, index) => {
          const item = items[key];
          const config = FEATURE_CONFIG[index];
          if (!config) return null;
          const { Icon } = config;

          return (
            <Reveal key={key} delay={index * 55}>
              <article
                className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-[var(--surface-1)] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-current hover:shadow-[var(--shadow-card-hover)]"
                style={
                  {
                    "--hover-border": `${config.accent}40`,
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${config.accent}40`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px -16px ${config.glow}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                {/* Background glow */}
                <div
                  className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
                    filter: "blur(16px)",
                  }}
                  aria-hidden="true"
                />

                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <span
                      className="flex size-11 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110"
                      style={{ backgroundColor: config.muted }}
                    >
                      <Icon
                        className="size-5 transition-colors duration-300"
                        style={{ color: config.accent }}
                        aria-hidden="true"
                      />
                    </span>
                    <div className="text-right">
                      <p
                        className="font-mono text-lg font-bold leading-none tabular-nums"
                        style={{ color: config.accent }}
                      >
                        {config.stat}
                      </p>
                      <p className="mt-0.5 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-[#778B88]">
                        {config.statLabel}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading text-base font-semibold tracking-tight transition-colors duration-300 group-hover:text-[#444444]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#778B88]">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {config.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] transition-all duration-300"
                        style={{
                          borderColor: `${config.accent}20`,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom accent line on hover */}
                  <div
                    className="h-px w-0 transition-all duration-500 group-hover:w-full"
                    style={{
                      background: `linear-gradient(90deg, ${config.accent}, transparent)`,
                    }}
                    aria-hidden="true"
                  />
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* ── Get In Touch ─────────────────────────────────────────────── */}
      <Reveal delay={200}>
        <div className="mt-16 overflow-hidden rounded-[2rem] border border-border/40 md:mt-20">
          <div
            className="relative px-8 py-12 md:px-14 md:py-16"
            style={{
              background: "linear-gradient(135deg, var(--brand-muted) 0%, var(--background) 50%, var(--accent-violet-muted) 100%)",
            }}
          >
            {/* Decorative orbs */}
            <div className="glow-orb pointer-events-none absolute -right-16 -top-10 size-56 opacity-40" aria-hidden="true" />
            <div className="glow-orb-violet pointer-events-none absolute -bottom-10 -left-12 size-40 opacity-25" aria-hidden="true" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <p className="eyebrow">
                  <span className="status-dot" aria-hidden="true" />
                  Get In Touch
                </p>
                <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                  <span className="text-[#444444]">Have a question or </span>
                  <span className="hero-gradient-text">partnership idea?</span>
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-[#778B88]">
                  We&apos;re always glad to hear from builders, partners, and curious minds exploring the XviFloo ecosystem.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href="/contact"
                    className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-[var(--brand)] px-6 text-sm font-semibold text-white transition-all duration-500 hover:shadow-[0_0_28px_-4px_var(--brand-glow-strong)]"
                  >
                    <span className="pointer-events-none absolute inset-0 translate-x-[-100%] skew-x-[-16deg] bg-white/15 transition-transform duration-700 group-hover:translate-x-[120%]" aria-hidden="true" />
                    <span className="relative">Send a message</span>
                  </a>
                  <a
                    href="mailto:contact@xvifloo.com"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-border/60 px-6 text-sm font-medium text-[#444444]/75 transition-all duration-300 hover:border-[var(--brand)]/40 hover:bg-[var(--brand-muted)] hover:text-[var(--brand)]"
                  >
                    contact@xvifloo.com
                  </a>
                </div>
              </div>

              {/* Stats mini-grid */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4">
                {[
                  { label: "Products", value: "3", sub: "in ecosystem" },
                  { label: "Response time", value: "&lt;24h", sub: "business days" },
                ].map((item) => (
                  <div key={item.label}
                    className="rounded-2xl border border-border/40 bg-background/50 px-5 py-4 backdrop-blur-sm">
                    <p className="font-heading text-2xl font-bold text-[var(--brand)]"
                      dangerouslySetInnerHTML={{ __html: item.value }} />
                    <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[#778B88]">{item.label}</p>
                    <p className="font-mono text-[0.55rem] text-[#778B88]/60">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
