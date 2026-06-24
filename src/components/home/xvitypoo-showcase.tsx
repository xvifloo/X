"use client";

import * as React from "react";
import Link from "next/link";
import {
  BarChart3, Braces, Code2, Globe, Hash,
  Keyboard, Languages, MonitorSmartphone, Type,
} from "lucide-react";

import { XviTypooLogo } from "@/components/brand/xvitypoo-logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal } from "@/components/home/section-shell";
import { trackEvent } from "@/lib/analytics/track-event";
import { cn } from "@/lib/utils";

type FeatureKey =
  | "bangla" | "unijoy" | "english"
  | "html" | "css" | "javascript"
  | "analytics" | "browser" | "noInstall";

const FEATURE_ICONS: Record<FeatureKey, typeof Languages> = {
  bangla: Languages, unijoy: Keyboard, english: Type,
  html: Code2, css: Braces, javascript: Hash,
  analytics: BarChart3, browser: Globe, noInstall: MonitorSmartphone,
};

const TYPOO_URL = "https://typoo.xvifloo.com";

// ── Typing mode data ──────────────────────────────────────────────────────────
type TypingMode = {
  id: string;
  label: string;
  lang: string;
  sample: string;
  dir: "ltr" | "rtl" | "auto";
  wpmBase: number;   // realistic WPM for this mode
  cpmBase: number;
};

const TYPING_MODES: TypingMode[] = [
  {
    id: "bangla",
    label: "বাংলা",
    lang: "Bangla · Avro",
    sample: "আমি বাংলায় টাইপ করি, প্রতিদিন আরও দ্রুত হচ্ছি।",
    dir: "auto",
    wpmBase: 38,
    cpmBase: 190,
  },
  {
    id: "unijoy",
    label: "ইউনিজয়",
    lang: "Bangla · Unijoy",
    sample: "বাংলা ভাষায় দ্রুত টাইপিং একটি দক্ষতা যা অনুশীলনে আসে।",
    dir: "auto",
    wpmBase: 42,
    cpmBase: 210,
  },
  {
    id: "english",
    label: "English",
    lang: "English",
    sample: "Precision typing, measured in real time, every single keystroke counts.",
    dir: "ltr",
    wpmBase: 68,
    cpmBase: 340,
  },
  {
    id: "code",
    label: "Code",
    lang: "JavaScript",
    sample: "const sum = (a, b) => a + b; // fast fingers, clean code.",
    dir: "ltr",
    wpmBase: 34,
    cpmBase: 170,
  },
  {
    id: "digits",
    label: "1234",
    lang: "Digits",
    sample: "3.14159  2718  1024  9801  42  6.02e23  299792458  1337",
    dir: "ltr",
    wpmBase: 55,
    cpmBase: 275,
  },
  {
    id: "symbols",
    label: "!@#",
    lang: "Symbols",
    sample: "!@#$%^&*()_+-=[]{}|;':\",./<>? — all tested, all counted.",
    dir: "ltr",
    wpmBase: 28,
    cpmBase: 140,
  },
];

const CYCLES_PER_MODE = 5; // complete sample cycles before auto-advancing

