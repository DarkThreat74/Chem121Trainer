import { NextRequest, NextResponse } from "next/server";
import { sql, SINGLE_USER_ID } from "@/lib/db";
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
    const { SAMPLE_QUESTIONS } = await import("@/lib/sample-data");
    const sampleQuestions = SAMPLE_QUESTIONS.filter((q) => q.topic === topicId);

    try {
      const dbQs = await sql`
        SELECT id FROM public.questions WHERE topic = ${topicId}
      ` as any[];
      if (dbQs.length > 0) {
        questionIds = dbQs.map((q) => q.id);
      } else {
        questionIds = sampleQuestions.map((q) => q.id);
      }
    } catch {
      questionIds = sampleQuestions.map((q) => q.id);
    }

    if (questionIds.length === 0) {
      return NextResponse.json(
        { error: "No questions found for this topic" },
        { status: 400 }
      );
    }

    // Ensure all questions exist in the DB before inserting review_state.
    // The review_state table has a FK constraint on question_id → questions.id,
    // so any question not in the questions table will cause a 500 error.
    // Auto-insert from sample data (same approach as /api/review route).
    for (const sampleQ of sampleQuestions) {
      await sql`
        INSERT INTO public.questions (id, topic, subtopic, mode, difficulty, content, is_sample)
        VALUES (${sampleQ.id}, ${sampleQ.topic}, ${sampleQ.subtopic}, ${sampleQ.mode}, ${sampleQ.difficulty}, ${JSON.stringify(sampleQ.content)}, ${sampleQ.is_sample})
        ON CONFLICT (id) DO NOTHING
      `;
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
          due = ${due.toISOString()},
          scheduled_days = 7,
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
