const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);
const SINGLE_USER_ID = "00000000-0000-0000-0000-000000000001";

(async () => {
  // Simulate what the API route does for question "fund-002"
  const questionId = "fund-002";

  try {
    // Check if question exists in DB
    const q = await sql`SELECT id FROM public.questions WHERE id = ${questionId}`;
    console.log(`Question ${questionId} exists in DB:`, q.length > 0);

    // Check if review_state already exists
    const existing = await sql`
      SELECT reps, stability, difficulty, due, lapses, state
      FROM public.review_state
      WHERE user_id = ${SINGLE_USER_ID} AND question_id = ${questionId}
    `;
    console.log("Existing review_state:", existing.length > 0 ? existing[0] : "none");

    // Try the upsert (same as API route)
    const now = new Date();
    const due = new Date(now.getTime() + 86400000); // tomorrow

    await sql`
      INSERT INTO public.review_state
        (user_id, question_id, stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review)
      VALUES
        (${SINGLE_USER_ID}, ${questionId}, 1.0, 5.0, ${due.toISOString()}, 1, 0, 2, 0, 1, ${now.toISOString()})
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
    console.log("✅ review_state upsert succeeded!");

    // Try review_log insert
    await sql`
      INSERT INTO public.review_log
        (user_id, question_id, rating, state, due, time_taken_ms)
      VALUES
        (${SINGLE_USER_ID}, ${questionId}, 3, 2, ${due.toISOString()}, 5000)
    `;
    console.log("✅ review_log insert succeeded!");

    // Clean up test data
    await sql`DELETE FROM public.review_state WHERE question_id = ${questionId} AND user_id = ${SINGLE_USER_ID}`;
    await sql`DELETE FROM public.review_log WHERE question_id = ${questionId} AND user_id = ${SINGLE_USER_ID} AND reviewed_at > NOW() - INTERVAL '1 minute'`;
    console.log("🧹 Cleaned up test data");

    // Now test with a question that might NOT exist in DB
    const badQuestionId = "fund-999";
    const badQ = await sql`SELECT id FROM public.questions WHERE id = ${badQuestionId}`;
    console.log(`\nQuestion ${badQuestionId} exists in DB:`, badQ.length > 0);

    try {
      await sql`
        INSERT INTO public.review_state
          (user_id, question_id, stability, difficulty, due, reps, lapses, state, elapsed_days, scheduled_days, last_review)
        VALUES
          (${SINGLE_USER_ID}, ${badQuestionId}, 1.0, 5.0, ${due.toISOString()}, 1, 0, 2, 0, 1, ${now.toISOString()})
        ON CONFLICT (user_id, question_id) DO UPDATE SET
          reps = EXCLUDED.reps
      `;
      console.log("✅ review_state with bad question_id succeeded (no FK constraint)");
    } catch (e) {
      console.log("❌ review_state with bad question_id FAILED:", e.message);
    }

  } catch (e) {
    console.error("❌ Error:", e.message);
    console.error("Full error:", e);
  }
})();
