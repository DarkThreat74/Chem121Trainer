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

    // Load sample questions for this topic (used for auto-inserting
    // any questions not yet in the DB, and as a fallback for question IDs).
    const { SAMPLE_QUESTIONS } = await import("@/lib/sample-data");
    const sampleQuestions = SAMPLE_QUESTIONS.filter((q) => q.topic === topicId);

    // Ensure all sample questions exist in the DB.
    // The review_state table has a FK constraint on question_id → questions.id,
    // so any question not in the questions table will cause a FK violation.
    //
    // We use a single INSERT ... SELECT FROM unnest(...) query instead of
    // 28+ individual INSERTs. This reduces the number of HTTP requests to
    // Neon from 56+ down to 2-3, avoiding Vercel edge runtime timeouts.
    if (sampleQuestions.length > 0) {
      const ids = sampleQuestions.map((q) => q.id);
      const topics = sampleQuestions.map((q) => q.topic);
      const subtopics = sampleQuestions.map((q) => q.subtopic);
      const modes = sampleQuestions.map((q) => q.mode);
      const difficulties = sampleQuestions.map((q) => q.difficulty);
      const contents = sampleQuestions.map((q) => JSON.stringify(q.content));
      const isSamples = sampleQuestions.map((q) => q.is_sample);

      await sql`
        INSERT INTO public.questions (id, topic, subtopic, mode, difficulty, content, is_sample)
        SELECT id, topic, subtopic, mode, difficulty, content, is_sample
        FROM unnest(
          ${ids}::text[],
          ${topics}::text[],
          ${subtopics}::text[],
          ${modes}::text[],
          ${difficulties}::int[],
          ${contents}::jsonb[],
          ${isSamples}::boolean[]
        ) AS t(id, topic, subtopic, mode, difficulty, content, is_sample)
        ON CONFLICT (id) DO NOTHING
      `;
    }

    // Get ALL question IDs for this topic from the DB (after the insert above,
    // this includes any questions that were just added from sample data).
    // Fall back to sample data if the DB is unreachable.
    let questionIds: string[];
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

    // Mark all questions as seen (reps=1, state=Review) using a single
    // INSERT ... SELECT FROM unnest(...) query. This replaces the previous
    // approach of 28+ individual INSERTs in a transaction.
    const now = new Date();
    const due = new Date(now.getTime() + 86400000 * 7); // due in 7 days
    const nowIso = now.toISOString();
    const dueIso = due.toISOString();

    await sql`
      INSERT INTO public.review_state
        (user_id, question_id, stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review)
      SELECT
        ${SINGLE_USER_ID}, qid, 3.0, 5.0, ${dueIso}::timestamptz, 1, 0, 2, 0, 7, ${nowIso}::timestamptz
      FROM unnest(${questionIds}::text[]) AS qid
      ON CONFLICT (user_id, question_id) DO UPDATE SET
        reps = GREATEST(public.review_state.reps, 1),
        state = 2,
        due = EXCLUDED.due,
        scheduled_days = 7,
        last_review = EXCLUDED.last_review
    `;

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
