# TODO — XviFloo Ecosystem Audit + Premium UX Improvements

## Phase 0 — Scope Confirmation (done)
- Completed codebase audit (structure, features discovered, gaps, bugs, UX/perf/security, readiness, roadmap).
- Next step: implement requested UX improvements while preserving architecture, CMS/Admin compatibility, responsiveness, accessibility, and performance.

## Phase 1 — Pre-implementation verification (no logic changes yet)
- [ ] Review and identify the exact components responsible for:
  - [ ] “Ecosystem Status · Ecosystem Evolution Active — … under active …” section removal
  - [ ] Background network/particle effect density and drift behavior
  - [ ] Cursor/mouse interaction system (ring/attraction/glow)
  - [ ] Ecosystem architecture section visuals
  - [ ] XviTypoo showcase (live typing, stats, language indicator)
  - [ ] Roadmap section upgrade (milestones, future releases, research status, etc.)
  - [ ] Future vision section redesign
  - [ ] Capabilities section upgrade
  - [ ] Card system upgrade (glass depth, neon accents, hover elevation)
  - [ ] Micro-animations across interactions/scroll reveals
- [ ] Confirm where these sections live in repo:
  - [ ] `src/components/home/*`
  - [ ] Any background/particle components in `src/components/site/*`

## Phase 2 — Visual/content changes (UX only; preserve architecture)
- [ ] Remove the clutter section entirely and rebalance spacing
- [ ] Reduce particle/network density by ~40–60% and stabilize distribution
- [ ] Implement elegant cursor interaction zone (circular ring + smooth attraction + soft glow)
- [ ] Upgrade ecosystem architecture visualization to “platform-like” system feel
- [ ] Upgrade XviTypoo showcase to multi-mode live typing + WPM/CPM/accuracy/session timer/language indicator

## Phase 3 — Section rewrites (UI/UX only; keep CMS/Admin integration intact)
- [ ] Roadmap section: upgrade to professional SaaS roadmap experience
- [ ] Future vision section: redesign using maps/timelines/pathways
- [ ] Capabilities section: transform into enterprise-grade architecture/security/AI layers
- [ ] Card system: unify glass effect, border glow, shadows, contrast, hover elevation
- [ ] Micro-animations: hover, section reveals, scroll transitions, magnetic buttons

## Phase 4 — Accessibility + Performance validation
- [ ] Validate reduced-motion behavior remains correct
- [ ] Validate mobile performance (limit SVG/particle costs)
- [ ] Ensure keyboard focus states remain visible on interactive elements

## Phase 5 — End-to-end testing (post-changes)
- [ ] Frontend: scroll through every home section and interact with all controls
- [ ] Backend/API smoke: auth flow + analytics POST + locale POST
- [ ] RBAC/admin: confirm access control expectations
