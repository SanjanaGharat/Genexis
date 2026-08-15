"use client";

import { motion } from "framer-motion";

export default function MortalityGauge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(1, score));
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - pct);
  const color = pct < 0.1 ? "#2be3a0" : pct < 0.3 ? "#ffd166" : "#ff8a66";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 140 140" className="w-36 h-36 -rotate-90">
        <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <motion.circle
          cx="70" cy="70" r="54" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="-mt-24 text-center">
        <div className="font-display text-3xl text-parchment">{(pct * 100).toFixed(1)}%</div>
      </div>
      <p className="mt-16 text-xs text-white/40 text-center max-w-[10rem]">
        Modeled 10-year all-cause mortality risk (Levine 2018 cohort)
      </p>
    </div>
  );
}
