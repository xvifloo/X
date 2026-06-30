"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3, Braces, Code2, Globe, Hash,
  Keyboard, Languages, MonitorSmartphone, Type,
} from "lucide-react";

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
  { id: "bangla",  label: "বাংলা",   lang: "Bangla · Avro",   sample: "আমি বাংলায় টাইপ করি, প্রতিদিন আরও দ্রুত হচ্ছি।",              dir: "auto", wpmBase: 38, cpmBase: 190 },
  { id: "unijoy",  label: "ইউনিজয়", lang: "Bangla · Unijoy", sample: "বাংলা ভাষায় দ্রুত টাইপিং একটি দক্ষতা যা অনুশীলনে আসে।",        dir: "auto", wpmBase: 42, cpmBase: 210 },
  { id: "english", label: "English", lang: "English",          sample: "Precision typing, measured in real time, every keystroke counts.", dir: "ltr",  wpmBase: 68, cpmBase: 340 },
  { id: "code",    label: "Code",    lang: "JavaScript",       sample: "const sum = (a, b) => a + b; // fast fingers, clean code.",        dir: "ltr",  wpmBase: 34, cpmBase: 170 },
];

const CYCLES_PER_MODE = 4;

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
    const id = window.setInterval(() => setVal(base + Math.floor((Math.random() * 2 - 1) * jitter)), ms);
    return () => window.clearInterval(id);
  }, [base, jitter, ms]);
  return val;
}

