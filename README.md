# Chem 121 Trainer

A mobile-first introductory chemistry learning app built with Next.js 14, TypeScript, and spaced repetition (FSRS). Designed to teach CHEM 121 concepts from zero knowledge, with detailed diagrams, worked examples, and guided practice.

## Features

### Learning Path
- **8 topics** taught in sequence: Fundamentals, Metric System, Atomic Structure, Significant Figures, Dimensional Analysis, The Mole, Stoichiometry, Molarity & Dilutions
- Each topic has a dedicated **Learn page** with detailed concept explanations, ASCII diagrams, data tables, side-by-side comparisons, flowcharts, worked examples, and vocabulary flashcards
- **Text-to-speech narration** on every section — tap the speaker icon to have the content read aloud
- Topics unlock progressively as you complete the previous one (50% threshold)
- Content written for students with zero chemistry knowledge

### Quiz System
- Each topic has a **Quiz** with 10-23 questions (162 total across all topics)
- Two question modes: **Quiz** (multiple choice, short text, numeric) and **Solver** (guided step-by-step unit conversion with sig fig checking)
- **6-in-a-row mastery**: Get 6 consecutive correct answers to complete a session
- Wrong answers recycle to the end of the queue so you get another chance
- "Mastered" = 6 in a row AND every unique question answered correctly at least once
- "Completed" = 6 in a row but not all questions mastered yet

### Review (Spaced Repetition)
- Uses **FSRS** (Free Spaced Repetition Scheduler) for optimal review scheduling
- Review only pulls from **unlocked topics** and **due questions** (not unseen ones)
- Questions appear in review only after FSRS schedules them (delayed onset)
- **Auto-advance mode**: Shows explanation briefly with a 4-second countdown, then automatically advances to the next question
- Continuous flow until all due cards are reviewed

### PWA Support
- Installable on iOS, Android, and desktop
- Service worker with network-first for pages, cache-first for static assets
- Service worker never intercepts POST requests (review saves always go through)
- Install prompt with platform-specific instructions

### UI/UX
- Mobile-first responsive design (works on phone, tablet, desktop)
- **Dark and light mode** — toggle in settings, persists across sessions
- **Settings panel** — voice selection, reading speed, theme toggle (gear icon on dashboard and learn pages)
- Framer Motion animations throughout
- Confetti on streaks and high-accuracy completions
- Safe area support for notched devices
- Bottom nav on mobile, top nav on desktop

## Tech Stack

- **Next.js 14.2.5** (App Router)
- **React 18**
- **TypeScript 5.5**
- **Tailwind CSS 3.4**
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **Neon Postgres** (`@neondatabase/serverless`)
- **ts-fsrs** (spaced repetition scheduling)
- **Vercel** (deployment)

## Project Structure

```
app/
  api/review/route.ts       # Edge API: saves review state + log to Neon
  dashboard/page.tsx        # Dashboard with guided learning path
  learn/[topic]/page.tsx    # Per-topic learn pages (teaching content)
  practice/[topic]/page.tsx # Per-topic quiz sessions (server-side lock)
  review/page.tsx           # Spaced repetition review session
  layout.tsx                # Root layout (PWA, NavBar, SW register)
  page.tsx                  # Landing page
  loading.tsx               # Loading screen
  globals.css               # Global styles + Tailwind

components/
  DashboardClient.tsx       # Dashboard UI (topic cards with Learn + Quiz buttons)
  ReviewSession.tsx         # Review/quiz engine (auto-advance, 6-in-a-row, recycling)
  QuizCard.tsx              # Quiz mode renderer (MC, numeric, short text)
  SolverCard.tsx            # Solver mode renderer (guided unit conversion)
  NavBar.tsx                # Navigation (Dashboard + Review)
  Confetti.tsx              # Trigger-based confetti
  PWAInstallPrompt.tsx      # PWA install banner (SSR-safe)
  ServiceWorkerRegister.tsx # SW registration (production only)
  SettingsProvider.tsx      # Settings context (voice, rate, theme + localStorage)
  SettingsPanel.tsx         # Settings UI (voice picker, speed slider, dark/light toggle)

lib/
  types.ts                  # Question, Topic types + TOPICS constant (8 topics)
  sample-data.ts            # 162 questions (112 quiz + 50 solver) fallback
  learn-content.ts          # Detailed teaching content for all 8 topics
  db.ts                     # Neon serverless client
  fsrs.ts                   # FSRS scheduling wrapper

public/
  manifest.json             # PWA manifest
  sw.js                     # Service worker
  icon.svg                  # App icon

docs/
  source-material/          # Extracted text from CHEM 121 PDF worksheets
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon Postgres database (or use the sample data fallback)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

Without `DATABASE_URL`, the app falls back to `lib/sample-data.ts` (162 questions) and review saves will fail silently (logged to console).

### Database Setup

Run `neon/setup.sql` in the Neon SQL Editor to create the schema and seed questions.

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Question Bank

| Topic | Questions | Mode |
|---|---:|---|
| Fundamentals | 22 | Quiz |
| Metric System | 20 | Quiz |
| Atomic Structure | 10 | Quiz |
| Significant Figures | 22 | Mixed |
| Dimensional Analysis | 22 | Solver |
| The Mole | 20 | Solver |
| Stoichiometry | 23 | Solver |
| Molarity & Dilutions | 23 | Solver |
| **Total** | **162** | |

All questions have explanations. 8 giveaway/answer-leaking questions were fixed.

## Pedagogy

The app follows this learning order:

1. **Teach** the concept (Learn page with diagrams and explanations)
2. **Show worked examples** (interactive step-by-step reveal)
3. **Guide** through problems (SolverCard with unit cancellation validation)
4. **Independent practice** (QuizCard with feedback explanations)
5. **Schedule review** via FSRS spaced repetition

## License

Personal project for CHEM 121 study.
