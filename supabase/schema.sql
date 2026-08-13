-- Chem 121 Trainer — Supabase Schema
-- Run this in the Supabase SQL Editor

-- ============================================================
-- 1. users table (extends auth.users)
-- ============================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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
-- 5. RLS Policies
-- ============================================================
alter table public.users enable row level security;
alter table public.questions enable row level security;
alter table public.review_state enable row level security;
alter table public.review_log enable row level security;

-- Users: can only see/update their own row
create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Questions: readable by all authenticated users
create policy "Authenticated can read questions" on public.questions
  for select to authenticated using (true);

-- Review state: user can only see/modify their own
create policy "Users can read own review state" on public.review_state
  for select using (auth.uid() = user_id);
create policy "Users can insert own review state" on public.review_state
  for insert using (auth.uid() = user_id);
create policy "Users can update own review state" on public.review_state
  for update using (auth.uid() = user_id);
create policy "Users can delete own review state" on public.review_state
  for delete using (auth.uid() = user_id);

-- Review log: user can only see/insert their own
create policy "Users can read own review logs" on public.review_log
  for select using (auth.uid() = user_id);
create policy "Users can insert own review logs" on public.review_log
  for insert using (auth.uid() = user_id);
