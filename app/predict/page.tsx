"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ImageUpload from "@/components/ImageUpload";
import BiomarkerForm from "@/components/BiomarkerForm";
import ProcessingAnimation, { StageState } from "@/components/ProcessingAnimation";
import ResultsView from "@/components/ResultsView";
import { estimateFacialAge, NoFaceDetectedError } from "@/lib/faceEstimation";
import { createPrediction, listPredictions } from "@/lib/api";
import { BiomarkerPanel, FacialAgeResult, LifestyleInputs, PredictionRecord } from "@/lib/types";
import { TrendPoint } from "@/components/TrendChart";
import { AlertTriangle } from "lucide-react";

type Step = "upload" | "form" | "processing" | "results";

const stepIndex: Record<Step, number> = { upload: 0, form: 1, processing: 2, results: 3 };
const stepLabels = ["Photo", "Biomarkers", "Pipeline", "Report"];

const STAGE_LABELS = [
  "Loading pretrained CNN weights",
  "Detecting face & estimating age/gender",
  "Sending panel to the PhenoAge API",
  "Computing Phenotypic Age (Levine 2018)",
  "Building recommendation set",
];

export default function PredictPage() {
  const [step, setStep] = useState<Step>("upload");
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [stages, setStages] = useState<StageState[]>(
    STAGE_LABELS.map((label) => ({ label, status: "pending" }))
  );
  const [record, setRecord] = useState<PredictionRecord | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  function setStage(i: number, status: StageState["status"]) {
    setStages((prev) => prev.map((s, idx) => (idx === i ? { ...s, status } : s)));
  }

  async function runPipeline(biomarkers: BiomarkerPanel, lifestyle: LifestyleInputs) {
    setError(null);
    setStep("processing");
    setStages(STAGE_LABELS.map((label) => ({ label, status: "pending" })));

    let facialAge: FacialAgeResult | null = null;

    try {
      // Stage 0-1: real on-device CNN inference (skipped cleanly if no photo).
      if (imageEl) {
        setStage(0, "active");
        setStage(1, "active");
        try {
          facialAge = await estimateFacialAge(imageEl);
        } catch (e) {
          if (!(e instanceof NoFaceDetectedError)) throw e;
          // No face found — continue without a facial estimate rather than
          // failing the whole pipeline.
        }
        setStage(0, "done");
        setStage(1, "done");
      } else {
        setStage(0, "done");
        setStage(1, "done");
      }

      // Stage 2-3: real network round-trip; the server computes the actual
      // Phenotypic Age from the raw biomarkers (see app/api/predictions).
      setStage(2, "active");
      const created = await createPrediction(biomarkers, lifestyle, facialAge);
      setStage(2, "done");
      setStage(3, "done");

      // Stage 4: recommendations came back as part of the same response —
      // the "building" stage reflects that they've now arrived.
      setStage(4, "active");
      const history = await listPredictions();
      setStage(4, "done");

      setTrend(
        history.map((h) => ({
          createdAt: h.createdAt,
          chronologicalAge: h.chronologicalAge,
          phenotypicAge: h.phenotypicAge,
        }))
      );
      setRecord(created);
      setStep("results");
    } catch (e) {
      console.error(e);
      setStages((prev) => prev.map((s) => (s.status === "active" ? { ...s, status: "error" } : s)));
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong running the pipeline. Check the console for details."
      );
    }
  }

  function restart() {
    setStep("upload");
    setImageEl(null);
    setRecord(null);
    setError(null);
  }

  return (
    <div className="px-4 sm:px-6 pt-28 sm:pt-32 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 no-print">
          <h1 className="font-display text-2xl sm:text-3xl text-parchment">Genexis</h1>
          <p className="text-white/45 text-sm mt-1">
            Phenotypic age calculator — real published formula, real on-device face model, computed
            server-side.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-10 no-print">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`h-1.5 rounded-full flex-1 transition-colors duration-500 ${
                  i <= stepIndex[step] ? "bg-cell-400" : "bg-white/10"
                }`}
              />
            </div>
          ))}
        </div>
        <p className="font-mono text-xs text-white/40 uppercase mb-8 -mt-6 no-print">
          Step {stepIndex[step] + 1} of 4 — {stepLabels[stepIndex[step]]}
        </p>

        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, rotateY: -8, x: 24 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: 8, x: -24 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="perspective"
            >
              <h1 className="font-display text-3xl text-parchment mb-2">Start with a photo</h1>
              <p className="text-white/50 mb-8 max-w-lg">
                Optional — runs a real pretrained face-detection + age/gender CNN entirely in your
                browser (TensorFlow.js). Shown alongside your PhenoAge result for comparison; it isn't
                blended into that number. Skip if you'd rather go straight to the blood panel.
              </p>
              <div className="max-w-md">
                <ImageUpload
                  onImage={(img) => {
                    setImageEl(img);
                    setStep("form");
                  }}
                  onSkip={() => setStep("form")}
                />
              </div>
            </motion.div>
          )}

          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, rotateY: -8, x: 24 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: 8, x: -24 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="perspective"
            >
              <h1 className="font-display text-3xl text-parchment mb-2">Blood panel</h1>
              <p className="text-white/50 mb-8 max-w-lg">
                Nine biomarkers from a standard CBC + CMP + CRP — the exact inputs to the published
                Levine et al. (2018) Phenotypic Age formula. Sent to your own API route, computed
                server-side, and stored so your trend line works across visits.
              </p>
              <BiomarkerForm onSubmit={runPipeline} />
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProcessingAnimation stages={stages} />
              {error && (
                <div className="max-w-sm mx-auto mt-4 flex items-start gap-2 rounded-lg border border-bio-500/30 bg-bio-500/10 p-4 text-sm text-bio-300">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <div>
                    <p>{error}</p>
                    <button
                      onClick={() => setStep("form")}
                      className="mt-2 underline underline-offset-2 text-bio-200"
                    >
                      Back to the form
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === "results" && record && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-display text-3xl text-parchment mb-8">Your report</h1>
              <ResultsView record={record} trend={trend} onRestart={restart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
