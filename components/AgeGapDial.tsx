"use client";

import { motion } from "framer-motion";

export default function AgeGapDial({
  chronologicalAge,
  phenotypicAge,
  ageGap,
  classification,
}: {
  chronologicalAge: number;
  phenotypicAge: number;
  ageGap: number;
  classification: string;
}) {
  const clamped = Math.max(-10, Math.min(10, ageGap));
  const rotation = (clamped / 10) * 90; // -90..90 deg needle sweep

  const color =
    classification === "aging slower" ? "#2be3a0" : classification === "aging faster" ? "#ff8a66" : "#5f92ff";

  return (
    <div className="perspective">
      <motion.div
        initial={{ rotateX: 25, opacity: 0 }}
        animate={{ rotateX: 12, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="preserve-3d relative mx-auto w-full max-w-xs"
      >
        <svg viewBox="0 0 200 130" className="w-full">
          <path d="M 15 110 A 85 85 0 0 1 185 110" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" strokeLinecap="round" />
          <path
            d="M 15 110 A 85 85 0 0 1 185 110"
            fill="none"
            stroke="url(#gapGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="267"
            strokeDashoffset={267 - (267 * (clamped + 10)) / 20}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
          />
          <defs>
            <linearGradient id="gapGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5f92ff" />
              <stop offset="50%" stopColor="#2be3a0" />
              <stop offset="100%" stopColor="#ff8a66" />
            </linearGradient>
          </defs>
          <motion.line
            x1="100" y1="110" x2="100" y2="35"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ rotate: 0 }}
            animate={{ rotate: rotation }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "100px 110px" }}
          />
          <circle cx="100" cy="110" r="5" fill={color} />
        </svg>
        <div className="text-center -mt-3">
          <div className="font-display text-4xl" style={{ color }}>
            {ageGap > 0 ? "+" : ""}
            {ageGap.toFixed(1)}
            <span className="text-lg text-white/40 ml-1">yrs</span>
          </div>
          <p className="mt-1 text-sm font-mono uppercase tracking-wide" style={{ color }}>
            {classification}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="font-mono text-xs text-white/40 uppercase">Chronological</div>
            <div className="font-display text-2xl text-chrono-300">{chronologicalAge}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-white/40 uppercase">Phenotypic</div>
            <div className="font-display text-2xl text-bio-300">{phenotypicAge.toFixed(1)}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
