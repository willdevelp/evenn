"use server";

import { revalidatePath } from "next/cache";
import { withTransaction } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import {
  recordIdSchema,
  reservationStatusSchema,
} from "@/lib/actions/validation";

type ItemRow = { ticket_type_id: string; quantity: number };

/**
 * Change le statut d'une réservation depuis le tableau de bord.
 *
 * - `confirmed` : la commande passe à `paid`.
 * - `cancelled` : le stock est rendu et les billets émis sont invalidés.
 * - `pending`   : remet une commande non payée en attente.
 */
export async function updateReservationStatus(id: string | number, status: string) {
  const reservationId = recordIdSchema.parse(id);
  const validStatus = reservationStatusSchema.parse(status);
  const organization = await requireOrganization();

  const result = await withTransaction(async (client) => {
    const { rows } = await client.query<{
      id: string;
      status: string;
      organization_id: string;
    }>(
      `SELECT id, status::text AS status, organization_id
         FROM orders
        WHERE id = $1 AND kind = 'ticket'
        FOR UPDATE`,
      [reservationId],
    );

    const order = rows[0];
    if (!order || order.organization_id !== organization.id) {
      throw new Error("Réservation introuvable");
    }

    if (validStatus === "cancelled") {
      if (order.status === "paid" || order.status === "pending") {
        const { rows: items } = await client.query<ItemRow>(
          `SELECT ticket_type_id, quantity FROM ticket_order_items WHERE order_id = $1`,
          [reservationId],
        );
        for (const item of items) {
          await client.query(`SELECT release_ticket_stock($1, $2)`, [
            item.ticket_type_id,
            item.quantity,
          ]);
        }
        await client.query(
          `UPDATE tickets
              SET status = 'cancelled'
            WHERE order_id = $1 AND status = 'valid'`,
          [reservationId],
        );
      }

      await client.query(
        `UPDATE orders SET status = 'cancelled' WHERE id = $1`,
        [reservationId],
      );
    } else if (validStatus === "confirmed") {
      await client.query(
        `UPDATE orders
            SET status = 'paid', paid_at = COALESCE(paid_at, now())
          WHERE id = $1`,
        [reservationId],
      );
    } else {
      await client.query(
        `UPDATE orders SET status = 'pending' WHERE id = $1`,
        [reservationId],
      );
    }

    return { id: reservationId, status: validStatus };
  });

  revalidatePath("/dashboard/reservations");
  revalidatePath("/dashboard");
  return result;
}

