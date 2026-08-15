/**
 * Standard clinical unit conversion factors (US-conventional ⇄ SI).
 * These are fixed physical/molar-mass conversion constants published in
 * any clinical chemistry reference — not tuned or estimated for this app.
 *
 *   Albumin:    g/dL × 10      = g/L
 *   Creatinine: mg/dL × 88.4   = µmol/L   (88.4 = 1000 / molar mass 88.4 g/mol... 
 *               actually derived from MW of creatinine, 113.12 g/mol,
 *               with the standard clinical factor of 88.4)
 *   Glucose:    mg/dL ÷ 18.0   = mmol/L   (18.0 = MW of glucose / 10, 180.16 g/mol)
 *
 * The Phenotypic Age model (lib/phenoAge.ts) always computes in SI. The
 * biomarker form lets the person enter values in whichever unit system
 * matches their lab report; these functions convert at that boundary.
 */

export const ALBUMIN_GDL_TO_GL = 10;
export const CREATININE_MGDL_TO_UMOLL = 88.4;
export const GLUCOSE_MGDL_TO_MMOLL = 18.0;

export type LabUnitSystem = "us" | "si";

export function albuminToSI(value: number | null, system: LabUnitSystem): number | null {
  if (value === null) return null;
  return system === "us" ? value * ALBUMIN_GDL_TO_GL : value;
}
export function albuminFromSI(value: number | null, system: LabUnitSystem): number | null {
  if (value === null) return null;
  return system === "us" ? value / ALBUMIN_GDL_TO_GL : value;
}

export function creatinineToSI(value: number | null, system: LabUnitSystem): number | null {
  if (value === null) return null;
  return system === "us" ? value * CREATININE_MGDL_TO_UMOLL : value;
}
export function creatinineFromSI(value: number | null, system: LabUnitSystem): number | null {
  if (value === null) return null;
  return system === "us" ? value / CREATININE_MGDL_TO_UMOLL : value;
}

export function glucoseToSI(value: number | null, system: LabUnitSystem): number | null {
  if (value === null) return null;
  return system === "us" ? value / GLUCOSE_MGDL_TO_MMOLL : value;
}
export function glucoseFromSI(value: number | null, system: LabUnitSystem): number | null {
  if (value === null) return null;
  return system === "us" ? value * GLUCOSE_MGDL_TO_MMOLL : value;
}

export const UNIT_LABELS: Record<LabUnitSystem, { albumin: string; creatinine: string; glucose: string }> = {
  us: { albumin: "g/dL", creatinine: "mg/dL", glucose: "mg/dL" },
  si: { albumin: "g/L", creatinine: "µmol/L", glucose: "mmol/L" },
};
