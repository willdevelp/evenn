import { pool } from "@/lib/db";
import {
  SITE_TEMPLATE_BY_KEY,
  SITE_TEMPLATES,
  type SiteEventType,
  type SitePalette,
  type SiteSectionTemplate,
  type SiteTemplateDefinition,
  type SiteTemplateLayout,
} from "@/lib/sites/catalog";
import type { SiteTemplateOption } from "@/lib/sites/types";

type TemplateRow = {
  id: string;
  key: string;
  name: string;
  kind: string;
  schema: Record<string, unknown> | null;
};

let seedPromise: Promise<void> | null = null;

/**
 * Crée les 21 modèles du catalogue (3 par type d'événement) s'ils n'existent
 * pas encore. Le schéma `site_templates` est la source utilisée par
 * `sites.template_id` ; on ne peut donc pas se contenter du catalogue en
 * mémoire.
 */
export function ensureSiteTemplatesSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedTemplates().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

async function seedTemplates(): Promise<void> {
  const { rows } = await pool.query<{ key: string }>("SELECT key FROM site_templates");
  const existing = new Set(rows.map((row) => row.key));
  const missing = SITE_TEMPLATES.filter((template) => !existing.has(template.key));

  for (const template of missing) {
    const schema = {
      eventType: template.eventType,
      variant: template.variant,
      layout: template.layout,
      description: template.description,
      palette: template.palette,
      sections: template.sections,
    };

    await pool.query(
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
}

function asPalette(value: unknown, fallback: SitePalette): SitePalette {
  const palette = (value ?? {}) as Partial<SitePalette>;
  return {
    primaryColor: palette.primaryColor ?? fallback.primaryColor,
    accentColor: palette.accentColor ?? fallback.accentColor,
    backgroundColor: palette.backgroundColor ?? fallback.backgroundColor,
    textColor: palette.textColor ?? fallback.textColor,
  };
}

function rowToOption(row: TemplateRow): SiteTemplateOption {
  const catalog = SITE_TEMPLATE_BY_KEY.get(row.key);
  const fallback: SiteTemplateDefinition = catalog ?? SITE_TEMPLATES[0];
  const schema = row.schema ?? {};

  return {
    id: row.id,
    key: row.key,
    name: row.name,
    eventType: (schema.eventType as SiteEventType | undefined) ?? fallback.eventType,
    description: (schema.description as string | undefined) ?? fallback.description,
    layout: (schema.layout as SiteTemplateLayout | undefined) ?? fallback.layout,
    palette: asPalette(schema.palette, fallback.palette),
    sections: (schema.sections as SiteSectionTemplate[] | undefined) ?? fallback.sections,
  };
}

export async function listSiteTemplates(eventType: SiteEventType): Promise<SiteTemplateOption[]> {
  await ensureSiteTemplatesSeeded();

  const { rows } = await pool.query<TemplateRow>(
    `SELECT id, key, name, kind::text AS kind, schema
       FROM site_templates
      WHERE is_active = true
        AND COALESCE(schema->>'eventType', '') = $1
      ORDER BY name ASC`,
    [eventType],
  );

  return rows.map(rowToOption);
}

export async function getSiteTemplateById(id: string): Promise<SiteTemplateOption | null> {
  await ensureSiteTemplatesSeeded();

  const { rows } = await pool.query<TemplateRow>(
    `SELECT id, key, name, kind::text AS kind, schema
       FROM site_templates
      WHERE id = $1 AND is_active = true
      LIMIT 1`,
    [id],
  );

  return rows[0] ? rowToOption(rows[0]) : null;
}
