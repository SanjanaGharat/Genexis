import { getDeviceId } from "./device";
import { BiomarkerPanel, FacialAgeResult, LifestyleInputs, PredictionRecord } from "./types";

async function authedFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-device-id": getDeviceId(),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function createPrediction(
  biomarkers: BiomarkerPanel,
  lifestyle: LifestyleInputs,
  facialAge: FacialAgeResult | null
): Promise<PredictionRecord> {
  return authedFetch("/api/predictions", {
    method: "POST",
    body: JSON.stringify({ biomarkers, lifestyle, facialAge }),
  });
}

interface PredictionListItem {
  id: string;
  createdAt: string;
  chronologicalAge: number;
  phenotypicAge: number;
  ageGap: number;
  mortalityScore: number;
  classification: string;
  facialAge: number | null;
  biomarkers: BiomarkerPanel;
  lifestyle: LifestyleInputs;
  recommendations: unknown;
}

export async function listPredictions(): Promise<PredictionListItem[]> {
  const data = await authedFetch("/api/predictions", { method: "GET" });
  return data.predictions;
}

export async function clearPredictions(): Promise<number> {
  const data = await authedFetch("/api/predictions/clear", { method: "DELETE" });
  return data.deleted;
}
