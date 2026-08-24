const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

(async () => {
  // Check recent saves
  const recent = await sql`
    SELECT question_id, rating, reviewed_at, time_taken_ms
    FROM public.review_log
    ORDER BY reviewed_at DESC
    LIMIT 10
  `;
  console.log("Recent review logs:");
  for (const r of recent) {
    console.log(`  ${r.question_id}: rating=${r.rating} time=${r.time_taken_ms}ms at=${r.reviewed_at}`);
  }

  // Check review_state for recently saved questions
  const states = await sql`
    SELECT question_id, reps, state, due, last_review
    FROM public.review_state
    ORDER BY last_review DESC
    LIMIT 10
  `;
  console.log("\nRecent review states:");
  for (const s of states) {
    console.log(`  ${s.question_id}: reps=${s.reps} state=${s.state} due=${s.due} last=${s.last_review}`);
  }

  // Count total
  const total = await sql`SELECT COUNT(*) as count FROM public.review_state`;
  console.log(`\nTotal review_state rows: ${total[0].count}`);

  const logTotal = await sql`SELECT COUNT(*) as count FROM public.review_log`;
  console.log(`Total review_log rows: ${logTotal[0].count}`);
})().catch((e) => console.error("Error:", e));
