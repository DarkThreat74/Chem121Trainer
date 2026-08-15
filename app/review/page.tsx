import { sql, SINGLE_USER_ID } from "@/lib/db";
import { SAMPLE_QUESTIONS } from "@/lib/sample-data";
import ReviewSession from "@/components/ReviewSession";
import type { Question } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "edge";

function safeJsonParse(str: string): any {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

export default async function ReviewPage() {
  // Get all questions (from DB or sample fallback)
  let allQuestions: Question[];

  try {
    const dbQuestions = (await sql`
      SELECT id, topic, subtopic, mode, difficulty, content, is_sample
      FROM public.questions
      ORDER BY topic, difficulty
    `) as any[];

    allQuestions =
      dbQuestions.length > 0
        ? dbQuestions.map((q) => ({
            ...q,
            content: typeof q.content === "string" ? safeJsonParse(q.content) : q.content,
          }))
        : SAMPLE_QUESTIONS;
  } catch {
    allQuestions = SAMPLE_QUESTIONS;
  }

  // Get review states
  let reviewStates: any[] = [];
  try {
    reviewStates = await sql`
      SELECT question_id, stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review
      FROM public.review_state
      WHERE user_id = ${SINGLE_USER_ID}
    `;
  } catch {}

  const now = new Date();

  // Find due question IDs (oldest due first)
  const dueStates = reviewStates
    .filter((rs) => new Date(rs.due) <= now)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  // Find unseen question IDs
  const seenIds = new Set(reviewStates.map((rs) => rs.question_id));
  const unseenQuestions = allQuestions.filter((q) => !seenIds.has(q.id));

  // Build queue: due first, then unseen
  const dueQuestions: Question[] = dueStates
    .map((rs) => allQuestions.find((q) => q.id === rs.question_id))
    .filter((q): q is Question => q !== undefined);

  const queue: Question[] = [...dueQuestions, ...unseenQuestions];

  // Pass review states as a map for the client
  const stateMap: Record<string, any> = {};
  for (const rs of reviewStates) {
    stateMap[rs.question_id] = rs;
  }

  if (queue.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center safe-top safe-bottom">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-ok/20 to-accent/20">
          <svg className="h-10 w-10 text-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">All caught up!</h2>
        <p className="mt-2 max-w-sm text-text-secondary">
          No cards due for review. Come back later or practice a specific topic.
        </p>
        <a
          href="/dashboard"
          className="mt-6 rounded-xl bg-gradient-to-r from-accent-hover to-accent px-8 py-3.5 font-semibold text-white transition hover:opacity-90 glow-accent"
        >
          Back to dashboard
        </a>
      </div>
    );
  }

  return <ReviewSession questions={queue} reviewStates={stateMap} />;
}
