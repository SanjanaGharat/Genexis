"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ReferenceStatus } from "@/lib/types";

const SHORT_LABEL: Record<string, string> = {
  albumin: "Albumin",
  creatinine: "Creatinine",
  glucose: "Glucose",
  crp: "CRP",
  lymphocytePercent: "Lymph %",
  mcv: "MCV",
  rdw: "RDW",
  alkalinePhosphatase: "ALP",
  wbc: "WBC",
};

export default function RadarChart({ data }: { data: ReferenceStatus[] }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || data.length === 0) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const size = 380;
    const center = size / 2;
    const radius = size / 2 - 60;
    const levels = 4;
    const angleSlice = (Math.PI * 2) / data.length;

    // Normalize each biomarker onto 0-1 where 1 = midpoint of the healthy
    // reference range, so a perfectly "average healthy" panel draws a
    // clean ring at radius/2, and outliers push out toward the edge.
    const normalized = data.map((d) => {
      const [lo, hi] = d.referenceRange;
      const mid = (lo + hi) / 2;
      const span = (hi - lo) / 2 || 1;
      const z = (d.value - mid) / span; // ~ -1..1 within range, beyond outside
      return Math.max(0, Math.min(2, 1 + z * 0.5));
    });

    const rScale = d3.scaleLinear().domain([0, 2]).range([0, radius]);

    const g = svg
      .attr("viewBox", `0 0 ${size} ${size}`)
      .append("g")
      .attr("transform", `translate(${center},${center})`);

    for (let l = 1; l <= levels; l++) {
      g.append("circle")
        .attr("r", (radius / levels) * l)
        .attr("fill", "none")
        .attr("stroke", "rgba(255,255,255,0.06)");
    }

    g.append("circle")
      .attr("r", rScale(1))
      .attr("fill", "rgba(43,227,160,0.06)")
      .attr("stroke", "rgba(43,227,160,0.35)")
      .attr("stroke-dasharray", "3,3");

    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      g.append("line").attr("x1", 0).attr("y1", 0).attr("x2", x).attr("y2", y).attr("stroke", "rgba(255,255,255,0.08)");

      const lx = Math.cos(angle) * (radius + 28);
      const ly = Math.sin(angle) * (radius + 28);
      g.append("text")
        .attr("x", lx).attr("y", ly)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", 10)
        .attr("fill", "rgba(255,255,255,0.55)")
        .attr("font-family", "var(--font-plex-mono)")
        .attr("fill", d.measured ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.3)")
        .text((SHORT_LABEL[d.key as string] ?? d.label) + (d.measured ? "" : " (est.)"));
    });

    const line = d3
      .lineRadial<number>()
      .radius((v) => rScale(v))
      .angle((_, i) => angleSlice * i)
      .curve(d3.curveLinearClosed);

    const path = g
      .append("path")
      .datum(normalized)
      .attr("d", line as any)
      .attr("fill", "rgba(255,138,102,0.18)")
      .attr("stroke", "#ff8a66")
      .attr("stroke-width", 2)
      .attr("opacity", 0);

    path.transition().duration(700).ease(d3.easeCubicOut).attr("opacity", 1);

    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const r = rScale(normalized[i]);
      const cx = Math.cos(angle) * r;
      const cy = Math.sin(angle) * r;
      const color = !d.measured
        ? "rgba(255,255,255,0.35)"
        : d.status === "normal"
        ? "#2be3a0"
        : d.status === "low"
        ? "#5f92ff"
        : "#ff8a66";
      g.append("circle")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", 0)
        .attr("fill", color)
        .transition().delay(300 + i * 60).duration(300)
        .attr("r", 4);
    });
  }, [data]);

  return <svg ref={ref} className="w-full h-auto" />;
}
