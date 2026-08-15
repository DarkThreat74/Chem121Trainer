import { sql, SINGLE_USER_ID } from "@/lib/db";
import { SAMPLE_QUESTIONS } from "@/lib/sample-data";
import ReviewSession from "@/components/ReviewSession";
import { TOPICS, type Question, type Topic } from "@/lib/types";

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

  // Calculate which topics are unlocked based on guided path progress
  // A topic is unlocked if:
  //   - It is the first topic (order 1), OR
  //   - The previous topic has seen >= 50% of its total question count
  const sortedTopics = [...TOPICS].sort((a, b) => a.order - b.order);
  const topicQuestionCounts: Record<string, number> = {};
  for (const t of sortedTopics) {
    topicQuestionCounts[t.id] = allQuestions.filter((q) => q.topic === t.id).length;
  }

  const topicSeenCounts: Record<string, number> = {};
  for (const rs of reviewStates) {
    const q = allQuestions.find((q) => q.id === rs.question_id);
    if (q) {
      topicSeenCounts[q.topic] = (topicSeenCounts[q.topic] || 0) + 1;
    }
  }

  const unlockedTopics: Set<Topic> = new Set();
  for (let i = 0; i < sortedTopics.length; i++) {
    const topic = sortedTopics[i];
    if (i === 0) {
      unlockedTopics.add(topic.id);
    } else {
      const prevTopic = sortedTopics[i - 1];
      const prevTotal = topicQuestionCounts[prevTopic.id] || 0;
      const prevSeen = topicSeenCounts[prevTopic.id] || 0;
      // Unlock if previous topic has been seen at least 50%
      if (prevTotal > 0 && prevSeen >= prevTotal * 0.5) {
        unlockedTopics.add(topic.id);
      }
    }
  }

  // Only include questions from unlocked topics
  const unlockedQuestions = allQuestions.filter((q) => unlockedTopics.has(q.topic));

  // Find DUE questions only (questions already seen and scheduled for review by FSRS)
  // Do NOT include unseen questions — those are introduced through topic-specific quizzes
  const dueStates = reviewStates
    .filter((rs) => {
      const q = allQuestions.find((q) => q.id === rs.question_id);
      if (!q) return false;
      if (!unlockedTopics.has(q.topic)) return false;
      return new Date(rs.due) <= now;
    })
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  const dueQuestions: Question[] = dueStates
    .map((rs) => allQuestions.find((q) => q.id === rs.question_id))
    .filter((q): q is Question => q !== undefined);

  // Pass review states as a map for the client
  const stateMap: Record<string, any> = {};
  for (const rs of reviewStates) {
    stateMap[rs.question_id] = rs;
  }

  if (dueQuestions.length === 0) {
    // Check if user has any unlocked topics with seen questions at all
    const hasAnySeen = reviewStates.some((rs) => {
      const q = allQuestions.find((q) => q.id === rs.question_id);
      return q && unlockedTopics.has(q.topic);
    });

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center safe-top safe-bottom">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-ok/20 to-accent/20">
          <svg className="h-10 w-10 text-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">
          {hasAnySeen ? "All caught up!" : "Start learning first"}
        </h2>
        <p className="mt-2 max-w-sm text-text-secondary">
          {hasAnySeen
            ? "No cards due for review right now. Come back later — spaced repetition will schedule your next review automatically."
            : "Complete some topic quizzes first. Questions you answer will appear here for review on a spaced repetition schedule."}
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

  return <ReviewSession questions={dueQuestions} reviewStates={stateMap} autoAdvance={true} />;
}
