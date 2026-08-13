import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { SAMPLE_QUESTIONS } from "@/lib/sample-data";
import ReviewSession from "@/components/ReviewSession";
import type { Question, Topic } from "@/lib/types";
import { TOPICS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PracticePage({
  params,
}: {
  params: { topic: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const topicInfo = TOPICS.find((t) => t.id === params.topic);
  if (!topicInfo) notFound();

  // Get all questions for this topic
  const { data: dbQuestions } = await supabase
    .from("questions")
    .select("*")
    .eq("topic", params.topic)
    .order("difficulty");

  let questions: Question[];
  if (dbQuestions && dbQuestions.length > 0) {
    questions = dbQuestions as Question[];
  } else {
    questions = SAMPLE_QUESTIONS.filter((q) => q.topic === params.topic);
  }

  // Get review states
  const { data: reviewStates } = await supabase
    .from("review_state")
    .select("*")
    .eq("user_id", user.id)
    .in(
      "question_id",
      questions.map((q) => q.id)
    );

  const stateMap: Record<string, any> = {};
  for (const rs of reviewStates || []) {
    stateMap[rs.question_id] = rs;
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold">{topicInfo.label}</h2>
        <p className="mt-2 max-w-sm text-text-secondary">
          No content available for this topic yet. Real questions need to be
          imported from your course worksheets.
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
        <ReviewSession
          userId={user.id}
          questions={questions}
          reviewStates={stateMap}
        />
      </div>
    </div>
  );
}
