import Link from "next/link";
import HeroHelix from "@/components/HeroHelix";
import Reveal from "@/components/Reveal";
import Tilt3DCard from "@/components/Tilt3DCard";
import {
  ArrowRight,
  Camera,
  Database,
  FileDown,
  FlaskConical,
  LineChart,
  ScanFace,
  ShieldCheck,
} from "lucide-react";

const pipeline = [
  {
    title: "Blood panel — optional fields",
    detail:
      "Nine real biomarkers from a CBC + CMP + CRP. Don't have a value on hand? Leave it blank — it's imputed with a clinical reference-range midpoint and clearly flagged as estimated everywhere it appears, never silently guessed.",
    icon: FlaskConical,
  },
  {
    title: "On-device face model",
    detail:
      "A real pretrained CNN (TinyFaceDetector + AgeGenderNet + FaceExpressionNet + 68-point FaceLandmark, via TensorFlow.js) runs in your browser tab — age, gender, expression, and landmark-located skin signals. No image ever leaves your device.",
    icon: ScanFace,
  },
  {
    title: "Published formula",
    detail:
      "Biological age is the actual Levine et al. (2018) Phenotypic Age regression — peer-reviewed coefficients from a Cox model trained on 10-year NHANES mortality, not an invented weighting.",
    icon: FlaskConical,
  },
  {
    title: "Server-side computation",
    detail:
      "The client sends only raw values. The API route recomputes Phenotypic Age from those inputs and writes the result — the number in your report is auditable from what's stored, never client-trusted.",
    icon: Database,
  },
  {
    title: "Explainable output",
    detail:
      "Every recommendation cites the specific out-of-range value that triggered it. Per-marker \"years contributed\" bars come from re-running the real formula with that one marker reset — a genuine sensitivity, not a lookup table.",
    icon: ShieldCheck,
  },
  {
    title: "Trend + export",
    detail:
      "Every run is written to a real database and charted over time. Print or export any report as a PDF, or pull the raw JSON for your own records.",
    icon: FileDown,
  },
];

