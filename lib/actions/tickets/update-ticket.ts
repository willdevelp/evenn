"use server";

import { revalidatePath } from "next/cache";

import { pool } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { recordIdSchema, ticketTypeInputSchema } from "@/lib/actions/validation";

const updateSchema = ticketTypeInputSchema.pick({
  name: true,
  price_amount: true,
  quantity_total: true,
});

/** Modifie un type de billet appartenant à l'organisation connectée. */
export async function updateTicket(id: string, input: unknown) {
  const organization = await requireOrganization();
  const ticketId = recordIdSchema.parse(id);
  const ticket = updateSchema.parse(input);

  const { rows: existing } = await pool.query(
    `SELECT tt.quantity_sold
       FROM ticket_types tt
       JOIN events e ON e.id = tt.event_id
      WHERE tt.id = $1
        AND e.organization_id = $2
        AND e.deleted_at IS NULL
      LIMIT 1`,
    [ticketId, organization.id],
  );

  if (!existing[0]) {
    throw new Error("Type de billet introuvable.");
  }

  const sold = Number(existing[0].quantity_sold);
  if (ticket.quantity_total < sold) {
    throw new Error(
      `Le quota ne peut pas être inférieur aux ${sold} billet(s) déjà vendu(s).`,
    );
  }

  const { rows } = await pool.query(
    `UPDATE ticket_types tt
        SET name = $2,
            price_amount = $3,
            quantity_total = $4,
            updated_at = now()
       FROM events e
      WHERE tt.id = $1
        AND e.id = tt.event_id
        AND e.organization_id = $5
        AND e.deleted_at IS NULL
      RETURNING tt.id, tt.event_id`,
    [ticketId, ticket.name, ticket.price_amount, ticket.quantity_total, organization.id],
  );

  if (rows.length === 0) {
    throw new Error("Type de billet introuvable.");
  }

  revalidatePath("/dashboard/tickets");
  revalidatePath(`/dashboard/events/${rows[0].event_id}`);

  return { id: rows[0].id, eventId: rows[0].event_id };
}
