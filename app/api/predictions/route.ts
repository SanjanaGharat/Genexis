export const runtime = "nodejs"; // better-sqlite3 needs the Node runtime, not Edge

import { NextRequest, NextResponse } from "next/server";
import { createPredictionSchema } from "@/lib/validation";
import { calculatePhenotypicAge, calculateChronologicalAge, classifyGap } from "@/lib/phenoAge";
import { generateRecommendations } from "@/lib/recommendations";
import { insertPrediction, listPredictionsForDevice, PredictionRow } from "@/lib/predictionsRepo";

function getDeviceId(req: NextRequest): string | null {
  return req.headers.get("x-device-id");
}

function shapeRow(r: PredictionRow) {
  return {
    id: r.id,
    createdAt: r.created_at,
    chronologicalAge: r.chronological_age,
    phenotypicAge: r.phenotypic_age,
    ageGap: r.age_gap,
    mortalityScore: r.mortality_score,
    classification: r.classification,
    facialAge: r.facial_age,
    biomarkers: JSON.parse(r.biomarkers),
    lifestyle: JSON.parse(r.lifestyle),
    recommendations: JSON.parse(r.recommendations),
  };
}

export async function POST(req: NextRequest) {
  const deviceId = getDeviceId(req);
  if (!deviceId) {
    return NextResponse.json({ error: "Missing x-device-id header." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createPredictionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { biomarkers, lifestyle, facialAge } = parsed.data;

  // ── The actual computation happens here, server-side. The client never
  // sends a precomputed age — only raw inputs — so the result can't be
  // tampered with in the browser and stays auditable from stored inputs.
  const chronologicalAge = calculateChronologicalAge(biomarkers.dateOfBirth);
  const phenoResult = calculatePhenotypicAge(biomarkers, chronologicalAge);
  const ageGap = Math.round((phenoResult.phenotypicAge - chronologicalAge) * 100) / 100;
  const classification = classifyGap(ageGap);
  const recommendations = generateRecommendations(ageGap, phenoResult, lifestyle, facialAge);

  try {
    const row = insertPrediction({
      deviceId,
      chronologicalAge,
      phenotypicAge: phenoResult.phenotypicAge,
      ageGap,
      mortalityScore: phenoResult.mortalityScore,
      classification,
      biomarkers: JSON.stringify(biomarkers),
      lifestyle: JSON.stringify(lifestyle),
      facialAge: facialAge?.estimatedAge ?? null,
      facialConfidence: facialAge?.detectionConfidence ?? null,
      recommendations: JSON.stringify(recommendations),
    });

    return NextResponse.json({
      id: row.id,
      createdAt: row.created_at,
      chronologicalAge,
      phenoAge: phenoResult,
      ageGap,
      classification,
      facialAge,
      recommendations,
      biomarkers,
      lifestyle,
    });
  } catch (err) {
    console.error("Failed to persist prediction:", err);
    return NextResponse.json({ error: "Database write failed." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const deviceId = getDeviceId(req);
  if (!deviceId) {
    return NextResponse.json({ error: "Missing x-device-id header." }, { status: 400 });
  }

  try {
    const rows = listPredictionsForDevice(deviceId);
    return NextResponse.json({ predictions: rows.map(shapeRow) });
  } catch (err) {
    console.error("Failed to load predictions:", err);
    return NextResponse.json({ error: "Database read failed." }, { status: 500 });
  }
}