const stack = [
  { name: "Levine 2018 PhenoAge", desc: "The actual peer-reviewed 9-biomarker mortality-risk regression, unit-verified against a published worked example." },
  { name: "@vladmandic/face-api (TF.js)", desc: "Real pretrained face detection, age/gender, expression, and 68-point landmark networks, run entirely client-side." },
  { name: "Next.js API Routes + Zod", desc: "Server-side computation and input validation — the client never sends a precomputed age." },
  { name: "SQLite via better-sqlite3", desc: "A real relational database for history — file-backed, durable, no ORM binary-download step to break your install." },
  { name: "Chart.js + D3", desc: "Six chart types: radar, normalized bar, diverging contribution bar, age-comparison bar, mortality gauge, and trend line." },
  { name: "Next.js on Vercel", desc: "Edge-deployed, zero-config hosting with instant preview builds on every push." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-36 sm:pt-40 pb-20 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div>
            <Reveal>
              <p className="eyebrow font-mono text-xs text-cell-400 mb-5 uppercase">Two ages, one person</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-parchment text-balance">
                You have a birthday.
                <br />
                Your cells keep{" "}
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-bio-400 to-cell-400">
                  their own calendar.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-white/60 text-lg max-w-lg leading-relaxed">
                Genexis computes your biological age from a real, published clinical formula — a
                nine-biomarker regression validated against ten-year mortality risk — and pairs it with a
                real on-device face model. No invented weights, no client-trusted math.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/predict"
                  className="group inline-flex items-center gap-2 rounded-full bg-cell-400 text-ink-950 px-6 py-3.5 font-semibold hover:bg-cell-300 transition-colors"
                >
                  Run a calculation
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-white/70 hover:text-parchment text-sm font-medium underline decoration-white/20 underline-offset-4"
                >
                  See how the pipeline works
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="relative h-[340px] sm:h-[420px] md:h-[520px]">
            <HeroHelix />
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS — chrono vs bio */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="eyebrow font-mono text-xs text-bio-400 uppercase mb-3">Why the distinction matters</p>
            <h2 className="font-display text-3xl md:text-4xl text-parchment max-w-2xl text-balance">
              Two 40-year-olds can have completely different bodies.
            </h2>
            <p className="mt-4 text-white/60 max-w-2xl leading-relaxed">
              Chronological age is a poor predictor of disease risk. Biological age — how tissues and
              organ systems have actually worn — correlates strongly with cardiovascular disease, type 2
              diabetes, and cognitive decline. It's also the one that responds to what you actually do.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 overflow-x-auto rounded-2xl border border-white/10">
            <div className="grid grid-cols-3 text-sm min-w-[560px]">
              <div className="p-4 sm:p-5 font-mono text-xs uppercase text-white/40 tracking-wide">Aspect</div>
              <div className="p-4 sm:p-5 font-mono text-xs uppercase text-chrono-300 tracking-wide border-l border-white/10">Chronological age</div>
              <div className="p-4 sm:p-5 font-mono text-xs uppercase text-bio-300 tracking-wide border-l border-white/10">Biological (Phenotypic) age</div>

              {[
                ["Basis", "Calendar time since birth", "Nine blood biomarkers: albumin, creatinine, glucose, CRP, lymphocyte %, MCV, RDW, ALP, WBC"],
                ["Changeable", "No — fixed and linear", "Yes — moves with sleep, exercise, inflammation, metabolic health"],
                ["Validated against", "Nothing — it's a calendar count", "10-year all-cause mortality risk, NHANES III cohort (Levine et al. 2018)"],
                ["What Genexis computes it from", "Your date of birth", "Whatever blood values you provide — missing ones are imputed and flagged, never guessed silently"],
                ["Actionability", "None", "Each out-of-range marker maps to a specific, cited recommendation"],
              ].map(([a, b, c]) => (
                <div className="contents" key={a}>
                  <div className="p-4 sm:p-5 text-white/70 border-t border-white/10">{a}</div>
                  <div className="p-4 sm:p-5 text-white/50 border-t border-l border-white/10">{b}</div>
                  <div className="p-4 sm:p-5 text-white/80 border-t border-l border-white/10">{c}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PIPELINE */}
      <section id="how-it-works" className="px-4 sm:px-6 py-16 sm:py-20 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="eyebrow font-mono text-xs text-cell-400 uppercase mb-3">The pipeline, in order</p>
            <h2 className="font-display text-3xl md:text-4xl text-parchment max-w-2xl text-balance">
              Six real stages from photo + panel to action plan.
            </h2>
          </Reveal>

          <div className="mt-12 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {pipeline.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <Tilt3DCard className="h-full">
                  <div className="flex items-start justify-between">
                    <step.icon className="text-cell-400" size={22} strokeWidth={1.5} />
                    <span className="font-mono text-xs text-white/30">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl text-parchment">{step.title}</h3>
                  <p className="mt-2 text-sm text-white/55 leading-relaxed">{step.detail}</p>
                </Tilt3DCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FACIAL SIGNALS CALLOUT */}
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <Reveal>
            <p className="eyebrow font-mono text-xs text-bio-400 uppercase mb-3">Face model, honestly scoped</p>
            <h2 className="font-display text-3xl text-parchment text-balance">
              Real facial signals — framed as wellness cues, not diagnosis.
            </h2>
            <p className="mt-4 text-white/60 leading-relaxed">
              The optional photo step runs real trained networks: age/gender estimation, expression
              classification, and 68-point facial landmarks. From those landmarks, Genexis computes two
              honest pixel-level heuristics — under-eye darkness relative to the rest of your face, and
              skin-texture roughness across cheeks and forehead — and turns them into general precautions
              (sleep, hydration, sun protection). It does not run a dermatology-grade diagnostic model, and
              says so directly in your report rather than overstating what a texture heuristic can tell you.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card-glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <ScanFace size={18} className="text-cell-400" />
                <span className="text-sm text-white/70">Age, gender, expression — real CNN output</span>
              </div>
              <div className="flex items-center gap-3">
                <Camera size={18} className="text-cell-400" />
                <span className="text-sm text-white/70">68-point landmarks locate eyes, cheeks, forehead</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-cell-400" />
                <span className="text-sm text-white/70">Signals labeled as heuristics, with a stated confidence and limits</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="px-4 sm:px-6 py-16 sm:py-20 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="eyebrow font-mono text-xs text-bio-400 uppercase mb-3">Under the hood</p>
            <h2 className="font-display text-3xl md:text-4xl text-parchment max-w-2xl text-balance">
              Built to match the architecture, not just the pitch.
            </h2>
          </Reveal>
          <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stack.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.05}>
                <div className="card-glass rounded-2xl p-6 h-full">
                  <h3 className="font-display text-lg text-parchment">{s.name}</h3>
                  <p className="mt-2 text-sm text-white/55 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-24 sm:py-28">
        <Reveal className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-parchment text-balance">
            Find out which age you're actually living in.
          </h2>
          <p className="mt-5 text-white/55">Every field is optional. Takes about ninety seconds.</p>
          <Link
            href="/predict"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-cell-400 text-ink-950 px-8 py-4 font-semibold hover:bg-cell-300 transition-colors"
          >
            Run a calculation <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
