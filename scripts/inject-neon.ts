import { neon } from "@neondatabase/serverless";
import { SAMPLE_QUESTIONS } from "../lib/sample-data";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set. Check .env.local");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function inject() {
  console.log(`📦 Injecting ${SAMPLE_QUESTIONS.length} questions into Neon DB...\n`);

  // Create schema if not exists
  await sql`
    CREATE TABLE IF NOT EXISTS public.questions (
      id TEXT PRIMARY KEY,
      topic TEXT NOT NULL,
      subtopic TEXT NOT NULL,
      mode TEXT NOT NULL,
      difficulty INTEGER NOT NULL,
      content JSONB NOT NULL,
      is_sample BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log("✅ questions table ready");

  await sql`
    CREATE TABLE IF NOT EXISTS public.review_state (
      user_id UUID NOT NULL,
      question_id TEXT NOT NULL,
      stability REAL NOT NULL DEFAULT 0,
      difficulty REAL NOT NULL DEFAULT 0,
      due TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      reps INTEGER NOT NULL DEFAULT 0,
      lapses INTEGER NOT NULL DEFAULT 0,
      state INTEGER NOT NULL DEFAULT 0,
      elapsed_days REAL NOT NULL DEFAULT 0,
      scheduled_days REAL NOT NULL DEFAULT 0,
      last_review TIMESTAMPTZ,
      PRIMARY KEY (user_id, question_id)
    )
  `;
  console.log("✅ review_state table ready");

  await sql`
    CREATE TABLE IF NOT EXISTS public.review_log (
      id TEXT NOT NULL,
      user_id UUID NOT NULL,
      question_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      state INTEGER NOT NULL,
      due TIMESTAMPTZ NOT NULL,
      reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      time_taken_ms INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (id)
    )
  `;
  console.log("✅ review_log table ready\n");

  // Delete old questions
  const deleted = await sql`DELETE FROM public.questions`;
  console.log(`🗑️  Deleted ${deleted.count ?? "all"} old questions`);

  // Insert new questions in batches
  let inserted = 0;
  const batchSize = 20;

  for (let i = 0; i < SAMPLE_QUESTIONS.length; i += batchSize) {
    const batch = SAMPLE_QUESTIONS.slice(i, i + batchSize);
    const values = batch.map(
      (q) =>
        `('${q.id}', '${q.topic}', '${q.subtopic}', '${q.mode}', ${q.difficulty}, '${JSON.stringify(q.content).replace(/'/g, "''")}', ${q.is_sample})`
    );

    await sql.query(
      `INSERT INTO public.questions (id, topic, subtopic, mode, difficulty, content, is_sample) VALUES ${values.join(", ")}`
    );
    inserted += batch.length;
    console.log(`  Inserted ${inserted}/${SAMPLE_QUESTIONS.length}...`);
  }

  // Verify
  const count = await sql`SELECT COUNT(*) as count FROM public.questions`;
  console.log(`\n✅ Total questions in DB: ${count[0].count}`);

  const byTopic = await sql`
    SELECT topic, COUNT(*) as count 
    FROM public.questions 
    GROUP BY topic 
    ORDER BY topic
  `;
  console.log("\n📊 Questions per topic:");
  for (const row of byTopic) {
    console.log(`   ${row.topic}: ${row.count}`);
  }

  console.log("\n🎉 Injection complete!");
}

inject().catch((err) => {
  console.error("❌ Injection failed:", err);
  process.exit(1);
});
