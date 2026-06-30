/**
 * Minimal atmosphere — no canvas, no heavy animation.
 * Just a very subtle radial gradient at the top to give the page
 * a soft glow above the hero section. That's it.
 */
export function SiteAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Very subtle top brand glow */}
      <div
        className="absolute inset-x-0 top-0 h-64"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(23,183,155,0.06) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
