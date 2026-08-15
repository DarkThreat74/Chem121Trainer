-- Chem 121 Trainer — Neon Database Setup
-- Safe to run multiple times (idempotent). Run in Neon SQL Editor.
-- Single-user app — no auth system, uses a hardcoded user ID.

-- ============================================================
-- 1. users table (single row for the app owner)
-- ============================================================
create table if not exists public.users (
  id uuid primary key default '00000000-0000-0000-0000-000000000001',
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

insert into public.users (id, display_name)
values ('00000000-0000-0000-0000-000000000001', 'Student')
on conflict (id) do nothing;

-- ============================================================
-- 2. questions table
-- ============================================================
create table if not exists public.questions (
  id text primary key,
  topic text not null,
  subtopic text not null,
  mode text not null check (mode in ('quiz', 'solver')),
  difficulty int not null default 1,
  content jsonb not null,
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_questions_topic on public.questions(topic);
create index if not exists idx_questions_mode on public.questions(mode);

-- ============================================================
-- 3. review_state table (FSRS scheduling state per user per question)
-- ============================================================
create table if not exists public.review_state (
  user_id uuid not null references public.users(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  stability float not null default 0,
  difficulty float not null default 0,
  due timestamptz not null default now(),
  reps int not null default 0,
  lapses int not null default 0,
  state int not null default 0,
  elapsed_days float not null default 0,
  scheduled_days float not null default 0,
  last_review timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create index if not exists idx_review_state_due on public.review_state(user_id, due);
create index if not exists idx_review_state_user on public.review_state(user_id);

-- ============================================================
-- 4. review_log table (every review event)
-- ============================================================
create table if not exists public.review_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  rating int not null,
  state int not null,
  due timestamptz not null,
  reviewed_at timestamptz not null default now(),
  time_taken_ms int not null default 0
);

create index if not exists idx_review_log_user on public.review_log(user_id, reviewed_at desc);
create index if not exists idx_review_log_question on public.review_log(user_id, question_id);

-- ============================================================
-- 5. Seed Sample Questions
-- ============================================================
-- 162 questions across 8 topics, injected directly via scripts/inject-neon.ts
-- Source of truth: lib/sample-data.ts
-- To re-inject: set DATABASE_URL env var and run: npx tsx scripts/inject-neon.ts
-- Or use the Neon SQL Editor to run individual INSERTs below.

DELETE FROM public.questions WHERE is_sample = true;

-- Note: The 162 questions are defined in lib/sample-data.ts and were
-- injected directly into the Neon database on Aug 13, 2026.
-- Topics: fundamentals (22), metric-system (20), atomic-structure (10),
-- significant-figures (22), dimensional-analysis (22), the-mole (20),
-- stoichiometry (23), molarity-dilutions (23).
-- To re-seed, run the inject script or copy INSERTs from lib/sample-data.ts.
