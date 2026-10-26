"use server";

import { pool } from "@/lib/db";

export type ReservationItem = {
  id: string;
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type ReservationTicket = {
  id: string;
  qrToken: string;
  status: string;
  holderName: string | null;
  ticketTypeName: string;
};

export type ReservationDetail = {
  id: string;
  orderNumber: string;
  status: string;
  eventId: string;
  eventTitle: string;
  eventDate: string | null;
  venue: string;
  city: string;
  buyerName: string | null;
  buyerEmail: string | null;
  buyerPhone: string | null;
  currency: string;
  amount: number;
  createdAt: string;
  items: ReservationItem[];
  tickets: ReservationTicket[];
};

type OrderRow = {
  id: string;
  order_number: string;
  status: string;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  total_amount: string;
  currency: string;
  created_at: Date;
  event_id: string | null;
  event_title: string | null;
  venue: string | null;
  city: string | null;
  starts_at: Date | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Récapitulatif public d'une réservation (le lien contient un UUID non devinable). */
export async function getReservation(orderId: string): Promise<ReservationDetail | null> {
  if (!UUID_RE.test(orderId)) return null;

  const { rows: orders } = await pool.query<OrderRow>(
    `SELECT
        o.id,
        o.order_number,
        o.status::text AS status,
        o.buyer_name,
        o.buyer_email,
        o.buyer_phone,
        o.total_amount,
        o.currency,
        o.created_at,
        e.id            AS event_id,
        e.title         AS event_title,
        CONCAT_WS(', ', NULLIF(e.venue_name, ''), NULLIF(e.city, '')) AS venue,
        e.city,
        d.starts_at
       FROM orders o
       LEFT JOIN ticket_order_items oi ON oi.order_id = o.id
       LEFT JOIN ticket_types tt ON tt.id = oi.ticket_type_id
       LEFT JOIN events e ON e.id = tt.event_id
       LEFT JOIN LATERAL (
         SELECT starts_at
           FROM event_dates
          WHERE event_id = e.id
          ORDER BY starts_at ASC
          LIMIT 1
       ) d ON TRUE
      WHERE o.id = $1 AND o.kind = 'ticket'
      LIMIT 1`,
    [orderId],
  );

  const order = orders[0];
  if (!order) return null;

  const { rows: itemRows } = await pool.query<{
    id: string;
    ticket_type_id: string;
    name: string;
    quantity: number;
    unit_price: string;
    total_amount: string;
  }>(
    `SELECT oi.id, oi.ticket_type_id, tt.name, oi.quantity, oi.unit_price, oi.total_amount
       FROM ticket_order_items oi
       JOIN ticket_types tt ON tt.id = oi.ticket_type_id
      WHERE oi.order_id = $1
      ORDER BY oi.id ASC`,
    [orderId],
  );

  const { rows: ticketRows } = await pool.query<{
    id: string;
    qr_token: string;
    status: string;
    holder_name: string | null;
    name: string;
  }>(
    `SELECT t.id, t.qr_token, t.status::text AS status, t.holder_name, tt.name
       FROM tickets t
       JOIN ticket_types tt ON tt.id = t.ticket_type_id
      WHERE t.order_id = $1
      ORDER BY t.created_at ASC, t.id ASC`,
    [orderId],
  );

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    eventId: order.event_id ?? "",
    eventTitle: order.event_title ?? "Événement",
    eventDate: order.starts_at ? order.starts_at.toISOString() : null,
    venue: order.venue ?? "",
    city: order.city ?? "",
    buyerName: order.buyer_name,
    buyerEmail: order.buyer_email,
    buyerPhone: order.buyer_phone,
    currency: order.currency,
    amount: Number(order.total_amount),
    createdAt: order.created_at.toISOString(),
    items: itemRows.map((item) => ({
      id: item.id,
      ticketTypeId: item.ticket_type_id,
      ticketTypeName: item.name,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price),
      amount: Number(item.total_amount),
    })),
    tickets: ticketRows.map((ticket) => ({
      id: ticket.id,
      qrToken: ticket.qr_token,
      status: ticket.status,
      holderName: ticket.holder_name,
      ticketTypeName: ticket.name,
    })),
  };
}
