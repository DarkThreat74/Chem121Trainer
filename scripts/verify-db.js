const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

(async () => {
  const r = await sql`SELECT topic, COUNT(*) as count FROM public.questions GROUP BY topic ORDER BY topic`;
  console.log("Questions per topic:");
  for (const row of r) {
    console.log(`  ${row.topic}: ${row.count}`);
  }
  const t = await sql`SELECT COUNT(*) as total FROM public.questions`;
  console.log(`\nTotal: ${t[0].total}`);
})().catch((e) => console.error(e));
