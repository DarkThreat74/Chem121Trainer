import { sql, SINGLE_USER_ID } from "@/lib/db";
import { notFound } from "next/navigation";
import { SAMPLE_QUESTIONS } from "@/lib/sample-data";
import ReviewSession from "@/components/ReviewSession";
import type { Question } from "@/lib/types";
import { TOPICS } from "@/lib/types";
import { Lock } from "lucide-react";

export const dynamic = "force-dynamic";
export const runtime = "edge";

function safeJsonParse(str: string): any {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

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
            content: typeof q.content === "string" ? safeJsonParse(q.content) : q.content,
          }))
        : SAMPLE_QUESTIONS.filter((q) => q.topic === params.topic);
  } catch {
    questions = SAMPLE_QUESTIONS.filter((q) => q.topic === params.topic);
  }

  // Guided path: check if previous topic is unlocked
  // First topic (order=1) is always unlocked
  const prevTopic = TOPICS.find((t) => t.order === topicInfo.order - 1);
  let isLocked = false;
  let prevTopicLabel = "";

  if (prevTopic) {
    let prevSeenCount = 0;
    let prevTotalCount = 0;
    try {
      // Count previous topic's questions and seen questions using a JOIN.
      // NOTE: We cannot use ANY(${array}) here because the Neon serverless
      // driver does not correctly serialize array parameters in the edge
      // runtime — the query silently returns 0 rows. A JOIN on the questions
      // table avoids the array parameter entirely.
      const prevStats = await sql`
        SELECT
          (SELECT COUNT(*) FROM public.questions WHERE topic = ${prevTopic.id}) as total,
          (SELECT COUNT(*)
           FROM public.review_state rs
           JOIN public.questions q ON q.id = rs.question_id
           WHERE rs.user_id = ${SINGLE_USER_ID}
             AND q.topic = ${prevTopic.id}
             AND rs.reps > 0) as seen
      `;
      prevTotalCount = prevStats[0]?.total || 0;
      prevSeenCount = prevStats[0]?.seen || 0;

      // Fallback to sample data count if DB has no questions for this topic
      if (prevTotalCount === 0) {
        prevTotalCount = SAMPLE_QUESTIONS.filter(
          (q) => q.topic === prevTopic.id
        ).length;
      }
    } catch {
      // DB unavailable — allow access (fallback mode)
    }

    if (prevTotalCount > 0 && prevSeenCount < prevTotalCount * 0.5) {
      isLocked = true;
      prevTopicLabel = prevTopic.label;
    }
  }

  if (isLocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center safe-top safe-bottom">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-bg-card">
          <Lock className="h-6 w-6 text-text-tertiary" />
        </div>
        <h2 className="mt-4 text-xl font-bold">{topicInfo.label}</h2>
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          This section is locked. Complete at least 50% of{" "}
          <span className="font-semibold text-text">{prevTopicLabel}</span>{" "}
          first to unlock this section.
        </p>
        <a
          href="/dashboard"
          className="mt-6 rounded-xl bg-gradient-to-r from-accent-hover to-accent px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Back to dashboard
        </a>
      </div>
    );
  }

  let reviewStates: any[] = [];
  try {
    // Use a JOIN to avoid ANY(${array}) which fails in the Neon edge runtime.
    reviewStates = await sql`
      SELECT rs.question_id, rs.stability, rs.difficulty, rs.due, rs.reps, rs.lapses, rs.state, rs.elapsed_days, rs.scheduled_days, rs.last_review
      FROM public.review_state rs
      JOIN public.questions q ON q.id = rs.question_id
      WHERE rs.user_id = ${SINGLE_USER_ID}
      AND q.topic = ${params.topic}
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
      <div className="mx-auto max-w-3xl px-4 py-6 lg:max-w-4xl">
        <div className="mb-4">
          <a
            href="/dashboard"
            className="text-sm text-text-secondary transition hover:text-text"
          >
            ← Back to dashboard
          </a>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs font-bold text-text-tertiary">STEP {topicInfo.order}</span>
            <h1 className="text-lg font-bold">{topicInfo.label}</h1>
          </div>
          <p className="mt-0.5 text-sm text-text-secondary">{topicInfo.description}</p>
        </div>
        <ReviewSession questions={questions} reviewStates={stateMap} />
      </div>
    </div>
  );
}
