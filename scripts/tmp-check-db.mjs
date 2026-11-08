import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : undefined,
});

await client.connect();
const result = await client.query(
  "select id, slug, name_fr, scope, sort_order from categories where slug in ('mariage','concours','bapteme','deuil','anniversaire','formation','festival') order by slug, scope",
);
console.log(JSON.stringify(result.rows, null, 2));
await client.end();
