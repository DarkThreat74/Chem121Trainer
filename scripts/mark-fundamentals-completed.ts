import { neon } from "@neondatabase/serverless";
import { SAMPLE_QUESTIONS } from "../lib/sample-data";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const sql = neon(process.env.DATABASE_URL!);
const SINGLE_USER_ID = "00000000-0000-0000-0000-000000000001";

(async () => {
  const fundQuestions = SAMPLE_QUESTIONS.filter((q) => q.topic === "fundamentals");
  console.log(`Marking ${fundQuestions.length} fundamentals questions as completed...`);

  const now = new Date();
  const due = new Date(now.getTime() + 86400000 * 3); // due in 3 days

  let count = 0;
  for (const q of fundQuestions) {
    try {
      // Insert review_state with reps=1 (seen)
      await sql`
        INSERT INTO public.review_state
          (user_id, question_id, stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review)
        VALUES
          (${SINGLE_USER_ID}, ${q.id}, 3.0, 5.0, ${due.toISOString()}, 1, 0, 2, 0, 3, ${now.toISOString()})
        ON CONFLICT (user_id, question_id) DO UPDATE SET
          reps = GREATEST(public.review_state.reps, 1),
          state = 2,
          last_review = ${now.toISOString()}
      `;

      // Insert a review log entry
      await sql`
        INSERT INTO public.review_log
          (user_id, question_id, rating, state, due, time_taken_ms)
        VALUES
          (${SINGLE_USER_ID}, ${q.id}, 3, 2, ${due.toISOString()}, 5000)
      `;
      count++;
    } catch (e: any) {
      console.error(`  Failed for ${q.id}: ${e.message}`);
    }
  }

  console.log(`Marked ${count}/${fundQuestions.length} questions as completed`);

  // Verify
  const seen = await sql`
    SELECT COUNT(*) as count
    FROM public.review_state
    WHERE user_id = ${SINGLE_USER_ID}
    AND question_id IN (SELECT id FROM public.questions WHERE topic = 'fundamentals')
  `;
  console.log(`Fundamentals seen count: ${seen[0].count}/22`);
})().catch((e) => console.error("Error:", e));
