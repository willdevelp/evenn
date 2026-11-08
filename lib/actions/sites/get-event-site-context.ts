"use server";

import { pool } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { formatEventDate, formatEventPlace, formatEventTime } from "@/lib/event-format";
import { EVENT_TYPE_META, resolveSiteEventType } from "@/lib/sites/catalog";
import { getSiteDomainSuffix, getSiteUrl } from "@/lib/sites/url";
import { listSiteTemplates } from "@/lib/sites/templates-db";
import type { EventSiteContext, EventSiteSummary, SiteEventSummary } from "@/lib/sites/types";

type EventRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: string;
  cover_url: string | null;
  venue_name: string | null;
  address: string | null;
  city: string | null;
  category_name: string | null;
  category_slug: string | null;
  starts_at: Date | string | null;
};

type SiteRow = {
  id: string;
  name: string;
  subdomain: string;
  status: string;
  theme: Record<string, unknown> | null;
  published_at: Date | string | null;
  created_at: Date | string;
  template_name: string;
};

function toIso(value: Date | string | null): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function mapSite(row: SiteRow): EventSiteSummary {
  const theme = (row.theme ?? {}) as EventSiteSummary["theme"];
  return {
    id: row.id,
    name: row.name,
    subdomain: row.subdomain,
    url: getSiteUrl(row.subdomain),
    status: row.status,
    templateName: row.template_name,
    theme,
    publishedAt: toIso(row.published_at),
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
  };
}

/** Contexte complet d'un site d'événement : événement, type, modèles, site existant. */
export async function getEventSiteContext(eventId: string): Promise<EventSiteContext | null> {
  const organization = await requireOrganization();

  const { rows } = await pool.query<EventRow>(
    `SELECT
        e.id,
        e.title,
        e.slug,
        e.description,
        e.status::text AS status,
        e.cover_url,
        e.venue_name,
        e.address,
        e.city,
        c.name_fr AS category_name,
        c.slug AS category_slug,
        d.starts_at
       FROM events e
       LEFT JOIN categories c ON c.id = e.category_id
       LEFT JOIN LATERAL (
         SELECT starts_at
           FROM event_dates
          WHERE event_id = e.id
          ORDER BY starts_at ASC
          LIMIT 1
       ) d ON TRUE
      WHERE e.id = $1
        AND e.organization_id = $2
        AND e.deleted_at IS NULL
      LIMIT 1`,
    [eventId, organization.id],
  );

  const row = rows[0];
  if (!row) return null;

  const eventType = resolveSiteEventType(row.category_slug, row.category_name);
  const templates = eventType ? await listSiteTemplates(eventType) : [];

  const { rows: siteRows } = await pool.query<SiteRow>(
    `SELECT
        s.id,
        s.name,
        s.subdomain,
        s.status::text AS status,
        s.theme,
        s.published_at,
        s.created_at,
        t.name AS template_name
       FROM sites s
       JOIN site_templates t ON t.id = s.template_id
      WHERE s.event_id = $1
        AND s.organization_id = $2
        AND s.deleted_at IS NULL
      LIMIT 1`,
    [eventId, organization.id],
  );

  const date = toIso(row.starts_at);
  const publicUrl = `${(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")}/events/${row.id}`;
  const location = formatEventPlace(row.venue_name, row.city);

  const event: SiteEventSummary = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? "",
    category: row.category_name,
    categorySlug: row.category_slug,
    status: row.status,
    coverUrl: row.cover_url,
    venueName: row.venue_name,
    address: row.address,
    city: row.city,
    date,
    dateLabel: formatEventDate(date),
    timeLabel: formatEventTime(date) ?? "",
    location,
    publicUrl,
  };

  return {
    event,
    eventType,
    eventTypeLabel: eventType ? EVENT_TYPE_META[eventType].label : null,
    templates,
    site: siteRows[0] ? mapSite(siteRows[0]) : null,
    domainSuffix: getSiteDomainSuffix(),
  };
}
