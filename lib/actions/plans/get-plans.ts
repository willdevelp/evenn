"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getPlans() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("price", { ascending: true });

  if (error) {
    throw new Error(`Impossible de récupérer les forfaits : ${error.message}`);
  }

  return data;
}
