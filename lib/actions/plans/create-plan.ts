"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { planInputSchema } from "@/lib/actions/validation";

export async function createPlan(input: unknown) {
  const plan = planInputSchema.parse(input);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("plans")
    .insert(plan)
    .select()
    .single();

  if (error) {
    throw new Error(`Impossible de créer le forfait : ${error.message}`);
  }

  revalidatePath("/pricing");
  return data;
}
