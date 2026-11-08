"use server";

import { pool } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { resolveSiteEventType } from "@/lib/sites/catalog";
import { getSiteUrl } from "@/lib/sites/url";
import { formatEventDate, formatEventPlace, formatEventTime } from "@/lib/event-format";
import type {
  SiteEligibleEvent,
  SiteEventSummary,
  SiteOverview,
  SiteOverviewItem,
} from "@/lib/sites/types";

type SiteRow = {
  id: string;
  name: string;
  subdomain: string;
  status: string;
  theme: Record<string, unknown> | null;
  published_at: Date | string | null;
  created_at: Date | string;
  event_id: string | null;
  event_title: string | null;
  template_name: string;
  event_type: string | null;
};

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

function toIso(value: Date | string | null): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

/** Liste des sites de l'organisation + événements éligibles sans site. */
export async function getSitesOverview(): Promise<SiteOverview> {
  const organization = await requireOrganization();

  const { rows } = await pool.query<SiteRow>(
    `SELECT
        s.id,
        s.name,
        s.subdomain,
        s.status::text AS status,
        s.theme,
        s.published_at,
        s.created_at,
        s.event_id,
        e.title AS event_title,
        t.name AS template_name,
        COALESCE(t.schema->>'eventType', '') AS event_type
       FROM sites s
       LEFT JOIN events e ON e.id = s.event_id
       JOIN site_templates t ON t.id = s.template_id
      WHERE s.organization_id = $1
        AND s.deleted_at IS NULL
      ORDER BY s.created_at DESC`,
    [organization.id],
  );

  const sites: SiteOverviewItem[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    subdomain: row.subdomain,
    url: getSiteUrl(row.subdomain),
    status: row.status,
    templateName: row.template_name,
    theme: (row.theme ?? {}) as SiteOverviewItem["theme"],
    publishedAt: toIso(row.published_at),
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    eventId: row.event_id,
    eventTitle: row.event_title,
    eventType: (row.event_type as SiteOverviewItem["eventType"]) || null,
  }));

  const { rows: eventRows } = await pool.query<EventRow>(
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
       LEFT JOIN sites s
              ON s.event_id = e.id
             AND s.deleted_at IS NULL
      WHERE e.organization_id = $1
        AND e.deleted_at IS NULL
        AND s.id IS NULL
      ORDER BY d.starts_at DESC NULLS LAST, e.created_at DESC`,
    [organization.id],
  );

  const eligibleEvents: SiteEligibleEvent[] = eventRows.flatMap((row) => {
    const eventType = resolveSiteEventType(row.category_slug, row.category_name);
    if (!eventType) return [];

    const date = toIso(row.starts_at);
    const publicUrl = `${(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")}/events/${row.id}`;
    const summary: SiteEventSummary = {
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
      location: formatEventPlace(row.venue_name, row.city),
      publicUrl,
    };

    return [{ ...summary, eventType }];
  });

  return { sites, eligibleEvents };
}
