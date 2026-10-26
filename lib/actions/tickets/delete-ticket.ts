"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordIdSchema } from "@/lib/actions/validation";

export async function deleteTicket(id: string | number) {
  const ticketId = recordIdSchema.parse(id);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tickets")
    .delete()
    .eq("id", ticketId)
    .select("id, event_id");

  if (error) {
    throw new Error(`Impossible de supprimer le billet : ${error.message}`);
  }
  if (data.length === 0) {
    throw new Error("Ticket introuvable");
  }

  revalidatePath(`/dashboard/events/${data[0].event_id}`);
  revalidatePath("/dashboard/tickets");
  return { success: true };
}
