export type Sex = "female" | "male" | "unspecified";

/**
 * The nine biomarkers used by the Levine et al. (2018) Phenotypic Age
 * formula, in the conventional US lab units the published coefficients
 * expect. See lib/phenoAge.ts for the formula itself and a citation.
 */
export interface BiomarkerPanel {
  dateOfBirth: string; // ISO date, used to derive chronological age
  sex: Sex;
  albumin: number | null; // g/dL — null if unknown
  creatinine: number | null; // mg/dL
  glucose: number | null; // mg/dL, fasting
  crp: number | null; // mg/L, C-reactive protein
  lymphocytePercent: number | null; // %
  mcv: number | null; // fL, mean cell volume
  rdw: number | null; // %, red cell distribution width
  alkalinePhosphatase: number | null; // U/L
  wbc: number | null; // K/µL (x10^9/L), white blood cell count
}

/**
 * Lifestyle factors are NOT part of the validated PhenoAge formula — they
 * feed the rule-based recommendation engine only, kept separate so the
 * headline age number stays traceable to the published model alone.
 */
export interface LifestyleInputs {
  smoker: boolean;
  alcoholUnitsPerWeek: number;
  exerciseDaysPerWeek: number;
  sleepHours: number;
  perceivedStress: number; // 1-10 self-report
}

export interface FacialSignal {
  underEyeDarknessIndex: number; // 0-1, pixel-brightness heuristic — NOT a diagnosis
  skinTextureIndex: number; // 0-1, edge-density heuristic across cheeks/forehead
}

export interface FacialAgeResult {
  estimatedAge: number;
  estimatedGender: "male" | "female";
  genderProbability: number; // 0-1
  detectionConfidence: number; // 0-1, face detector's box confidence
  expression: string | null; // top expression label, if landmarks+expression model ran
  expressionProbability: number | null;
  signals: FacialSignal | null; // null if landmarks couldn't be located
  modelSource: string;
}

export interface ReferenceStatus {
  key: keyof BiomarkerPanel;
  label: string;
  value: number;
  unit: string;
  referenceRange: [number, number];
  status: "low" | "normal" | "high";
  measured: boolean; // false if this value was imputed because it was left blank
}

export interface BiomarkerContribution {
  key: string;
  label: string;
  yearsContribution: number; // signed — how many years this marker adds/subtracts vs. a reference-midpoint value
  measured: boolean;
}

export interface PhenoAgeResult {
  phenotypicAge: number;
  mortalityScore: number; // 0-1, 10-year all-cause mortality risk per the model
  linearPredictor: number; // raw xb term, exposed for transparency/debugging
  referenceStatuses: ReferenceStatus[];
  contributions: BiomarkerContribution[];
  imputedCount: number; // how many of the 9 markers were left blank and estimated
}

export type RecommendationCategory =
  | "Metabolic"
  | "Inflammation"
  | "Kidney & Liver"
  | "Blood Panel"
  | "Exercise"
  | "Sleep"
  | "Stress Management"
  | "Smoking & Alcohol"
  | "Skin & Wellness"
  | "Clinical Follow-up";

export interface Recommendation {
  category: RecommendationCategory;
  priority: 1 | 2 | 3;
  trigger: string;
  advice: string;
}

export interface PredictionRecord {
  id: string;
  createdAt: string; // ISO timestamp
  chronologicalAge: number;
  phenoAge: PhenoAgeResult;
  ageGap: number;
  classification: "aging slower" | "on par" | "aging faster";
  facialAge: FacialAgeResult | null;
  recommendations: Recommendation[];
  biomarkers: BiomarkerPanel;
  lifestyle: LifestyleInputs;
}
