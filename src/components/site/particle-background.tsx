"use client";

import * as React from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  r: number;
  core: boolean;
  twinklePhase: number;
};

type Pointer = { x: number; y: number; active: boolean };

type Pulse = { ax: number; ay: number; bx: number; by: number; born: number; duration: number };

// ============================================================================
// TUNABLE CONFIGURATION — adjust these to change the feel of the background.
// ============================================================================

/** Opacity ceiling for the ambient constellation lines (0–1). Raise this to
 *  make the network more visible; lower it for a quieter, sparser field. */
const NETWORK_OPACITY = 0.22;

/** Maximum distance (px) at which two particles will be linked by a line.
 *  Larger values produce a denser-looking web; smaller values a sparser one. */
const NETWORK_DISTANCE = 52;

/** Target number of particles across the whole viewport at desktop density.
 *  Actual count is scaled down automatically on smaller / lower-DPI screens. */
const PARTICLE_COUNT = 760;

/** Top speed (px/frame) a particle can drift at under its own ambient motion,
 *  before any pointer or spring forces are applied. Higher = livelier field. */
const PARTICLE_SPEED = 0.1;

// ----------------------------------------------------------------------------
// Mouse interaction — soft magnetic influence only. There is intentionally
// no "web" drawn around the cursor: nearby particles are pulled gently
// toward it and a soft glow renders underneath, but no connection lines are
// generated between particles near the pointer.
// ----------------------------------------------------------------------------
const INTERACTION_RADIUS = 150;
const ATTRACT_STRENGTH = 0.034;
const GLOW_RADIUS = 70;

// Anti-drift system: every particle is anchored to a jittered-grid home
// position and gently spring-pulled back to it, which guarantees uniform
// coverage over time regardless of how the cursor wanders.
const SPRING_K = 0.0016;
const MAX_LEASH = 130;

const PULSE_DURATION = 1100;
const PULSE_INTERVAL = 720;

const CELL_SIZE = NETWORK_DISTANCE;

