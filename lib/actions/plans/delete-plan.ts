"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { planIdSchema } from "@/lib/actions/validation";

export async function deletePlan(id: string) {
  const planId = planIdSchema.parse(id);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("plans")
    .delete()
    .eq("id", planId)
    .select("id");

  if (error) {
    throw new Error(`Impossible de supprimer le forfait : ${error.message}`);
  }
  if (data.length === 0) {
    throw new Error("Forfait introuvable");
  }

  revalidatePath("/pricing");
  return { success: true };
}
