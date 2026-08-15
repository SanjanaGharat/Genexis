"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearPredictions, listPredictions } from "@/lib/api";
import TrendChart from "@/components/TrendChart";
import Reveal from "@/components/Reveal";
import { ArrowRight, Loader2, Trash2 } from "lucide-react";

interface Row {
  id: string;
  createdAt: string;
  chronologicalAge: number;
  phenotypicAge: number;
  ageGap: number;
  classification: string;
}

export default function HistoryPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await listPredictions();
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load history.");
      setRows([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="px-6 pt-32 pb-24">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <div>
              <h1 className="font-display text-3xl text-parchment">Trend history</h1>
              <p className="text-white/50 mt-1">Every prediction stored for this device in the database.</p>
            </div>
            {rows && rows.length > 0 && (
              <button
                onClick={async () => {
                  await clearPredictions();
                  await load();
                }}
                className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-bio-400 transition-colors"
              >
                <Trash2 size={14} /> Clear history
              </button>
            )}
          </div>
        </Reveal>

        {rows === null ? (
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : error ? (
          <Reveal className="card-glass rounded-2xl p-8 text-sm text-bio-400">
            {error} — if this is your first run, make sure you've run{" "}
            <code className="font-mono text-white/70">npm run db:migrate</code>.
          </Reveal>
        ) : rows.length === 0 ? (
          <Reveal className="card-glass rounded-2xl p-12 text-center">
            <p className="text-white/50">No predictions saved for this device yet.</p>
            <Link
              href="/predict"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-cell-400 text-ink-950 px-6 py-3 text-sm font-semibold hover:bg-cell-300 transition-colors"
            >
              Run your first prediction <ArrowRight size={15} />
            </Link>
          </Reveal>
        ) : (
          <div className="space-y-8">
            {rows.length > 1 && (
              <Reveal className="card-glass rounded-2xl p-6">
                <TrendChart history={rows} />
              </Reveal>
            )}

            <div className="space-y-3">
              {rows.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.03}>
                  <div className="card-glass rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-mono text-xs text-white/40">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-1 text-white/70 text-sm">
                        Chrono <span className="font-mono text-chrono-300">{r.chronologicalAge}</span> ·
                        PhenoAge <span className="font-mono text-bio-300">{r.phenotypicAge.toFixed(1)}</span>
                      </p>
                    </div>
                    <span
                      className={`text-xs font-mono uppercase px-3 py-1.5 rounded-full border ${
                        r.classification === "aging slower"
                          ? "border-cell-400/40 text-cell-400"
                          : r.classification === "aging faster"
                          ? "border-bio-400/40 text-bio-400"
                          : "border-chrono-400/40 text-chrono-300"
                      }`}
                    >
                      {r.ageGap > 0 ? "+" : ""}
                      {r.ageGap.toFixed(1)} yrs · {r.classification}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
