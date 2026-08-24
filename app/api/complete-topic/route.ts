import { NextRequest, NextResponse } from "next/server";
import { sql, SINGLE_USER_ID } from "@/lib/db";
import { SAMPLE_QUESTIONS } from "@/lib/sample-data";
import { TOPICS } from "@/lib/types";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { topicId } = (await request.json()) as { topicId: string };

    if (!topicId || !TOPICS.find((t) => t.id === topicId)) {
      return NextResponse.json(
        { error: "Invalid topicId" },
        { status: 400 }
      );
    }

    // Get all question IDs for this topic (from DB or sample fallback)
    let questionIds: string[];
    try {
      const dbQs = await sql`
        SELECT id FROM public.questions WHERE topic = ${topicId}
      ` as any[];
      questionIds = dbQs.length > 0
        ? dbQs.map((q) => q.id)
        : SAMPLE_QUESTIONS.filter((q) => q.topic === topicId).map((q) => q.id);
    } catch {
      questionIds = SAMPLE_QUESTIONS.filter((q) => q.topic === topicId).map((q) => q.id);
    }

    if (questionIds.length === 0) {
      return NextResponse.json(
        { error: "No questions found for this topic" },
        { status: 400 }
      );
    }

    const now = new Date();
    const due = new Date(now.getTime() + 86400000 * 7); // due in 7 days

    // Mark all questions as seen (reps=1, state=Review)
    for (const qid of questionIds) {
      await sql`
        INSERT INTO public.review_state
          (user_id, question_id, stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review)
        VALUES
          (${SINGLE_USER_ID}, ${qid}, 3.0, 5.0, ${due.toISOString()}, 1, 0, 2, 0, 7, ${now.toISOString()})
        ON CONFLICT (user_id, question_id) DO UPDATE SET
          reps = GREATEST(public.review_state.reps, 1),
          state = 2,
          last_review = ${now.toISOString()}
      `;
    }

    return NextResponse.json({
      success: true,
      marked: questionIds.length,
    });
  } catch (error) {
    console.error("Complete topic error:", error);
    return NextResponse.json(
      { error: "Failed to mark topic complete" },
      { status: 500 }
    );
  }
}
