"use server";

import { revalidatePath } from "next/cache";
import { withTransaction } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { eventInputSchema } from "@/lib/actions/validation";

/**
 * Met à jour un événement existant (events + event_dates + ticket_types).
 *
 * Les catégories de billets déjà vendues ne sont jamais supprimées : on marque
 * les anciennes `is_active = false` et on insère la nouvelle configuration, afin
 * de préserver les `tickets` et `order_items` qui les référencent.
 */
export async function updateEvent(id: string, input: unknown) {
  const data = eventInputSchema.parse(input);
  const organization = await requireOrganization();
  const now = new Date().toISOString();

  return withTransaction(async (client) => {
    const { rows: existing } = await client.query(
      `SELECT id, status FROM events
        WHERE id = $1 AND organization_id = $2 AND deleted_at IS NULL
        FOR UPDATE`,
      [id, organization.id],
    );

    if (!existing[0]) throw new Error("Événement introuvable");

    const status = data.status ?? existing[0].status;

    const { rows: events } = await client.query(
      `UPDATE events
          SET title = $1, description = $2, category_id = $3, cover_url = $4,
              venue_name = $5, address = $6, city = $7, country_code = $8,
              timezone = $9, status = $10, visibility = $11,
              published_at = CASE WHEN $10 = 'published' AND published_at IS NULL
                                  THEN $12::timestamptz ELSE published_at END,
              updated_at = now()
        WHERE id = $13
        RETURNING id, slug, title, status`,
      [
        data.title,
        data.description,
        data.category_id ?? null,
        data.cover_url || null,
        data.venue_name || null,
        data.address,
        data.city,
        (data.country_code ?? "CM").toUpperCase(),
        data.timezone ?? "Africa/Douala",
        status,
        data.visibility ?? "public",
        now,
        id,
      ],
    );

    // Une seule date pour l'instant : on remplace la première occurrence.
    const { rows: dates } = await client.query(
      `SELECT id FROM event_dates WHERE event_id = $1 ORDER BY starts_at ASC LIMIT 1`,
      [id],
    );

    if (dates[0]) {
      await client.query(
        `UPDATE event_dates
            SET starts_at = $1, ends_at = $2, doors_open_at = $3
          WHERE id = $4`,
        [data.starts_at, data.ends_at ?? null, data.doors_open_at ?? null, dates[0].id],
      );
    } else {
      await client.query(
        `INSERT INTO event_dates (event_id, starts_at, ends_at, doors_open_at)
         VALUES ($1, $2, $3, $4)`,
        [id, data.starts_at, data.ends_at ?? null, data.doors_open_at ?? null],
      );
    }

    // On désactive les anciennes catégories de billets (l'historique reste intact).
    await client.query(`UPDATE ticket_types SET is_active = false WHERE event_id = $1`, [id]);

    for (const [index, ticket] of data.tickets.entries()) {
      await client.query(
        `INSERT INTO ticket_types (
           event_id, name, description, price_amount, currency,
           quantity_total, max_per_order, is_active, sort_order
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8)`,
        [
          id,
          ticket.name,
          ticket.description || null,
          Math.round(ticket.price_amount),
          ticket.currency ?? "XAF",
          ticket.quantity_total,
          ticket.max_per_order ?? 10,
          index,
        ],
      );
    }

    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard/tickets");
    revalidatePath(`/dashboard/events/${id}`);

    return events[0];
  });
}
