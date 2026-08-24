const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

(async () => {
  const cols = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'review_log'
    ORDER BY ordinal_position
  `;
  console.log("review_log columns:");
  cols.forEach((c) => console.log(`  ${c.column_name}: ${c.data_type}`));

  const cols2 = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'review_state'
    ORDER BY ordinal_position
  `;
  console.log("\nreview_state columns:");
  cols2.forEach((c) => console.log(`  ${c.column_name}: ${c.data_type}`));
})().catch((e) => console.error("Error:", e));
