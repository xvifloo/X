"use client";

import * as React from "react";
import Link from "next/link";
import {
  BarChart3,
  Braces,
  Code2,
  Globe,
  Keyboard,
  Languages,
  MonitorSmartphone,
  Sparkles,
} from "lucide-react";

import { XviTypooLogo } from "@/components/brand/xvitypoo-logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal } from "@/components/home/section-shell";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";

type FeatureKey =
  | "bangla"
  | "unijoy"
  | "html"
  | "css"
  | "javascript"
  | "analytics"
  | "browser"
  | "noInstall";

const FEATURE_ICONS: Record<FeatureKey, typeof Languages> = {
  bangla: Languages,
  unijoy: Keyboard,
  html: Code2,
  css: Sparkles,
  javascript: Braces,
  analytics: BarChart3,
  browser: Globe,
  noInstall: MonitorSmartphone,
};

const FEATURE_GROUP: Record<FeatureKey, "typing" | "code" | "platform"> = {
  bangla: "typing",
  unijoy: "typing",
  html: "code",
  css: "code",
  javascript: "code",
  analytics: "platform",
  browser: "platform",
  noInstall: "platform",
};

const TYPOO_URL = "https://typoo.xvifloo.com";

const BANGLA_SAMPLE = "আমি বাংলায় টাইপ করি, প্রতিদিন আরও দ্রুত।";

const CODE_SNIPPETS: Record<"html" | "css" | "javascript", { lines: { text: string; cls: string }[][] }> = {
  html: {
    lines: [
      [{ text: "<section", cls: "text-[var(--accent-blue)]" }, { text: " class=", cls: "text-muted-foreground" }, { text: '"hero"', cls: "text-[var(--brand)]" }, { text: ">", cls: "text-[var(--accent-blue)]" }],
      [{ text: "  <h1>", cls: "text-[var(--accent-blue)]" }, { text: "Build faster", cls: "text-foreground" }, { text: "</h1>", cls: "text-[var(--accent-blue)]" }],
      [{ text: "</section>", cls: "text-[var(--accent-blue)]" }],
    ],
  },
  css: {
    lines: [
      [{ text: ".hero ", cls: "text-[var(--brand)]" }, { text: "{", cls: "text-muted-foreground" }],
      [{ text: "  display: ", cls: "text-[var(--accent-violet)]" }, { text: "grid;", cls: "text-foreground" }],
      [{ text: "  gap: ", cls: "text-[var(--accent-violet)]" }, { text: "2rem;", cls: "text-foreground" }],
      [{ text: "}", cls: "text-muted-foreground" }],
    ],
  },
  javascript: {
    lines: [
      [{ text: "function ", cls: "text-[var(--accent-violet)]" }, { text: "sum", cls: "text-[var(--accent-blue)]" }, { text: "(a, b) {", cls: "text-foreground" }],
      [{ text: "  return ", cls: "text-[var(--accent-violet)]" }, { text: "a + b;", cls: "text-foreground" }],
      [{ text: "}", cls: "text-foreground" }],
    ],
  },
};

function WindowChrome({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-3">
      <span className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-destructive/50" />
        <span className="size-2.5 rounded-full bg-[var(--brand)]/40" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
      </span>
      <span className="ml-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </span>
    </div>
  );
}

