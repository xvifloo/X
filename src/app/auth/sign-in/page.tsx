"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import { XviFlooLogo } from "@/components/brand/xvifloo-logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { SiteAtmosphere } from "@/components/site/site-atmosphere";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already linked to a different sign-in method. Please retry — it will now link automatically.",
  AccessDenied: "Access was denied for this account.",
  Default: "Something went wrong while signing in. Please try again.",
};

/**
 * Reads `callbackUrl` from the URL exactly once and sanitizes it to a safe,
 * same-origin relative path. This is the fix for the "callbackUrl grows
 * infinitely" bug: the previous version called `signIn(provider)` with no
 * `callbackUrl` at all, which makes next-auth default to
 * `window.location.href` — and since this page's own URL can already
 * contain a `callbackUrl` param (set by src/middleware.ts), every retry
 * re-wrapped the previous value, nesting deeper each time. Passing a single
 * clean value explicitly here breaks that cycle.
 */
function getSafeCallbackUrl(raw: string | null): string {
  if (!raw) return "/admin";
  // Only allow a relative path within this app — never a full URL (which
  // could itself already be a nested sign-in URL, or an external target).
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/admin";
  if (raw.startsWith("/auth/sign-in")) return "/admin";
  return raw;
}

function SignInContent() {
  const { dict } = useI18n();
  const searchParams = useSearchParams();

  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const errorCode = searchParams.get("error");
  const errorMessage = errorCode
    ? (ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default)
    : null;

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

          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="h-11 rounded-full"
              onClick={() => signIn("github", { callbackUrl })}
            >
              Continue with GitHub
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-full"
              onClick={() => signIn("google", { callbackUrl })}
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

export default function SignInPage() {
  return (
    <React.Suspense fallback={null}>
      <SignInContent />
    </React.Suspense>
  );
}
