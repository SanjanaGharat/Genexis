"use client";

import { motion } from "framer-motion";
import { Check, Loader2, AlertTriangle } from "lucide-react";

export interface StageState {
  label: string;
  status: "pending" | "active" | "done" | "error";
}

/**
 * Purely presentational — every stage transition is driven by
 * app/page.tsx as each real async step (model load, inference,
 * API round-trip) actually resolves. There's no setTimeout choreography
 * here standing in for work that isn't happening.
 */
export default function ProcessingAnimation({ stages }: { stages: StageState[] }) {
  const doneCount = stages.filter((s) => s.status === "done").length;

  return (
    <div className="flex flex-col items-center py-16">
      <div className="relative h-28 w-28">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-cell-400/70"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
          style={{ borderTopColor: "transparent", borderLeftColor: "transparent" }}
        />
        <motion.span
          className="absolute inset-3 rounded-full border-2 border-bio-400/60"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          style={{ borderBottomColor: "transparent", borderRightColor: "transparent" }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/50">
          {doneCount}/{stages.length}
        </div>
      </div>

      <ul className="mt-10 space-y-3 w-full max-w-sm">
        {stages.map((s) => (
          <li key={s.label} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                s.status === "done"
                  ? "bg-cell-400 border-cell-400"
                  : s.status === "error"
                  ? "bg-bio-500 border-bio-500"
                  : s.status === "active"
                  ? "border-cell-400"
                  : "border-white/15"
              }`}
            >
              {s.status === "done" && <Check size={12} className="text-ink-950" />}
              {s.status === "active" && <Loader2 size={11} className="text-cell-400 animate-spin" />}
              {s.status === "error" && <AlertTriangle size={11} className="text-ink-950" />}
            </span>
            <span
              className={
                s.status === "done" || s.status === "active"
                  ? "text-white/80"
                  : s.status === "error"
                  ? "text-bio-400"
                  : "text-white/30"
              }
            >
              {s.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
