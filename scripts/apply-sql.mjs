import { readFile } from "node:fs/promises";
import { Pool } from "pg";

const file = process.argv[2];

if (!file) {
  console.error("Usage : node --env-file=.env scripts/apply-sql.mjs <fichier.sql>");
  process.exit(1);
}

const sql = await readFile(file, "utf8");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  ssl: process.env.DATABASE_URL?.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : undefined,
});

try {
  await pool.query(sql);
  console.log(`Migration appliquée : ${file}`);
} finally {
  await pool.end();
}
