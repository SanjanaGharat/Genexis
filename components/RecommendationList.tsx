"use client";

import { motion } from "framer-motion";
import { Recommendation } from "@/lib/types";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

const priorityMeta: Record<number, { label: string; color: string; icon: any }> = {
  1: { label: "High priority", color: "#ff8a66", icon: AlertTriangle },
  2: { label: "Worth addressing", color: "#ffd166", icon: Info },
  3: { label: "On track", color: "#2be3a0", icon: CheckCircle2 },
};

export default function RecommendationList({ items }: { items: Recommendation[] }) {
  return (
    <ul className="space-y-3">
      {items.map((r, i) => {
        const meta = priorityMeta[r.priority];
        const Icon = meta.icon;
        return (
          <motion.li
            key={`${r.category}-${i}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="rounded-xl card-glass p-4 flex gap-3.5"
          >
            <Icon size={18} style={{ color: meta.color }} className="shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-wide" style={{ color: meta.color }}>
                  {r.category}
                </span>
                <span className="text-[10px] text-white/30">·</span>
                <span className="text-[10px] text-white/30">{meta.label}</span>
              </div>
              <p className="mt-1 text-sm text-white/80 leading-relaxed">{r.advice}</p>
              <p className="mt-1.5 text-xs text-white/35 italic">Trigger: {r.trigger}</p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
