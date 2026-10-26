import { z } from "zod";

/**
 * Validations partagées entre les formulaires client (react-hook-form)
 * et les éventuelles Server Actions d'authentification.
 */

/** Numéro au format E.164 (ex: +2376XXXXXXXX). */
export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, {
    message: "Numéro invalide. Utilisez le format international, ex : +237 6XX XX XX XX.",
  });

export const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide." }),
  password: z.string().min(8, { message: "Mot de passe trop court (8 caractères minimum)." }),
  rememberMe: z.boolean(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Email invalide." }),
  phoneNumber: z.string().trim().refine(
    (value) => value === "" || /^\+[1-9]\d{7,14}$/.test(value),
    { message: "Numéro invalide. Utilisez le format international, ex : +237 6XX XX XX XX." },
  ),
  password: z
    .string()
    .min(8, { message: "Mot de passe trop court (8 caractères minimum)." })
    .max(72, { message: "Mot de passe trop long (72 caractères maximum)." }),
  countryCode: z.string().trim().length(2, { message: "Code pays invalide (2 lettres)." }),
});

export const phoneOtpSchema = z.object({
  phoneNumber: phoneNumberSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "Le code doit contenir 6 chiffres." }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PhoneOtpInput = z.infer<typeof phoneOtpSchema>;

/** Traduit les erreurs Better Auth en message lisible. */
export function authErrorMessage(error: { message?: string; status?: number } | undefined): string {
  const message = error?.message ?? "";
  if (/invalid email or password/i.test(message)) return "Email ou mot de passe incorrect.";
  if (/user already exists/i.test(message)) return "Un compte existe déjà avec cet email.";
  if (/email not verified/i.test(message)) return "Vérifiez votre email avant de vous connecter.";
  if (/too many requests/i.test(message)) return "Trop de tentatives. Réessayez dans quelques minutes.";
  if (/banned/i.test(message)) return "Ce compte a été suspendu.";
  if (/invalid phone/i.test(message)) return message;
  return message || "Une erreur est survenue. Réessayez.";
}
