"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="mt-4 flex w-full items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
    >
      <LogOut className="size-3.5" aria-hidden="true" />
      Sign out
    </button>
  );
}
