"use server";

import { revalidatePath } from "next/cache";
import { withTransaction } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { toSlug } from "@/lib/slug";
import { eventInputSchema } from "@/lib/actions/validation";

export type CreatedEvent = {
  id: string;
  slug: string;
  title: string;
  status: string;
};

/**
 * Crée un événement complet à partir du schéma SQL réel.
 *
 * Répartition des données :
 *   events       <- titre, catégorie, couverture, lieu, timezone, statut, slug
 *   event_dates  <- starts_at / ends_at / doors_open_at
 *   ticket_types <- catégories de billets (PAS de table "tickets")
 *
 * Tout est écrit dans une seule transaction : si un billet échoue, l'événement
 * est annulé (rollback) au lieu de laisser des données orphelines.
 */
export async function createEvent(input: unknown): Promise<CreatedEvent> {
  const data = eventInputSchema.parse(input);
  const organization = await requireOrganization();

  const status = data.status ?? "published";
  const now = new Date().toISOString();

  return withTransaction(async (client) => {
    // Slug unique : "concert-afro-night", "concert-afro-night-2"...
    const baseSlug = toSlug(data.title);
    let slug = baseSlug;
    for (let attempt = 0; attempt < 50; attempt += 1) {
      const { rowCount } = await client.query("SELECT 1 FROM events WHERE slug = $1", [slug]);
      if (rowCount === 0) break;
      slug = `${baseSlug}-${attempt + 2}`;
    }

    const { rows: events } = await client.query<CreatedEvent>(
      `INSERT INTO events (
         organization_id, category_id, title, slug, description, cover_url,
         venue_name, address, city, country_code, timezone,
         status, visibility, published_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id, slug, title, status`,
      [
        organization.id,
        data.category_id ?? null,
        data.title,
        slug,
        data.description,
        data.cover_url || null,
        data.venue_name || null,
        data.address,
        data.city,
        (data.country_code ?? "CM").toUpperCase(),
        data.timezone ?? "Africa/Douala",
        status,
        data.visibility ?? "public",
        status === "published" ? now : null,
      ],
    );

    const event = events[0];

    await client.query(
      `INSERT INTO event_dates (event_id, starts_at, ends_at, doors_open_at)
       VALUES ($1, $2, $3, $4)`,
      [
        event.id,
        data.starts_at,
        data.ends_at ?? null,
        data.doors_open_at ?? null,
      ],
    );

    for (const [index, ticket] of data.tickets.entries()) {
      await client.query(
        `INSERT INTO ticket_types (
           event_id, name, description, price_amount, currency,
           quantity_total, max_per_order, is_active, sort_order
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          event.id,
          ticket.name,
          ticket.description || null,
          Math.round(ticket.price_amount),
          ticket.currency ?? "XAF",
          ticket.quantity_total,
          ticket.max_per_order ?? 10,
          true,
          index,
        ],
      );
    }

    revalidatePath("/dashboard/events");
    revalidatePath("/events");
    revalidatePath(`/dashboard/organizer/${organization.slug}`);

    return event;
  });
}
