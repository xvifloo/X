"use client";

import { EcosystemSection } from "@/components/home/ecosystem-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { RoadmapSection } from "@/components/home/roadmap-section";
import { VisionSection } from "@/components/home/vision-section";
import { XviTypooShowcase } from "@/components/home/xvitypoo-showcase";
import { SectionBg } from "@/components/site/section-bg";
import { SiteShell } from "@/components/site/site-shell";

export default function HomePage() {
  return (
    <SiteShell>
      {/* Section 1 — Dark (hero) */}
      <SectionBg index={1}>
        <HeroSection />
      </SectionBg>

      {/* Section 2 — Light */}
      <SectionBg index={2}>
        <EcosystemSection />
      </SectionBg>

      {/* Section 3 — Dark */}
      <SectionBg index={3}>
        <XviTypooShowcase />
      </SectionBg>

      {/* Section 4 — Light */}
      <SectionBg index={4}>
        <RoadmapSection />
      </SectionBg>

      {/* Section 5 — Dark */}
      <SectionBg index={5}>
        <VisionSection />
      </SectionBg>

      {/* Section 6 — Light */}
      <SectionBg index={6}>
        <FeaturesSection />
      </SectionBg>
    </SiteShell>
  );
}
