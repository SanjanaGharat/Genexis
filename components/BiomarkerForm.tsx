"use client";

import { useState } from "react";
import { BiomarkerPanel, LifestyleInputs, Sex } from "@/lib/types";
import {
  LabUnitSystem,
  UNIT_LABELS,
  albuminFromSI,
  albuminToSI,
  creatinineFromSI,
  creatinineToSI,
  glucoseFromSI,
  glucoseToSI,
} from "@/lib/units";
import { ArrowRight, HelpCircle } from "lucide-react";

// Every clinical field is a string in form state so an input can be
// genuinely empty (not "0", not a fake default) — parsed to number|null
// only at submit time.
interface FormState {
  dateOfBirth: string;
  sex: Sex;
  albumin: string;
  creatinine: string;
  glucose: string;
  crp: string;
  lymphocytePercent: string;
  mcv: string;
  rdw: string;
  alkalinePhosphatase: string;
  wbc: string;
  smoker: boolean;
  alcoholUnitsPerWeek: number;
  exerciseDaysPerWeek: number;
  sleepHours: number;
  perceivedStress: number;
}

const defaultState: FormState = {
  dateOfBirth: "",
  sex: "unspecified",
  albumin: "",
  creatinine: "",
  glucose: "",
  crp: "",
  lymphocytePercent: "",
  mcv: "",
  rdw: "",
  alkalinePhosphatase: "",
  wbc: "",
  smoker: false,
  alcoholUnitsPerWeek: 0,
  exerciseDaysPerWeek: 3,
  sleepHours: 7,
  perceivedStress: 4,
};

function toNumberOrNull(s: string): number | null {
  if (s.trim() === "") return null;
  const n = parseFloat(s);
  return Number.isNaN(n) ? null : n;
}

