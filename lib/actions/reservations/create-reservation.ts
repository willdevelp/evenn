"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import type { PoolClient } from "pg";
import { getSession } from "@/lib/auth-session";
import { withTransaction } from "@/lib/db";
import { fulfillPaidOrder } from "@/lib/payments/fulfill";
import { makeTicketToken } from "@/lib/tickets";
import { ticketReservationSchema } from "@/lib/actions/validation";

export type ReservationSummary = {
  id: string;
  orderNumber: string;
  eventId: string;
  eventTitle: string;
  ticketTypeId: string;
  ticketTypeName: string;
  price: number;
  quantity: number;
  amount: number;
  status: string;
  buyerName: string;
  buyerEmail: string;
};

type EventRow = {
  id: string;
  organization_id: string;
  title: string;
  status: string;
  visibility: string;
  deleted_at: Date | null;
  event_date_id: string | null;
};

type TicketTypeRow = {
  id: string;
  name: string;
  price_amount: string;
  quantity_total: number;
  quantity_sold: number;
  max_per_order: number;
  is_active: boolean;
  currency: string;
};

const readInput = (input: FormData | unknown) => {
  if (!(input instanceof FormData)) return input;

  return {
    eventId: input.get("eventId"),
    ticketTypeId: input.get("ticketTypeId"),
    quantity: input.get("quantity"),
    buyerName: input.get("buyerName"),
    buyerEmail: input.get("buyerEmail"),
    buyerPhone: input.get("buyerPhone") ?? "",
  };
};

/**
 * Crée une réservation de billets et émet immédiatement les billets associés.
 *
 * Le flux utilise les vraies tables du schéma :
 *   orders -> ticket_order_items -> tickets (+ payments et écritures comptables).
 * Le stock est réservé de façon atomique via `reserve_ticket_stock`, ce qui évite
 * la survente si deux acheteurs réservent en même temps.
 */
