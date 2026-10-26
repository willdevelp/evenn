"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";

/**
 * Supprime un événement (suppression douce via `deleted_at`).
 *
 * Les lignes `tickets` et `order_items` liées sont conservées pour l'historique
 * comptable ; l'événement disparaît des listes car `deleted_at` est renseigné.
 */
export async function deleteEvent(id: string) {
  const { rowCount } = await pool.query(
    `UPDATE events
        SET deleted_at = now(), updated_at = now()
      WHERE id = $1 AND deleted_at IS NULL`,
    [id],
  );

  if (rowCount === 0) {
    throw new Error("Événement introuvable");
  }

  revalidatePath("/events");
  revalidatePath("/dashboard/events");
  return { success: true };
}