function TypingPreview() {
  const [modeIdx, setModeIdx]     = React.useState(0);
  const [typed, setTyped]         = React.useState(0);
  const [cycleCount, setCycleCount] = React.useState(0);

  const mode   = TYPING_MODES[modeIdx];
  const wpm    = useLiveStat(mode.wpmBase, 3, 950);
  const cpm    = useLiveStat(mode.cpmBase, 10, 950);
  const acc    = useLiveStat(97, 1, 1200);
  const netWpm = Math.max(0, wpm - Math.floor(Math.random() * 3));
  const timer  = useSessionTimer();

  React.useEffect(() => {
    if (cycleCount >= CYCLES_PER_MODE) {
      setModeIdx((p) => (p + 1) % TYPING_MODES.length);
      setTyped(0); setCycleCount(0);
    }
  }, [cycleCount]);

  React.useEffect(() => {
    setTyped(0); setCycleCount(0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setTyped(mode.sample.length); return; }
    const id = window.setInterval(() => {
      setTyped((p) => {
        if (p >= mode.sample.length) { setCycleCount((c) => c + 1); return 0; }
        return p + 1;
      });
    }, 80);
    return () => window.clearInterval(id);
  }, [modeIdx, mode.sample.length]);

  const visible = Math.min(typed, mode.sample.length);

  return (
    <div className="card-base relative overflow-hidden p-5">
      <span className="scan-line" aria-hidden="true" />

      {/* Header */}
      <div className="mb-4 flex items-center gap-2 border-b border-[rgba(23,183,155,0.10)] pb-3">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/60" />
          <span className="size-2.5 rounded-full bg-[var(--brand)]/50" />
          <span className="size-2.5 rounded-full bg-gray-300" />
        </span>
        <span className="ml-2 font-heading text-[0.6rem] uppercase tracking-[0.18em] text-[#778B88]">
          XviTypoo — Live Session
        </span>
        <span className="badge-status badge-live ml-auto">● REC</span>
      </div>

      {/* Mode tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {TYPING_MODES.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => { setModeIdx(i); setTyped(0); setCycleCount(0); }}
            className={cn(
              "rounded-full px-3 py-1 font-heading text-[0.58rem] font-semibold uppercase tracking-[0.12em] transition-all duration-250",
              i === modeIdx
                ? "bg-[var(--brand)] text-white shadow-sm"
                : "border border-[rgba(23,183,155,0.20)] bg-transparent text-[#778B88] hover:text-[#444444]",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex size-[6px]">
            <span className="absolute size-full rounded-full bg-[var(--brand)] opacity-40"
              style={{ animation: "ping-soft 2s ease-in-out infinite" }} />
            <span className="relative size-full rounded-full bg-[var(--brand)]" />
          </span>
          <span className="font-heading text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
            {mode.lang}
          </span>
        </div>
        <span className="font-mono text-[0.55rem] text-[#778B88]">{timer}</span>
      </div>

      {/* Typing text */}
      <p dir={mode.dir} className="h-16 overflow-hidden font-mono text-sm leading-relaxed text-[#444444]">
        <span>{mode.sample.slice(0, visible)}</span>
        <span className="caret inline-block h-4 w-[1.5px] -translate-y-0.5 bg-[var(--brand)] align-middle" />
        <span className="text-[#778B88]/40">{mode.sample.slice(visible)}</span>
      </p>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-4 gap-2 border-t border-[rgba(23,183,155,0.10)] pt-4">
        {[
          { label: "WPM",      value: String(wpm),           color: "#17B79B" },
          { label: "Net WPM",  value: String(netWpm),        color: "#3b6cf6" },
          { label: "CPM",      value: String(cpm),           color: "#8b5cf6" },
          { label: "Accuracy", value: `${Math.max(94, acc)}%`, color: "#17B79B" },
        ].map((s) => (
          <div key={s.label}>
            <p className="font-heading text-base font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
            <p className="font-heading text-[0.5rem] uppercase tracking-[0.10em] text-[#778B88]">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Fold card ──────────────────────────────────────────────── */
function FoldCard({
  label, Icon, isActive, onEnter, onLeave, visible, index,
}: {
  label: string; Icon: typeof Languages;
  isActive: boolean; onEnter: () => void; onLeave: () => void;
  visible: boolean; index: number;
}) {
  return (
    <div
      className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        maxHeight: visible ? "52px" : "0px",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(8px)",
        transitionDelay: visible ? `${index * 35}ms` : `${(8 - index) * 18}ms`,
      }}
    >
      <button
        type="button"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className={cn(
          "mb-1.5 flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-250",
          isActive
            ? "border-[var(--brand)]/30 bg-[rgba(23,183,155,0.08)] text-[var(--brand)]"
            : "border-[rgba(23,183,155,0.12)] bg-white text-[#778B88] hover:border-[var(--brand)]/25 hover:text-[#444444]",
        )}
      >
        <span className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-lg transition-colors",
          isActive ? "bg-[var(--brand)] text-white" : "bg-[rgba(23,183,155,0.08)] text-[var(--brand)]",
        )}>
          <Icon className="size-3" />
        </span>
        <span className="truncate font-heading text-xs font-semibold">{label}</span>
      </button>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export function XviTypooShowcase() {
  const { dict } = useI18n();
  const section  = dict.home.typoo;
  const features = section.features;
  const [hovered, setHovered]     = React.useState<FeatureKey | null>(null);
  const [cardsVisible, setCardsVisible] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const activeFeature: FeatureKey = hovered ?? "bangla";

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

  return (
    <section id="xvitypoo" className="scroll-mt-20 section-pad">
      <div className="section-inner">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
          {/* Left */}
          <div className="space-y-8">
            <Reveal>
              <div className="space-y-5">
                <p className="eyebrow">{section.eyebrow}</p>
                <h2 className="text-display-sm">
                  <span className="text-[#444444]">XviTypoo — </span>
                  <span className="section-gradient-text">precision typing,</span>
                  <span className="text-[#444444]"> reimagined</span>
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-[#778B88]">
                  {section.subheading}
                </p>

                <div className="flex items-center gap-3">
                  <Image src="/xviTypooCm.svg" alt="XviTypoo" width={32} height={32} className="size-8 rounded-lg" />
                  <span className="badge-status badge-live">Live · Production</span>
                </div>

                <Link href="https://typoo.xvifloo.com" target="_blank" rel="noopener noreferrer"
                  onClick={() => void trackEvent({ eventName: "xvitypoo_launch_click", props: { source: "homepage" } })}
                  className="btn-primary inline-flex">
                  {section.cta}
                </Link>
              </div>
            </Reveal>

            {/* Fold cards */}
            <div ref={containerRef}>
              <div className="grid grid-cols-2 gap-0 lg:grid-cols-3">
                {(Object.keys(features) as FeatureKey[]).map((key, i) => (
                  <FoldCard
                    key={key}
                    label={features[key]}
                    Icon={FEATURE_ICONS[key]}
                    isActive={activeFeature === key}
                    onEnter={() => setHovered(key)}
                    onLeave={() => setHovered(null)}
                    visible={cardsVisible}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right — typing preview */}
          <Reveal delay={120} className="lg:sticky lg:top-24">
            <TypingPreview />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