export async function createReservation(
  input: FormData | unknown,
): Promise<ReservationSummary> {
  const values = ticketReservationSchema.parse(readInput(input));
  const quantity = values.quantity;

  const session = await getSession().catch(() => null);
  const buyerUserId = session?.user?.id ?? null;

  const summary = await withTransaction(async (client) => {
    const { rows: events } = await client.query<EventRow>(
      `SELECT
          e.id,
          e.organization_id,
          e.title,
          e.status::text     AS status,
          e.visibility::text AS visibility,
          e.deleted_at,
          d.id               AS event_date_id
         FROM events e
         LEFT JOIN LATERAL (
           SELECT id
             FROM event_dates
            WHERE event_id = e.id
            ORDER BY starts_at ASC
            LIMIT 1
         ) d ON TRUE
        WHERE e.id = $1`,
      [values.eventId],
    );

    const event = events[0];
    if (
      !event ||
      event.deleted_at ||
      event.status !== "published" ||
      event.visibility !== "public"
    ) {
      throw new Error("Cet événement n'est plus disponible à la réservation.");
    }

    const { rows: ticketTypes } = await client.query<TicketTypeRow>(
      `SELECT id, name, price_amount, quantity_total, quantity_sold,
              max_per_order, is_active, currency
         FROM ticket_types
        WHERE id = $1 AND event_id = $2
        FOR UPDATE`,
      [values.ticketTypeId, values.eventId],
    );

    const ticketType = ticketTypes[0];
    if (!ticketType || !ticketType.is_active) {
      throw new Error("Ce type de billet n'est plus disponible.");
    }

    if (quantity > ticketType.max_per_order) {
      throw new Error(
        `Vous ne pouvez pas réserver plus de ${ticketType.max_per_order} billet(s) par commande.`,
      );
    }

    const remaining = ticketType.quantity_total - ticketType.quantity_sold;
    if (quantity > remaining) {
      throw new Error(
        remaining > 0
          ? `Il ne reste que ${remaining} billet(s) disponible(s).`
          : "Ce type de billet est épuisé.",
      );
    }

    // Vérifie aussi la fenêtre de vente et la capacité côté base.
    const { rows: stock } = await client.query<{ ok: boolean }>(
      `SELECT reserve_ticket_stock($1, $2) AS ok`,
      [ticketType.id, quantity],
    );
    if (!stock[0]?.ok) {
      throw new Error("Ce type de billet n'est plus disponible.");
    }

    const unitPrice = Number(ticketType.price_amount);
    const subtotal = unitPrice * quantity;

    const { rows: orders } = await client.query<{
      id: string;
      order_number: string;
      status: string;
    }>(
      `INSERT INTO orders (
          organization_id, kind, status, buyer_user_id,
          buyer_name, buyer_email, buyer_phone, currency,
          subtotal_amount, discount_amount, fee_amount,
          platform_commission_amount, total_amount, paid_at
       )
       VALUES ($1, 'ticket', 'pending', $2, $3, $4, $5, $6, $7, 0, 0, 0, $7, NULL)
       RETURNING id, order_number, status::text AS status`,
      [
        event.organization_id,
        buyerUserId,
        values.buyerName,
        values.buyerEmail,
        values.buyerPhone || null,
        ticketType.currency || "XAF",
        subtotal,
      ],
    );

    const order = orders[0];
    if (!order) throw new Error("Impossible de créer la réservation.");

    const { rows: items } = await client.query<{ id: string }>(
      `INSERT INTO ticket_order_items (
          order_id, ticket_type_id, event_date_id, quantity, unit_price, total_amount
       )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [order.id, ticketType.id, event.event_date_id, quantity, unitPrice, subtotal],
    );

    const item = items[0];
    if (!item) throw new Error("Impossible de créer la réservation.");

    if (subtotal > 0) {
      // Paiement immédiat en mode "mock" : il n'y a pas encore d'agrégateur
      // branché. Le webhook `/api/webhooks/mock` suit exactement le même
      // chemin de livraison pour les paiements réels.
      const { rows: payments } = await client.query<{ id: string }>(
        `INSERT INTO payments (
            order_id, provider, provider_reference, method, status,
            amount, currency, paid_at
         )
         VALUES ($1, 'mock', $2, 'other', 'succeeded', $3, $4, now())
         RETURNING id`,
        [order.id, `MOCK-${order.id}`, subtotal, ticketType.currency || "XAF"],
      );

      const payment = payments[0];
      if (!payment) throw new Error("Impossible d'enregistrer le paiement.");

      await fulfillPaidOrder(client, order.id, payment.id);
    } else {
      // Billet gratuit : pas de paiement, mais on émet quand même les billets.
      await client.query(
        `UPDATE orders SET status = 'paid', paid_at = now() WHERE id = $1`,
        [order.id],
      );
      await issueTickets(client, {
        orderId: order.id,
        orderItemId: item.id,
        ticketTypeId: ticketType.id,
        eventId: event.id,
        eventDateId: event.event_date_id,
        quantity,
        buyerName: values.buyerName,
        buyerEmail: values.buyerEmail,
        buyerPhone: values.buyerPhone || null,
      });
    }

    return {
      id: order.id,
      orderNumber: order.order_number,
      eventId: event.id,
      eventTitle: event.title,
      ticketTypeId: ticketType.id,
      ticketTypeName: ticketType.name,
      price: unitPrice,
      quantity,
      amount: subtotal,
      status: "paid",
      buyerName: values.buyerName,
      buyerEmail: values.buyerEmail,
    } satisfies ReservationSummary;
  });

  revalidatePath("/dashboard/reservations");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/events");
  revalidatePath(`/events/${summary.eventId}`);

  return summary;
}

type IssueTicketsInput = {
  orderId: string;
  orderItemId: string;
  ticketTypeId: string;
  eventId: string;
  eventDateId: string | null;
  quantity: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string | null;
};

/** Émet un billet nominatif (avec jeton QR signé) par place réservée. */
async function issueTickets(client: PoolClient, input: IssueTicketsInput) {
  for (let index = 0; index < input.quantity; index += 1) {
    const ticketId = randomUUID();
    await client.query(
      `INSERT INTO tickets (
          id, order_id, order_item_id, ticket_type_id, event_id, event_date_id,
          holder_name, holder_email, holder_phone, qr_token
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        ticketId,
        input.orderId,
        input.orderItemId,
        input.ticketTypeId,
        input.eventId,
        input.eventDateId,
        input.buyerName,
        input.buyerEmail,
        input.buyerPhone,
        makeTicketToken(ticketId),
      ],
    );
  }
}
