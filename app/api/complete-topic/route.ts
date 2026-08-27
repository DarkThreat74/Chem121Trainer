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

    // Load sample questions for this topic.
    const { SAMPLE_QUESTIONS } = await import("@/lib/sample-data");
    const sampleQuestions = SAMPLE_QUESTIONS.filter((q) => q.topic === topicId);

    // Step 1: Check which questions already exist in the DB.
    // This is a single SELECT — cheap and fast.
    let dbIds = new Set<string>();
    try {
      const dbQs = await sql`
        SELECT id FROM public.questions WHERE topic = ${topicId}
      ` as any[];
      dbIds = new Set(dbQs.map((q) => q.id));
    } catch {
      // DB unreachable — we'll use sample IDs only
    }

    // Step 2: Insert only the MISSING sample questions.
    // This is usually 0 queries (questions already seeded) or a small
    // number (new questions added in a recent update). We use individual
    // INSERTs in a transaction — this avoids jsonb[] / boolean[] array
    // parameters which fail in Vercel's edge runtime.
    const missingQs = sampleQuestions.filter((q) => !dbIds.has(q.id));
    if (missingQs.length > 0) {
      await sql.transaction(
        missingQs.map((q) => sql`
          INSERT INTO public.questions (id, topic, subtopic, mode, difficulty, content, is_sample)
          VALUES (${q.id}, ${q.topic}, ${q.subtopic}, ${q.mode}, ${q.difficulty}, ${JSON.stringify(q.content)}, ${q.is_sample})
          ON CONFLICT (id) DO NOTHING
        `)
      );
    }

    // Step 3: Determine the full list of question IDs to mark.
    // Use DB IDs + any we just inserted. Fall back to sample IDs if DB is empty.
    let questionIds: string[];
    if (dbIds.size > 0) {
      questionIds = [...dbIds, ...missingQs.map((q) => q.id)];
    } else {
      questionIds = sampleQuestions.map((q) => q.id);
    }

    if (questionIds.length === 0) {
      return NextResponse.json(
        { error: "No questions found for this topic" },
        { status: 400 }
      );
    }

    // Step 4: Mark all questions as seen using a single INSERT...SELECT
    // FROM unnest with a simple text[] parameter. This is the only array
    // parameter we use — text[] is reliably supported by the Neon HTTP
    // driver in the edge runtime.
    const now = new Date();
    const due = new Date(now.getTime() + 86400000 * 7);
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
