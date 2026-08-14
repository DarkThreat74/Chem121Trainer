import { sql, SINGLE_USER_ID } from "@/lib/db";
import { SAMPLE_QUESTIONS } from "@/lib/sample-data";
import ReviewSession from "@/components/ReviewSession";
import type { Question } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "edge";

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
            content: typeof q.content === "string" ? JSON.parse(q.content) : q.content,
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
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold">All caught up!</h2>
        <p className="mt-2 text-text-secondary">
          No cards due for review. Come back later or practice a specific topic.
        </p>
        <a
          href="/dashboard"
          className="mt-6 rounded-lg bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-hover"
        >
          Back to dashboard
        </a>
      </div>
    );
  }

  return <ReviewSession questions={queue} reviewStates={stateMap} />;
}
