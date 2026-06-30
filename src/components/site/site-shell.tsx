import type { ReactNode } from "react";

import { SiteAtmosphere } from "@/components/site/site-atmosphere";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden">
      <SiteAtmosphere />
      <div className="relative z-10 flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
