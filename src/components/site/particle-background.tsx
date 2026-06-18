"use client";

import * as React from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  core: boolean;
  twinklePhase: number;
};

type Pointer = { x: number; y: number; active: boolean; lastX: number; lastY: number };

type Ripple = { x: number; y: number; born: number; strength: number };

type Pulse = { ax: number; ay: number; bx: number; by: number; born: number; duration: number };

const REPULSE_RADIUS = 78;
const ATTRACT_RADIUS = 210;
const LINK_DISTANCE = 64;
const CELL_SIZE = LINK_DISTANCE;
const RIPPLE_LIFE = 900;
const RIPPLE_WIDTH = 90;
const RIPPLE_SPEED = 0.62; // px/ms
const RIPPLE_MIN_INTERVAL = 200;
const PULSE_DURATION = 1100;
const PULSE_INTERVAL = 650;

export function ParticleBackground({
  maxDensity = 3400,
  maxVelocity = 0.16,
}: {
  maxDensity?: number;
  maxVelocity?: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const pointerRef = React.useRef<Pointer>({ x: 0, y: 0, active: false, lastX: 0, lastY: 0 });
  const reducedMotionRef = React.useRef(false);
  const ripplesRef = React.useRef<Ripple[]>([]);
  const pulsesRef = React.useRef<Pulse[]>([]);
  const lastRippleRef = React.useRef(0);
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
    let lastTime = performance.now();

    const getDensity = (w: number, h: number) => {
      const area = w * h;
      const raw = Math.floor(area / 260);
      const dpr = window.devicePixelRatio || 1;
      const dprScale = dpr > 2 ? 0.65 : dpr > 1.5 ? 0.8 : 1;
      const mobileScale = w < 640 ? 0.4 : w < 1024 ? 0.7 : 1;
      return Math.max(220, Math.min(maxDensity, Math.floor(raw * dprScale * mobileScale)));
    };

    const seedParticles = () => {
      const count = getDensity(width, height);
      particles = Array.from({ length: count }, () => {
        const core = Math.random() < 0.07;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() * 2 - 1) * maxVelocity,
          vy: (Math.random() * 2 - 1) * maxVelocity,
          r: core ? 1.1 + Math.random() * 0.9 : 0.35 + Math.random() * 0.55,
          core,
          twinklePhase: Math.random() * Math.PI * 2,
        };
      });
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

    const applyPointerForces = (p: Particle) => {
      const pointer = pointerRef.current;
      if (!pointer.active) return;

      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) return;

      const nx = dx / dist;
      const ny = dy / dist;

      if (dist < REPULSE_RADIUS) {
        const force = ((REPULSE_RADIUS - dist) / REPULSE_RADIUS) * 0.46;
        p.vx -= nx * force;
        p.vy -= ny * force;
      } else if (dist < ATTRACT_RADIUS) {
        const force = ((ATTRACT_RADIUS - dist) / ATTRACT_RADIUS) * 0.045;
        p.vx += nx * force;
        p.vy += ny * force;
      }
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
      if (pulsesRef.current.length > 5) return;
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
            if (d < LINK_DISTANCE) candidates.push(idx);
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
      const dt = now - lastTime;
      lastTime = now;
      const reduced = reducedMotionRef.current;
      const brand =
        getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#17b79b";

      ctx.clearRect(0, 0, width, height);

      ripplesRef.current = ripplesRef.current.filter((r) => now - r.born < RIPPLE_LIFE);
      pulsesRef.current = pulsesRef.current.filter((p) => now - p.born < p.duration);

      for (const p of particles) {
        if (!reduced) {
          applyPointerForces(p);
          applyRippleForces(p, now);
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.99;
          p.vy *= 0.99;

          const speed = Math.hypot(p.vx, p.vy);
          const cap = p.core ? maxVelocity * 1.4 : maxVelocity;
          if (speed > cap) {
            p.vx = (p.vx / speed) * cap;
            p.vy = (p.vy / speed) * cap;
          }

          if (p.x < -8) p.x = width + 8;
          if (p.x > width + 8) p.x = -8;
          if (p.y < -8) p.y = height + 8;
          if (p.y > height + 8) p.y = -8;
        }

        const twinkle = reduced
          ? 1
          : 0.72 + 0.28 * Math.sin(now / 1400 + p.twinklePhase);
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
                const base = a.core || b.core ? 0.4 : 0.26;
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
          ctx.globalAlpha = 0.35 * fade;
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
          ctx.globalAlpha = fade * 0.22 * ripple.strength;
          ctx.strokeStyle = `${brand}aa`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      void dt;
      raf = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const prev = pointerRef.current;
      const now = performance.now();
      pointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
        lastX: prev.x,
        lastY: prev.y,
      };

      if (reducedMotionRef.current) return;

      const speed = Math.hypot(event.clientX - prev.x, event.clientY - prev.y);
      if (speed > 26 && now - lastRippleRef.current > RIPPLE_MIN_INTERVAL) {
        ripplesRef.current.push({
          x: event.clientX,
          y: event.clientY,
          born: now,
          strength: 0.85,
        });
        lastRippleRef.current = now;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reducedMotionRef.current) return;
      ripplesRef.current.push({
        x: event.clientX,
        y: event.clientY,
        born: performance.now(),
        strength: 1.6,
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
