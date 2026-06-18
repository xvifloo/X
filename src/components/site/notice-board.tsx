"use client";

import { useI18n } from "@/components/providers/i18n-provider";

export function NoticeBoard() {
  const { dict } = useI18n();

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative z-20 border-b border-border/40 bg-background/50 backdrop-blur-sm"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-6 py-2 md:px-8">
        <span className="status-dot" aria-hidden="true" />
        <p className="truncate text-xs text-muted-foreground md:text-sm">
          <span className="sr-only">{dict.notice.label}: </span>
          <span className="font-medium text-foreground/80">{dict.notice.label}</span>
          <span className="mx-2 opacity-40">·</span>
          {dict.notice.message}
        </p>
      </div>
    </div>
  );
}
