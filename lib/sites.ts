import { pool } from "./db";
import type { SitePalette, SiteTemplateLayout } from "./sites/catalog";

export type SiteSection = { type: string; content: Record<string, unknown>; isVisible?: boolean };
export type SitePageSnapshot = { path: string; title: string; sections: SiteSection[] };
export type SiteSnapshot = { pages: SitePageSnapshot[] };

export type SiteTheme = Partial<SitePalette> & {
  variant?: string;
  layout?: SiteTemplateLayout;
  templateKey?: string;
  eventType?: string;
};

export type SiteTemplateSchema = {
  eventType?: string;
  variant?: string;
  layout?: SiteTemplateLayout;
  description?: string;
  palette?: SitePalette;
  sections?: SiteSection[];
};

export type PublishedSite = {
  id: string;
  name: string;
  theme: SiteTheme;
  seo: { title?: string; description?: string; image?: string };
  snapshot: SiteSnapshot;
  template: {
    id: string;
    key: string;
    name: string;
    kind: string;
    schema: SiteTemplateSchema;
  };
};

/**
 * Retrouve un site publié à partir de la clé du tenant :
 *  - sans point  -> sous-domaine (ex: "awa")
 *  - avec point  -> domaine personnalisé vérifié (ex: "monmariage.cm")
 */
export async function getPublishedSite(tenantKey: string): Promise<PublishedSite | null> {
  const { rows } = await pool.query(
    `SELECT
        s.id,
        s.name,
        s.theme,
        s.seo,
        v.snapshot,
        t.id          AS template_id,
        t.key         AS template_key,
        t.name        AS template_name,
        t.kind::text  AS template_kind,
        t.schema      AS template_schema
       FROM sites s
       JOIN site_versions v ON v.id = s.published_version_id
       JOIN site_templates t ON t.id = s.template_id
      WHERE s.status = 'published'
        AND s.deleted_at IS NULL
        AND ( ($1 NOT LIKE '%.%' AND s.subdomain = $1)
           OR ($1 LIKE '%.%' AND s.id = (SELECT site_id FROM site_domains WHERE domain = $1 AND verified_at IS NOT NULL)) )
      LIMIT 1`,
    [tenantKey.toLowerCase()],
  );

  const row = rows[0] as
    | (Omit<PublishedSite, "template"> & {
        template_id: string;
        template_key: string;
        template_name: string;
        template_kind: string;
        template_schema: SiteTemplateSchema;
      })
    | undefined;

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    theme: row.theme ?? {},
    seo: row.seo ?? {},
    snapshot: row.snapshot,
    template: {
      id: row.template_id,
      key: row.template_key,
      name: row.template_name,
      kind: row.template_kind,
      schema: row.template_schema ?? {},
    },
  };
}
