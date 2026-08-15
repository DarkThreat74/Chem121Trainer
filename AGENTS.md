# Chem 121 Trainer — Project Context

Chem 121 Trainer is a mobile-first Next.js 14 web app for interactive chemistry practice, using FSRS spaced repetition.

## Architecture

- **Single-user app** — no authentication.
- **Runtime**: Next.js App Router, TypeScript, Tailwind CSS.
- **Database**: Neon Postgres via the `@neondatabase/serverless` client.
- **Spaced repetition**: `ts-fsrs` for scheduling.
- **Deployment**: Vercel.

## Key Files

- `neon/setup.sql` — Idempotent DB schema and seed data (run in Neon SQL Editor).
- `lib/db.ts` — Neon serverless client (`sql` tagged template + `SINGLE_USER_ID`).
- `lib/fsrs.ts` — FSRS scheduling wrapper around `ts-fsrs`.
- `lib/types.ts` — `Question`, `Topic`, `ReviewState` types and `TOPICS` constant (8 topics).
- `lib/sample-data.ts` — 162 sample questions across all 8 modules (fallback when DB is empty).
- `docs/source-material/` — Extracted text from CHEM 121 PDF worksheets (study guides + answer keys).
- `components/QuizCard.tsx` — Quiz mode (multiple-choice, numeric, short-text).
- `components/SolverCard.tsx` — Guided solver with unit-cancellation validation and sig-fig checking.
- `components/ReviewSession.tsx` — Review queue engine; calls `/api/review` to save results.
- `components/DashboardClient.tsx` — Dashboard with streak, mastery %, due count, and topic list.
- `app/api/review/route.ts` — Edge API route that saves review state and log to Neon.
- `app/review/page.tsx` — Due-card review session.
- `app/practice/[topic]/page.tsx` — Per-topic practice.
- `app/dashboard/page.tsx` — Dashboard (edge runtime; queries Neon directly).

## Environment

- `DATABASE_URL` — Neon connection string with `sslmode=require`.

## Migration Notes

Migrated from Supabase to Neon on Aug 13 2026. Removed: auth pages, middleware, Supabase client/server utilities, and `LogoutButton`.
