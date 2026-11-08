import { Client } from "pg";
import { SITE_TEMPLATES } from "../lib/sites/catalog.ts";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : undefined,
});

await client.connect();
try {
  for (const template of SITE_TEMPLATES) {
    const schema = {
      eventType: template.eventType,
      variant: template.variant,
      layout: template.layout,
      description: template.description,
      palette: template.palette,
      sections: template.sections,
    };

    await client.query(
      `INSERT INTO site_templates (key, name, kind, schema, is_active)
       VALUES ($1, $2, $3::template_kind, $4::jsonb, true)
       ON CONFLICT (key) DO UPDATE
         SET name = EXCLUDED.name,
             kind = EXCLUDED.kind,
             schema = EXCLUDED.schema,
             is_active = true,
             updated_at = now()`,
      [template.key, template.name, template.kind, JSON.stringify(schema)],
    );
  }

  const result = await client.query(
    "select count(*)::int as total, count(*) filter (where schema->>'eventType' = 'wedding')::int as weddings from site_templates",
  );
  console.log(JSON.stringify({ catalog: SITE_TEMPLATES.length, database: result.rows[0] }));
} finally {
  await client.end();
}