function useSessionTimer() {
  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function useLiveStat(base: number, jitter: number, intervalMs = 900) {
  const [val, setVal] = React.useState(base);
  React.useEffect(() => {
    const id = window.setInterval(
      () => setVal(base + Math.floor((Math.random() * 2 - 1) * jitter)),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [base, jitter, intervalMs]);
  return val;
}

function TypingPreview({ feature }: { feature: "bangla" | "unijoy" }) {
  const [typed, setTyped] = React.useState(0);
  const reducedRef = React.useRef(false);
  const wpm = useLiveStat(86, 4);
  const cpm = useLiveStat(432, 14);
  const acc = useLiveStat(98, 1);
  const timer = useSessionTimer();

  React.useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current) {
      setTyped(BANGLA_SAMPLE.length);
      return;
    }

    const id = window.setInterval(() => {
      setTyped((prev) => {
        if (prev >= BANGLA_SAMPLE.length + 14) return 0;
        return prev + 1;
      });
    }, 95);

    return () => window.clearInterval(id);
  }, []);

  const visible = Math.min(typed, BANGLA_SAMPLE.length);

  return (
    <div>
      <WindowChrome title="XviTypoo — Typing Test" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="status-dot" aria-hidden="true" />
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--brand)]">
            Bangla · {feature === "unijoy" ? "Unijoy" : "Avro"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
            {timer}
          </span>
          <span className="badge-status badge-live">Recording</span>
        </div>
      </div>
      <p
        dir="auto"
        className="mt-5 min-h-20 font-heading text-xl leading-relaxed tracking-tight sm:text-2xl"
      >
        <span className="text-foreground">{BANGLA_SAMPLE.slice(0, visible)}</span>
        <span className="caret inline-block h-6 w-[2px] -translate-y-0.5 bg-[var(--brand)] align-middle" />
        <span className="text-muted-foreground/35">{BANGLA_SAMPLE.slice(visible)}</span>
      </p>
      <div className="mt-6 grid grid-cols-4 gap-3 border-t border-border/50 pt-5">
        {[
          { label: "WPM", value: String(wpm), accent: "var(--brand)" },
          { label: "CPM", value: String(cpm), accent: "var(--brand)" },
          { label: "Accuracy", value: `${Math.max(95, acc)}%`, accent: "var(--accent-blue)" },
          { label: "Streak", value: "12d", accent: "var(--accent-violet)" },
        ].map((stat) => (
          <div key={stat.label}>
            <p
              className="font-heading text-xl font-semibold tracking-tight tabular-nums transition-all duration-300"
              style={{ color: stat.accent }}
            >
              {stat.value}
            </p>
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted-foreground/60">
        Illustrative demo session
      </p>
    </div>
  );
}

function CodePreview({ feature }: { feature: "html" | "css" | "javascript" }) {
  const tabs: Array<"html" | "css" | "javascript"> = ["html", "css", "javascript"];

  return (
    <div>
      <WindowChrome title="XviTypoo — Code Mode" />
      <div className="flex gap-1.5">
        {tabs.map((tab) => (
          <span
            key={tab}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] transition-colors duration-300",
              tab === feature
                ? "bg-[var(--brand-muted)] text-[var(--brand)]"
                : "text-muted-foreground",
            )}
          >
            {tab === "javascript" ? "js" : tab}
          </span>
        ))}
      </div>
      <pre className="mt-5 min-h-32 overflow-x-auto rounded-xl bg-[var(--surface-2)] p-4 font-mono text-sm leading-relaxed">
        {CODE_SNIPPETS[feature].lines.map((line, i) => (
          <div key={i}>
            {line.map((seg, j) => (
              <span key={j} className={seg.cls}>
                {seg.text}
              </span>
            ))}
          </div>
        ))}
      </pre>
      <div className="mt-6 flex items-center gap-6 border-t border-border/50 pt-5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
        <span>112 CPM</span>
        <span>0 errors</span>
        <span className="text-[var(--brand)]">Syntax-aware</span>
      </div>
    </div>
  );
}

