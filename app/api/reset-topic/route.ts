import { NextRequest, NextResponse } from "next/server";
import { sql, SINGLE_USER_ID } from "@/lib/db";
import { TOPICS } from "@/lib/types";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { topicId } = (await request.json()) as { topicId: string };

    if (!topicId || !TOPICS.find((t) => t.id === topicId)) {
      return NextResponse.json({ error: "Invalid topicId" }, { status: 400 });
    }

    // Get question IDs for this topic from the DB.
    let questionIds: string[] = [];
    try {
      const dbQs = await sql`
        SELECT id FROM public.questions WHERE topic = ${topicId}
      ` as any[];
      questionIds = dbQs.map((q) => q.id);
    } catch {}

    // Fall back to sample data if DB is empty.
    if (questionIds.length === 0) {
      try {
        const { SAMPLE_QUESTIONS } = await import("@/lib/sample-data");
        questionIds = SAMPLE_QUESTIONS.filter((q) => q.topic === topicId).map((q) => q.id);
      } catch {
        return NextResponse.json({ error: "No questions found" }, { status: 400 });
      }
    }

    if (questionIds.length === 0) {
      return NextResponse.json({ error: "No questions found" }, { status: 400 });
    }

    // Reset each question's review state to unseen (reps=0, state=New).
    // Sequential queries — same reliable pattern as complete-topic.
    for (const qid of questionIds) {
      await sql`
        UPDATE public.review_state
        SET reps = 0, lapses = 0, state = 0, elapsed_days = 0, scheduled_days = 0,
            stability = 0, difficulty = 0,
            due = now(), last_review = null
        WHERE user_id = ${SINGLE_USER_ID} AND question_id = ${qid}
      `;
    }

    return NextResponse.json({
      success: true,
      reset: questionIds.length,
    });
  } catch (error: any) {
    const msg = error?.message || String(error);
    console.error("Reset topic error:", msg);
    return NextResponse.json(
      { error: "Failed to reset topic", detail: msg },
      { status: 500 }
    );
  }
}
