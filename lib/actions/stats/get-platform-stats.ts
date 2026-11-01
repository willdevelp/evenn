"use server";

import { pool } from "@/lib/db";

/** Agrégats publics calculés en base (aucune valeur codée en dur). */
export type PlatformStats = {
  /** Événements publiés et publics. */
  publishedEvents: number;
  /** Événements publiés dont la prochaine occurrence est à venir. */
  upcomingEvents: number;
  /** Billets réellement vendus (somme des quotas vendus des catégories de billets). */
  ticketsSold: number;
  /** Capacité totale des billets en vente. */
  capacity: number;
  /** Organisations (organisateurs) enregistrées. */
  organizations: number;
  /** Comptes utilisateurs. */
  members: number;
  /** Entrées scannées (contrôle d'accès). */
  scans: number;
  /** Revenus encaissés sur la billetterie, en XAF. */
  revenue: number;
};

export async function getPlatformStats(): Promise<PlatformStats> {
  const { rows } = await pool.query(
    `SELECT
       (SELECT count(*) FROM events e
         WHERE e.deleted_at IS NULL
           AND e.status::text = 'published'
           AND e.visibility::text = 'public')::int AS published_events,
       (SELECT count(*) FROM events e
          JOIN LATERAL (
            SELECT starts_at FROM event_dates WHERE event_id = e.id ORDER BY starts_at ASC LIMIT 1
          ) d ON TRUE
         WHERE e.deleted_at IS NULL
           AND e.status::text = 'published'
           AND e.visibility::text = 'public'
           AND d.starts_at >= now())::int AS upcoming_events,
       (SELECT COALESCE(sum(tt.quantity_sold), 0) FROM ticket_types tt)::int AS tickets_sold,
       (SELECT COALESCE(sum(tt.quantity_total), 0) FROM ticket_types tt)::int AS capacity,
       (SELECT count(*) FROM organizations)::int AS organizations,
       (SELECT count(*) FROM "user")::int AS members,
       (SELECT count(*) FROM ticket_scans)::int AS scans,
       (SELECT COALESCE(sum(gross_revenue), 0) FROM v_event_sales)::int AS revenue`,
  );

  const row = rows[0];

  return {
    publishedEvents: row.published_events,
    upcomingEvents: row.upcoming_events,
    ticketsSold: row.tickets_sold,
    capacity: row.capacity,
    organizations: row.organizations,
    members: row.members,
    scans: row.scans,
    revenue: row.revenue,
  };
}
