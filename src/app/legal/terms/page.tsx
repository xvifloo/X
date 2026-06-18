"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { LegalPageShell } from "@/components/site/legal-page-shell";
import { SiteShell } from "@/components/site/site-shell";

export default function TermsPage() {
  const { dict } = useI18n();
  const content = dict.legal.terms;

  return (
    <SiteShell>
      <LegalPageShell
        eyebrow={content.eyebrow}
        heading={content.heading}
        updated={content.updated}
        intro={content.intro}
        sections={content.sections}
        backLabel={dict.legal.backLink}
      />
    </SiteShell>
  );
}
