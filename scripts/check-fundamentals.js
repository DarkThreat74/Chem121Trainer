const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);
const SINGLE_USER_ID = "00000000-0000-0000-0000-000000000001";

(async () => {
  // Check all fundamentals questions in DB
  const fundQuestions = await sql`
    SELECT id FROM public.questions WHERE topic = 'fundamentals' ORDER BY id
  `;
  console.log(`Fundamentals questions in DB: ${fundQuestions.length}`);
  for (const q of fundQuestions) {
    console.log(`  ${q.id}`);
  }

  // Check which fundamentals questions have review_state
  const fundStates = await sql`
    SELECT question_id, reps, state
    FROM public.review_state
    WHERE user_id = ${SINGLE_USER_ID}
    AND question_id IN (SELECT id FROM public.questions WHERE topic = 'fundamentals')
    ORDER BY question_id
  `;
  console.log(`\nFundamentals review_state rows: ${fundStates.length}`);
  for (const s of fundStates) {
    console.log(`  ${s.question_id}: reps=${s.reps} state=${s.state}`);
  }

  // Find missing
  const fundIds = new Set(fundQuestions.map(q => q.id));
  const stateIds = new Set(fundStates.map(s => s.question_id));
  const missing = [...fundIds].filter(id => !stateIds.has(id));
  console.log(`\nMissing review_state: ${missing.length}`);
  for (const id of missing) {
    console.log(`  ${id}`);
  }

  // Check metric-system too
  const metricStates = await sql`
    SELECT COUNT(*) as count
    FROM public.review_state
    WHERE user_id = ${SINGLE_USER_ID}
    AND question_id IN (SELECT id FROM public.questions WHERE topic = 'metric-system')
  `;
  console.log(`\nMetric-system review_state count: ${metricStates[0].count}/20`);
})().catch((e) => console.error("Error:", e));
