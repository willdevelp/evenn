import { pool } from "./db";

export type SiteSection = { type: string; content: Record<string, unknown>; isVisible?: boolean };
export type SitePageSnapshot = { path: string; title: string; sections: SiteSection[] };
export type SiteSnapshot = { pages: SitePageSnapshot[] };

export type PublishedSite = {
  id: string;
  name: string;
  theme: Record<string, string>;
  seo: { title?: string; description?: string; image?: string };
  snapshot: SiteSnapshot;
};

/**
 * Retrouve un site publié à partir de la clé du tenant :
 *  - sans point  -> sous-domaine (ex: "awa")
 *  - avec point  -> domaine personnalisé vérifié (ex: "monmariage.cm")
 */
export async function getPublishedSite(tenantKey: string): Promise<PublishedSite | null> {
  const { rows } = await pool.query(
    `SELECT s.id, s.name, s.theme, s.seo, v.snapshot
       FROM sites s
       JOIN site_versions v ON v.id = s.published_version_id
      WHERE s.status = 'published'
        AND s.deleted_at IS NULL
        AND ( ($1 NOT LIKE '%.%' AND s.subdomain = $1)
           OR ($1 LIKE '%.%' AND s.id = (SELECT site_id FROM site_domains WHERE domain = $1 AND verified_at IS NOT NULL)) )
      LIMIT 1`,
    [tenantKey.toLowerCase()],
  );
  return (rows[0] as PublishedSite | undefined) ?? null;
}