function PlatformPreview({ feature }: { feature: "analytics" | "browser" | "noInstall" }) {
  return (
    <div>
      <WindowChrome title="XviTypoo — Platform" />
      {feature === "analytics" && (
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--brand)]">
            Progress, visualized
          </p>
          <div className="mt-5 flex h-28 items-end gap-2">
            {[38, 52, 46, 64, 58, 74, 70].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-[var(--brand)] to-[var(--brand)]/40"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-5 flex gap-8 border-t border-border/50 pt-5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            <span>+18% this week</span>
            <span>24 sessions</span>
          </div>
        </div>
      )}

      {feature === "browser" && (
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--brand)]">
            Runs anywhere
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            No extensions, no plugins. XviTypoo runs entirely in the browser tab you already have
            open.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Chrome", "Firefox", "Safari", "Edge"].map((b) => (
              <span
                key={b}
                className="rounded-full border border-border/60 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {feature === "noInstall" && (
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--brand)]">
            Zero install
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border/60 bg-[var(--surface-2)] px-4 py-3">
            <span className="size-2 rounded-full bg-[var(--brand)]" />
            <span className="truncate font-mono text-sm text-muted-foreground">{TYPOO_URL}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Open the link and start typing. There is nothing to download or configure.
          </p>
        </div>
      )}
    </div>
  );
}

function TypooPreviewPanel({ feature }: { feature: FeatureKey }) {
  const group = FEATURE_GROUP[feature];

  return (
    <div className="glass-panel relative overflow-hidden rounded-[1.5rem] p-6 md:p-7">
      {group === "typing" && <TypingPreview feature={feature as "bangla" | "unijoy"} />}
      {group === "code" && <CodePreview feature={feature as "html" | "css" | "javascript"} />}
      {group === "platform" && (
        <PlatformPreview feature={feature as "analytics" | "browser" | "noInstall"} />
      )}
    </div>
  );
}

export function XviTypooShowcase() {
  const { dict } = useI18n();
  const section = dict.home.typoo;
  const features = section.features;
  const [hovered, setHovered] = React.useState<FeatureKey | null>(null);
  const activeFeature: FeatureKey = hovered ?? "bangla";

  const handleLaunch = () => {
    trackEvent({
      eventName: "xvitypoo_launch_click",
      props: { destination: TYPOO_URL, source: "homepage_showcase" },
    });
  };

  return (
    <section id="xvitypoo" className="section-pad scroll-mt-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-br from-[var(--brand-muted)] via-background to-background p-8 md:p-14 lg:p-16">
          <div
            className="glow-orb pointer-events-none absolute -right-20 -top-20 size-72 opacity-60"
            aria-hidden="true"
          />

          <div className="relative grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div className="space-y-10">
              <Reveal>
                <div className="space-y-8">
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2 className="text-display-sm max-w-xl">{section.heading}</h2>
                  <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                    {section.subheading}
                  </p>

                  <div className="flex items-center gap-5">
                    <XviTypooLogo size="md" />
                    <div>
                      <p className="text-xl font-semibold tracking-tight">
                        <span>Xvi</span>
                        <span className="text-[var(--brand)]">Typoo</span>
                      </p>
                      <span className="badge-status badge-live mt-2">Live</span>
                    </div>
                  </div>

                  <Button asChild size="lg" className="h-12 rounded-full px-8">
                    <Link
                      href={TYPOO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLaunch}
                    >
                      {section.cta}
                    </Link>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(features) as FeatureKey[]).map((key, i) => {
                    const Icon = FEATURE_ICONS[key];
                    const isHovered = activeFeature === key;

                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onMouseEnter={() => setHovered(key)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(key)}
                          onBlur={() => setHovered(null)}
                          className={cn(
                            "hover-lift group flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-background/60 p-4 text-left backdrop-blur-sm",
                            isHovered && "border-[var(--brand)]/40 shadow-[0_8px_32px_var(--brand-glow)]",
                          )}
                          style={{ transitionDelay: `${i * 30}ms` }}
                        >
                          <span
                            className={cn(
                              "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-500",
                              isHovered
                                ? "bg-[var(--brand)] text-white"
                                : "bg-[var(--brand-muted)] text-[var(--brand)]",
                            )}
                          >
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <span className="text-sm font-medium">{features[key]}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={160} className="lg:sticky lg:top-28">
              <TypooPreviewPanel feature={activeFeature} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
