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
- `lib/fsrs.ts` — FSRS scheduling wrapper around `ts-fsrs` (retention=0.9, max_interval=365, fuzz=true).
- `lib/types.ts` — `Question`, `Topic`, `ReviewState` types and `TOPICS` constant (8 topics).
- `lib/sample-data.ts` — 162 questions across all 8 topics (112 quiz + 50 solver). Fallback when DB is empty.
- `pdf_extracted/` — Extracted text from CHEM 121 PDF worksheets (committed, intentional content).
- `components/QuizCard.tsx` — Quiz mode (multiple-choice, numeric, short-text).
- `components/SolverCard.tsx` — Guided solver with unit-cancellation validation and sig-fig checking.
- `components/ReviewSession.tsx` — Review/quiz engine with auto-advance mode (review), 6-in-a-row mastery (practice), wrong-answer recycling, confetti on streaks. Calls `/api/review` to save results. Failed saves are queued via `lib/offline-sync.ts` for offline sync.
- `components/DashboardClient.tsx` — Dashboard with guided learning path. Each topic card has Learn + Quiz buttons. Locked/unlocked topics, streak, mastery %, due count.
- `components/Confetti.tsx` — Trigger-based confetti component (fires on 3-streak, 5-streak intervals, 80%+ session completion).
- `components/PWAInstallPrompt.tsx` — PWA install banner (detects beforeinstallprompt, iOS instructions, dismissible). All browser APIs accessed in useEffect only.
- `components/ServiceWorkerRegister.tsx` — Registers service worker (dev + production). Handles SW updates with auto-reload on controllerchange.
- `components/OfflineSync.tsx` — Online/offline indicator banner. Auto-flushes queued review saves when connectivity is restored. Listens for `online`/`offline` events and Background Sync messages from SW.
- `components/SettingsProvider.tsx` — React context for app settings (TTS voice, rate, theme). Persists to localStorage under `chem121-settings`. Loads voices async via onvoiceschanged.
- `components/SettingsPanel.tsx` — Settings UI: voice selection (lists all English voices), speed slider (0.5x-1.5x with presets), dark/light mode toggle. Mobile bottom sheet / desktop modal. Test voice button.
- `app/api/review/route.ts` — Edge API route that saves review state and log to Neon. Validates input including timeTakenMs (400 on invalid).
- `app/review/page.tsx` — Spaced repetition review. Only pulls from unlocked topics and due questions (not unseen). Passes autoAdvance={true}.
- `app/practice/[topic]/page.tsx` — Per-topic quiz. Enforces guided path lock server-side (50% seen threshold for previous topic, uses DB question IDs not sample data).
- `app/dashboard/page.tsx` — Dashboard (edge runtime; queries Neon directly).
- `app/learn/[topic]/page.tsx` — Per-topic learn page with detailed teaching content, diagrams (visual/table/comparison/flowchart/steps), worked examples, vocabulary flashcards, TTS narration buttons. DiagramRenderer handles 5 diagram types. SpeakButton uses Web Speech API with settings from SettingsProvider. Settings gear in header. Scroll progress bar with time remaining estimate (based on word count at 200 WPM + 30% overhead).
- `lib/learn-content.ts` — Detailed teaching content for all 8 topics. Written for zero-knowledge beginners. Includes concepts, formulas, worked examples, vocabulary, diagrams, and misconceptions.
- `lib/offline-sync.ts` — IndexedDB-based offline queue for review saves. `queueReview()` stores failed POSTs, `flushQueue()` replays them to `/api/review` when online. Falls back to localStorage if IndexedDB fails.
- `app/layout.tsx` — Root layout with PWA metadata, NavBar, ServiceWorkerRegister, PWAInstallPrompt, OfflineSync, SettingsProvider wrapper.
- `public/manifest.json` — PWA manifest (standalone display, start_url=/dashboard, /icon.svg).
- `public/sw.js` — Service worker v2. Pre-caches all 8 practice + 8 learn pages + dashboard + review. Network-first for pages (cache fallback), cache-first for static assets, stale-while-revalidate for other GETs. Background Sync support for offline review queue.

## Environment

- `DATABASE_URL` — Neon connection string with `sslmode=require`.

## Migration Notes

Migrated from Supabase to Neon on Aug 13 2026. Removed: auth pages, middleware, Supabase client/server utilities, and `LogoutButton`.

