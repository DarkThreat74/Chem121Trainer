import { neon } from "@neondatabase/serverless";
import { SAMPLE_QUESTIONS } from "../lib/sample-data";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const sql = neon(process.env.DATABASE_URL!);
const SINGLE_USER_ID = "00000000-0000-0000-0000-000000000001";

(async () => {
  // Find metric-system questions missing review_state
  const existing = await sql`
    SELECT question_id FROM public.review_state
    WHERE user_id = ${SINGLE_USER_ID}
    AND question_id IN (SELECT id FROM public.questions WHERE topic = 'metric-system')
  `;
  const existingIds = new Set(existing.map((r: any) => r.question_id));

  const metricQuestions = SAMPLE_QUESTIONS.filter(
    (q) => q.topic === "metric-system" && !existingIds.has(q.id)
  );

  console.log(`Missing metric-system review_state: ${metricQuestions.length}`);
  for (const q of metricQuestions) {
    console.log(`  ${q.id}`);
  }

  if (metricQuestions.length === 0) {
    console.log("All metric-system questions already have review_state!");
    return;
  }

  const now = new Date();
  const due = new Date(now.getTime() + 86400000 * 7);

  for (const q of metricQuestions) {
    await sql`
      INSERT INTO public.review_state
        (user_id, question_id, stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review)
      VALUES
        (${SINGLE_USER_ID}, ${q.id}, 3.0, 5.0, ${due.toISOString()}, 1, 0, 2, 0, 7, ${now.toISOString()})
      ON CONFLICT (user_id, question_id) DO UPDATE SET
        reps = GREATEST(public.review_state.reps, 1),
        state = 2,
        last_review = ${now.toISOString()}
    `;
    console.log(`  Fixed ${q.id}`);
  }

  // Verify
  const count = await sql`
    SELECT COUNT(*) as count FROM public.review_state
    WHERE user_id = ${SINGLE_USER_ID}
    AND question_id IN (SELECT id FROM public.questions WHERE topic = 'metric-system')
  `;
  console.log(`\nMetric-system review_state: ${count[0].count}/20`);
})().catch((e) => console.error("Error:", e));