function Field({
  label,
  unit,
  hint,
  children,
}: {
  label: string;
  unit?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-mono uppercase tracking-wide text-white/40">
        {label} {unit && <span className="text-white/25">({unit})</span>}
      </span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1 block text-[11px] text-white/30">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg bg-ink-800/80 border border-white/10 px-3.5 py-2.5 text-parchment text-sm placeholder:text-white/20 focus:border-cell-400/60 focus:outline-none transition-colors";

export default function BiomarkerForm({
  onSubmit,
}: {
  onSubmit: (biomarkers: BiomarkerPanel, lifestyle: LifestyleInputs) => void;
}) {
  const [unitSystem, setUnitSystem] = useState<LabUnitSystem>("us");
  const [data, setData] = useState<FormState>(defaultState);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function toggleUnits(next: LabUnitSystem) {
    if (next === unitSystem) return;
    setData((d) => {
      const conv = (s: string, toSI: (v: number | null, sys: LabUnitSystem) => number | null, fromSI: (v: number | null, sys: LabUnitSystem) => number | null) => {
        const n = toNumberOrNull(s);
        if (n === null) return "";
        const si = toSI(n, unitSystem);
        const out = fromSI(si, next);
        return out === null ? "" : (Math.round(out * 100) / 100).toString();
      };
      return {
        ...d,
        albumin: conv(d.albumin, albuminToSI, albuminFromSI),
        creatinine: conv(d.creatinine, creatinineToSI, creatinineFromSI),
        glucose: conv(d.glucose, glucoseToSI, glucoseFromSI),
      };
    });
    setUnitSystem(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const biomarkers: BiomarkerPanel = {
      dateOfBirth: data.dateOfBirth,
      sex: data.sex,
      albumin: albuminToSI(toNumberOrNull(data.albumin), unitSystem),
      creatinine: creatinineToSI(toNumberOrNull(data.creatinine), unitSystem),
      glucose: glucoseToSI(toNumberOrNull(data.glucose), unitSystem),
      crp: toNumberOrNull(data.crp),
      lymphocytePercent: toNumberOrNull(data.lymphocytePercent),
      mcv: toNumberOrNull(data.mcv),
      rdw: toNumberOrNull(data.rdw),
      alkalinePhosphatase: toNumberOrNull(data.alkalinePhosphatase),
      wbc: toNumberOrNull(data.wbc),
    };
    const lifestyle: LifestyleInputs = {
      smoker: data.smoker,
      alcoholUnitsPerWeek: data.alcoholUnitsPerWeek,
      exerciseDaysPerWeek: data.exerciseDaysPerWeek,
      sleepHours: data.sleepHours,
      perceivedStress: data.perceivedStress,
    };
    onSubmit(biomarkers, lifestyle);
  }

  const u = UNIT_LABELS[unitSystem];
  const filledCount = [
    data.albumin, data.creatinine, data.glucose, data.crp, data.lymphocytePercent,
    data.mcv, data.rdw, data.alkalinePhosphatase, data.wbc,
  ].filter((v) => v.trim() !== "").length;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Date of birth">
          <input
            type="date"
            required
            className={inputClass}
            value={data.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
          />
        </Field>
        <Field label="Sex">
          <select className={inputClass} value={data.sex} onChange={(e) => update("sex", e.target.value as Sex)}>
            <option value="unspecified">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </Field>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <p className="text-xs font-mono uppercase tracking-wide text-cell-400">
            Blood panel · {filledCount}/9 provided
          </p>
          <div className="inline-flex rounded-full border border-white/10 p-0.5 text-xs">
            {(["us", "si"] as LabUnitSystem[]).map((sys) => (
              <button
                key={sys}
                type="button"
                onClick={() => toggleUnits(sys)}
                className={`px-3 py-1 rounded-full transition-colors ${
                  unitSystem === sys ? "bg-cell-400 text-ink-950 font-semibold" : "text-white/50"
                }`}
              >
                {sys === "us" ? "US units" : "SI units"}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/40 mb-5 flex items-start gap-1.5">
          <HelpCircle size={13} className="mt-0.5 shrink-0" />
          Every field below is optional. Leave anything you don't have blank — it's estimated with a
          neutral, population-typical value and clearly flagged as such in your results, never silently
          guessed.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Albumin" unit={u.albumin} hint="CMP · protein/liver marker">
            <input type="number" step="0.01" placeholder="e.g. 4.5" className={inputClass} value={data.albumin}
              onChange={(e) => update("albumin", e.target.value)} />
          </Field>
          <Field label="Creatinine" unit={u.creatinine} hint="CMP · kidney filtration marker">
            <input type="number" step="0.01" placeholder="e.g. 0.9" className={inputClass} value={data.creatinine}
              onChange={(e) => update("creatinine", e.target.value)} />
          </Field>
          <Field label="Fasting glucose" unit={u.glucose} hint="CMP · metabolic marker">
            <input type="number" step="0.1" placeholder="e.g. 90" className={inputClass} value={data.glucose}
              onChange={(e) => update("glucose", e.target.value)} />
          </Field>
          <Field label="C-reactive protein" unit="mg/L" hint="Inflammation marker">
            <input type="number" step="0.01" placeholder="e.g. 1.0" className={inputClass} value={data.crp}
              onChange={(e) => update("crp", e.target.value)} />
          </Field>
          <Field label="Lymphocyte %" unit="%" hint="CBC differential">
            <input type="number" step="0.1" placeholder="e.g. 30" className={inputClass} value={data.lymphocytePercent}
              onChange={(e) => update("lymphocytePercent", e.target.value)} />
          </Field>
          <Field label="MCV" unit="fL" hint="CBC · mean red cell volume">
            <input type="number" step="0.1" placeholder="e.g. 90" className={inputClass} value={data.mcv}
              onChange={(e) => update("mcv", e.target.value)} />
          </Field>
          <Field label="RDW" unit="%" hint="CBC · red cell distribution width">
            <input type="number" step="0.1" placeholder="e.g. 13" className={inputClass} value={data.rdw}
              onChange={(e) => update("rdw", e.target.value)} />
          </Field>
          <Field label="Alkaline phosphatase" unit="U/L" hint="CMP · liver/bone enzyme">
            <input type="number" step="1" placeholder="e.g. 70" className={inputClass} value={data.alkalinePhosphatase}
              onChange={(e) => update("alkalinePhosphatase", e.target.value)} />
          </Field>
          <Field label="White blood cell count" unit="10⁹/L" hint="CBC · same numeric scale as K/µL">
            <input type="number" step="0.1" placeholder="e.g. 6.0" className={inputClass} value={data.wbc}
              onChange={(e) => update("wbc", e.target.value)} />
          </Field>
        </div>
      </div>

      <div>
        <p className="text-xs font-mono uppercase tracking-wide text-bio-400 mb-1">Lifestyle</p>
        <p className="text-xs text-white/40 mb-4">
          Not part of the PhenoAge formula — used only to shape your recommendations.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Average sleep" unit="hrs/night">
            <input type="number" step="0.5" min="0" max="16" className={inputClass}
              value={data.sleepHours} onChange={(e) => update("sleepHours", parseFloat(e.target.value) || 0)} />
          </Field>
          <Field label="Exercise" unit="days/week">
            <input type="number" step="1" min="0" max="7" className={inputClass}
              value={data.exerciseDaysPerWeek} onChange={(e) => update("exerciseDaysPerWeek", parseFloat(e.target.value) || 0)} />
          </Field>
          <Field label="Alcohol" unit="units/week">
            <input type="number" step="1" min="0" className={inputClass}
              value={data.alcoholUnitsPerWeek} onChange={(e) => update("alcoholUnitsPerWeek", parseFloat(e.target.value) || 0)} />
          </Field>
          <Field label="Perceived stress" unit="1–10 self-rated">
            <input type="range" min="1" max="10" step="1" className="w-full accent-bio-400"
              value={data.perceivedStress} onChange={(e) => update("perceivedStress", parseFloat(e.target.value))} />
            <div className="text-right text-xs font-mono text-white/50 mt-1">{data.perceivedStress}/10</div>
          </Field>
        </div>
        <label className="mt-5 flex items-center gap-3 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={data.smoker}
            onChange={(e) => update("smoker", e.target.checked)}
            className="h-4 w-4 rounded accent-bio-500"
          />
          <span className="text-sm text-white/60">Current smoker</span>
        </label>
      </div>

      <button
        type="submit"
        className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-cell-400 text-ink-950 px-7 py-3.5 font-semibold hover:bg-cell-300 transition-colors"
      >
        Calculate PhenoAge
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
