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

    // Get existing review state
    const existing = await sql`
      SELECT stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review
      FROM public.review_state
      WHERE user_id = ${SINGLE_USER_ID} AND question_id = ${questionId}
    `;

    const card =
      existing.length > 0
        ? reviewStateToCard({
            stability: existing[0].stability,
            difficulty: existing[0].difficulty,
            due: existing[0].due,
            reps: existing[0].reps,
            lapses: existing[0].lapses,
            state: existing[0].state,
            elapsed_days: existing[0].elapsed_days,
            scheduled_days: existing[0].scheduled_days,
            last_review: existing[0].last_review,
          })
        : newCard();

    const rating: Rating = isCorrect ? Rating.Good : Rating.Again;
    const { card: updatedCard } = reviewCard(card, rating);

    // Upsert review state
    const sd = cardToReviewState(updatedCard, SINGLE_USER_ID, questionId);
    await sql`
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
    `;

    // Insert review log
    await sql`
      INSERT INTO public.review_log
        (user_id, question_id, rating, state, due, time_taken_ms)
      VALUES
        (${SINGLE_USER_ID}, ${questionId}, ${rating}, ${updatedCard.state}, ${new Date(updatedCard.due).toISOString()}, ${timeTakenMs || 0})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review save error:", error);
    return NextResponse.json(
      { error: "Failed to save review" },
      { status: 500 }
    );
  }
}
