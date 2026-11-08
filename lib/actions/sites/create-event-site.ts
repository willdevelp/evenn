"use server";

import { revalidatePath } from "next/cache";

import { withTransaction } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { requireUser } from "@/lib/session";
import { EVENT_TYPE_META, resolveSiteEventType } from "@/lib/sites/catalog";
import { buildSiteSections } from "@/lib/sites/render";
import { getSiteUrl } from "@/lib/sites/url";
import { getSiteTemplateById } from "@/lib/sites/templates-db";
import { createEventSiteSchema } from "@/lib/sites/validation";
import type { CreatedEventSite, SiteEventSummary } from "@/lib/sites/types";
import { formatEventDate, formatEventPlace, formatEventTime } from "@/lib/event-format";

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "dashboard",
  "auth",
  "support",
  "help",
  "mail",
  "static",
  "cdn",
  "assets",
  "blog",
  "docs",
  "status",
  "evenn",
  "localhost",
]);

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

/**
 * Crée le site web personnalisé d'un événement :
 *   sites          <- événement, modèle, sous-domaine, thème, SEO
 *   site_pages     <- page d'accueil
 *   site_sections  <- sections rendues depuis le modèle
 *   site_versions  <- version publiée (snapshot utilisé par le rendu public)
 *
 * Les sept types autorisés sont définis dans `lib/sites/catalog.ts`.
 */
export async function createEventSite(input: unknown): Promise<CreatedEventSite> {
  const data = createEventSiteSchema.parse(input);
  const organization = await requireOrganization();
  const session = await requireUser();

  const template = await getSiteTemplateById(data.templateId);
  if (!template) {
    throw new Error("Ce modèle n'est plus disponible.");
  }

  return withTransaction(async (client) => {
    const { rows } = await client.query<EventRow>(
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
      [data.eventId, organization.id],
    );

    const event = rows[0];
    if (!event) {
      throw new Error("Événement introuvable ou non autorisé.");
    }

    const eventType = resolveSiteEventType(event.category_slug, event.category_name);
    if (!eventType) {
      throw new Error(
        "Ce type d'événement ne dispose pas encore de site personnalisé. Types pris en charge : mariage, concours, baptême, deuil, anniversaire, formation et festival.",
      );
    }
    if (template.eventType !== eventType) {
      throw new Error("Le modèle choisi ne correspond pas au type de l'événement.");
    }

    if (RESERVED_SUBDOMAINS.has(data.subdomain)) {
      throw new Error("Ce sous-domaine est réservé par la plateforme.");
    }

    const { rowCount: reserved } = await client.query(
      "SELECT 1 FROM reserved_subdomains WHERE name = $1 LIMIT 1",
      [data.subdomain],
    );
    if (reserved) {
      throw new Error("Ce sous-domaine est réservé. Choisissez-en un autre.");
    }

    const { rowCount: existingSubdomain } = await client.query(
      "SELECT 1 FROM sites WHERE subdomain = $1 LIMIT 1",
      [data.subdomain],
    );
    if (existingSubdomain) {
      throw new Error("Ce sous-domaine est déjà utilisé. Choisissez-en un autre.");
    }

    const { rows: existingSite } = await client.query(
      "SELECT 1 FROM sites WHERE event_id = $1 AND deleted_at IS NULL LIMIT 1",
      [event.id],
    );
    if (existingSite[0]) {
      throw new Error("Cet événement possède déjà un site web.");
    }

    const date = event.starts_at ? new Date(event.starts_at).toISOString() : null;
    const publicUrl = `${(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")}/events/${event.id}`;
    const eventSummary: SiteEventSummary = {
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description ?? "",
      category: event.category_name,
      categorySlug: event.category_slug,
      status: event.status,
      coverUrl: event.cover_url,
      venueName: event.venue_name,
      address: event.address,
      city: event.city,
      date,
      dateLabel: formatEventDate(date),
      timeLabel: formatEventTime(date) ?? "",
      location: formatEventPlace(event.venue_name, event.city),
      publicUrl,
    };

    const sections = buildSiteSections(template, eventSummary);
    const meta = EVENT_TYPE_META[eventType];
    const theme = {
      ...data.theme,
      variant: template.key.split("-").slice(1).join("-") || template.key,
      layout: template.layout,
      templateKey: template.key,
      eventType,
    };
    const seo = {
      title: `${event.title} — ${meta.label}`,
      description: (event.description ?? template.description).slice(0, 180),
      image: event.cover_url ?? undefined,
      eventId: event.id,
      eventType,
    };
    const now = new Date().toISOString();

    const { rows: sites } = await client.query<{ id: string; subdomain: string }>(
      `INSERT INTO sites (
         organization_id, event_id, template_id, name, subdomain,
         status, theme, seo, created_by, published_at
       )
       VALUES ($1, $2, $3, $4, $5, 'published', $6::jsonb, $7::jsonb, $8, $9)
       RETURNING id, subdomain`,
      [
        organization.id,
        event.id,
        template.id,
        event.title,
        data.subdomain,
        JSON.stringify(theme),
        JSON.stringify(seo),
        session.user.id,
        now,
      ],
    );

    const site = sites[0];

    const { rows: pages } = await client.query<{ id: string }>(
      `INSERT INTO site_pages (site_id, path, title, is_home, sort_order, seo)
       VALUES ($1, '/', $2, true, 0, $3::jsonb)
       RETURNING id`,
      [
        site.id,
        event.title,
        JSON.stringify({ title: seo.title, description: seo.description }),
      ],
    );

    const page = pages[0];

    for (const [index, section] of sections.entries()) {
      await client.query(
        `INSERT INTO site_sections (page_id, type, content, sort_order, is_visible)
         VALUES ($1, $2, $3::jsonb, $4, $5)`,
        [page.id, section.type, JSON.stringify(section.content), index, section.isVisible ?? true],
      );
    }

    const snapshot = {
      pages: [
        {
          path: "/",
          title: event.title,
          sections,
        },
      ],
    };

    const { rows: versions } = await client.query<{ id: string }>(
      `INSERT INTO site_versions (site_id, version_number, snapshot, note, created_by)
       VALUES ($1, 1, $2::jsonb, $3, $4)
       RETURNING id`,
      [site.id, JSON.stringify(snapshot), "Publication initiale", session.user.id],
    );

    await client.query(
      `UPDATE sites
          SET published_version_id = $1,
              updated_at = now()
        WHERE id = $2`,
      [versions[0].id, site.id],
    );

    const url = getSiteUrl(site.subdomain);

    revalidatePath("/dashboard/sites");
    revalidatePath(`/dashboard/events/${event.id}`);
    revalidatePath(`/dashboard/events/${event.id}/site`);
    revalidatePath(`/sites/${site.subdomain}`);

    return {
      id: site.id,
      subdomain: site.subdomain,
      url,
      eventId: event.id,
      templateName: template.name,
    };
  });
}
