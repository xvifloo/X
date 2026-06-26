"use client";

import * as React from "react";

export function CustomCursor() {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const dotRef   = React.useRef<HTMLDivElement>(null);
  const pos       = React.useRef({ x: -200, y: -200 });
  const outer     = React.useRef({ x: -200, y: -200 });
  const rafId     = React.useRef(0);
  const [visible, setVisible] = React.useState(false);
  const [isPointer, setIsPointer] = React.useState(false);

  React.useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.style.cursor = "none";

    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const style = el ? window.getComputedStyle(el).cursor : "auto";
      setIsPointer(style === "pointer");
    };

    const onLeave = () => setVisible(false);

    const animate = () => {
      // Dot follows mouse exactly
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`;
      }
      // Outer ring lags behind with easing
      outer.current.x += (pos.current.x - outer.current.x) * 0.12;
      outer.current.y += (pos.current.y - outer.current.y) * 0.12;
      if (outerRef.current) {
        outerRef.current.style.transform =
          `translate(${outer.current.x - 16}px, ${outer.current.y - 16}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Outer ring — lags */}
      <div
        ref={outerRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] size-8 rounded-full will-change-transform"
        style={{
          border: "1.5px solid var(--brand)",
          opacity: 0.8,
          transition: isPointer ? "width 0.2s, height 0.2s, border-color 0.2s" : "none",
          width: isPointer ? "44px" : "32px",
          height: isPointer ? "44px" : "32px",
          transform: `translate(${outer.current.x - 16}px, ${outer.current.y - 16}px)`,
        }}
      />
      {/* Center dot — instant */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] size-1.5 rounded-full bg-[var(--brand)] will-change-transform"
        style={{ transform: `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)` }}
      />
    </>
  );
}
