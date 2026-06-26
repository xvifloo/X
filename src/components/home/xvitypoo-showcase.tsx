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

type TypingMode = {
  id: string;
  label: string;
  lang: string;
  sample: string;
  dir: "ltr" | "rtl" | "auto";
  wpmBase: number;
  cpmBase: number;
};

const TYPING_MODES: TypingMode[] = [
  { id: "bangla",  label: "বাংলা",  lang: "Bangla · Avro",   sample: "আমি বাংলায় টাইপ করি, প্রতিদিন আরও দ্রুত হচ্ছি।",              dir: "auto", wpmBase: 38, cpmBase: 190 },
  { id: "unijoy",  label: "ইউনিজয়",lang: "Bangla · Unijoy", sample: "বাংলা ভাষায় দ্রুত টাইপিং একটি দক্ষতা যা অনুশীলনে আসে।",        dir: "auto", wpmBase: 42, cpmBase: 210 },
  { id: "english", label: "English",lang: "English",          sample: "Precision typing, measured in real time, every keystroke counts.", dir: "ltr",  wpmBase: 68, cpmBase: 340 },
  { id: "code",    label: "Code",   lang: "JavaScript",       sample: "const sum = (a, b) => a + b; // fast fingers, clean code.",        dir: "ltr",  wpmBase: 34, cpmBase: 170 },
  { id: "digits",  label: "1234",   lang: "Digits",           sample: "3.14159  2718  1024  9801  42  6.02e23  299792458  1337",          dir: "ltr",  wpmBase: 55, cpmBase: 275 },
  { id: "symbols", label: "!@#",    lang: "Symbols",          sample: "!@#$%^&*()_+-=[]{}|;':\\\",./<>? — all tested, all counted.",      dir: "ltr",  wpmBase: 28, cpmBase: 140 },
];

const CYCLES_PER_MODE = 5;

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
    <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
      <span className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-destructive/50" />
        <span className="size-2.5 rounded-full bg-[var(--brand)]/40" />
        <span className="size-2.5 rounded-full bg-white/15" />
      </span>
      <span className="ml-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--brand)]/70">
        {title}
      </span>
    </div>
  );
}

/* ── Topology overlay for the showcase box ─────────────────────── */
function ShowcaseTopology() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="sc-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgba(23,183,155,0.12)" />
          </pattern>
          <pattern id="sc-topo" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M0,32 Q16,16 32,32 Q48,48 64,32" stroke="rgba(23,183,155,0.07)" strokeWidth="0.6" fill="none" />
            <path d="M32,0 Q48,16 32,32 Q16,48 32,64" stroke="rgba(23,183,155,0.05)" strokeWidth="0.4" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sc-dots)" />
        <rect width="100%" height="100%" fill="url(#sc-topo)" />
      </svg>
    </div>
  );
}

/* ── Foldable feature card ─────────────────────────────────────── */
function FoldCard({
  featureKey,
  label,
  Icon,
  isActive,
  onEnter,
  onLeave,
  index,
  visible,
}: {
  featureKey: FeatureKey;
  label: string;
  Icon: typeof Languages;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className="overflow-hidden transition-all duration-500 ease-out"
      style={{
        maxHeight: visible ? "60px" : "0px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transitionDelay: visible ? `${index * 40}ms` : `${(8 - index) * 20}ms`,
      }}
    >
      <button
        type="button"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className={cn(
          "hover-lift flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-left backdrop-blur-sm transition-all duration-300 mb-1.5",
          isActive
            ? "border-[var(--brand)]/50 bg-[var(--brand)]/10"
            : "bg-white/5 hover:bg-white/8",
        )}
      >
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
            isActive ? "bg-[var(--brand)] text-white" : "bg-white/10 text-[var(--brand)]",
          )}
        >
          <Icon className="size-3" aria-hidden="true" />
        </span>
        <span className="truncate text-xs font-medium text-white/80">{label}</span>
      </button>
    </div>
  );
}