## Current State (as of last session)

- **176 questions** across 8 topics, all with explanations.
  - Fundamentals: 28, Metric System: 22, Atomic Structure: 10, Significant Figures: 24, Dimensional Analysis: 22, The Mole: 20, Stoichiometry: 25, Molarity & Dilutions: 25.
- **Study guide coverage**: Scientific method (hypothesis, theory, law, control, variables), physical/chemical properties, standard deviation, SI abbreviations (M, mol, mM, mmol, µM, µmol), mole vs molarity distinction, gas volume at STP (22.4 L/mol), stock solutions, C1V1=C2V2, dilution factor.
- **8 giveaway questions fixed** (fund-001, fund-008, fund-009, fund-010, diman-011, diman-012, mole-012, molarity-015).
- **Per-topic learn pages** at `/learn/[topic]` with detailed teaching content (concepts, diagrams, worked examples, vocabulary). Written for zero-knowledge beginners. Each section has a TTS play button. Scroll progress bar with time-remaining estimate in header.
- **Dashboard cards** have two buttons each: Learn (goes to `/learn/[topic]`) and Quiz (goes to `/practice/[topic]`).
- **NavBar** has only Dashboard and Review (Learn removed — learning is per-topic from dashboard).
- **6-in-a-row mastery** for quiz sessions: requires ALL questions attempted AND 6 consecutive correct to finish. Wrong answers recycle to end of queue (appended, not removed). "Mastered" = all questions correct + 6 in a row. "Completed" = 6 in a row only.
- **Review system**: Only pulls from unlocked topics and due questions (FSRS scheduled). Auto-advance mode with 4-second countdown. No unseen questions in review.
- **Guided learning path**: topics locked in order, unlock at 50% seen of previous topic. Enforced both on dashboard and server-side on practice pages (uses DB question IDs for threshold).
- **Text-to-speech**: Web Speech API with best-voice auto-selection (Google US English, Microsoft Natural, Apple Samantha). Text cleanup strips ASCII art, expands symbols. Natural sentence chunking with pauses. Settings panel lets user pick voice and speed.
- **Settings panel**: Gear icon on dashboard and learn pages. Voice selection (all English voices), speed slider (0.5x-1.5x with presets), dark/light mode toggle. All settings persist to localStorage.
- **Dark/light mode**: All colors converted to CSS variables. Light mode has white backgrounds, dark text, adjusted accent/status colors. Theme applied via class on `<html>`.
- **PWA + Offline**: manifest, service worker v2 (pre-caches all 16 topic pages + dashboard + review), install prompt (Chrome/Edge/Android + iOS instructions). Full offline support: pages load from cache, review saves queued in IndexedDB and synced when back online. Background Sync API used where supported. OfflineSync component shows status banner.
- **Feedback screen redesigned**: gradient background, spring icon animation, streak indicator, glow effects.
- **Confetti**: trigger-based, fires on streaks and high-accuracy session completion.
- **Build passes**: TypeScript 0 errors, Next.js build successful, all 22 routes return 200.
- **API validation**: questionId, isCorrect, and timeTakenMs all validated (400 on invalid).
- **SSR-safe**: All browser APIs accessed in useEffect only. No hydration mismatches.
- **Latest commit**: see git log on `main` (last: offline sync + bug fixes).

## Pedagogy Order

1. Teach the concept (learn page)
2. Show a worked example (interactive step-by-step)
3. Guide the learner through problems (SolverCard)
4. Independent practice (QuizCard)
5. Schedule via FSRS after each attempt

## Known Limitations / Future Work

- No per-choice explanations for multiple-choice distractors (only general question explanation + correct answer shown).
- Offline mode serves cached pages (last-visited state). Dashboard stats may be stale until back online. New topic pages not previously visited won't load offline.
- Background Sync API not supported on Safari/iOS — offline queue flushes via `online` event listener instead (requires app to be open).
- Illinois-specific content was added then removed per user request — content is generic Chem 121.
- The `pdf_extracted/` source covers: High School Review, Atomic Structure, Stoichiometry/Dimensional Analysis, Dilutions, Significant Figures, Terms. Does NOT cover: nomenclature, gas laws, thermochemistry, bonding, electron configuration, acids/bases, equilibrium (these are second-half CHEM 121 topics not in the supplied PDFs).
