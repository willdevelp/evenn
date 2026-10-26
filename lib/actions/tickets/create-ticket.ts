"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordIdSchema, ticketInputSchema } from "@/lib/actions/validation";

export async function createTicket(eventId: string | number, input: unknown) {
  const validEventId = recordIdSchema.parse(eventId);
  const ticket = ticketInputSchema.parse(input);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tickets")
    .insert({ ...ticket, event_id: validEventId })
    .select()
    .single();

  if (error) {
    throw new Error(`Impossible de créer le billet : ${error.message}`);
  }

  revalidatePath(`/dashboard/events/${validEventId}`);
  revalidatePath("/dashboard/tickets");
  return data;
}
