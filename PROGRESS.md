# Chem 121 Trainer — AI Handoff & Progress Document

> **Purpose:** This document allows any AI to pick up where the previous session left off.
> **Last updated:** Aug 13, 2026 8:30 PM CST
> **Updated by:** Devin session (UI/UX Interactive Redesign)

---

## Project Overview

A mobile-first Next.js 14 web app for interactive chemistry practice with FSRS spaced repetition.
Single-user app (no auth). Deployed to Vercel. Database on Neon Postgres.

**Stack:** Next.js App Router, TypeScript, Tailwind CSS, Neon Postgres (`@neondatabase/serverless`), `ts-fsrs`, lucide-react icons.

**Repo:** https://github.com/DarkThreat74/Chem121Trainer.git

---

## Environment

- `DATABASE_URL` env var (Neon connection string with `sslmode=require`)
- Connection string: `postgresql://neondb_owner:npg_OLYdMBUWp8i1@ep-ancient-heart-aybkrxpk-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require`
- Single user ID: `00000000-0000-0000-0000-000000000001`
- Vercel env vars needed: `DATABASE_URL` only (old Supabase vars should be removed)

---

## Key Files

| File | Purpose |
|------|---------|
| `neon/setup.sql` | Idempotent DB schema + seed data (run in Neon SQL Editor) |
| `lib/db.ts` | Neon serverless client (sql tagged template + SINGLE_USER_ID) |
| `lib/fsrs.ts` | FSRS scheduling wrapper (ts-fsrs) |
| `lib/types.ts` | Question, Topic, ReviewState types + TOPICS constant |
| `lib/sample-data.ts` | 98 sample questions across all 7 modules (fallback when DB empty) |
| `components/QuizCard.tsx` | Quiz mode (multiple-choice, numeric, short-text) |
| `components/SolverCard.tsx` | Guided solver with unit-cancellation validation + sig-fig checking |
| `components/ReviewSession.tsx` | Review queue engine, calls /api/review to save |
| `components/DashboardClient.tsx` | Dashboard with streak, mastery %, due count, topic list |
| `app/api/review/route.ts` | Edge API route that saves review state + log to Neon |
| `app/review/page.tsx` | Due-card review session |
| `app/practice/[topic]/page.tsx` | Per-topic practice |
| `app/dashboard/page.tsx` | Dashboard (edge runtime, queries Neon directly) |
| `tailwind.config.ts` | Custom color palette, fonts (Inter, JetBrains Mono), animations |
| `app/globals.css` | Font imports, dark theme, glassmorphism, custom scrollbar |
| `app/layout.tsx` | Root layout with dark mode |

---

## 7 Chemistry Topics (Chem 121 Curriculum)

1. **Fundamentals** — matter, measurements, atoms/molecules, physical vs chemical properties
2. **Metric System** — SI prefixes, conversions
3. **Significant Figures** — counting, rounding (mult/div, add/sub)
4. **Dimensional Analysis** — single/multi-step unit conversions, imperial↔metric
5. **The Mole** — Avogadro's number, molar mass, mole↔mass↔particles conversions
6. **Stoichiometry** — balanced equations, mole ratios, mass-to-mass, limiting reactant, percent yield
7. **Molarity & Dilutions** — molarity calculations, M₁V₁=M₂V₂ dilutions

---

## Research Basis (Pedagogy)

Content and UI were designed based on research using the `agent-reach` skill:
- **5E Framework:** Engage, Explore, Explain, Elaborate, Evaluate
- **Spaced Repetition (FSRS):** Proven to improve long-term retention in STEM
- **Scaffolding:** SolverCard guides step-by-step with unit cancellation validation
- **Worked Examples:** Every question has a detailed explanation
- **Immediate Feedback:** QuizCard and SolverCard show correct/incorrect with explanation
- **Metacognition:** Explanations teach the "why" not just the "what"

---

## Progress Tracker

### ✅ Completed

| # | Task | Details |
|---|------|---------|
| 1 | Research chemistry pedagogy | Used agent-reach for 5E model, spaced repetition, scaffolding, active learning research |
| 2 | Redesign color system, fonts, global styles | New Tailwind config with custom palette, Inter + JetBrains Mono fonts, glassmorphism, dark theme |
| 3 | Redesign Dashboard | Modern card UI, gradient accents, icon mapping, progress bars, stats display |
| 4 | Redesign QuizCard | Immersive question card, animated feedback states, gradient buttons, accessible controls |
| 5 | Redesign SolverCard | Cleaner step builder, animated steps, unit cancellation validation, sig-fig checking |
| 6 | Redesign ReviewSession | Progress header, feedback panel, session complete screen with trophy |
| 7 | Build content — Fundamentals (10 Q) | 10 quiz questions: measurement, accuracy/precision, physical/chemical, atoms/molecules, mass/weight |
| 7 | Build content — Metric System (10 Q) | 10 quiz questions: prefix meanings, prefix conversions |
| 7 | Build content — Significant Figures (18 Q) | 18 quiz questions: counting rules, rounding mult/div, rounding add/sub |
| 7 | Build content — Dimensional Analysis (14 Q) | 6 solver + 8 quiz: single-step, multi-step, imperial↔metric, concept questions |
| 7 | Build content — The Mole (14 Q) | 8 solver + 6 quiz: Avogadro's number, molar mass, mole↔mass↔particles |
| 7 | Build content — Stoichiometry (14 Q) | 8 solver + 6 quiz: balanced equations, mole ratios, mass-to-mass, limiting reactant, percent yield |
| 7 | Build content — Molarity & Dilutions (14 Q) | 8 solver + 6 quiz: molarity definition, calculations, dilution equation, solute/solvent |
| — | Fix stoic-009 bug | Correct answer was "H₂ is limiting" but O₂ is actually limiting — fixed |
| — | Migrate from Supabase to Neon | Removed auth, middleware, supabase client/server utils. Added Neon client. |
| — | Push middleware fix to GitHub | Deleted middleware.ts (was crashing Vercel with Supabase import error) |

