import { FacialAgeResult, LifestyleInputs, PhenoAgeResult, Recommendation } from "./types";

/**
 * Every recommendation traces to a named, out-of-range trigger from the
 * actual computed PhenoAge reference statuses or a stated lifestyle input
 * — nothing here is a black box, and nothing fires without a real value
 * crossing a real, cited reference range.
 */
export function generateRecommendations(
  ageGap: number,
  pheno: PhenoAgeResult,
  lifestyle: LifestyleInputs,
  facialAge: FacialAgeResult | null = null
): Recommendation[] {
  const recs: Recommendation[] = [];
  const byKey = Object.fromEntries(pheno.referenceStatuses.map((s) => [s.key, s]));

  if (byKey.glucose?.status === "high") {
    recs.push({
      category: "Metabolic",
      priority: 1,
      trigger: `Fasting glucose ${byKey.glucose.value} ${byKey.glucose.unit} is above the ${byKey.glucose.referenceRange[1]} ${byKey.glucose.unit} reference ceiling`,
      advice:
        "Elevated fasting glucose is one of the largest single contributors to the PhenoAge formula. Reducing refined carbohydrate and added-sugar intake, and adding post-meal walks, are the two interventions with the most evidence for lowering fasting glucose within weeks.",
    });
  }

  if (byKey.crp?.status === "high") {
    recs.push({
      category: "Inflammation",
      priority: byKey.crp.value > 10 ? 1 : 2,
      trigger: `CRP ${byKey.crp.value} mg/L is above the ${byKey.crp.referenceRange[1]} mg/L reference ceiling`,
      advice:
        "CRP above 10 mg/L usually reflects an acute infection or injury rather than baseline inflammation — consider retesting when you're not acutely unwell before acting on this. Persistently elevated CRP is linked to poor sleep, visceral fat, and periodontal disease; addressing those is the usual first line.",
    });
  }

  if (byKey.albumin?.status === "low") {
    recs.push({
      category: "Kidney & Liver",
      priority: 2,
      trigger: `Albumin ${byKey.albumin.value} ${byKey.albumin.unit} is below the ${byKey.albumin.referenceRange[0]} ${byKey.albumin.unit} reference floor`,
      advice:
        "Low albumin can reflect inadequate dietary protein, chronic inflammation, or liver/kidney function — it's worth discussing with a physician rather than self-treating, since the underlying cause changes the fix.",
    });
  }

  if (byKey.creatinine?.status === "high") {
    recs.push({
      category: "Kidney & Liver",
      priority: 2,
      trigger: `Creatinine ${byKey.creatinine.value} ${byKey.creatinine.unit} is above the ${byKey.creatinine.referenceRange[1]} ${byKey.creatinine.unit} reference ceiling`,
      advice:
        "Elevated creatinine can reflect reduced kidney filtration, dehydration at draw time, or high recent muscle exertion — a repeat test alongside eGFR is the right next step before drawing conclusions.",
    });
  }

  if (byKey.alkalinePhosphatase?.status === "high") {
    recs.push({
      category: "Kidney & Liver",
      priority: 2,
      trigger: `Alkaline phosphatase ${byKey.alkalinePhosphatase.value} U/L is above the ${byKey.alkalinePhosphatase.referenceRange[1]} U/L reference ceiling`,
      advice:
        "ALP is produced by both liver and bone — an isolated high reading is common and often benign, but persistent elevation is worth a liver panel follow-up.",
    });
  }

  if (byKey.rdw?.status === "high" || byKey.mcv?.status !== "normal") {
    recs.push({
      category: "Blood Panel",
      priority: 2,
      trigger: `${byKey.rdw?.status === "high" ? "RDW" : "MCV"} outside the reference range`,
      advice:
        "RDW and MCV outside range can point toward nutrient status (iron, B12, folate) — a ferritin/B12/folate panel is the standard follow-up before supplementing blindly.",
    });
  }

  if (byKey.wbc?.status !== "normal" || byKey.lymphocytePercent?.status !== "normal") {
    recs.push({
      category: "Blood Panel",
      priority: 3,
      trigger: "White cell count or lymphocyte percentage outside reference range",
      advice:
        "This can reflect a recent infection, stress response, or lab timing as often as anything chronic — worth a repeat panel in a few weeks if it wasn't already explained by how you were feeling on draw day.",
    });
  }

  // Lifestyle recommendations — informational, not part of the PhenoAge math itself.
  if (lifestyle.sleepHours < 7) {
    recs.push({
      category: "Sleep",
      priority: lifestyle.sleepHours < 6 ? 1 : 2,
      trigger: `Average sleep ${lifestyle.sleepHours} hrs/night, below the 7-9 hr adult recommendation`,
      advice:
        "Chronic short sleep is independently associated with elevated CRP and impaired glucose tolerance — both of which feed directly into this model's inputs. A consistent wake time is usually the highest-leverage first change.",
    });
  }
  if (lifestyle.exerciseDaysPerWeek < 3) {
    recs.push({
      category: "Exercise",
      priority: 2,
      trigger: `${lifestyle.exerciseDaysPerWeek} exercise days/week, below the commonly cited 150 min/week (~3+ sessions) target`,
      advice:
        "Regular moderate cardio plus resistance training measurably improves fasting glucose and inflammatory markers over 8-12 weeks — the two biomarkers here with the largest weight in the formula.",
    });
  }
  if (lifestyle.perceivedStress >= 7) {
    recs.push({
      category: "Stress Management",
      priority: 2,
      trigger: `Self-reported stress ${lifestyle.perceivedStress}/10`,
      advice:
        "Chronic stress elevates cortisol and CRP over time. A daily 10-minute breathing or mindfulness practice has trial evidence for lowering baseline stress within weeks — it won't move this quarter's blood panel but is worth starting now for the next one.",
    });
  }
  if (lifestyle.smoker) {
    recs.push({
      category: "Smoking & Alcohol",
      priority: 1,
      trigger: "Current smoker",
      advice:
        "Smoking measurably elevates WBC count and CRP, both direct inputs to this model. Cessation support (nicotine replacement, counseling) produces detectable biomarker improvement within months of quitting.",
    });
  }
  if (lifestyle.alcoholUnitsPerWeek > 14) {
    recs.push({
      category: "Smoking & Alcohol",
      priority: 2,
      trigger: `${lifestyle.alcoholUnitsPerWeek} units/week, above the commonly cited 14-unit/week guideline`,
      advice: "Reducing intake toward guideline levels tends to improve liver enzymes and inflammatory markers over subsequent panels.",
    });
  }

  if (pheno.imputedCount > 0) {
    recs.push({
      category: "Blood Panel",
      priority: pheno.imputedCount >= 5 ? 1 : 2,
      trigger: `${pheno.imputedCount} of 9 biomarkers were left blank`,
      advice: `${pheno.imputedCount} value${pheno.imputedCount > 1 ? "s were" : " was"} estimated using a population-typical midpoint rather than your actual lab result. The PhenoAge number above is only as accurate as your weakest input — a full CBC + CMP + CRP panel will sharpen it considerably.`,
    });
  }

  // Facial wellness signals — pixel-heuristic only, explicitly not a
  // dermatology diagnosis. Framed as general precautions, always pointing
  // toward a professional for anything persistent.
  if (facialAge?.signals) {
    const { underEyeDarknessIndex, skinTextureIndex } = facialAge.signals;
    if (underEyeDarknessIndex >= 0.35) {
      recs.push({
        category: "Skin & Wellness",
        priority: underEyeDarknessIndex >= 0.6 ? 2 : 3,
        trigger: `Under-eye area reads notably darker than your cheek baseline (index ${underEyeDarknessIndex.toFixed(2)})`,
        advice:
          "This is a pixel-brightness heuristic, not a diagnosis — lighting and camera angle affect it too. Under-eye darkening is commonly associated with poor sleep, dehydration, or allergies. If it's persistent regardless of sleep and hydration, a dermatologist can rule out other causes.",
      });
    }
    if (skinTextureIndex >= 0.5) {
      recs.push({
        category: "Skin & Wellness",
        priority: 3,
        trigger: `Elevated skin-texture/edge signal across cheeks and forehead (index ${skinTextureIndex.toFixed(2)})`,
        advice:
          "Again a pixel-texture heuristic, not a skin-condition classifier — photo resolution and lighting shift this number too. General precautions that help regardless of cause: daily broad-spectrum SPF, a consistent gentle cleanser/moisturizer routine, and staying hydrated. See a dermatologist for anything that looks like a persistent rash, lesion, or asymmetric mole — this tool cannot and does not screen for those.",
      });
    }
    if (facialAge.expression && facialAge.expressionProbability && facialAge.expressionProbability > 0.6 && ["sad", "angry", "fearful"].includes(facialAge.expression)) {
      recs.push({
        category: "Skin & Wellness",
        priority: 3,
        trigger: `Detected expression: ${facialAge.expression} (${Math.round(facialAge.expressionProbability * 100)}% confidence)`,
        advice:
          "One photo's expression isn't a mood measurement — but if stress has been weighing on you lately, it's worth pairing with the stress-management note above rather than ignoring either signal in isolation.",
      });
    }
  }

  if (ageGap >= 1.5) {
    recs.push({
      category: "Clinical Follow-up",
      priority: 1,
      trigger: `PhenoAge exceeds chronological age by ${ageGap.toFixed(1)} years`,
      advice:
        "This is a population-level statistical model, not a diagnosis. Bring this panel to a physician, especially any markers flagged high — they can interpret it alongside your full history.",
    });
  }

  if (recs.length === 0) {
    recs.push({
      category: "Clinical Follow-up",
      priority: 3,
      trigger: "All nine PhenoAge biomarkers within reference range",
      advice: "Nothing here needs urgent action. Re-test in 3-6 months to see whether the trend holds.",
    });
  }

  const order: Record<number, number> = { 1: 0, 2: 1, 3: 2 };
  return recs.sort((a, b) => order[a.priority] - order[b.priority]);
}
