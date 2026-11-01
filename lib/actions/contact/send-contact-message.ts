"use server";

import { z } from "zod";

import { pool } from "@/lib/db";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const contactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom."),
  email: z.string().trim().email("Adresse email invalide."),
  message: z
    .string()
    .trim()
    .min(10, "Votre message doit contenir au moins 10 caractères.")
    .max(5000, "Votre message est trop long (5 000 caractères maximum)."),
});

/** Enregistre un message du formulaire de contact public dans la base. */
export async function sendContactMessage(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Formulaire invalide.",
    };
  }

  try {
    await pool.query(
      `INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)`,
      [parsed.data.name, parsed.data.email, parsed.data.message],
    );
  } catch {
    return {
      status: "error",
      message: "L’envoi a échoué. Réessayez dans un instant.",
    };
  }

  return { status: "success" };
}
