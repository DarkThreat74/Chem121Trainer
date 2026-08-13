import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SAMPLE_QUESTIONS } from "@/lib/sample-data";
import ReviewSession from "@/components/ReviewSession";
import type { Question } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get all questions (from DB or sample fallback)
  const { data: dbQuestions } = await supabase
    .from("questions")
    .select("*")
    .order("topic, difficulty");

  const allQuestions: Question[] =
    dbQuestions && dbQuestions.length > 0
      ? (dbQuestions as Question[])
      : SAMPLE_QUESTIONS;

  // Get review states for this user
  const { data: reviewStates } = await supabase
    .from("review_state")
    .select("*")
    .eq("user_id", user.id);

  const now = new Date();

  // Find due question IDs (oldest due first)
  const dueStates = (reviewStates || [])
    .filter((rs) => new Date(rs.due) <= now)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  // Find unseen question IDs (no review state exists)
  const seenIds = new Set((reviewStates || []).map((rs) => rs.question_id));
  const unseenQuestions = allQuestions.filter((q) => !seenIds.has(q.id));

  // Build queue: due first (oldest first), then unseen
  const dueQuestions: Question[] = dueStates
    .map((rs) => allQuestions.find((q) => q.id === rs.question_id))
    .filter((q): q is Question => q !== undefined);

  const queue: Question[] = [...dueQuestions, ...unseenQuestions];

  // Pass review states as a map for the client
  const stateMap: Record<string, any> = {};
  for (const rs of reviewStates || []) {
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

  return (
    <ReviewSession
      userId={user.id}
      questions={queue}
      reviewStates={stateMap}
    />
  );
}
