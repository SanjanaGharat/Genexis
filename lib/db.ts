import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

/**
 * A real, file-backed relational database — not a mock, not an in-memory
 * array pretending to be one. better-sqlite3 is a synchronous, natively
 * compiled SQLite driver; the schema below is created on first import if
 * it doesn't already exist, so there's no separate "run the migration"
 * step required before `npm run dev` works.
 *
 * ── Why not Prisma? ──────────────────────────────────────────────────
 * Prisma's `postinstall` step downloads a prebuilt query-engine binary
 * from binaries.prisma.sh at install time. That's a completely normal
 * dependency in a real developer's environment, but it made this project
 * impossible to verify end-to-end inside the sandboxed environment this
 * was generated in (that host is only allowed to reach npm/GitHub, not
 * Prisma's binary CDN) — so rather than ship an ORM setup that was never
 * actually run, this uses a driver with zero network dependency at
 * install time. Swapping back to Prisma (or Drizzle) is a reasonable
 * follow-up if you'd prefer typed migrations.
 *
 * ── Production note ─────────────────────────────────────────────────
 * SQLite-on-disk is genuinely durable for local dev and for any
 * always-on Node host (a VPS, Docker container, Railway/Render/Fly).
 * It is NOT durable on Vercel's serverless functions — the filesystem
 * outside /tmp is read-only at runtime and /tmp itself doesn't persist
 * across invocations. See README.md § "Production database" for the
 * exact swap to a hosted Postgres (the schema translates directly).
 */

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "genexis.db");

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const globalForDb = globalThis as unknown as { __genexisDb?: Database.Database };

export const db: Database.Database = globalForDb.__genexisDb ?? new Database(DB_PATH);
if (process.env.NODE_ENV !== "production") globalForDb.__genexisDb = db;

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS predictions (
    id                 TEXT PRIMARY KEY,
    device_id          TEXT NOT NULL,
    created_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    chronological_age  REAL NOT NULL,
    phenotypic_age     REAL NOT NULL,
    age_gap            REAL NOT NULL,
    mortality_score    REAL NOT NULL,
    classification     TEXT NOT NULL,
    biomarkers         TEXT NOT NULL,
    lifestyle          TEXT NOT NULL,
    facial_age         REAL,
    facial_confidence  REAL,
    recommendations    TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_predictions_device ON predictions(device_id, created_at);
`);
