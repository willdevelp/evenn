import { z } from "zod";

/**
 * Validation de la création d'un événement, alignée sur le schéma SQL réel :
 *   - `events`       : organization_id (NOT NULL), title, slug, category_id,
 *                      description, cover_url, venue_name, address, city,
 *                      country_code, timezone, visibility, status
 *   - `event_dates`  : event_id, starts_at (NOT NULL), doors_open_at, ends_at
 *   - `ticket_types` : event_id, name, price_amount, currency, quantity_total,
 *                      quantity_sold, max_per_order, is_active, sort_order
 *
 * Aucune de ces tables n'a de colonne `location`, `date`, `time` ni de table
 * `tickets` : la localisation est éclatée (venue_name/address/city) et les
 * dates vivent dans `event_dates`.
 */

const trimmed = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `${label} : ${min} caractères minimum`)
    .max(max, `${label} : ${max} caractères maximum`);

/** Horodatage ISO accepté par PostgreSQL (timestamptz). */
const timestamptz = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), { message: "Date ou heure invalide." });

export const ticketTypeInputSchema = z.object({
  name: trimmed("Nom du billet", 1, 80),
  price_amount: z.coerce
    .number()
    .min(0, "Le prix ne peut pas être négatif")
    .max(100_000_000, "Prix trop élevé"),
  quantity_total: z.coerce
    .number()
    .int("La quantité doit être un entier")
    .positive("La quantité doit être supérieure à 0")
    .max(1_000_000, "Quantité trop élevée"),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  max_per_order: z.coerce.number().int().positive().max(100).optional(),
  currency: z.string().trim().length(3).optional(),
});

export const eventInputSchema = z
  .object({
    title: trimmed("Titre", 3, 160),
    description: trimmed("Description", 10, 5000),
    category_id: z.string().uuid("Catégorie invalide").nullable().optional(),
    cover_url: z.string().url("URL d'image invalide").or(z.literal("")).optional(),
    venue_name: z.string().trim().max(160).optional().or(z.literal("")),
    address: trimmed("Adresse", 3, 255),
    city: trimmed("Ville", 2, 80),
    country_code: z.string().trim().length(2).optional(),
    timezone: z.string().trim().min(1).optional(),

    // `event_dates`
    starts_at: timestamptz,
    ends_at: timestamptz.nullable().optional(),
    doors_open_at: timestamptz.nullable().optional(),

    // Publication immédiate ou brouillon
    status: z.enum(["draft", "published"]).optional(),
    visibility: z.enum(["public", "unlisted", "private"]).optional(),

    tickets: z.array(ticketTypeInputSchema).min(1, "Au moins un billet est requis"),
  })
  .refine((data) => !data.ends_at || Date.parse(data.ends_at) > Date.parse(data.starts_at), {
    message: "La fin doit être postérieure au début.",
    path: ["ends_at"],
  })
  .refine(
    (data) => !data.doors_open_at || Date.parse(data.doors_open_at) <= Date.parse(data.starts_at),
    { message: "L'ouverture des portes doit précéder le début.", path: ["doors_open_at"] },
  );

export type EventInput = z.infer<typeof eventInputSchema>;
export type TicketTypeInput = z.infer<typeof ticketTypeInputSchema>;

/** Identifiant de ligne : les clés primaires du schéma sont des UUID. */
export const recordIdSchema = z.string().uuid("Identifiant invalide");

/**
 * Ancienne forme d'un billet, conservée pour les actions `lib/actions/tickets/*`
 * qui écrivent encore dans une table `tickets` (à migrer vers `ticket_types`).
 */
export const ticketInputSchema = z.object({
  name: z.string().trim().min(1, "Le nom du ticket est obligatoire"),
  price: z.coerce.number().min(0, "Le prix ne peut pas être négatif"),
  quantity: z.coerce.number().int().positive("La quantité doit être supérieure à 0"),
});

export const reservationSchema = z.object({
  title: z.string().trim().min(1, "Le titre de l’événement est obligatoire"),
  price: z.coerce.number().nonnegative("Le prix est invalide"),
  quantity: z.coerce.number().int().positive("La quantité doit être supérieure à 0"),
});

