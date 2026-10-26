"use server";

import { pool } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";

export type DashboardEvent = {
  id: string;
  title: string;
  slug: string;
  status: string;
  visibility: string;
  category: string | null;
  cover_url: string | null;
  venue_name: string | null;
  address: string | null;
  city: string | null;
  country_code: string;

  /** Date de l'événement (prochaine occurrence de `event_dates`), en ISO. */
  date: string | null;
  ends_at: string | null;

  /** Nombre de billets émis. */
  tickets_sold: number;
  /** Somme des quotas de toutes les catégories de billets. */
  total_tickets: number;
  /** Montant encaissé sur les commandes payées, en XAF. */
  revenue: number;

  // --- Compatibilité avec l'ancienne forme attendue par le tableau de bord ---
  /** Ancien champ `location` : "venue_name, city". */
  location: string;
};

type DashboardEventRow = Omit<DashboardEvent, "date" | "ends_at"> & {
  date: Date | string | null;
  ends_at: Date | string | null;
};

const toIsoString = (value: Date | string | null): string | null =>
  value instanceof Date ? value.toISOString() : value;

/**
 * Liste les événements de l'organisation courante avec leurs agrégats.
 *
 * Remplace l'ancienne requête Supabase qui interrogeait une relation `tickets`
 * et une colonne `date` inexistantes. Les données proviennent maintenant des
 * vraies tables : events + event_dates + ticket_types.
 *
 * `orders` ne porte pas d'`event_id` : le lien par événement passe par
 * `ticket_order_items.ticket_type_id -> ticket_types.event_id` (la table
 * `order_items` des types générés n'existe pas en base ; c'est la vue
 * `v_event_sales` qui fait foi pour les ventes).
 */
export async function getEvents(): Promise<DashboardEvent[]> {
  const organization = await requireOrganization();

  const { rows } = await pool.query<DashboardEventRow>(
    `SELECT
        e.id,
        e.title,
        e.slug,
        e.status::text                     AS status,
        e.visibility::text                 AS visibility,
        c.name_fr                          AS category,
        e.cover_url,
        e.venue_name,
        e.address,
        e.city,
        e.country_code,
        d.starts_at                        AS date,
        d.ends_at,
        COALESCE(s.tickets_sold, 0)::int   AS tickets_sold,
        COALESCE(t.total, 0)::int          AS total_tickets,
        COALESCE(s.gross_revenue, 0)::bigint AS revenue,
        CONCAT_WS(', ', NULLIF(e.venue_name, ''), NULLIF(e.city, '')) AS location
      FROM events e
      LEFT JOIN categories c ON c.id = e.category_id
      LEFT JOIN LATERAL (
        SELECT id, starts_at, ends_at
          FROM event_dates
         WHERE event_id = e.id
         ORDER BY starts_at ASC
         LIMIT 1
      ) d ON TRUE
      LEFT JOIN LATERAL (
        SELECT SUM(quantity_total) AS total
          FROM ticket_types
         WHERE event_id = e.id
      ) t ON TRUE
      LEFT JOIN v_event_sales s ON s.event_id = e.id
     WHERE e.organization_id = $1 AND e.deleted_at IS NULL
     ORDER BY COALESCE(d.starts_at, e.created_at) DESC`,
    [organization.id],
  );

  return rows.map((row) => ({
    ...row,
    date: toIsoString(row.date),
    ends_at: toIsoString(row.ends_at),
    location: row.location || row.city || "",
  }));
}



export async function getEvent(): Promise<DashboardEvent[]> {
  const { rows } = await pool.query<DashboardEventRow>(
    `SELECT
        e.id,
        e.title,
        e.slug,
        e.status::text AS status,
        e.visibility::text AS visibility,
        c.name_fr AS category,
        e.cover_url,
        e.venue_name,
        e.address,
        e.city,
        e.country_code,
        d.starts_at AS date,
        d.ends_at,
        COALESCE(s.tickets_sold, 0)::int AS tickets_sold,
        COALESCE(t.total, 0)::int AS total_tickets,
        COALESCE(s.gross_revenue, 0)::bigint AS revenue,
        CONCAT_WS(
          ', ',
          NULLIF(e.venue_name, ''),
          NULLIF(e.city, '')
        ) AS location
      FROM events e
      LEFT JOIN categories c
        ON c.id = e.category_id
      LEFT JOIN LATERAL (
        SELECT starts_at, ends_at
        FROM event_dates
        WHERE event_id = e.id
        ORDER BY starts_at ASC
        LIMIT 1
      ) d ON TRUE
      LEFT JOIN LATERAL (
        SELECT SUM(quantity_total) AS total
        FROM ticket_types
        WHERE event_id = e.id
      ) t ON TRUE
      LEFT JOIN v_event_sales s
        ON s.event_id = e.id
      WHERE
        e.deleted_at IS NULL
        AND e.status::text = 'published'
        AND e.visibility::text = 'public'
      ORDER BY
        COALESCE(d.starts_at, e.created_at) DESC`
  );

  return rows.map((row) => ({
    ...row,
    date: toIsoString(row.date),
    ends_at: toIsoString(row.ends_at),
    location: row.location || row.city || "",
  }));
}
