import { z } from "zod";

const hexColor = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide (format attendu : #RRGGBB).");

export const siteThemeSchema = z
  .object({
    primaryColor: hexColor,
    accentColor: hexColor,
    backgroundColor: hexColor,
    textColor: hexColor,
  })
  .strict();

export const createEventSiteSchema = z
  .object({
    eventId: z.string().uuid("Événement invalide."),
    templateId: z.string().uuid("Modèle invalide."),
    subdomain: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Le sous-domaine doit contenir au moins 3 caractères.")
      .max(63, "Le sous-domaine ne peut pas dépasser 63 caractères.")
      .regex(
        /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
        "Le sous-domaine doit contenir uniquement des lettres minuscules, des chiffres et des tirets.",
      ),
    theme: siteThemeSchema,
  })
  .strict();

export type CreateEventSiteInput = z.infer<typeof createEventSiteSchema>;
