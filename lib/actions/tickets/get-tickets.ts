"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getTickets() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tickets")
    .select("*, events!inner(title)")
    .order("id", { ascending: false });

  if (error) {
    throw new Error(`Impossible de récupérer les billets : ${error.message}`);
  }

  return data.map(({ events, ...ticket }) => ({
    ...ticket,
    event_title: events.title,
  }));
}
