import { z } from "zod";

export const sexSchema = z.enum(["female", "male", "unspecified"]);

export const biomarkerPanelSchema = z.object({
  dateOfBirth: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date"),
  sex: sexSchema,
  albumin: z.number().min(10).max(80).nullable(), // g/L (SI, canonical)
  creatinine: z.number().min(10).max(1500).nullable(), // µmol/L
  glucose: z.number().min(1).max(40).nullable(), // mmol/L
  crp: z.number().min(0).max(300).nullable(), // mg/L
  lymphocytePercent: z.number().min(0).max(100).nullable(),
  mcv: z.number().min(50).max(150).nullable(),
  rdw: z.number().min(8).max(30).nullable(),
  alkalinePhosphatase: z.number().min(5).max(1000).nullable(),
  wbc: z.number().min(0.5).max(50).nullable(),
});

export const lifestyleInputsSchema = z.object({
  smoker: z.boolean(),
  alcoholUnitsPerWeek: z.number().min(0).max(100),
  exerciseDaysPerWeek: z.number().min(0).max(7),
  sleepHours: z.number().min(0).max(16),
  perceivedStress: z.number().min(1).max(10),
});

export const facialAgeResultSchema = z
  .object({
    estimatedAge: z.number(),
    estimatedGender: z.enum(["male", "female"]),
    genderProbability: z.number().min(0).max(1),
    detectionConfidence: z.number().min(0).max(1),
    expression: z.string().nullable(),
    expressionProbability: z.number().min(0).max(1).nullable(),
    signals: z
      .object({
        underEyeDarknessIndex: z.number().min(0).max(1),
        skinTextureIndex: z.number().min(0).max(1),
      })
      .nullable(),
    modelSource: z.string(),
  })
  .nullable();

export const createPredictionSchema = z.object({
  biomarkers: biomarkerPanelSchema,
  lifestyle: lifestyleInputsSchema,
  facialAge: facialAgeResultSchema,
});

export type CreatePredictionInput = z.infer<typeof createPredictionSchema>;
