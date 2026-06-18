"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowLeft } from "lucide-react";

import { XviFlooLogo } from "@/components/brand/xvifloo-logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { SiteAtmosphere } from "@/components/site/site-atmosphere";

export default function SignInPage() {
  const { dict } = useI18n();

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden">
      <SiteAtmosphere />

      <main className="relative z-10 flex flex-1 items-center justify-center p-6">
        <div className="glass-panel w-full max-w-md space-y-8 rounded-[1.75rem] p-8 md:p-10">
          <div className="space-y-4 text-center">
            <Link href="/" className="inline-flex justify-center">
              <XviFlooLogo size="lg" />
            </Link>
            <p className="text-sm text-muted-foreground">{dict.brand.tagline}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button size="lg" className="h-11 rounded-full" onClick={() => signIn("github")}>
              Continue with GitHub
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-full"
              onClick={() => signIn("google")}
            >
              Continue with Google
            </Button>
          </div>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            If providers are not configured yet, set the OAuth environment variables in{" "}
            <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono">.env</code>.
          </p>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
