# XviFloo Ecosystem UI Refresh — Task Tracker

## Plan approved
- [x] Imported/understood requirements (navbar/hero/theme/perf)
- [x] Update design tokens + animations/perf guardrails in `src/app/globals.css`
- [x] Implement navbar visual system + overlay expansion behavior in `src/components/home/navbar.tsx`
- [x] Update hero typography/CTAs/star behavior in `src/components/home/hero-section.tsx`
- [x] Remove vertical scan animation from topology; keep topology animation only in `src/components/home/ecosystem-graph.tsx`
- [x] Update Contact "Get In Touch" section (likely `src/app/contact/page.tsx` and/or homepage sections)
- [x] Update favicon to `xviFlooFm.svg` in `src/app/layout.tsx`
- [x] Ensure mobile submenu (+) behavior with single-open constraint
- [x] Verify no routing breaks + no layout shift when navbar expands
- [x] Final verification: responsiveness (mobile/tablet/ultra-wide) + no overflow

## Notes
- SVGs must only be referenced from `/public` (never recreated).
- Avoid unnecessary JS; prefer CSS for smoothness.