/* ── Typing preview ────────────────────────────────────────────── */
function TypingCyclePreview() {
  const [modeIdx, setModeIdx]     = React.useState(0);
  const [typed, setTyped]         = React.useState(0);
  const [cycleCount, setCycleCount] = React.useState(0);

  const mode    = TYPING_MODES[modeIdx];
  const wpm     = useLiveStat(mode.wpmBase, 3, 950);
  const cpm     = useLiveStat(mode.cpmBase, 10, 950);
  const acc     = useLiveStat(97, 1, 1200);
  const netWpm  = Math.max(0, wpm - Math.floor(Math.random() * 3));
  const timer   = useSessionTimer();

  React.useEffect(() => {
    if (cycleCount >= CYCLES_PER_MODE) {
      setModeIdx((prev) => (prev + 1) % TYPING_MODES.length);
      setTyped(0);
      setCycleCount(0);
    }
  }, [cycleCount]);

  React.useEffect(() => {
    setTyped(0);
    setCycleCount(0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setTyped(mode.sample.length); return; }
    const id = window.setInterval(() => {
      setTyped((prev) => {
        if (prev >= mode.sample.length) { setCycleCount((c) => c + 1); return 0; }
        return prev + 1;
      });
    }, 85);
    return () => window.clearInterval(id);
  }, [modeIdx, mode.sample.length]);

  const visible = Math.min(typed, mode.sample.length);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl">
      <span className="scan-line" aria-hidden="true" />
      <WindowChrome title="XviTypoo — Live Session" />

      {/* Mode tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {TYPING_MODES.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => { setModeIdx(i); setTyped(0); setCycleCount(0); }}
            className={cn(
              "rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] transition-all duration-300",
              i === modeIdx
                ? "bg-[var(--brand)] text-white shadow-[0_0_12px_var(--brand-glow)]"
                : "bg-white/8 text-white/50 hover:text-white/80",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="status-dot" aria-hidden="true" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--brand)]">
            {mode.lang}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-white/40">{timer}</span>
          <span className="badge-status badge-live">● REC</span>
        </div>
      </div>

      {/* Typing text */}
      <p
        dir={mode.dir}
        className="mt-4 h-20 overflow-hidden font-heading text-base leading-relaxed tracking-tight sm:text-lg"
      >
        <span className="text-white/90">{mode.sample.slice(0, visible)}</span>
        <span className="caret inline-block h-4 w-[2px] -translate-y-0.5 bg-[var(--brand)] align-middle" />
        <span className="text-white/20">{mode.sample.slice(visible)}</span>
      </p>

      {/* Cycle dots */}
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: CYCLES_PER_MODE }, (_, i) => (
          <span
            key={i}
            className="size-1.5 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i < cycleCount ? "var(--brand)" : "rgba(255,255,255,0.15)" }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/10 pt-4">
        {[
          { label: "WPM",      value: String(wpm),              accent: "var(--brand)" },
          { label: "Net WPM",  value: String(netWpm),           accent: "var(--accent-blue)" },
          { label: "CPM",      value: String(cpm),              accent: "var(--accent-violet)" },
          { label: "Accuracy", value: `${Math.max(94, acc)}%`,  accent: "var(--brand)" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="font-heading text-base font-semibold tabular-nums sm:text-lg"
              style={{ color: stat.accent }}>
              {stat.value}
            </p>
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.1em] text-white/40">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main export ───────────────────────────────────────────────── */
export function XviTypooShowcase() {
  const { dict } = useI18n();
  const section  = dict.home.typoo;
  const features = section.features;
  const [hovered, setHovered]   = React.useState<FeatureKey | null>(null);
  const [cardsVisible, setCardsVisible] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const activeFeature: FeatureKey = hovered ?? "bangla";

  /* fold cards in on scroll */
  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => setCardsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const handleLaunch = () => {
    void trackEvent({
      eventName: "xvitypoo_launch_click",
      props: { destination: TYPOO_URL, source: "homepage_showcase" },
    });
  };

  return (
    <section id="xvitypoo" className="scroll-mt-20 py-20 md:py-28">
      {/* Full width, only 0.4rem gap on sides */}
      <div className="px-[0.4rem] sm:px-2 md:px-3">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[oklch(0.04_0.014_252)] via-[oklch(0.055_0.018_252)] to-[oklch(0.04_0.012_252)] px-6 py-10 md:px-10 lg:px-12">
          <ShowcaseTopology />

          {/* Brand glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, var(--brand-glow) 0%, transparent 70%)", filter: "blur(40px)" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-12 size-56 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, var(--accent-violet-glow) 0%, transparent 70%)", filter: "blur(40px)" }}
            aria-hidden="true"
          />

          <div className="relative z-[1] grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            {/* Left col */}
            <div className="space-y-8">
              <Reveal>
                <div className="space-y-5">
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2 className="text-display-sm max-w-lg text-white">
                    XviTypoo —&nbsp;
                    <span className="section-gradient-text">precision typing,</span>
                    {" "}reimagined
                  </h2>
                  <p className="max-w-md text-base leading-relaxed text-white/60">
                    {section.subheading}
                  </p>

                  <div className="flex items-center gap-4">
                    <XviTypooLogo size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge-status badge-live">Live</span>
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-white/40">
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

              {/* Foldable feature cards */}
              <div ref={containerRef}>
                <div className="grid grid-cols-2 gap-0 lg:grid-cols-3">
                  {(Object.keys(features) as FeatureKey[]).map((key, i) => {
                    const Icon = FEATURE_ICONS[key];
                    return (
                      <FoldCard
                        key={key}
                        featureKey={key}
                        label={features[key]}
                        Icon={Icon}
                        isActive={activeFeature === key}
                        onEnter={() => setHovered(key)}
                        onLeave={() => setHovered(null)}
                        index={i}
                        visible={cardsVisible}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right col — typing demo */}
            <Reveal delay={140} className="lg:sticky lg:top-28">
              <TypingCyclePreview />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
