"use server";

import { revalidatePath } from "next/cache";

import { pool } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { recordIdSchema } from "@/lib/actions/validation";

/** Supprime un type de billet encore vierge, appartenant à l'organisation connectée. */
export async function deleteTicket(id: string) {
  const organization = await requireOrganization();
  const ticketId = recordIdSchema.parse(id);

  const { rows: existing } = await pool.query(
    `SELECT tt.event_id, tt.quantity_sold
       FROM ticket_types tt
       JOIN events e ON e.id = tt.event_id
      WHERE tt.id = $1
        AND e.organization_id = $2
        AND e.deleted_at IS NULL
      LIMIT 1`,
    [ticketId, organization.id],
  );

  const ticket = existing[0];
  if (!ticket) {
    throw new Error("Type de billet introuvable.");
  }

  if (Number(ticket.quantity_sold) > 0) {
    throw new Error(
      "Ce type de billet a déjà été vendu : il ne peut pas être supprimé.",
    );
  }

  try {
    await pool.query(`DELETE FROM ticket_types WHERE id = $1`, [ticketId]);
  } catch {
    throw new Error(
      "Ce type de billet est rattaché à des billets existants et ne peut pas être supprimé.",
    );
  }

  revalidatePath("/dashboard/tickets");
  revalidatePath(`/dashboard/events/${ticket.event_id}`);

  return { success: true };
}
