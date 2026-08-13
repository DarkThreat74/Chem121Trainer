import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TOPICS } from "@/lib/types";
import { SAMPLE_QUESTIONS } from "@/lib/sample-data";
import DashboardClient from "@/components/DashboardClient";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get all review states for this user
  const { data: reviewStates } = await supabase
    .from("review_state")
    .select("*")
    .eq("user_id", user.id);

  // Get review logs for streak and mastery calculation
  const { data: reviewLogs } = await supabase
    .from("review_log")
    .select("*")
    .eq("user_id", user.id)
    .order("reviewed_at", { ascending: false });

  // Get all questions (from DB, or fall back to sample data if DB is empty)
  const { data: dbQuestions } = await supabase
    .from("questions")
    .select("*")
    .order("topic, difficulty");

  const questions = dbQuestions && dbQuestions.length > 0
    ? dbQuestions
    : SAMPLE_QUESTIONS.map((q) => ({
        id: q.id,
        topic: q.topic,
        subtopic: q.subtopic,
        mode: q.mode,
        difficulty: q.difficulty,
        content: q.content,
        is_sample: q.is_sample,
      }));

  // Calculate streak
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const streak = calculateStreak(reviewLogs || []);

  // Calculate due count
  const dueCount = (reviewStates || []).filter(
    (rs) => new Date(rs.due) <= now
  ).length;

  // Calculate per-topic mastery
  const topicMastery = calculateTopicMastery(
    reviewLogs || [],
    questions,
    reviewStates || []
  );

  // Count questions per topic
  const questionsPerTopic = TOPICS.map((t) => ({
    ...t,
    count: questions.filter((q) => q.topic === t.id).length,
  }));

  return (
    <div className="min-h-screen safe-top safe-bottom">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">Chem 121 Trainer</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              {profile?.email || user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <DashboardClient
          streak={streak}
          dueCount={dueCount}
          topicMastery={topicMastery}
          topicsWithCounts={questionsPerTopic}
        />
      </main>
    </div>
  );
}

function calculateStreak(
  logs: Array<{ reviewed_at: string }>
): number {
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

  // Check if today has a review
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let checkDate = today;

  if (!days.has(todayKey)) {
    // If no review today, check yesterday
    checkDate = new Date(today.getTime() - oneDay);
    const yesterdayKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    if (!days.has(yesterdayKey)) return 0;
  }

  // Count consecutive days
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

  // Group logs by topic
  const topicLogs: Record<string, Array<{ rating: number; reviewed_at: string }>> = {};
  for (const log of logs) {
    const topic = topicMap.get(log.question_id);
    if (!topic) continue;
    if (!topicLogs[topic]) topicLogs[topic] = [];
    topicLogs[topic].push({ rating: log.rating, reviewed_at: log.reviewed_at });
  }

  // Count seen questions per topic
  const seenPerTopic: Record<string, Set<string>> = {};
  for (const rs of reviewStates) {
    const topic = topicMap.get(rs.question_id);
    if (!topic) continue;
    if (!seenPerTopic[topic]) seenPerTopic[topic] = new Set();
    seenPerTopic[topic].add(rs.question_id);
  }

  // Count total questions per topic
  const totalPerTopic: Record<string, number> = {};
  for (const q of questions) {
    totalPerTopic[q.topic] = (totalPerTopic[q.topic] || 0) + 1;
  }

  for (const topic of Object.keys(totalPerTopic)) {
    const tLogs = topicLogs[topic] || [];
    const total = totalPerTopic[topic] || 0;
    const seen = seenPerTopic[topic]?.size || 0;

    // Weighted accuracy: more recent reviews weighted higher
    // Rating >= 3 (Good) counts as correct
    let weightedCorrect = 0;
    let weightedTotal = 0;
    const sortedLogs = [...tLogs].sort(
      (a, b) => new Date(a.reviewed_at).getTime() - new Date(b.reviewed_at).getTime()
    );
    for (let i = 0; i < sortedLogs.length; i++) {
      const weight = (i + 1) / sortedLogs.length; // newer = higher weight
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
