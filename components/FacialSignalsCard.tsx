"use client";

import { FacialAgeResult } from "@/lib/types";
import { ScanFace, AlertCircle } from "lucide-react";

function SignalBar({ label, value, hint }: { label: string; value: number; hint: string }) {
  const color = value >= 0.6 ? "#ff8a66" : value >= 0.35 ? "#ffd166" : "#2be3a0";
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-white/60">{label}</span>
        <span className="font-mono" style={{ color }}>
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value * 100}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-1 text-[11px] text-white/35">{hint}</p>
    </div>
  );
}

export default function FacialSignalsCard({ facialAge }: { facialAge: FacialAgeResult }) {
  return (
    <div className="card-glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <ScanFace size={17} className="text-cell-400" />
        <h3 className="font-display text-lg text-parchment">Facial signals</h3>
      </div>
      <p className="text-xs text-white/40 mb-5">
        Real CNN output, on-device. Not blended into the PhenoAge number above.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <div className="font-mono text-xs text-white/40 uppercase">Estimated age</div>
          <div className="font-display text-2xl text-parchment">{facialAge.estimatedAge}</div>
        </div>
        <div>
          <div className="font-mono text-xs text-white/40 uppercase">Gender / expression</div>
          <div className="text-sm text-white/70 mt-1 capitalize">
            {facialAge.estimatedGender} ({Math.round(facialAge.genderProbability * 100)}%)
            {facialAge.expression && (
              <>
                {" · "}
                {facialAge.expression} ({Math.round((facialAge.expressionProbability ?? 0) * 100)}%)
              </>
            )}
          </div>
        </div>
      </div>

      {facialAge.signals ? (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <SignalBar
            label="Under-eye darkness"
            value={facialAge.signals.underEyeDarknessIndex}
            hint="Brightness under the eyes vs. cheek baseline — affected by lighting, not diagnostic."
          />
          <SignalBar
            label="Skin texture signal"
            value={facialAge.signals.skinTextureIndex}
            hint="Edge/texture density across cheeks and forehead — a heuristic, not a skin classifier."
          />
          <div className="flex items-start gap-2 pt-1">
            <AlertCircle size={13} className="text-white/30 mt-0.5 shrink-0" />
            <p className="text-[11px] text-white/35 leading-relaxed">
              These two numbers are pixel statistics located by a real landmark model, not output from a
              trained dermatology classifier. Treat them as general wellness cues — see your action plan
              below for what they suggest, and a dermatologist for anything persistent or concerning.
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-white/35 pt-4 border-t border-white/10">
          Landmark-based signals weren't available for this photo (face angle or resolution too limiting).
        </p>
      )}
    </div>
  );
}
