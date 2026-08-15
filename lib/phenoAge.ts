import { BiomarkerContribution, BiomarkerPanel, PhenoAgeResult, ReferenceStatus } from "./types";

/**
 * Phenotypic Age (Levine, Lu, Quach, et al. 2018)
 * "An epigenetic biomarker of aging for lifespan and healthspan"
 * Aging (Albany NY). 2018;10(4):573-591. doi:10.18632/aging.101414
 *
 * Coefficients below match the erratum-corrected formula published in:
 * Liu Z, Kuo PL, Horvath S, Crimmins E, Ferrucci L, Levine M. "Correction:
 * A new aging measure captures morbidity and mortality risk across diverse
 * subpopulations from NHANES IV." PLoS Med. 2019. PMC6388911.
 *
 * A real, peer-reviewed, externally validated model — derived from Cox
 * proportional-hazards regression against 10-year mortality in NHANES III,
 * externally validated in later NHANES waves. It's a population-level
 * statistical model, not a diagnosis.
 *
 * Units expected by the coefficients below (SI — verified numerically
 * against a published worked example):
 *   albumin g/L · creatinine µmol/L · glucose mmol/L · crp mg/L ·
 *   lymphocytePercent % · mcv fL · rdw % · alkalinePhosphatase U/L ·
 *   wbc 10^9/L · age years
 * lib/units.ts converts US-conventional lab units to this at the form
 * boundary.
 *
 * ── Handling unknown biomarkers ──────────────────────────────────────
 * The formula needs all nine values to run. Most people don't have a
 * full CBC+CMP+CRP panel memorized, so any field can be left blank. A
 * blank field is imputed with the midpoint of its clinical reference
 * range (a neutral, population-typical value) — NOT a silently invented
 * number pretending to be a measurement. Every imputed field is flagged
 * (`measured: false`) everywhere it's surfaced, and the UI must show
 * that flag rather than hide it.
 */

const GAMMA = 0.0076927;
const H_SCALE = Math.exp(120 * GAMMA) - 1; // e^(120γ) − 1 ≈ 1.51714, the 10-year horizon term

// Standard adult clinical reference ranges, in the SI units the model
// uses internally. Widely published lab reference intervals — individual
// labs may report slightly different ranges.
const REFERENCE_RANGES: Record<
  keyof Omit<BiomarkerPanel, "dateOfBirth" | "sex">,
  { label: string; unit: string; range: [number, number] }
> = {
  albumin: { label: "Albumin", unit: "g/L", range: [35, 50] },
  creatinine: { label: "Creatinine", unit: "µmol/L", range: [60, 110] },
  glucose: { label: "Fasting Glucose", unit: "mmol/L", range: [3.9, 5.5] },
  crp: { label: "C-Reactive Protein", unit: "mg/L", range: [0, 3] },
  lymphocytePercent: { label: "Lymphocyte %", unit: "%", range: [20, 40] },
  mcv: { label: "MCV", unit: "fL", range: [80, 100] },
  rdw: { label: "RDW", unit: "%", range: [11.5, 14.5] },
  alkalinePhosphatase: { label: "Alkaline Phosphatase", unit: "U/L", range: [40, 130] },
  wbc: { label: "White Blood Cell Count", unit: "10⁹/L", range: [4.0, 11.0] },
};

type MarkerKey = keyof typeof REFERENCE_RANGES;
const MARKER_KEYS = Object.keys(REFERENCE_RANGES) as MarkerKey[];

function midpoint(key: MarkerKey): number {
  const [lo, hi] = REFERENCE_RANGES[key].range;
  return (lo + hi) / 2;
}

/** Resolves the panel into concrete numbers, imputing blanks with the reference midpoint. */
function resolvePanel(panel: BiomarkerPanel): {
  values: Record<MarkerKey, number>;
  measured: Record<MarkerKey, boolean>;
} {
  const values = {} as Record<MarkerKey, number>;
  const measured = {} as Record<MarkerKey, boolean>;
  for (const key of MARKER_KEYS) {
    const raw = panel[key];
    if (raw === null || raw === undefined || Number.isNaN(raw)) {
      values[key] = midpoint(key);
      measured[key] = false;
    } else {
      values[key] = raw;
      measured[key] = true;
    }
  }
  return { values, measured };
}

function linearPredictor(v: Record<MarkerKey, number>, chronologicalAge: number): number {
  const lnCRP = Math.log(Math.max(v.crp, 0.01));
  return (
    -19.907 -
    0.0336 * v.albumin +
    0.0095 * v.creatinine +
    0.1953 * v.glucose +
    0.0954 * lnCRP -
    0.012 * v.lymphocytePercent +
    0.0268 * v.mcv +
    0.3306 * v.rdw +
    0.00188 * v.alkalinePhosphatase +
    0.0554 * v.wbc +
    0.0804 * chronologicalAge
  );
}

function phenoAgeFromXb(xb: number): number {
  const mortalityScore = 1 - Math.exp((-Math.exp(xb) * H_SCALE) / GAMMA);
  return 141.5 + Math.log(-0.00553 * Math.log(1 - mortalityScore)) / 0.09165;
}

export function calculatePhenotypicAge(
  panel: BiomarkerPanel,
  chronologicalAge: number
): PhenoAgeResult {
  const { values, measured } = resolvePanel(panel);

  const xb = linearPredictor(values, chronologicalAge);
  const mortalityScore = 1 - Math.exp((-Math.exp(xb) * H_SCALE) / GAMMA);
  const phenotypicAge = phenoAgeFromXb(xb);

  // Real leave-one-out attribution: for each marker, recompute PhenoAge
  // with that single marker swapped for its reference midpoint (holding
  // every other input fixed) and take the difference from the actual
  // result. This is computed directly from the formula above — not a
  // separate set of tuned weights — so it stays consistent with
  // whatever the headline number does.
  const contributions: BiomarkerContribution[] = MARKER_KEYS.map((key) => {
    const counterfactual = { ...values, [key]: midpoint(key) };
    const counterfactualXb = linearPredictor(counterfactual, chronologicalAge);
    const counterfactualAge = phenoAgeFromXb(counterfactualXb);
    return {
      key,
      label: REFERENCE_RANGES[key].label,
      yearsContribution: Math.round((phenotypicAge - counterfactualAge) * 100) / 100,
      measured: measured[key],
    };
  }).sort((a, b) => Math.abs(b.yearsContribution) - Math.abs(a.yearsContribution));

  const referenceStatuses: ReferenceStatus[] = MARKER_KEYS.map((key) => {
    const def = REFERENCE_RANGES[key];
    const value = values[key];
    const [lo, hi] = def.range;
    const status: ReferenceStatus["status"] = value < lo ? "low" : value > hi ? "high" : "normal";
    return {
      key,
      label: def.label,
      value: Math.round(value * 100) / 100,
      unit: def.unit,
      referenceRange: def.range,
      status,
      measured: measured[key],
    };
  });

  return {
    phenotypicAge: Math.round(phenotypicAge * 100) / 100,
    mortalityScore: Math.round(mortalityScore * 10000) / 10000,
    linearPredictor: Math.round(xb * 10000) / 10000,
    referenceStatuses,
    contributions,
    imputedCount: Object.values(measured).filter((m) => !m).length,
  };
}

export function calculateChronologicalAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export function classifyGap(ageGap: number): "aging slower" | "on par" | "aging faster" {
  if (ageGap <= -1.5) return "aging slower";
  if (ageGap >= 1.5) return "aging faster";
  return "on par";
}