/**
 * Réservation d'un billet depuis la page publique d'un événement.
 *
 * Les identifiants sont des UUID (`events.id`, `ticket_types.id`). Le nom et
 * l'email sont obligatoires : `orders` impose au moins un moyen de contacter
 * l'acheteur (buyer_user_id, buyer_email ou buyer_phone).
 */
export const ticketReservationSchema = z.object({
  eventId: z.string().uuid("Événement invalide"),
  ticketTypeId: z.string().uuid("Type de billet invalide"),
  quantity: z.coerce
    .number()
    .int("La quantité doit être un entier")
    .min(1, "Sélectionnez au moins un billet")
    .max(100, "Quantité trop élevée"),
  buyerName: z
    .string()
    .trim()
    .min(2, "Votre nom doit contenir au moins 2 caractères")
    .max(120, "Votre nom est trop long"),
  buyerEmail: z
    .string()
    .trim()
    .min(1, "L'adresse email est obligatoire")
    .email("Adresse email invalide")
    .max(255, "Adresse email trop longue"),
  buyerPhone: z
    .string()
    .trim()
    .max(30, "Numéro de téléphone trop long")
    .optional()
    .or(z.literal("")),
});

export type TicketReservationInput = z.infer<typeof ticketReservationSchema>;

export const reservationStatusSchema = z.enum(["pending", "confirmed", "cancelled"]);

export const planIdSchema = z.string().uuid();

export const planInputSchema = z.object({
  name: z.string().trim().min(1, "Le nom du forfait est obligatoire"),
  description: z.string().trim().min(1, "La description du forfait est obligatoire"),
  cta: z.string().trim().min(1, "Le texte du bouton est obligatoire"),
  highlighted: z.boolean(),
  price: z.coerce.number().nonnegative("Le prix ne peut pas être négatif"),
  billing_cycle: z.string().trim().min(1, "La période de facturation est obligatoire"),
  event_limit: z.number().int().nonnegative().nullable(),
  ticket_limit: z.number().int().nonnegative().nullable(),
  features: z.array(z.string()),
});

/**
 * Mise à jour de l'organisation (table `organizations`).
 *
 * Champs éditables uniquement : `verification_status` / `verified_at` sont
 * pilotés par la plateforme, `owner_id` et `created_at` ne bougent pas.
 *
 * `organizations.slug` est de type `citext` avec un index UNIQUE : l'unicité est
 * vérifiée en base (comparaison insensible à la casse), pas ici.
 */
export const socialLinksSchema = z
  .object({
    facebook: z.string().trim().url("URL Facebook invalide").or(z.literal("")).optional(),
    instagram: z.string().trim().url("URL Instagram invalide").or(z.literal("")).optional(),
    twitter: z.string().trim().url("URL X / Twitter invalide").or(z.literal("")).optional(),
    linkedin: z.string().trim().url("URL LinkedIn invalide").or(z.literal("")).optional(),
    youtube: z.string().trim().url("URL YouTube invalide").or(z.literal("")).optional(),
  })
  .strict();

export type SocialLinks = z.infer<typeof socialLinksSchema>;

export const organizationInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(120, "Le nom est trop long"),
  slug: z
    .string()
    .trim()
    .min(3, "L'identifiant doit contenir au moins 3 caractères")
    .max(60, "L'identifiant est trop long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Identifiant invalide : minuscules, chiffres et tirets uniquement",
    ),
  description: z
    .string()
    .trim()
    .max(2000, "La description est trop longue")
    .optional()
    .or(z.literal("")),
  logo_url: z.string().trim().url("URL du logo invalide").or(z.literal("")).optional(),
  website_url: z.string().trim().url("URL du site invalide").or(z.literal("")).optional(),
  country_code: z.string().trim().length(2, "Code pays invalide").toUpperCase(),
  social_links: socialLinksSchema.optional(),
});

export type OrganizationInput = z.infer<typeof organizationInputSchema>;
