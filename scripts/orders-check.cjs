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

  for (const t of ["orders", "tickets", "ticket_order_items", "payments", "ledger_entries", "ledger_accounts"]) {
    const trg = await pool.query(
      `SELECT tgname, pg_get_triggerdef(t.oid) AS def
         FROM pg_trigger t JOIN pg_class c ON c.oid = t.tgrelid
        WHERE c.relname = $1 AND NOT t.tgisinternal`,
      [t],
    );
    console.log(`\n=== triggers ${t} ===`);
    for (const r of trg.rows) console.log("   ", r.def);
    if (trg.rows.length === 0) console.log("    (aucun)");
  }

  // Fonctions référencées
  const fns = await pool.query(
    `SELECT p.proname, pg_get_functiondef(p.oid) AS def
       FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public' AND p.proname IN
        ('fn_order_after_insert','fn_ticket_after_insert','fn_orders_after_insert','fn_tickets_after_insert',
         'fn_order_created','fn_ticket_created','fn_create_tickets_for_order','fn_generate_order_number')
      ORDER BY p.proname`,
  );
  console.log("\n=== fonctions ===");
  for (const f of fns.rows) {
    console.log("\n---", f.proname, "---");
    console.log(f.def.slice(0, 1800));
  }

  // Defaults intéressants
  const defs = await pool.query(
    `SELECT table_name, column_name, column_default FROM information_schema.columns
      WHERE table_name IN ('orders','tickets','payments','ticket_order_items')
        AND column_default IS NOT NULL
      ORDER BY table_name, ordinal_position`,
  );
  console.log("\n=== defaults ===");
  for (const d of defs.rows) console.log("   ", d.table_name, ".", d.column_name, "=>", d.column_default);

  await pool.end();
})().catch((e) => {
  console.error("ERR", e.message);
  process.exit(1);
});
