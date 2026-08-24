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
      // Get previous topic's actual question IDs from the DB (not sample data)
      // so the 50% unlock threshold is calculated against the real question set
      const prevDbQuestions = await sql`
        SELECT id FROM public.questions
        WHERE topic = ${prevTopic.id}
      ` as any[];
      let prevQuestionIds: string[];
      if (prevDbQuestions.length > 0) {
        prevQuestionIds = prevDbQuestions.map((q) => q.id);
      } else {
        // Fallback to sample data if DB has no questions for this topic
        prevQuestionIds = SAMPLE_QUESTIONS.filter(
          (q) => q.topic === prevTopic.id
        ).map((q) => q.id);
      }
      prevTotalCount = prevQuestionIds.length;
      if (prevTotalCount > 0) {
        const seenResult = await sql`
          SELECT COUNT(*) as seen
          FROM public.review_state
          WHERE user_id = ${SINGLE_USER_ID}
          AND question_id = ANY(${prevQuestionIds})
          AND reps > 0
        `;
        prevSeenCount = seenResult[0]?.seen || 0;
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