// ── Helpers ───────────────────────────────────────────────────────────────────
function useSessionTimer() {
  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  return `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
}

function useLiveStat(base: number, jitter: number, ms = 950) {
  const [val, setVal] = React.useState(base);
  React.useEffect(() => {
    const id = window.setInterval(
      () => setVal(base + Math.floor((Math.random() * 2 - 1) * jitter)),
      ms,
    );
    return () => window.clearInterval(id);
  }, [base, jitter, ms]);
  return val;
}

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

// ── Main cycling preview ──────────────────────────────────────────────────────
function TypingCyclePreview() {
  const [modeIdx, setModeIdx] = React.useState(0);
  const [typed, setTyped] = React.useState(0);
  const [cycleCount, setCycleCount] = React.useState(0);
  const reducedMotion = React.useRef(false);

  const mode = TYPING_MODES[modeIdx];
  const wpm  = useLiveStat(mode.wpmBase, 3, 950);
  const cpm  = useLiveStat(mode.cpmBase, 10, 950);
  const acc  = useLiveStat(97, 1, 1200);
  const netWpm = Math.max(0, wpm - Math.floor(Math.random() * 3)); // net = gross – errors
  const timer = useSessionTimer();

  // Advance mode after CYCLES_PER_MODE completions
  React.useEffect(() => {
    if (cycleCount >= CYCLES_PER_MODE) {
      setModeIdx((prev) => (prev + 1) % TYPING_MODES.length);
      setTyped(0);
      setCycleCount(0);
    }
  }, [cycleCount]);

  React.useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTyped(0);
    setCycleCount(0);
    if (reducedMotion.current) { setTyped(mode.sample.length); return; }

    const id = window.setInterval(() => {
      setTyped((prev) => {
        if (prev >= mode.sample.length) {
          setCycleCount((c) => c + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 85);
    return () => window.clearInterval(id);
  }, [modeIdx, mode.sample.length]);

  const visible = Math.min(typed, mode.sample.length);

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-border/40 bg-[var(--surface-glass)] p-6 backdrop-blur-2xl md:p-8">
      <span className="scan-line" aria-hidden="true" />
      <WindowChrome title="XviTypoo — Live Session" />

      {/* Mode tabs */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {TYPING_MODES.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => { setModeIdx(i); setTyped(0); setCycleCount(0); }}
            className={cn(
              "rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] transition-all duration-300",
              i === modeIdx
                ? "bg-[var(--brand)] text-white shadow-[0_0_12px_var(--brand-glow)]"
                : "bg-[var(--surface-2)] text-muted-foreground hover:text-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="status-dot" aria-hidden="true" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--brand)]">
            {mode.lang}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted-foreground">
            {timer}
          </span>
          <span className="badge-status badge-live">● REC</span>
        </div>
      </div>

      {/* Typing text */}
      <p
        dir={mode.dir}
        className="mt-5 min-h-[5rem] font-heading text-lg leading-relaxed tracking-tight sm:text-xl"
      >
        <span className="text-foreground">{mode.sample.slice(0, visible)}</span>
        <span className="caret inline-block h-5 w-[2px] -translate-y-0.5 bg-[var(--brand)] align-middle" />
        <span className="text-muted-foreground/30">{mode.sample.slice(visible)}</span>
      </p>

      {/* Cycle dots */}
      <div className="mt-3 flex items-center gap-1">
        {Array.from({ length: CYCLES_PER_MODE }, (_, i) => (
          <span
            key={i}
            className="size-1.5 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i < cycleCount ? "var(--brand)" : "var(--border)" }}
            aria-hidden="true"
          />
        ))}
        <span className="ml-1.5 font-mono text-[0.55rem] text-muted-foreground/70">
          {cycleCount}/{CYCLES_PER_MODE}
        </span>
      </div>

      {/* Stats — 4 metrics */}
      <div className="mt-5 grid grid-cols-4 gap-2 border-t border-border/40 pt-4">
        {[
          { label: "WPM",      value: String(wpm),          accent: "var(--brand)" },
          { label: "Net WPM",  value: String(netWpm),       accent: "var(--accent-blue)" },
          { label: "CPM",      value: String(cpm),          accent: "var(--accent-violet)" },
          { label: "Accuracy", value: `${Math.max(94, acc)}%`, accent: "var(--brand)" },
        ].map((stat) => (
          <div key={stat.label}>
            <p
              className="font-heading text-base font-semibold tabular-nums transition-all duration-300 sm:text-lg"
              style={{ color: stat.accent }}
            >
              {stat.value}
            </p>
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.1em] text-muted-foreground sm:text-[0.55rem]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-[0.52rem] uppercase tracking-[0.12em] text-muted-foreground/50">
        Illustrative demo · auto-cycles every {CYCLES_PER_MODE} passes
      </p>
    </div>
  );
}

// ── Showcase ──────────────────────────────────────────────────────────────────
export function XviTypooShowcase() {
  const { dict } = useI18n();
  const section = dict.home.typoo;
  const features = section.features;
  const [hovered, setHovered] = React.useState<FeatureKey | null>(null);
  const activeFeature: FeatureKey = hovered ?? "bangla";

  const handleLaunch = () => {
    void trackEvent({
      eventName: "xvitypoo_launch_click",
      props: { destination: TYPOO_URL, source: "homepage_showcase" },
    });
  };

  return (
    <section id="xvitypoo" className="section-pad scroll-mt-20">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-br from-[var(--brand-muted)] via-background to-[var(--accent-violet-muted)] p-6 md:p-10 lg:p-12">
          <div
            className="glow-orb pointer-events-none absolute -right-20 -top-20 size-72 opacity-50"
            aria-hidden="true"
          />
          <div
            className="glow-orb-violet pointer-events-none absolute -bottom-12 -left-12 size-56 opacity-30"
            aria-hidden="true"
          />

          <div className="relative grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            {/* Left col */}
            <div className="space-y-8">
              <Reveal>
                <div className="space-y-6">
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2 className="text-display-sm max-w-lg">
                    <span className="text-foreground">XviTypoo —&nbsp;</span>
                    <span className="section-gradient-text">precision typing,</span>
                    <span className="text-foreground"> reimagined</span>
                  </h2>
                  <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                    {section.subheading}
                  </p>

                  {/* Logo + badge */}
                  <div className="flex items-center gap-4">
                    <XviTypooLogo size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge-status badge-live">Live</span>
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">
                          production
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button asChild size="lg" className="h-12 rounded-full px-8">
                    <Link href={TYPOO_URL} target="_blank" rel="noopener noreferrer" onClick={handleLaunch}>
                      {section.cta}
                    </Link>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                  {(Object.keys(features) as FeatureKey[]).map((key, i) => {
                    const Icon = FEATURE_ICONS[key];
                    const isActive = activeFeature === key;
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onMouseEnter={() => setHovered(key)}
                          onMouseLeave={() => setHovered(null)}
                          className={cn(
                            "hover-lift flex w-full items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-3 py-2.5 text-left backdrop-blur-sm transition-all duration-300",
                            isActive && "border-[var(--brand)]/40 bg-[var(--brand-muted)]",
                          )}
                          style={{ transitionDelay: `${i * 25}ms` }}
                        >
                          <span className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
                            isActive ? "bg-[var(--brand)] text-white" : "bg-[var(--brand-muted)] text-[var(--brand)]",
                          )}>
                            <Icon className="size-3" aria-hidden="true" />
                          </span>
                          <span className="truncate text-xs font-medium">{features[key]}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            </div>

            {/* Right col — always shows the cycling demo */}
            <Reveal delay={140} className="lg:sticky lg:top-28">
              <TypingCyclePreview />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
