const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);
const SINGLE_USER_ID = "00000000-0000-0000-0000-000000000001";

(async () => {
  // Remove test saves (metric-001, metric-002, metric-003)
  await sql`DELETE FROM public.review_state WHERE question_id IN ('metric-001', 'metric-002', 'metric-003') AND user_id = ${SINGLE_USER_ID}`;
  await sql`DELETE FROM public.review_log WHERE question_id IN ('metric-001', 'metric-002', 'metric-003') AND user_id = ${SINGLE_USER_ID} AND reviewed_at > NOW() - INTERVAL '1 hour'`;

  const total = await sql`SELECT COUNT(*) as count FROM public.review_state`;
  console.log(`review_state rows after cleanup: ${total[0].count}`);

  const logTotal = await sql`SELECT COUNT(*) as count FROM public.review_log`;
  console.log(`review_log rows after cleanup: ${logTotal[0].count}`);
})().catch((e) => console.error("Error:", e));
