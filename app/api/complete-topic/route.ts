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

    // Get question IDs from the DB for this topic.
    let questionIds: string[] = [];
    try {
      const dbQs = await sql`
        SELECT id FROM public.questions WHERE topic = ${topicId}
      ` as any[];
      questionIds = dbQs.map((q) => q.id);
    } catch {}

    // If DB has no questions, load sample data to get IDs + insert them.
    if (questionIds.length === 0) {
      let sampleQs: any[] = [];
      try {
        const { SAMPLE_QUESTIONS } = await import("@/lib/sample-data");
        sampleQs = SAMPLE_QUESTIONS.filter((q) => q.topic === topicId);
      } catch {
        return NextResponse.json(
          { error: "No questions found" },
          { status: 400 }
        );
      }

      if (sampleQs.length === 0) {
        return NextResponse.json(
          { error: "No questions found" },
          { status: 400 }
        );
      }

      // Insert all sample questions in parallel (simple individual queries,
      // no arrays, no unnest, no transactions — just dead-simple INSERTs).
      await Promise.all(
        sampleQs.map((q) =>
          sql`
            INSERT INTO public.questions (id, topic, subtopic, mode, difficulty, content, is_sample)
            VALUES (${q.id}, ${q.topic}, ${q.subtopic}, ${q.mode}, ${q.difficulty}, ${JSON.stringify(q.content)}, ${q.is_sample})
            ON CONFLICT (id) DO NOTHING
          `
        )
      );

      questionIds = sampleQs.map((q) => q.id);
    }

    // Mark every question as seen. Simple individual upserts in parallel.
    // No array parameters, no unnest — just basic queries that always work.
    const now = new Date();
    const due = new Date(now.getTime() + 86400000 * 7);
    const nowIso = now.toISOString();
    const dueIso = due.toISOString();

    await Promise.all(
      questionIds.map((qid) =>
        sql`
          INSERT INTO public.review_state
            (user_id, question_id, stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review)
          VALUES
            (${SINGLE_USER_ID}, ${qid}, 3.0, 5.0, ${dueIso}, 1, 0, 2, 0, 7, ${nowIso})
          ON CONFLICT (user_id, question_id) DO UPDATE SET
            reps = GREATEST(public.review_state.reps, 1),
            state = 2,
            due = ${dueIso},
            scheduled_days = 7,
            last_review = ${nowIso}
        `
      )
    );

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
