"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordIdSchema, ticketInputSchema } from "@/lib/actions/validation";

export async function updateTicket(id: string | number, input: unknown) {
  const ticketId = recordIdSchema.parse(id);
  const ticket = ticketInputSchema.parse(input);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tickets")
    .update(ticket)
    .eq("id", ticketId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Impossible de modifier le billet : ${error.message}`);
  }
  if (!data) {
    throw new Error("Ticket introuvable");
  }

  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/tickets");
  revalidatePath(`/dashboard/events/${data.event_id}`);
  return data;
}
