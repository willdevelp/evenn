const fs = require("node:fs");
const path = require("node:path");
const { Pool } = require("pg");

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });

  const cols = await pool.query(
    `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns WHERE table_name='organizations' ORDER BY ordinal_position`,
  );
  console.log("===== organizations =====");
  for (const c of cols.rows) {
    console.log("   ", c.column_name, "|", c.data_type, "| null:", c.is_nullable, "|", c.column_default ?? "");
  }

  // Contraintes CHECK / UNIQUE
  const cons = await pool.query(
    `SELECT conname, contype, pg_get_constraintdef(oid) AS def
       FROM pg_constraint WHERE conrelid='organizations'::regclass ORDER BY contype, conname`,
  );
  console.log("\n===== contraintes =====");
  for (const c of cons.rows) console.log("   ", c.contype, c.conname, "=>", c.def);

  // Exemple de social_links réel
  const sample = await pool.query("SELECT id, slug, name, country_code, verification_status, social_links, website_url, logo_url FROM organizations LIMIT 3");
  console.log("\n===== échantillon =====");
  for (const r of sample.rows) console.log("   ", JSON.stringify(r));

  // Le type réel de slug
  const slugType = await pool.query(
    `SELECT c.udt_name, c.data_type FROM information_schema.columns c
      WHERE c.table_name='organizations' AND c.column_name='slug'`,
  );
  console.log("\ntype de slug:", JSON.stringify(slugType.rows[0]));

  await pool.end();
})().catch((e) => {
  console.error("ERR", e.message);
  process.exit(1);
});
