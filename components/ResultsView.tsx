"use client";

import { motion } from "framer-motion";
import { PredictionRecord } from "@/lib/types";
import AgeGapDial from "./AgeGapDial";
import RadarChart from "./RadarChart";
import NormalizedBarChart from "./NormalizedBarChart";
import ContributionChart from "./ContributionChart";
import AgeCompareChart from "./AgeCompareChart";
import MortalityGauge from "./MortalityGauge";
import FacialSignalsCard from "./FacialSignalsCard";
import RecommendationList from "./RecommendationList";
import TrendChart, { TrendPoint } from "./TrendChart";
import Tilt3DCard from "./Tilt3DCard";
import Link from "next/link";
import { RotateCcw, Info, FileDown, FileJson } from "lucide-react";

export default function ResultsView({
  record,
  trend,
  onRestart,
}: {
  record: PredictionRecord;
  trend: TrendPoint[];
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="card-glass rounded-xl p-4 flex items-start gap-3 text-sm text-white/60">
        <Info size={16} className="mt-0.5 shrink-0 text-cell-400" />
        <p>
          <span className="text-white/80 font-medium">Chronological age</span> is time since birth.{" "}
          <span className="text-white/80 font-medium">Phenotypic (biological) age</span> is computed from
          your blood panel — it moves with how your body is actually functioning, not the calendar. A
          negative gap means your biomarkers read younger than your birth age; positive means older.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Tilt3DCard className="lg:col-span-2">
          <AgeGapDial
            chronologicalAge={record.chronologicalAge}
            phenotypicAge={record.phenoAge.phenotypicAge}
            ageGap={record.ageGap}
            classification={record.classification}
          />
        </Tilt3DCard>

        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6">
          <div className="card-glass rounded-2xl p-6 flex flex-col items-center justify-center">
            <h3 className="font-display text-base text-parchment mb-4 self-start">Age comparison</h3>
            <AgeCompareChart
              chronologicalAge={record.chronologicalAge}
              phenotypicAge={record.phenoAge.phenotypicAge}
            />
          </div>
          <div className="card-glass rounded-2xl p-6 flex flex-col items-center">
            <h3 className="font-display text-base text-parchment mb-2 self-start">Mortality score</h3>
            <MortalityGauge score={record.phenoAge.mortalityScore} />
          </div>
        </div>
      </div>

      {record.facialAge && <FacialSignalsCard facialAge={record.facialAge} />}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-parchment mb-1">Biomarker radar</h3>
          <p className="text-xs text-white/40 mb-4">Dashed ring marks the reference-range midpoint.</p>
          <RadarChart data={record.phenoAge.referenceStatuses} />
        </div>
        <div className="card-glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-parchment mb-1">Biomarker spread</h3>
          <p className="text-xs text-white/40 mb-4">
            Same data as the radar, read as deviations from the reference midpoint. Gray bars were left
            blank and estimated.
          </p>
          <NormalizedBarChart data={record.phenoAge.referenceStatuses} />
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 card-glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-parchment mb-1">What's driving your age gap</h3>
          <p className="text-xs text-white/40 mb-4">
            Each bar is your actual PhenoAge minus a recomputed PhenoAge with only that marker reset to
            its reference midpoint — a real, per-marker sensitivity, not a fixed weight table.
          </p>
          <ContributionChart data={record.phenoAge.contributions} />
        </div>

        <div className="lg:col-span-2 card-glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-parchment mb-1">Reference range check</h3>
          <p className="text-xs text-white/40 mb-4">Each of the nine PhenoAge inputs against its clinical range.</p>
          <ul className="space-y-2.5">
            {record.phenoAge.referenceStatuses.map((s) => (
              <li key={s.key} className="flex items-center justify-between text-sm gap-2">
                <span className="text-white/60 flex items-center gap-1.5">
                  {s.label}
                  {!s.measured && (
                    <span className="text-[9px] font-mono uppercase px-1 py-0.5 rounded bg-white/10 text-white/40">
                      est.
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-white/50">
                    {s.value} {s.unit}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      s.status === "normal"
                        ? "text-cell-400 bg-cell-400/10"
                        : s.status === "low"
                        ? "text-chrono-300 bg-chrono-400/10"
                        : "text-bio-400 bg-bio-400/10"
                    }`}
                  >
                    {s.status}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-glass rounded-2xl p-6">
        <h3 className="font-display text-lg text-parchment mb-4">Action plan</h3>
        <RecommendationList items={record.recommendations} />
      </div>

      {trend.length > 1 && (
        <div className="card-glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-parchment mb-4">Trend across sessions</h3>
          <TrendChart history={trend} />
        </div>
      )}

      <div className="flex flex-wrap gap-4 pt-2 no-print">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/70 hover:text-parchment hover:border-white/30 transition-colors"
        >
          <RotateCcw size={15} /> Run another
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/70 hover:text-parchment hover:border-white/30 transition-colors"
        >
          <FileDown size={15} /> Export as PDF
        </button>
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `genexis-report-${new Date(record.createdAt).toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/70 hover:text-parchment hover:border-white/30 transition-colors"
        >
          <FileJson size={15} /> Export JSON
        </button>
        <Link
          href="/history"
          className="inline-flex items-center gap-2 rounded-full bg-cell-400 text-ink-950 px-6 py-3 text-sm font-semibold hover:bg-cell-300 transition-colors"
        >
          View full history
        </Link>
      </div>
    </motion.div>
  );
}
