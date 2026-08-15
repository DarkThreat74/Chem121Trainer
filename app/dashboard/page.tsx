import { sql, SINGLE_USER_ID } from "@/lib/db";
import { TOPICS } from "@/lib/types";
import { SAMPLE_QUESTIONS } from "@/lib/sample-data";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";
export const runtime = "edge";

function safeJsonParse(str: string): any {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

export default async function DashboardPage() {
  let questions: Array<{
    id: string;
    topic: string;
    subtopic: string;
    mode: string;
    difficulty: number;
    content: any;
    is_sample: boolean;
  }>;

  try {
    const dbQuestions = (await sql`
      SELECT id, topic, subtopic, mode, difficulty, content, is_sample
      FROM public.questions
      ORDER BY topic, difficulty
    `) as Array<{
      id: string;
      topic: string;
      subtopic: string;
      mode: string;
      difficulty: number;
      content: any;
      is_sample: boolean;
    }>;
    questions =
      dbQuestions.length > 0
        ? dbQuestions.map((q) => ({
            ...q,
            content: typeof q.content === "string" ? safeJsonParse(q.content) : q.content,
          }))
        : SAMPLE_QUESTIONS.map((q) => ({
            id: q.id,
            topic: q.topic,
            subtopic: q.subtopic,
            mode: q.mode,
            difficulty: q.difficulty,
            content: q.content,
            is_sample: q.is_sample,
          }));
  } catch {
    questions = SAMPLE_QUESTIONS.map((q) => ({
      id: q.id,
      topic: q.topic,
      subtopic: q.subtopic,
      mode: q.mode,
      difficulty: q.difficulty,
      content: q.content,
      is_sample: q.is_sample,
    }));
  }

  let reviewStates: any[] = [];
  try {
    reviewStates = await sql`
      SELECT question_id, stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review
      FROM public.review_state
      WHERE user_id = ${SINGLE_USER_ID}
    `;
  } catch {}

  let reviewLogs: any[] = [];
  try {
    reviewLogs = await sql`
      SELECT question_id, rating, reviewed_at
      FROM public.review_log
      WHERE user_id = ${SINGLE_USER_ID}
      ORDER BY reviewed_at DESC
    `;
  } catch {}

  const now = new Date();
  const streak = calculateStreak(reviewLogs);
  const dueCount = reviewStates.filter((rs) => new Date(rs.due) <= now).length;
  const topicMastery = calculateTopicMastery(reviewLogs, questions, reviewStates);
  const questionsPerTopic = TOPICS.map((t) => ({
    ...t,
    count: questions.filter((q) => q.topic === t.id).length,
  }));
  const weeklyActivity = calculateWeeklyActivity(reviewLogs);

  return (
    <div className="min-h-screen nav-offset safe-top safe-bottom">
      {/* Mobile header */}
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-bg/80 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="gradient-text">Chem 121</span> Trainer
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <DashboardClient
          streak={streak}
          dueCount={dueCount}
          topicMastery={topicMastery}
          topicsWithCounts={questionsPerTopic}
          weeklyActivity={weeklyActivity}
          totalReviews={reviewLogs.length}
        />
      </main>
    </div>
  );
}

function calculateStreak(logs: Array<{ reviewed_at: string }>): number {
  if (logs.length === 0) return 0;

  const days = new Set<string>();
  for (const log of logs) {
    const d = new Date(log.reviewed_at);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    days.add(key);
  }

  let streak = 0;
  const today = new Date();
  const oneDay = 86400000;

  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let checkDate = today;

  if (!days.has(todayKey)) {
    checkDate = new Date(today.getTime() - oneDay);
    const yesterdayKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    if (!days.has(yesterdayKey)) return 0;
  }

  while (true) {
    const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    if (days.has(key)) {
      streak++;
      checkDate = new Date(checkDate.getTime() - oneDay);
    } else {
      break;
    }
  }

  return streak;
}

function calculateWeeklyActivity(
  logs: Array<{ reviewed_at: string }>
): { date: string; label: string; count: number }[] {
  const days: { date: string; label: string; count: number }[] = [];
  const today = new Date();
  const oneDay = 86400000;
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * oneDay);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    days.push({ date: key, label: dayLabels[d.getDay()], count: 0 });
  }

  const dayMap = new Map(days.map((d) => [d.date, d]));
  for (const log of logs) {
    const d = new Date(log.reviewed_at);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const day = dayMap.get(key);
    if (day) day.count++;
  }

  return days;
}

function calculateTopicMastery(
  logs: Array<{ question_id: string; rating: number; reviewed_at: string }>,
  questions: Array<{ id: string; topic: string }>,
  reviewStates: Array<{ question_id: string; reps: number }>
): Record<string, { mastery: number; totalReviews: number; seen: number; total: number }> {
  const topicMap = new Map<string, string>();
  for (const q of questions) {
    topicMap.set(q.id, q.topic);
  }

  const result: Record<string, { mastery: number; totalReviews: number; seen: number; total: number }> = {};

  const topicLogs: Record<string, Array<{ rating: number; reviewed_at: string }>> = {};
  for (const log of logs) {
    const topic = topicMap.get(log.question_id);
    if (!topic) continue;
    if (!topicLogs[topic]) topicLogs[topic] = [];
    topicLogs[topic].push({ rating: log.rating, reviewed_at: log.reviewed_at });
  }

  const seenPerTopic: Record<string, Set<string>> = {};
  for (const rs of reviewStates) {
    const topic = topicMap.get(rs.question_id);
    if (!topic) continue;
    if (!seenPerTopic[topic]) seenPerTopic[topic] = new Set();
    seenPerTopic[topic].add(rs.question_id);
  }

  const totalPerTopic: Record<string, number> = {};
  for (const q of questions) {
    totalPerTopic[q.topic] = (totalPerTopic[q.topic] || 0) + 1;
  }

  for (const topic of Object.keys(totalPerTopic)) {
    const tLogs = topicLogs[topic] || [];
    const total = totalPerTopic[topic] || 0;
    const seen = seenPerTopic[topic]?.size || 0;

    let weightedCorrect = 0;
    let weightedTotal = 0;
    const sortedLogs = [...tLogs].sort(
      (a, b) => new Date(a.reviewed_at).getTime() - new Date(b.reviewed_at).getTime()
    );
    for (let i = 0; i < sortedLogs.length; i++) {
      const weight = (i + 1) / sortedLogs.length;
      weightedTotal += weight;
      if (sortedLogs[i].rating >= 3) weightedCorrect += weight;
    }

    const mastery = weightedTotal > 0
      ? Math.round((weightedCorrect / weightedTotal) * 100)
      : 0;

    result[topic] = { mastery, totalReviews: tLogs.length, seen, total };
  }

  return result;
}
