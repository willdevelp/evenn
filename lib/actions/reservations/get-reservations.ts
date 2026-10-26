"use server";

import { pool } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";

export type ReservationRow = {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  eventId: string;
  eventTitle: string;
  ticketType: string;
  quantity: number;
  amount: number;
  /** Statut affiché dans le tableau de bord. */
  status: "confirmed" | "pending" | "cancelled";
  /** Statut réel de la commande (`orders.status`). */
  orderStatus: string;
  createdAt: string;
};

type Row = {
  id: string;
  order_number: string;
  status: string;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  total_amount: string;
  created_at: Date;
  event_id: string | null;
  event_title: string | null;
  ticket_type: string | null;
  quantity: number | null;
};

const toDisplayStatus = (status: string): ReservationRow["status"] => {
  if (status === "paid") return "confirmed";
  if (status === "cancelled" || status === "refunded") return "cancelled";
  return "pending";
};

/** Réservations (commandes de billets) de l'organisation courante. */
export async function getReservations(): Promise<ReservationRow[]> {
  const organization = await requireOrganization();

  const { rows } = await pool.query<Row>(
    `SELECT
        o.id,
        o.order_number,
        o.status::text AS status,
        o.buyer_name,
        o.buyer_email,
        o.buyer_phone,
        o.total_amount,
        o.created_at,
        e.id   AS event_id,
        e.title AS event_title,
        string_agg(tt.name, ', ' ORDER BY tt.name) AS ticket_type,
        COALESCE(SUM(oi.quantity), 0)::int AS quantity
       FROM orders o
       LEFT JOIN ticket_order_items oi ON oi.order_id = o.id
       LEFT JOIN ticket_types tt ON tt.id = oi.ticket_type_id
       LEFT JOIN events e ON e.id = tt.event_id
      WHERE o.organization_id = $1 AND o.kind = 'ticket'
      GROUP BY o.id, e.id
      ORDER BY o.created_at DESC`,
    [organization.id],
  );

  return rows.map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    buyerName: row.buyer_name ?? "Client",
    buyerEmail: row.buyer_email ?? "Non renseigné",
    buyerPhone: row.buyer_phone ?? "",
    eventId: row.event_id ?? "",
    eventTitle: row.event_title ?? "Événement supprimé",
    ticketType: row.ticket_type ?? "—",
    quantity: Number(row.quantity ?? 0),
    amount: Number(row.total_amount),
    status: toDisplayStatus(row.status),
    orderStatus: row.status,
    createdAt: row.created_at.toISOString(),
  }));
}
