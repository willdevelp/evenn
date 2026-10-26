"use server";

import { revalidatePath } from "next/cache";
import { withTransaction } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { recordIdSchema } from "@/lib/actions/validation";

/**
 * Supprime une réservation encore en attente et rend le stock correspondant.
 * Les commandes payées ne sont pas supprimées (elles portent des écritures
 * comptables) : il faut d'abord les annuler.
 */
export async function deleteReservation(id: string | number) {
  const reservationId = recordIdSchema.parse(id);
  const organization = await requireOrganization();

  await withTransaction(async (client) => {
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
    if (order.status !== "pending") {
      throw new Error(
        "Seules les réservations en attente peuvent être supprimées. Annulez d'abord la réservation.",
      );
    }

    const { rows: items } = await client.query<{
      ticket_type_id: string;
      quantity: number;
    }>(
      `SELECT ticket_type_id, quantity FROM ticket_order_items WHERE order_id = $1`,
      [reservationId],
    );

    for (const item of items) {
      await client.query(`SELECT release_ticket_stock($1, $2)`, [
        item.ticket_type_id,
        item.quantity,
      ]);
    }

    await client.query(`DELETE FROM tickets WHERE order_id = $1`, [reservationId]);
    await client.query(`DELETE FROM ticket_order_items WHERE order_id = $1`, [reservationId]);
    await client.query(`DELETE FROM orders WHERE id = $1`, [reservationId]);
  });

  revalidatePath("/dashboard/reservations");
  revalidatePath("/dashboard");
  return { success: true };
}
