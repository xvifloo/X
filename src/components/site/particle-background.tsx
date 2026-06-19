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

type Ripple = { x: number; y: number; born: number; strength: number };

type Pulse = { ax: number; ay: number; bx: number; by: number; born: number; duration: number };

// Ambient constellation — kept deliberately sparse for a clean, premium field.
const LINK_DISTANCE = 46;
const CELL_SIZE = LINK_DISTANCE;

// A single, smooth, attraction-only zone around the cursor — no repulsion,
// no harsh snapping. Particles settle back to their home slot once released.
const INTERACTION_RADIUS = 165;
const INTERACTION_LINK_DISTANCE = 92;
const ATTRACT_STRENGTH = 0.046;
const GLOW_RADIUS = 78;

// Anti-drift system: every particle is anchored to a jittered-grid home
// position and gently spring-pulled back to it, which guarantees uniform
// coverage over time regardless of how the cursor wanders.
const SPRING_K = 0.0014;
const MAX_LEASH = 150;

const RIPPLE_LIFE = 760;
const RIPPLE_WIDTH = 80;
const RIPPLE_SPEED = 0.58; // px/ms
const PULSE_DURATION = 1100;
const PULSE_INTERVAL = 720;

export function ParticleBackground({
  maxDensity = 2600,
  maxVelocity = 0.1,
}: {
  maxDensity?: number;
  maxVelocity?: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const pointerRef = React.useRef<Pointer>({ x: 0, y: 0, active: false });
  const reducedMotionRef = React.useRef(false);
  const ripplesRef = React.useRef<Ripple[]>([]);
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
      const target = Math.max(
        180,
        Math.min(maxDensity, Math.floor((area / 340) * mobileScale * dprScale)),
      );
      const cols = Math.max(4, Math.round(Math.sqrt((target * w) / h)));
      const rows = Math.max(4, Math.round(target / cols));
      return { cols, rows };
    };

    // Jittered-grid seeding: every particle gets a "home" slot spread evenly
    // across the viewport, with a randomized offset inside that slot so the
    // result still reads as organic rather than a visible grid.
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

    const applyRippleForces = (p: Particle, now: number) => {
      for (const ripple of ripplesRef.current) {
        const age = now - ripple.born;
        if (age < 0 || age > RIPPLE_LIFE) continue;
        const radius = age * RIPPLE_SPEED;
        const dx = p.x - ripple.x;
        const dy = p.y - ripple.y;
        const dist = Math.hypot(dx, dy);
        const band = Math.abs(dist - radius);
        if (band > RIPPLE_WIDTH) continue;
        const falloff = 1 - age / RIPPLE_LIFE;
        const proximity = 1 - band / RIPPLE_WIDTH;
        const force = proximity * falloff * ripple.strength;
        if (dist > 0.001) {
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }
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
            if (d < LINK_DISTANCE * 1.4) candidates.push(idx);
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

      ripplesRef.current = ripplesRef.current.filter((r) => now - r.born < RIPPLE_LIFE);
      pulsesRef.current = pulsesRef.current.filter((p) => now - p.born < p.duration);

      const nearPointer: number[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reduced) {
          // Gentle spring back to the home slot — this is what keeps the
          // field uniform indefinitely, no matter how the cursor moves.
          p.vx += (p.homeX - p.x) * SPRING_K;
          p.vy += (p.homeY - p.y) * SPRING_K;

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
              nearPointer.push(i);
            }
          }

          applyRippleForces(p, now);

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
          // from its assigned slot, however forces stack up.
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
          ctx.fillStyle = `${brand}14`;
          ctx.fill();
        }
      }

      // Ambient constellation — sparse and faint by design.
      const grid = buildGrid();
      const linkDist2 = LINK_DISTANCE * LINK_DISTANCE;
      ctx.lineWidth = 0.5;

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
                const base = a.core || b.core ? 0.26 : 0.15;
                const alpha = (1 - d2 / linkDist2) * base;
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = `${brand}55`;
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

        for (const ripple of ripplesRef.current) {
          const age = now - ripple.born;
          const radius = age * RIPPLE_SPEED;
          const fade = 1 - age / RIPPLE_LIFE;
          if (fade <= 0) continue;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
          ctx.globalAlpha = fade * 0.18 * ripple.strength;
          ctx.strokeStyle = `${brand}aa`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // The cursor's interaction zone — a dynamic, denser network ring
        // plus a soft glow, replacing any hard push/pull with one smooth field.
        if (pointer.active && nearPointer.length > 1) {
          const linkDist2Near = INTERACTION_LINK_DISTANCE * INTERACTION_LINK_DISTANCE;
          ctx.lineWidth = 0.8;
          for (let i = 0; i < nearPointer.length; i++) {
            const a = particles[nearPointer[i]];
            for (let j = i + 1; j < nearPointer.length; j++) {
              const b = particles[nearPointer[j]];
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < linkDist2Near) {
                const alpha = (1 - d2 / linkDist2Near) * 0.5;
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = `${brand}cc`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }
          ctx.globalAlpha = 1;
        }

        if (pointer.active) {
          const glow = ctx.createRadialGradient(
            pointer.x,
            pointer.y,
            0,
            pointer.x,
            pointer.y,
            GLOW_RADIUS,
          );
          glow.addColorStop(0, `${brand}26`);
          glow.addColorStop(1, `${brand}00`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(pointer.x, pointer.y, GLOW_RADIUS, 0, Math.PI * 2);
          ctx.fill();

          const ringPulse = 0.14 + 0.04 * Math.sin(now / 900);
          ctx.beginPath();
          ctx.arc(pointer.x, pointer.y, INTERACTION_RADIUS, 0, Math.PI * 2);
          ctx.globalAlpha = ringPulse;
          ctx.strokeStyle = `${brand}aa`;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        }
      }

      raf = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reducedMotionRef.current) return;
      ripplesRef.current.push({
        x: event.clientX,
        y: event.clientY,
        born: performance.now(),
        strength: 1.1,
      });
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
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
