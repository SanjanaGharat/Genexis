"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  BarController,
  LineController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { ReferenceStatus } from "@/lib/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, BarController, LineController);

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

export default function NormalizedBarChart({ data }: { data: ReferenceStatus[] }) {
  const normalized = data.map((d) => {
    const [lo, hi] = d.referenceRange;
    const mid = (lo + hi) / 2;
    const span = (hi - lo) / 2 || 1;
    const z = (d.value - mid) / span;
    return Math.max(-2, Math.min(2, z));
  });

  const chartData = {
    labels: data.map((d) => SHORT_LABEL[d.key as string] ?? d.label),
    datasets: [
      {
        type: "bar" as const,
        data: normalized,
        backgroundColor: data.map((d, i) =>
          !d.measured
            ? "rgba(255,255,255,0.12)"
            : d.status === "normal"
            ? "rgba(43,227,160,0.7)"
            : d.status === "low"
            ? "rgba(95,146,255,0.75)"
            : "rgba(255,138,102,0.75)"
        ),
        borderRadius: 4,
        barThickness: 22,
        order: 2,
      },
      {
        type: "line" as const,
        data: data.map(() => 0),
        borderColor: "rgba(43,227,160,0.5)",
        borderDash: [4, 4],
        pointRadius: 0,
        borderWidth: 1.5,
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111523",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#f3efe6",
        bodyColor: "rgba(255,255,255,0.7)",
        callbacks: {
          label: (ctx: any) => {
            const d = data[ctx.dataIndex];
            if (ctx.datasetIndex === 1) return "reference midpoint";
            return `${d.value} ${d.unit} (range ${d.referenceRange[0]}\u2013${d.referenceRange[1]})${d.measured ? "" : " — estimated"}`;
          },
        },
      },
    },
    scales: {
      x: { ticks: { color: "rgba(255,255,255,0.5)", font: { size: 10 } }, grid: { display: false } },
      y: {
        min: -2,
        max: 2,
        ticks: { color: "rgba(255,255,255,0.35)", stepSize: 1 },
        grid: { color: "rgba(255,255,255,0.06)" },
        title: { display: true, text: "std. deviations from range midpoint", color: "rgba(255,255,255,0.35)", font: { size: 10 } },
      },
    },
  };

  return (
    <div className="h-64">
      {/* @ts-ignore mixed bar/line chart typing */}
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
}
