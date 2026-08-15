import { randomUUID } from "crypto";
import { db } from "./db";

export interface PredictionRow {
  id: string;
  device_id: string;
  created_at: string;
  chronological_age: number;
  phenotypic_age: number;
  age_gap: number;
  mortality_score: number;
  classification: string;
  biomarkers: string;
  lifestyle: string;
  facial_age: number | null;
  facial_confidence: number | null;
  recommendations: string;
}

const insertStmt = db.prepare(`
  INSERT INTO predictions (
    id, device_id, chronological_age, phenotypic_age, age_gap, mortality_score,
    classification, biomarkers, lifestyle, facial_age, facial_confidence, recommendations
  ) VALUES (
    @id, @deviceId, @chronologicalAge, @phenotypicAge, @ageGap, @mortalityScore,
    @classification, @biomarkers, @lifestyle, @facialAge, @facialConfidence, @recommendations
  )
`);

const selectByIdStmt = db.prepare(`SELECT * FROM predictions WHERE id = ?`);

const listByDeviceStmt = db.prepare(`
  SELECT * FROM predictions WHERE device_id = ? ORDER BY created_at DESC LIMIT 50
`);

const deleteByDeviceStmt = db.prepare(`DELETE FROM predictions WHERE device_id = ?`);

export function insertPrediction(input: {
  deviceId: string;
  chronologicalAge: number;
  phenotypicAge: number;
  ageGap: number;
  mortalityScore: number;
  classification: string;
  biomarkers: string;
  lifestyle: string;
  facialAge: number | null;
  facialConfidence: number | null;
  recommendations: string;
}): PredictionRow {
  const id = randomUUID();
  insertStmt.run({ id, ...input });
  return selectByIdStmt.get(id) as PredictionRow;
}

export function listPredictionsForDevice(deviceId: string): PredictionRow[] {
  return listByDeviceStmt.all(deviceId) as PredictionRow[];
}

export function clearPredictionsForDevice(deviceId: string): number {
  const result = deleteByDeviceStmt.run(deviceId);
  return result.changes;
}
