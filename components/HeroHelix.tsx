"use client";

import { useEffect, useRef } from "react";

/**
 * The page's thesis, rendered directly: two strands ("two ages running in
 * parallel") twist around a shared axis. The cool strand (chronological)
 * is perfectly even. The warm strand (biological) drifts off-phase —
 * sometimes tighter, sometimes looser — visualizing an age-gap that isn't
 * fixed like a birthday.
 *
 * Pure canvas 2D with a manual perspective projection (no three.js
 * dependency): each rung's x/scale is derived from a rotating angle and a
 * simulated z-depth.
 */
export default function HeroHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const POINTS = 46;
    const RADIUS = 78;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const axisLen = height * 0.86;

      const chronoPts: { x: number; y: number; z: number; s: number }[] = [];
      const bioPts: { x: number; y: number; z: number; s: number }[] = [];

      for (let i = 0; i < POINTS; i++) {
        const progress = i / (POINTS - 1);
        const y = cy - axisLen / 2 + progress * axisLen;
        const angle = progress * Math.PI * 6 + t;

        const cz = Math.sin(angle);
        const cx1 = Math.cos(angle) * RADIUS;
        const scaleC = 0.55 + 0.45 * ((cz + 1) / 2);
        chronoPts.push({ x: cx + cx1 * scaleC, y, z: cz, s: scaleC });

        const wobble = 1 + 0.35 * Math.sin(progress * 9 + t * 1.6);
        const angleB = angle + Math.PI;
        const bz = Math.sin(angleB);
        const bx1 = Math.cos(angleB) * RADIUS * wobble;
        const scaleB = 0.55 + 0.45 * ((bz + 1) / 2);
        bioPts.push({ x: cx + bx1 * scaleB, y, z: bz, s: scaleB });
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < POINTS; i += 2) {
        const a = chronoPts[i];
        const b = bioPts[i];
        const depth = (a.z + b.z) / 2;
        ctx.strokeStyle = `rgba(148,163,196,${0.05 + 0.06 * ((depth + 1) / 2)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      const drawStrand = (
        pts: { x: number; y: number; z: number; s: number }[],
        color: string
      ) => {
        for (let i = 0; i < pts.length - 1; i++) {
          const p = pts[i];
          const n = pts[i + 1];
          const depth = (p.z + 1) / 2;
          ctx.strokeStyle = color.replace("ALPHA", (0.25 + depth * 0.55).toFixed(2));
          ctx.lineWidth = 1.4 + depth * 1.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
        for (const p of pts) {
          const depth = (p.z + 1) / 2;
          const r = 1.6 + depth * 3.2;
          ctx.fillStyle = color.replace("ALPHA", (0.35 + depth * 0.65).toFixed(2));
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      drawStrand(chronoPts, "rgba(95,146,255,ALPHA)");
      drawStrand(bioPts, "rgba(255,138,102,ALPHA)");

      if (!reduceMotion) {
        t += 0.0045;
        raf = requestAnimationFrame(draw);
      }
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      role="img"
      aria-label="Animated visualization of two intertwined age strands — chronological age steady in blue, biological age fluctuating in coral"
    />
  );
}
