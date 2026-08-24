const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

(async () => {
  try {
    const rs = await sql`SELECT COUNT(*) as count FROM public.review_state`;
    console.log("review_state count:", rs[0].count);

    const rl = await sql`SELECT COUNT(*) as count FROM public.review_log`;
    console.log("review_log count:", rl[0].count);

    const u = await sql`SELECT COUNT(*) as count FROM public.users`;
    console.log("users count:", u[0].count);

    // Check if users table has the single user
    const user = await sql`SELECT id, display_name FROM public.users WHERE id = '00000000-0000-0000-0000-000000000001'`;
    console.log("single user exists:", user.length > 0);

    // Check if there are foreign key constraints on review_state
    const constraints = await sql`
      SELECT conname, contype
      FROM pg_constraint
      WHERE conrelid = 'public.review_state'::regclass
    `;
    console.log("review_state constraints:", constraints.map(c => `${c.conname}(${c.contype})`));

    // Check recent review logs
    const recent = await sql`
      SELECT question_id, rating, reviewed_at, time_taken_ms
      FROM public.review_log
      ORDER BY reviewed_at DESC
      LIMIT 5
    `;
    console.log("recent reviews:", recent.length);
    for (const r of recent) {
      console.log(`  ${r.question_id}: rating=${r.rating} at=${r.reviewed_at} time=${r.time_taken_ms}ms`);
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
})();
