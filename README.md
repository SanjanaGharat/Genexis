# Genexis — Epigenetic Aging Reversal Predictor

A full-stack app that estimates biological age from a real, published
clinical formula and an optional real on-device face-analysis model,
compares it against chronological age, and turns the gap into a
prioritized, explainable action plan.

This isn't a UI mockup wired to fake numbers. Specifically:

- **Biological age** is computed with the actual **Levine et al. (2018)
  Phenotypic Age formula** — a peer-reviewed Cox regression against 10-year
  mortality in NHANES III, externally validated in later NHANES waves.
  See `lib/phenoAge.ts` for the full citation and the coefficients, which
  were numerically verified against a worked example before shipping.
- **Facial age** runs a real pretrained CNN — `@vladmandic/face-api`'s
  TinyFaceDetector + AgeGenderNet, actual TensorFlow.js model weights
  vendored into `public/models/`, executing inference in your browser tab.
  No image is ever uploaded anywhere.
- **The math happens server-side.** The client sends raw biomarker values
  to `/api/predictions`; the API route recomputes Phenotypic Age from
  those inputs and persists both. The number you see is never
  client-trusted.
- **Persistence is a real database** (SQLite via `better-sqlite3`), not
  `localStorage` dressed up as history.

**This is a screening/awareness tool, not a diagnostic or medical device.**
PhenoAge is a population-level statistical model; a single out-of-range
biomarker is not a diagnosis.

## What's genuinely real vs. what's a documented limitation

| Piece | Status |
|---|---|
| Phenotypic Age formula | Real published coefficients, verified |
| Facial age/gender CNN | Real pretrained weights, real inference |
| Server-side computation | Real — API route, not client math |
| Database | Real SQLite, durable locally / on any always-on host |
| Input validation | Real — Zod schemas, both client and server types share them |
| User identity | Anonymous per-browser UUID (see `lib/device.ts`) — **not** full auth. Real accounts (NextAuth/Clerk) are the natural next step, not implemented here. |
| Production database durability | SQLite-on-disk does **not** persist on Vercel serverless (ephemeral filesystem) — see "Production database" below for the required swap |

## Stack

- Next.js 14 (App Router) + TypeScript, API routes for the backend
- `better-sqlite3` — real embedded relational database
- Zod — request validation shared between client and server
- `@vladmandic/face-api` + TensorFlow.js — real pretrained CNN inference, client-side
- Tailwind CSS — custom design tokens (`tailwind.config.ts`)
- Framer Motion — page transitions, 3D tilt cards, staged reveals
- D3.js — biomarker reference-range radar chart
- Chart.js / react-chartjs-2 — age trend line chart

## Run it locally

Requires Node.js 18.18+ (Node 20 LTS recommended). `better-sqlite3` is
pinned to `11.10.0`, a version with prebuilt binaries for Windows/macOS/
Linux on Node 18-22 — `npm install` should **not** need a C++ compiler or
Visual Studio Build Tools. (An earlier build of this project shipped an
unpinned `^13.x` range that only had prebuilt binaries for Node 22+ and
fell back to compiling from source on Node 20, which fails without build
tools installed — if you still see a `node-gyp` / `find VS` error, check
that `package.json` shows `"better-sqlite3": "11.10.0"` and delete
`node_modules` + `package-lock.json` before reinstalling.)

```bash
npm install
npm run dev
```

Open http://localhost:3000. The SQLite database file is created
automatically on first API call at `data/genexis.db` — no manual migration
step required.

```bash
npm run build   # production build
npm run start   # serve the production build locally
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Genexis"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy to Vercel

Vercel's serverless functions have a **read-only filesystem outside
`/tmp`**, and `/tmp` doesn't persist between invocations — so the SQLite
setup above works great for local dev or any always-on host (a VPS,
Docker, Railway, Render, Fly.io) but will not durably store history once
deployed to Vercel as-is. You have two honest options:

**Option A — deploy anyway, accept ephemeral history.** Set
`DATABASE_PATH=/tmp/genexis.db` as an environment variable in the Vercel
project settings. The app fully works; predictions just won't survive a
cold start. Fine for a demo/portfolio deployment.

**Option B — swap in a real hosted database (recommended for production).**
The schema in `lib/db.ts` is nine columns and one index — trivial to port.
The cleanest swap that keeps SQLite's exact SQL dialect is
[Turso](https://turso.tech) (libSQL, serverless-friendly, generous free
tier):

1. `npm install @libsql/client` and remove `better-sqlite3`.
2. In `lib/db.ts`, replace the `better-sqlite3` client with
   `createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN })`
   from `@libsql/client`.
3. Update `lib/predictionsRepo.ts`'s prepared statements to libSQL's
   `execute()` API (same SQL strings, different call signature — the
   `.sql` file's contents don't change).
4. Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in Vercel's environment
   variables.

Postgres (Vercel Postgres / Neon / Supabase) works too with the same
schema and minor type tweaks (`TEXT` → appropriate types), using the `pg`
package instead.

Then deploy:

1. Push to GitHub (above).
2. Go to https://vercel.com/new and import the repository — Next.js is
   auto-detected, `vercel.json` pins the build settings explicitly.
3. Set your database environment variable(s) from whichever option above.
4. Deploy.

## Project structure

```
app/
  page.tsx                     the actual tool — 4-step wizard, IS the homepage
  history/page.tsx            trend history, reads from the real API
  api/predictions/route.ts    POST (compute + persist) / GET (list) — server-side
  api/predictions/clear/route.ts
components/                   charts, cards, forms, animations
lib/
  phenoAge.ts                 the real Levine 2018 formula + citation
  faceEstimation.ts           real CNN inference via @vladmandic/face-api
  recommendations.ts          rule-based recommendation engine
  units.ts                    real US⇄SI lab-unit conversion constants
  validation.ts                Zod schemas shared client/server
  db.ts / predictionsRepo.ts  the real SQLite layer
  device.ts                   anonymous per-browser identity
  api.ts                      typed client for the API routes
public/models/                real pretrained TinyFaceDetector + AgeGenderNet weights
```

## Roadmap (honest gaps, not implemented here)

- Real multi-device user accounts (NextAuth/Clerk) instead of the
  per-browser anonymous ID
- Rate limiting on the API routes
- A hosted production database wired up out of the box (see above — the
  code path is documented but you have to pick and provision one)
- Automated tests for `lib/phenoAge.ts` against more published worked
  examples

## Model & data credits

- Levine, M.E. et al. "An epigenetic biomarker of aging for lifespan and
  healthspan." *Aging (Albany NY)* 10(4):573-591, 2018.
  doi:10.18632/aging.101414 — coefficients per the erratum-corrected
  version in Liu et al., *PLoS Med*, 2019 (PMC6388911).
- Face detection & age/gender model weights:
  [github.com/vladmandic/face-api](https://github.com/vladmandic/face-api)
  (MIT licensed).

## License

MIT — see `LICENSE`.
