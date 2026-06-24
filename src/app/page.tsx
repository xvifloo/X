"use client";

import { EcosystemSection } from "@/components/home/ecosystem-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { RoadmapSection } from "@/components/home/roadmap-section";
import { VisionSection } from "@/components/home/vision-section";
import { XviTypooShowcase } from "@/components/home/xvitypoo-showcase";
import { SiteShell } from "@/components/site/site-shell";

function SectionTransition() {
  return <div className="section-divider mx-auto w-full max-w-[90rem] px-4 sm:px-6 md:px-8" aria-hidden="true" />;
}

export default function HomePage() {
  return (
    <SiteShell>
      <HeroSection />
      <SectionTransition />
      <EcosystemSection />
      <SectionTransition />
      <XviTypooShowcase />
      <SectionTransition />
      <RoadmapSection />
      <SectionTransition />
      <VisionSection />
      <SectionTransition />
      <FeaturesSection />
    </SiteShell>
  );
}