export function ParticleBackground({
  maxDensity = PARTICLE_COUNT,
  maxVelocity = PARTICLE_SPEED,
}: {
  maxDensity?: number;
  maxVelocity?: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const pointerRef = React.useRef<Pointer>({ x: 0, y: 0, active: false });
  const reducedMotionRef = React.useRef(false);
  const pulsesRef = React.useRef<Pulse[]>([]);
  const lastPulseRef = React.useRef(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
    };
    motionQuery.addEventListener("change", onMotionChange);

    let raf = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    const getGridDims = (w: number, h: number) => {
      const area = w * h;
      const mobileScale = w < 640 ? 0.45 : w < 1024 ? 0.72 : 1;
      const dpr = window.devicePixelRatio || 1;
      const dprScale = dpr > 2 ? 0.7 : dpr > 1.5 ? 0.85 : 1;
      // Scale the requested PARTICLE_COUNT by viewport area relative to a
      // 1440×900 reference screen, so density reads consistently across
      // very large and ultrawide monitors instead of just thinning out.
      const referenceArea = 1440 * 900;
      const areaScale = Math.min(2.2, Math.max(0.35, area / referenceArea));
      const target = Math.max(
        160,
        Math.min(maxDensity * 2.4, Math.floor(maxDensity * areaScale * mobileScale * dprScale)),
      );
      const cols = Math.max(4, Math.round(Math.sqrt((target * w) / h)));
      const rows = Math.max(4, Math.round(target / cols));
      return { cols, rows };
    };

    // Jittered-grid seeding: every particle gets a "home" slot spread evenly
    // across the viewport, with a randomized offset inside that slot so the
    // result still reads as organic rather than a visible grid. This is also
    // what guarantees even coverage — there is no region of the screen that
    // starts (or ends up) emptier than another.
    const seedParticles = () => {
      const { cols, rows } = getGridDims(width, height);
      const cellW = width / cols;
      const cellH = height / rows;
      const next: Particle[] = [];

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const core = Math.random() < 0.07;
          const jitterX = (Math.random() - 0.5) * cellW * 0.86;
          const jitterY = (Math.random() - 0.5) * cellH * 0.86;
          const homeX = (cx + 0.5) * cellW + jitterX;
          const homeY = (cy + 0.5) * cellH + jitterY;

          next.push({
            x: homeX,
            y: homeY,
            vx: (Math.random() * 2 - 1) * maxVelocity,
            vy: (Math.random() * 2 - 1) * maxVelocity,
            homeX,
            homeY,
            r: core ? 1.05 + Math.random() * 0.85 : 0.35 + Math.random() * 0.5,
            core,
            twinklePhase: Math.random() * Math.PI * 2,
          });
        }
      }
      particles = next;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedParticles();
    };

    const cellKey = (x: number, y: number) =>
      `${Math.floor(x / CELL_SIZE)},${Math.floor(y / CELL_SIZE)}`;

    const buildGrid = () => {
      const grid = new Map<string, number[]>();
      for (let i = 0; i < particles.length; i++) {
        const key = cellKey(particles[i].x, particles[i].y);
        const bucket = grid.get(key);
        if (bucket) bucket.push(i);
        else grid.set(key, [i]);
      }
      return grid;
    };

    const maybeSpawnPulse = (now: number, grid: Map<string, number[]>) => {
      if (now - lastPulseRef.current < PULSE_INTERVAL) return;
      if (pulsesRef.current.length > 4) return;
      if (particles.length === 0) return;

      const cores = particles.filter((p) => p.core);
      if (cores.length === 0) return;
      const origin = cores[Math.floor(Math.random() * cores.length)];
      const cx = Math.floor(origin.x / CELL_SIZE);
      const cy = Math.floor(origin.y / CELL_SIZE);
      const candidates: number[] = [];

      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const bucket = grid.get(`${cx + ox},${cy + oy}`);
          if (!bucket) continue;
          for (const idx of bucket) {
            const other = particles[idx];
            if (other === origin) continue;
            const d = Math.hypot(other.x - origin.x, other.y - origin.y);
            if (d < NETWORK_DISTANCE * 1.4) candidates.push(idx);
          }
        }
      }

      if (candidates.length === 0) return;
      const targetIdx = candidates[Math.floor(Math.random() * candidates.length)];
      const target = particles[targetIdx];

      pulsesRef.current.push({
        ax: origin.x,
        ay: origin.y,
        bx: target.x,
        by: target.y,
        born: now,
        duration: PULSE_DURATION,
      });
      lastPulseRef.current = now;
    };

    const tick = () => {
      const now = performance.now();
      const reduced = reducedMotionRef.current;
      const pointer = pointerRef.current;
      const brand =
        getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#17b79b";

      ctx.clearRect(0, 0, width, height);

      pulsesRef.current = pulsesRef.current.filter((p) => now - p.born < p.duration);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reduced) {
          // Gentle spring back to the home slot — this is what keeps the
          // field uniform indefinitely, no matter how the cursor moves.
          p.vx += (p.homeX - p.x) * SPRING_K;
          p.vy += (p.homeY - p.y) * SPRING_K;

          // Soft magnetic influence only — no connection lines are ever
          // generated here, just a gentle pull toward the cursor.
          if (pointer.active) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < INTERACTION_RADIUS && dist > 0.5) {
              const t = 1 - dist / INTERACTION_RADIUS;
              const influence = t * t * (3 - 2 * t); // smoothstep, no hard edge
              const force = influence * ATTRACT_STRENGTH;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.985;
          p.vy *= 0.985;

          const speed = Math.hypot(p.vx, p.vy);
          const cap = p.core ? maxVelocity * 1.4 : maxVelocity;
          if (speed > cap) {
            p.vx = (p.vx / speed) * cap;
            p.vy = (p.vy / speed) * cap;
          }

          // Hard safety leash — guarantees no particle can ever wander far
          // from its assigned slot, however forces stack up. This is what
          // prevents the field from ever clustering toward an edge.
          const hdx = p.x - p.homeX;
          const hdy = p.y - p.homeY;
          const hdist = Math.hypot(hdx, hdy);
          if (hdist > MAX_LEASH) {
            const scale = MAX_LEASH / hdist;
            p.x = p.homeX + hdx * scale;
            p.y = p.homeY + hdy * scale;
          }
        }

        const twinkle = reduced ? 1 : 0.72 + 0.28 * Math.sin(now / 1400 + p.twinklePhase);
        const alphaHex = Math.round((p.core ? 0xaa : 0x66) * twinkle)
          .toString(16)
          .padStart(2, "0");

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${brand}${alphaHex}`;
        ctx.fill();

        if (p.core) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `${brand}16`;
          ctx.fill();
        }
      }

      // Ambient constellation — the only network lines drawn anywhere. These
      // connect nearby particles to each other regardless of cursor position,
      // so there is no special "web" effect tied to the mouse.
      const grid = buildGrid();
      const linkDist2 = NETWORK_DISTANCE * NETWORK_DISTANCE;
      ctx.lineWidth = 0.6;

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const cx = Math.floor(a.x / CELL_SIZE);
        const cy = Math.floor(a.y / CELL_SIZE);

        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const bucket = grid.get(`${cx + ox},${cy + oy}`);
            if (!bucket) continue;

            for (const j of bucket) {
              if (j <= i) continue;
              const b = particles[j];
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < linkDist2) {
                const base = a.core || b.core ? NETWORK_OPACITY * 1.25 : NETWORK_OPACITY;
                const alpha = (1 - d2 / linkDist2) * base;
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = `${brand}66`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }
        }
      }
      ctx.globalAlpha = 1;

      if (!reduced) {
        maybeSpawnPulse(now, grid);

        for (const pulse of pulsesRef.current) {
          const t = Math.min(1, (now - pulse.born) / pulse.duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const px = pulse.ax + (pulse.bx - pulse.ax) * eased;
          const py = pulse.ay + (pulse.by - pulse.ay) * eased;
          const fade = t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15;

          ctx.beginPath();
          ctx.moveTo(pulse.ax, pulse.ay);
          ctx.lineTo(pulse.bx, pulse.by);
          ctx.globalAlpha = 0.3 * fade;
          ctx.strokeStyle = `${brand}99`;
          ctx.lineWidth = 0.9;
          ctx.stroke();

          ctx.globalAlpha = fade;
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${brand}ee`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = `${brand}22`;
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Soft magnetic glow under the cursor — intentionally just a glow,
        // no particle-to-particle web is drawn here.
        if (pointer.active) {
          const glow = ctx.createRadialGradient(
            pointer.x,
            pointer.y,
            0,
            pointer.x,
            pointer.y,
            GLOW_RADIUS,
          );
          glow.addColorStop(0, `${brand}20`);
          glow.addColorStop(1, `${brand}00`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(pointer.x, pointer.y, GLOW_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      motionQuery.removeEventListener("change", onMotionChange);
      window.cancelAnimationFrame(raf);
    };
  }, [maxDensity, maxVelocity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full opacity-90"
    />
  );
}
