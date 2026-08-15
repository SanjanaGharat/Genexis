"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export interface TrendPoint {
  createdAt: string;
  chronologicalAge: number;
  phenotypicAge: number;
}

export default function TrendChart({ history }: { history: TrendPoint[] }) {
  const ordered = [...history].reverse();
  const labels = ordered.map((r) =>
    new Date(r.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Chronological age",
        data: ordered.map((r) => r.chronologicalAge),
        borderColor: "#5f92ff",
        backgroundColor: "rgba(95,146,255,0.08)",
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: "#5f92ff",
      },
      {
        label: "Phenotypic age",
        data: ordered.map((r) => r.phenotypicAge),
        borderColor: "#ff8a66",
        backgroundColor: "rgba(255,138,102,0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: "#ff8a66",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        labels: { color: "rgba(255,255,255,0.6)", font: { family: "var(--font-manrope)", size: 12 } },
      },
      tooltip: {
        backgroundColor: "#111523",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#f3efe6",
        bodyColor: "rgba(255,255,255,0.7)",
      },
    },
    scales: {
      x: { ticks: { color: "rgba(255,255,255,0.4)" }, grid: { color: "rgba(255,255,255,0.04)" } },
      y: { ticks: { color: "rgba(255,255,255,0.4)" }, grid: { color: "rgba(255,255,255,0.06)" } },
    },
  };

  return (
    <div className="h-72">
      <Line data={data} options={options} />
    </div>
  );
}
