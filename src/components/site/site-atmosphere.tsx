"use client";

import { ParticleBackground } from "@/components/site/particle-background";

/**
 * The full ambient background system for the site. Fixed to the viewport
 * (not the document) so the "deep-space" feel stays put while content
 * scrolls over it — layered from back to front:
 *   1. Deep atmospheric gradient (CSS)
 *   2-4. Micro particles, constellation links, neural pulses (canvas)
 *   5. Floating energy fields (CSS, blurred orbs)
 *   6. Mouse interaction (handled inside the canvas layer)
 *   + a faint film-grain pass to keep flat color from looking sterile.
 */
export function SiteAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Layer 1 — deep atmospheric gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 18% -10%, var(--brand-muted), transparent 60%), radial-gradient(ellipse 60% 45% at 100% 10%, var(--accent-blue-muted), transparent 55%), radial-gradient(ellipse 70% 60% at 50% 120%, var(--accent-violet-muted), transparent 60%)",
        }}
      />
      {/* Layer 5 — floating energy fields */}
      <div
        className="glow-orb absolute -left-32 top-[8%] size-[34rem] opacity-40"
        style={{ animationDuration: "22s" }}
      />
      <div
        className="glow-orb-blue absolute right-[-10%] top-[28%] size-[26rem] opacity-25"
        style={{ animationDuration: "26s", animationDelay: "-6s" }}
      />
      <div
        className="glow-orb absolute left-[8%] top-[62%] size-80 opacity-30"
        style={{ animationDuration: "19s", animationDelay: "-11s" }}
      />
      <div
        className="glow-orb-violet absolute right-[6%] bottom-[6%] size-[30rem] opacity-25"
        style={{ animationDuration: "28s", animationDelay: "-4s" }}
      />

      {/* Layers 2-4 + 6 — micro particles, constellation, neural pulses, pointer reactivity */}
      <ParticleBackground />

      {/* Film grain pass to avoid flat, sterile color fields */}
      <div className="noise-layer absolute inset-0" />

      {/* Soft top-to-bottom vignette so content near the very top/bottom reads cleanly */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--background) 35%, transparent) 0%, transparent 12%, transparent 88%, color-mix(in srgb, var(--background) 55%, transparent) 100%)",
        }}
      />
    </div>
  );
}
