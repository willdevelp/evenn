"use server";

import { pool } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";

export type EventDetailTicket = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  maxPerOrder: number;
};

export type EventDetail = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  status: string;
  visibility: string;
  country_code: string;
  timezone: string;

  cover_url: string | null;
  /** Ancien nom de `cover_url`, attendu par la page de détail. */
  image: string | null;
  venue_name: string | null;
  address: string | null;
  city: string | null;
  /** Ancien champ agrégé `location` : "venue_name, city". */
  location: string;

  /** Date ISO de la première occurrence (`event_dates`). */
  date: string | null;
  ends_at: string | null;
  /** Heure "HH:MM" dérivée de `starts_at`, attendue par la page de détail. */
  time: string;

  tickets: EventDetailTicket[];
  total_sold: number;
  total_tickets: number;
  revenue: number;
};

type DashboardEventRow = Omit<EventDetail, "date" | "ends_at"> & {
  date: Date | string | null;
  ends_at: Date | string | null;
};

/**
 * Détail d'un événement de l'organisation courante.
 * `tickets` expose les `ticket_types` (nom, prix, quota, vendus).
 */
export async function getEventById(id: string): Promise<EventDetail | null> {
  const organization = await requireOrganization();

  const { rows } = await pool.query<DashboardEventRow>(
    `SELECT
        e.id, e.title, e.slug, e.description,
        c.name_fr   AS category,
        e.status::text     AS status,
        e.visibility::text AS visibility,
        e.country_code, e.timezone,
        e.cover_url, e.venue_name, e.address, e.city,
        d.starts_at AS date, d.ends_at,
        CONCAT_WS(', ', NULLIF(e.venue_name, ''), NULLIF(e.city, '')) AS location
      FROM events e
      LEFT JOIN categories c ON c.id = e.category_id
      LEFT JOIN LATERAL (
        SELECT starts_at, ends_at
          FROM event_dates
         WHERE event_id = e.id
         ORDER BY starts_at ASC
         LIMIT 1
      ) d ON TRUE
     WHERE e.id = $1 AND e.organization_id = $2 AND e.deleted_at IS NULL`,
    [id, organization.id],
  );

  const event = rows[0];
  if (!event) return null;

  const { rows: tickets } = await pool.query(
    `SELECT id, name, price_amount, quantity_total, quantity_sold, max_per_order
       FROM ticket_types
      WHERE event_id = $1 AND is_active = true
      ORDER BY sort_order ASC, created_at ASC`,
    [id],
  );

  const { rows: revenue } = await pool.query(
    `SELECT COALESCE(gross_revenue, 0)::bigint AS amount
       FROM v_event_sales
      WHERE event_id = $1`,
    [id],
  );

  const mappedTickets: EventDetailTicket[] = tickets.map((t) => ({
    id: t.id,
    name: t.name,
    price: Number(t.price_amount),
    quantity: Number(t.quantity_total),
    sold: Number(t.quantity_sold),
    maxPerOrder: Number(t.max_per_order),
  }));

  const startsAt: string | null = event.date ? new Date(event.date).toISOString() : null;
  // Heure locale de Yaoundé (UTC+1) au format HH:MM.
  const time = startsAt
    ? new Date(new Date(startsAt).getTime() + 60 * 60 * 1000).toISOString().slice(11, 16)
    : "";

  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    category: event.category,
    status: event.status,
    visibility: event.visibility,
    country_code: event.country_code,
    timezone: event.timezone,
    cover_url: event.cover_url,
    image: event.cover_url,
    venue_name: event.venue_name,
    address: event.address,
    city: event.city,
    location: event.location || event.city || "",
    date: startsAt,
    ends_at: event.ends_at ? new Date(event.ends_at).toISOString() : null,
    time,
    tickets: mappedTickets,
    total_sold: mappedTickets.reduce((sum, t) => sum + t.sold, 0),
    total_tickets: mappedTickets.reduce((sum, t) => sum + t.quantity, 0),
    revenue: Number(revenue[0]?.amount ?? 0),
  };
}



export async function getEventsById(
  id: string
): Promise<EventDetail | null> {
  const { rows } = await pool.query<DashboardEventRow>(
    `SELECT
        e.id,
        e.title,
        e.slug,
        e.description,
        c.name_fr AS category,
        e.status::text AS status,
        e.visibility::text AS visibility,
        e.country_code,
        e.timezone,
        e.cover_url,
        e.venue_name,
        e.address,
        e.city,
        d.starts_at AS date,
        d.ends_at,
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
      WHERE
        e.id = $1
        AND e.deleted_at IS NULL
        AND e.status::text = 'published'
        AND e.visibility::text = 'public'`,
    [id]
  );

  const event = rows[0];

  if (!event) {
    return null;
  }

  const { rows: tickets } = await pool.query(
    `SELECT
        id,
        name,
        price_amount,
        quantity_total,
        quantity_sold,
        max_per_order
      FROM ticket_types
      WHERE event_id = $1 AND is_active = true
      ORDER BY sort_order ASC, created_at ASC`,
    [id]
  );

  const { rows: revenue } = await pool.query(
    `SELECT COALESCE(gross_revenue, 0)::bigint AS amount
      FROM v_event_sales
      WHERE event_id = $1`,
    [id]
  );

  const mappedTickets: EventDetailTicket[] = tickets.map((t) => ({
    id: t.id,
    name: t.name,
    price: Number(t.price_amount),
    quantity: Number(t.quantity_total),
    sold: Number(t.quantity_sold),
    maxPerOrder: Number(t.max_per_order),
  }));

  const startsAt = event.date
    ? new Date(event.date).toISOString()
    : null;

  // Utiliser le fuseau horaire configuré pour l'événement.
  const time = startsAt
    ? new Intl.DateTimeFormat("fr-FR", {
        timeZone: event.timezone || "Africa/Douala",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(new Date(startsAt))
    : "";

  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    category: event.category,
    status: event.status,
    visibility: event.visibility,
    country_code: event.country_code,
    timezone: event.timezone,
    cover_url: event.cover_url,
    image: event.cover_url,
    venue_name: event.venue_name,
    address: event.address,
    city: event.city,
    location: event.location || event.city || "",
    date: startsAt,
    ends_at: event.ends_at
      ? new Date(event.ends_at).toISOString()
      : null,
    time,
    tickets: mappedTickets,
    total_sold: mappedTickets.reduce(
      (sum, ticket) => sum + ticket.sold,
      0
    ),
    total_tickets: mappedTickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0
    ),
    revenue: Number(revenue[0]?.amount ?? 0),
  };
}
