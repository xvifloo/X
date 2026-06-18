"use client";

type TrackEventInput = {
  eventName: string;
  props?: Record<string, unknown>;
  path?: string;
};

let anonymousId: string | null = null;

function getAnonymousId() {
  if (anonymousId) return anonymousId;
  const key = "xv_anon_id";
  const existing = window.localStorage.getItem(key);
  if (existing) {
    anonymousId = existing;
    return existing;
  }
  const next = crypto.randomUUID();
  window.localStorage.setItem(key, next);
  anonymousId = next;
  return next;
}

export async function trackEvent({ eventName, props, path }: TrackEventInput) {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventName,
        props,
        path: path ?? window.location.pathname,
        anonymousId: getAnonymousId(),
        referrer: document.referrer || null,
        locale: document.documentElement.lang || null,
      }),
      keepalive: true,
    });
  } catch {
    // Analytics should never block UX.
  }
}
