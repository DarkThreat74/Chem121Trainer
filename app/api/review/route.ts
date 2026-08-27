import { NextRequest, NextResponse } from "next/server";
import { sql, SINGLE_USER_ID } from "@/lib/db";
import {
  newCard,
  reviewCard,
  cardToReviewState,
  reviewStateToCard,
  Rating,
} from "@/lib/fsrs";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, isCorrect, timeTakenMs } = body as {
      questionId: string;
      isCorrect: boolean;
      timeTakenMs: number;
    };

    if (!questionId || typeof isCorrect !== "boolean" ||
        typeof timeTakenMs !== "number" || timeTakenMs < 0 || timeTakenMs > 3600000) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Ensure the question exists in the DB and fetch any existing review
    // state in a SINGLE HTTP request (transaction). The review_state table
    // has a FK constraint on question_id → questions.id, so the question
    // must exist before we can insert review_state.
    //
    // We always run INSERT ... ON CONFLICT DO NOTHING for the question —
    // it's a no-op if the question already exists, and avoids a separate
    // SELECT-then-INSERT round trip. We need the sample data to know the
    // question's topic/subtopic/etc for the insert.
    let sampleQ: any = null;
    try {
      const { SAMPLE_QUESTIONS } = await import("@/lib/sample-data");
      sampleQ = SAMPLE_QUESTIONS.find((q) => q.id === questionId);
    } catch {}

    // Transaction 1: Insert question (if needed) + fetch existing review state
    const txnQueries: ReturnType<typeof sql>[] = [];

    if (sampleQ) {
      txnQueries.push(sql`
        INSERT INTO public.questions (id, topic, subtopic, mode, difficulty, content, is_sample)
        VALUES (${sampleQ.id}, ${sampleQ.topic}, ${sampleQ.subtopic}, ${sampleQ.mode}, ${sampleQ.difficulty}, ${JSON.stringify(sampleQ.content)}, ${sampleQ.is_sample})
        ON CONFLICT (id) DO NOTHING
      `);
    }

    txnQueries.push(sql`
      SELECT stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review
      FROM public.review_state
      WHERE user_id = ${SINGLE_USER_ID} AND question_id = ${questionId}
    `);

    const txnResults = await sql.transaction(txnQueries);
    const existingRows = txnResults[txnResults.length - 1] as any[];

    if (!sampleQ && existingRows.length === 0) {
      // Question not in sample data and not in DB — can't proceed
      // But still try to fetch from DB directly (might be a non-sample question)
      const dbCheck = await sql`
        SELECT id FROM public.questions WHERE id = ${questionId}
      `;
      if (dbCheck.length === 0) {
        return NextResponse.json(
          { error: "Question not found" },
          { status: 404 }
        );
      }
    }

    // Compute the FSRS update
    const card =
      existingRows.length > 0
        ? reviewStateToCard({
            stability: existingRows[0].stability,
            difficulty: existingRows[0].difficulty,
            due: existingRows[0].due,
            reps: existingRows[0].reps,
            lapses: existingRows[0].lapses,
            state: existingRows[0].state,
            elapsed_days: existingRows[0].elapsed_days,
            scheduled_days: existingRows[0].scheduled_days,
            last_review: existingRows[0].last_review,
          })
        : newCard();

    const rating: Rating = isCorrect ? Rating.Good : Rating.Again;
    const { card: updatedCard } = reviewCard(card, rating);
    const sd = cardToReviewState(updatedCard, SINGLE_USER_ID, questionId);

    // Transaction 2: Upsert review state + insert review log in a single HTTP request
    await sql.transaction([
      sql`
        INSERT INTO public.review_state
          (user_id, question_id, stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review)
        VALUES
          (${SINGLE_USER_ID}, ${questionId}, ${sd.stability}, ${sd.difficulty}, ${sd.due}, ${sd.reps}, ${sd.lapses}, ${sd.state}, ${sd.elapsed_days}, ${sd.scheduled_days}, ${sd.last_review})
        ON CONFLICT (user_id, question_id) DO UPDATE SET
          stability = EXCLUDED.stability,
          difficulty = EXCLUDED.difficulty,
          due = EXCLUDED.due,
          reps = EXCLUDED.reps,
          lapses = EXCLUDED.lapses,
          state = EXCLUDED.state,
          elapsed_days = EXCLUDED.elapsed_days,
          scheduled_days = EXCLUDED.scheduled_days,
          last_review = EXCLUDED.last_review
      `,
      sql`
        INSERT INTO public.review_log
          (user_id, question_id, rating, state, due, time_taken_ms)
        VALUES
          (${SINGLE_USER_ID}, ${questionId}, ${rating}, ${updatedCard.state}, ${new Date(updatedCard.due).toISOString()}, ${timeTakenMs || 0})
      `,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review save error:", error);
    return NextResponse.json(
      { error: "Failed to save review" },
      { status: 500 }
    );
  }
}
