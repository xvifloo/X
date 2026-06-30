"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EcosystemGraph } from "@/components/home/ecosystem-graph";
import { Reveal } from "@/components/home/section-shell";

/* Rotating outlined star — half visible, very slow */
function RotatingStar() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-60"
      style={{ width: "clamp(260px, 32vw, 480px)", height: "clamp(260px, 32vw, 480px)" }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="#17B79B"
        strokeWidth="0.8"
        className="h-full w-full"
        style={{ animation: "spin-very-slow 40s linear infinite" }}
      >
        {/* 8-pointed star outline */}
        <polygon
          points="50,2 61,38 97,38 68,60 80,95 50,74 20,95 32,60 3,38 39,38"
          fill="none"
          stroke="#17B79B"
          strokeWidth="0.8"
        />
        {/* Inner smaller star */}
        <polygon
          points="50,18 57,42 82,42 61,56 69,80 50,66 31,80 39,56 18,42 43,42"
          fill="none"
          stroke="#17B79B"
          strokeWidth="0.4"
          opacity="0.5"
        />
        {/* Center dot */}
        <circle cx="50" cy="50" r="1.5" fill="#17B79B" opacity="0.6" />
      </svg>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden"
    >
      {/* Rotating star — desktop only, right side, half off screen */}
      <div className="hidden lg:block">
        <RotatingStar />
      </div>

      {/* Topology dot pattern — very subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(23,183,155,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 60% 60% at 30% 50%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 30% 50%, black 0%, transparent 70%)",
        }}
      />

      <div className="section-inner relative z-10 w-full py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-8">

          {/* Left — copy */}
          <div className="space-y-8 lg:max-w-xl">
            <Reveal delay={0}>
              <h1>
                <span
                  className="block font-heading font-bold leading-[0.95] text-[#444444]"
                  style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "-0.03em" }}
                >
                  Think. Build.
                </span>
                <span
                  className="block font-heading font-bold leading-[0.95] text-[#17B79B]"
                  style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "-0.03em" }}
                >
                  Evolve.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={80}>
              <p
                className="max-w-md leading-relaxed"
                style={{ color: "#778B88", fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}
              >
                <span className="font-heading font-semibold text-[#444444]">XviFloo</span>
                {" "}— Building intelligent tools, AI experiences, and software solutions for the next decade.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="#ecosystem" className="btn-primary">
                  Explore
                  <ChevronRight className="size-3.5" />
                </Link>
                <Link href="#roadmap" className="btn-outline">
                  Roadmap
                  <ChevronRight className="size-3.5 opacity-50" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right — Live Architecture */}
          <Reveal delay={180} className="lg:order-last">
            <div className="relative">
              {/* White card */}
              <div
                className="relative overflow-hidden rounded-2xl border border-[rgba(23,183,155,0.12)] bg-white shadow-[0_4px_32px_-8px_rgba(0,0,0,0.10)]"
                style={{ padding: "1.5rem" }}
              >
                {/* Topology dots inside card */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(23,183,155,0.08) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />

                {/* Header */}
                <div className="relative mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2 items-center justify-center">
                      <span className="status-dot relative" />
                    </span>
                    <span
                      className="font-heading font-semibold uppercase tracking-[0.20em] text-[var(--brand)]"
                      style={{ fontSize: "0.62rem" }}
                    >
                      Live Architecture
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-[0.55rem] uppercase tracking-[0.12em] text-[#778B88]">v2.0</span>
                  </div>
                </div>

                {/* Ecosystem graph — topology animation kept */}
                <div className="relative">
                  <EcosystemGraph className="mx-auto w-full" />
                </div>

                {/* Footer */}
                <div className="relative mt-4 flex items-center justify-between border-t border-[rgba(23,183,155,0.10)] pt-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-[6px] items-center justify-center">
                      <span className="absolute size-full rounded-full bg-[var(--brand)] opacity-30"
                        style={{ animation: "ping-soft 2.2s ease-in-out infinite" }} />
                      <span className="relative size-[6px] rounded-full bg-[var(--brand)]" />
                    </span>
                    <span className="font-heading text-[0.55rem] uppercase tracking-[0.12em] text-[#778B88]">
                      System operational
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {[{ label: "Nodes", value: "9" }, { label: "Uptime", value: "99.9%" }].map((item) => (
                      <div key={item.label} className="text-right">
                        <p className="font-heading text-xs font-bold text-[var(--brand)]">{item.value}</p>
                        <p className="font-heading text-[0.5rem] uppercase tracking-[0.10em] text-[#778B88]">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