**Total questions in sample-data.ts: 98** (all 7 topics covered)

### ✅ Database Injected (Aug 13, 2026 7:39 PM)

| # | Task | Details |
|---|------|---------|
| 8 | Inject 98 questions into Neon DB | Done via `scripts/inject-neon.ts` using `@neondatabase/serverless` driver. Schema created, 35 old questions deleted, 98 new questions inserted. Verified: 98 questions across 7 topics confirmed in database. |
| 8 | Update `neon/setup.sql` | Updated with schema + note referencing `lib/sample-data.ts` as source of truth. Old stale seed data removed. |

### ✅ Build & Push (Aug 13, 2026)

| # | Task | Details |
|---|------|---------|
| 9 | Build, verify, and push to git | `npx next build` passed with no errors. Committed `AGENTS.md` (commit 88bd95a) and pushed to `origin/main`. |

### ✅ UI/UX Overhaul — Interactive Redesign (Aug 13, 2026)

| # | Task | Details |
|---|------|---------|
| 10 | Study CHEM 121 PDFs | Extracted and studied 10 course PDFs: High School Review, Structure of Atom, Significant Figures, Stoichiometry & Dimensional Analysis, Dilutions (with answers), and Terms in CHEM 121. |
| 11 | Add framer-motion | Installed `framer-motion` for smooth spring animations throughout the app. |
| 12 | Responsive NavBar | Bottom tab bar on mobile, top nav on desktop. Active indicator with shared layout animation. Hidden during active review/practice sessions. |
| 13 | Landing page | Animated hero with floating orbs, gradient title, topic preview pills, feature cards, dual CTAs. |
| 14 | Enhanced Dashboard | 3-column animated stats (streak/due/reviews), weekly activity bar chart, animated progress bars, pulse ring on streak flame. |
| 15 | Enhanced QuizCard | Keyboard shortcuts (1-9 for choices, Enter to submit), hint system, difficulty badge, framer-motion shake/bounce feedback. |
| 16 | Enhanced SolverCard | Visual unit cancellation (strikethrough animation), running calculation display, hint system, difficulty badge, animated step additions. |
| 17 | Enhanced ReviewSession | Per-question timer, session streak counter with flame, confetti on ≥80% accuracy, 4-stat completion screen (correct/missed/accuracy/best streak), avg time per card. |
| 18 | Learn page | Comprehensive study guide from PDF content: sig fig rules + calculation rules, metric prefixes & base units, atomic particles table, key formulas, stoichiometry steps, dimensional analysis example, interactive 3D flip vocabulary flashcards (24 terms) with shuffle. |

### ⬜ Pending

| # | Task | Notes |
|---|------|-------|
| — | Verify Vercel deployment | Check that app loads without errors, DATABASE_URL is set in Vercel env vars |
| — | Expand content to 20+ Q per topic | Some topics have fewer questions; aim for 20+ each |

---

## Architecture Notes

- **No auth:** Single hardcoded user ID. No login/signup pages. No middleware.
- **No Supabase:** All Supabase files deleted. Neon is the only database.
- **Edge runtime:** Dashboard, practice, review, and API route use `export const runtime = 'edge'`
- **FSRS scheduling:** `lib/fsrs.ts` wraps `ts-fsrs`. Review state stored in `review_state` table with `stability`, `difficulty`, `due`, `reps`, `lapses`, `state`, `elapsed_days`, `scheduled_days`.
- **Fallback:** If DB has no questions, app falls back to `SAMPLE_QUESTIONS` from `lib/sample-data.ts`.

---

## Known Issues & Gotchas

1. **`neon/setup.sql` is stale** — must be updated with new 98 questions before running in Neon
2. **Vercel env vars** — `DATABASE_URL` must be set in Vercel project settings. Old `NEXT_PUBLIC_SUPABASE_*` vars should be removed.
3. **Git line endings** — Windows CRLF warnings are normal, not errors
4. **Tailwind CSS directives** — IDE may warn about `@apply` rules; these are non-critical
5. **stoic-009 was fixed** — limiting reactant question had wrong answer; corrected to "O₂ is limiting"
6. **Solver questions need `numerator_value` and `denominator_value`** in `solution_chain` — the old SQL didn't have these but the new sample-data.ts does

---

## Build & Deploy

```bash
# Build locally
npx next build

# Push to git (triggers Vercel auto-deploy)
git add -A
git commit -m "Update message"
git push origin main

# Update database (user runs in Neon SQL Editor)
# Paste contents of neon/setup.sql
```

---

## How to Continue

1. **First:** Run `npx next build` to verify TypeScript compiles
2. **Second:** Push to git (`git add -A; git commit; git push origin main`)
3. **Third:** Verify Vercel deployment works (check for 500 errors, ensure `DATABASE_URL` is set in Vercel env vars)
4. **To re-inject database:** Set `DATABASE_URL` env var and run `npx tsx scripts/inject-neon.ts`
5. **Optional future improvements:**
   - Add more questions per topic (aim for 20+ each)
   - Add interactive visualizations (3D atoms, molecular builder)
   - Add gamification (XP, levels, achievements)
   - Add knowledge graph for topic dependencies
   - Add adaptive difficulty based on performance
