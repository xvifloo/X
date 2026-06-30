"use client";

import { ContactSection } from "@/components/home/contact-section";
import { EcosystemSection } from "@/components/home/ecosystem-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { RoadmapSection } from "@/components/home/roadmap-section";
import { VisionSection } from "@/components/home/vision-section";
import { XviTypooShowcase } from "@/components/home/xvitypoo-showcase";
import { SiteShell } from "@/components/site/site-shell";

export default function HomePage() {
  return (
    <SiteShell>
      {/* Section 1 — bg: #F2FFFA (light) */}
      <div className="section-light-bg">
        <HeroSection />
      </div>

      {/* Section 2 — bg: white card */}
      <div className="section-dark-bg">
        <EcosystemSection />
      </div>

      {/* Section 3 — bg: #F2FFFA */}
      <div className="section-light-bg">
        <XviTypooShowcase />
      </div>

      {/* Section 4 — bg: white */}
      <div className="section-dark-bg">
        <RoadmapSection />
      </div>

      {/* Section 5 — bg: #F2FFFA */}
      <div className="section-light-bg">
        <VisionSection />
      </div>

      {/* Section 6 — bg: white */}
      <div className="section-dark-bg">
        <FeaturesSection />
      </div>

      {/* Section 7 — contact — bg: #F2FFFA */}
      <div className="section-light-bg">
        <ContactSection />
      </div>
    </SiteShell>
  );
}
