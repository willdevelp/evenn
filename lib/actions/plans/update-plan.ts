"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { planIdSchema, planInputSchema } from "@/lib/actions/validation";

export async function updatePlan(id: string, input: unknown) {
  const planId = planIdSchema.parse(id);
  const plan = planInputSchema.parse(input);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("plans")
    .update(plan)
    .eq("id", planId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Impossible de modifier le forfait : ${error.message}`);
  }
  if (!data) {
    throw new Error("Forfait introuvable");
  }

  revalidatePath("/pricing");
  return data;
}
