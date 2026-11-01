"use server";

import { pool } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { recordIdSchema } from "@/lib/actions/validation";

export type TicketTypeRow = {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  price: number;
  sold: number;
  total: number;
  currency: string;
  isActive: boolean;
};

/** Types de billets des événements de l'organisation connectée. */
export async function getTickets(eventId?: string): Promise<TicketTypeRow[]> {
  const organization = await requireOrganization();
  const filter = eventId && recordIdSchema.safeParse(eventId).success ? eventId : null;

  const { rows } = await pool.query(
    `SELECT tt.id, tt.event_id, e.title AS event_title,
            tt.name, tt.price_amount, tt.quantity_sold, tt.quantity_total,
            tt.currency, tt.is_active
       FROM ticket_types tt
       JOIN events e ON e.id = tt.event_id
      WHERE e.organization_id = $1
        AND e.deleted_at IS NULL
        AND ($2::uuid IS NULL OR tt.event_id = $2::uuid)
      ORDER BY e.created_at DESC, tt.sort_order ASC, tt.created_at ASC`,
    [organization.id, filter],
  );

  return rows.map((row) => ({
    id: row.id,
    eventId: row.event_id,
    eventTitle: row.event_title,
    name: row.name,
    price: Number(row.price_amount),
    sold: Number(row.quantity_sold),
    total: Number(row.quantity_total),
    currency: row.currency,
    isActive: Boolean(row.is_active),
  }));
}
