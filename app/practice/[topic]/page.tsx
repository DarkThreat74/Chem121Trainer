import { sql, SINGLE_USER_ID } from "@/lib/db";
import { notFound } from "next/navigation";
import { SAMPLE_QUESTIONS } from "@/lib/sample-data";
import ReviewSession from "@/components/ReviewSession";
import type { Question } from "@/lib/types";
import { TOPICS } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function PracticePage({
  params,
}: {
  params: { topic: string };
}) {
  const topicInfo = TOPICS.find((t) => t.id === params.topic);
  if (!topicInfo) notFound();

  let questions: Question[];

  try {
    const dbQuestions = (await sql`
      SELECT id, topic, subtopic, mode, difficulty, content, is_sample
      FROM public.questions
      WHERE topic = ${params.topic}
      ORDER BY difficulty
    `) as any[];

    questions =
      dbQuestions.length > 0
        ? dbQuestions.map((q) => ({
            ...q,
            content: typeof q.content === "string" ? JSON.parse(q.content) : q.content,
          }))
        : SAMPLE_QUESTIONS.filter((q) => q.topic === params.topic);
  } catch {
    questions = SAMPLE_QUESTIONS.filter((q) => q.topic === params.topic);
  }

  let reviewStates: any[] = [];
  try {
    const questionIds = questions.map((q) => q.id);
    reviewStates = await sql`
      SELECT question_id, stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review
      FROM public.review_state
      WHERE user_id = ${SINGLE_USER_ID}
      AND question_id = ANY(${questionIds})
    `;
  } catch {}

  const stateMap: Record<string, any> = {};
  for (const rs of reviewStates) {
    stateMap[rs.question_id] = rs;
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold">{topicInfo.label}</h2>
        <p className="mt-2 max-w-sm text-text-secondary">
          No content available for this topic yet.
        </p>
        <a
          href="/dashboard"
          className="mt-6 rounded-lg border border-border bg-bg-card px-6 py-3 font-medium text-text transition hover:bg-bg-elevated"
        >
          Back to dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-top safe-bottom">
      <div className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <a
            href="/dashboard"
            className="text-sm text-text-secondary transition hover:text-text"
          >
            ← Back to dashboard
          </a>
          <h1 className="mt-1 text-lg font-bold">{topicInfo.label}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <ReviewSession questions={questions} reviewStates={stateMap} />
      </div>
    </div>
  );
}
