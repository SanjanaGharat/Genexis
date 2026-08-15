"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function AgeCompareChart({
  chronologicalAge,
  phenotypicAge,
}: {
  chronologicalAge: number;
  phenotypicAge: number;
}) {
  const data = {
    labels: ["Chronological", "Phenotypic"],
    datasets: [
      {
        data: [chronologicalAge, phenotypicAge],
        backgroundColor: ["rgba(95,146,255,0.75)", "rgba(255,138,102,0.75)"],
        borderRadius: 6,
        barThickness: 48,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "#111523",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#f3efe6",
        bodyColor: "rgba(255,255,255,0.7)",
        callbacks: { label: (ctx: any) => `${ctx.raw.toFixed(1)} years` },
      },
    },
    scales: {
      x: { ticks: { color: "rgba(255,255,255,0.55)" }, grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { color: "rgba(255,255,255,0.4)" },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
    },
  };

  return (
    <div className="h-48">
      <Bar data={data} options={options} />
    </div>
  );
}
