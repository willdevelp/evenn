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
  organizer: {
    name: string;
    description: string | null;
    logoUrl: string | null;
    websiteUrl: string | null;
    socialLinks: Record<string, string>;
  };
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
  const { rows } = await pool.query<{
    id: string;
    name: string;
    theme: SiteTheme | null;
    seo: PublishedSite["seo"] | null;
    snapshot: SiteSnapshot;
    organizer_name: string | null;
    organizer_description: string | null;
    organizer_logo_url: string | null;
    organizer_website_url: string | null;
    organizer_social_links: unknown;
    template_id: string;
    template_key: string;
    template_name: string;
    template_kind: string;
    template_schema: SiteTemplateSchema | null;
  }>(
    `SELECT
        s.id,
        s.name,
        s.theme,
        s.seo,
        v.snapshot,
        o.name AS organizer_name,
        o.description AS organizer_description,
        o.logo_url AS organizer_logo_url,
        o.website_url AS organizer_website_url,
        o.social_links AS organizer_social_links,
        t.id          AS template_id,
        t.key         AS template_key,
        t.name        AS template_name,
        t.kind::text  AS template_kind,
        t.schema      AS template_schema
       FROM sites s
       JOIN organizations o ON o.id = s.organization_id
       JOIN site_versions v ON v.id = s.published_version_id
       JOIN site_templates t ON t.id = s.template_id
      WHERE s.status = 'published'
        AND s.deleted_at IS NULL
        AND o.deleted_at IS NULL
        AND ( ($1 NOT LIKE '%.%' AND s.subdomain = $1)
           OR ($1 LIKE '%.%' AND s.id = (SELECT site_id FROM site_domains WHERE domain = $1 AND verified_at IS NOT NULL)) )
        AND (
          s.event_id IS NULL
          OR NOT EXISTS (SELECT 1 FROM event_dates ed WHERE ed.event_id = s.event_id)
          OR EXISTS (
            SELECT 1 FROM event_dates ed
             WHERE ed.event_id = s.event_id
               AND COALESCE(ed.ends_at, ed.starts_at) > now()
          )
        )
      LIMIT 1`,
    [tenantKey.toLowerCase()],
  );

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    theme: row.theme ?? {},
    seo: row.seo ?? {},
    snapshot: row.snapshot,
    organizer: {
      name: row.organizer_name ?? "",
      description: row.organizer_description,
      logoUrl: row.organizer_logo_url,
      websiteUrl: row.organizer_website_url,
      socialLinks:
        row.organizer_social_links &&
        typeof row.organizer_social_links === "object" &&
        !Array.isArray(row.organizer_social_links)
          ? Object.fromEntries(
              Object.entries(row.organizer_social_links).filter(
                (entry): entry is [string, string] => typeof entry[1] === "string",
              ),
            )
          : {},
    },
    template: {
      id: row.template_id,
      key: row.template_key,
      name: row.template_name,
      kind: row.template_kind,
      schema: row.template_schema ?? {},
    },
  };
}
