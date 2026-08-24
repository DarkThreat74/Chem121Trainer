const { neon } = require("@neondatabase/serverless");
const { SAMPLE_QUESTIONS } = require("./lib/sample-data");
require("dotenv").config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

(async () => {
  // Get existing question IDs from DB
  const existing = await sql`SELECT id FROM public.questions`;
  const existingIds = new Set(existing.map((r) => r.id));
  console.log(`DB has ${existingIds.size} questions`);

  // Find missing questions
  const missing = SAMPLE_QUESTIONS.filter((q) => !existingIds.has(q.id));
  console.log(`Missing ${missing.length} questions:`);
  for (const q of missing) {
    console.log(`  ${q.id} (${q.topic})`);
  }

  if (missing.length === 0) {
    console.log("✅ All questions already in DB!");
    return;
  }

  // Insert missing questions one by one
  let inserted = 0;
  for (const q of missing) {
    try {
      await sql.query(
        `INSERT INTO public.questions (id, topic, subtopic, mode, difficulty, content, is_sample)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [q.id, q.topic, q.subtopic, q.mode, q.difficulty, JSON.stringify(q.content), q.is_sample]
      );
      inserted++;
      console.log(`  ✅ Inserted ${q.id}`);
    } catch (e) {
      console.error(`  ❌ Failed to insert ${q.id}: ${e.message}`);
    }
  }

  console.log(`\n✅ Inserted ${inserted}/${missing.length} missing questions`);

  // Verify
  const count = await sql`SELECT COUNT(*) as count FROM public.questions`;
  console.log(`Total questions in DB: ${count[0].count}`);

  const byTopic = await sql`SELECT topic, COUNT(*) as count FROM public.questions GROUP BY topic ORDER BY topic`;
  console.log("\nQuestions per topic:");
  for (const row of byTopic) {
    console.log(`  ${row.topic}: ${row.count}`);
  }
})().catch((e) => console.error("Error:", e));
