"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BiomarkerContribution } from "@/lib/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

/**
 * Each bar is the real, computed difference between your actual
 * PhenoAge and a counterfactual PhenoAge with that one marker swapped
 * for its reference-range midpoint (see lib/phenoAge.ts) — not a
 * pre-assigned weight per marker.
 */
export default function ContributionChart({ data }: { data: BiomarkerContribution[] }) {
  const sorted = [...data].sort((a, b) => a.yearsContribution - b.yearsContribution);

  const chartData = {
    labels: sorted.map((d) => d.label + (d.measured ? "" : " (est.)")),
    datasets: [
      {
        data: sorted.map((d) => d.yearsContribution),
        backgroundColor: sorted.map((d) =>
          !d.measured
            ? "rgba(255,255,255,0.12)"
            : d.yearsContribution > 0
            ? "rgba(255,138,102,0.75)"
            : "rgba(43,227,160,0.75)"
        ),
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "#111523",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#f3efe6",
        bodyColor: "rgba(255,255,255,0.7)",
        callbacks: {
          label: (ctx: any) => `${ctx.raw > 0 ? "+" : ""}${ctx.raw.toFixed(2)} yrs vs. reference midpoint`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.4)" },
        grid: { color: "rgba(255,255,255,0.06)" },
        title: { display: true, text: "years added / subtracted", color: "rgba(255,255,255,0.35)", font: { size: 10 } },
      },
      y: {
        ticks: { color: "rgba(255,255,255,0.55)", font: { size: 11 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div style={{ height: Math.max(220, sorted.length * 34) }}>
      {/* @ts-ignore */}
      <Bar data={chartData} options={options} />
    </div>
  );
}
