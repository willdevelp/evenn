"use server";

import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { organizationInputSchema } from "@/lib/actions/validation";

export type UpdatedOrganization = {
  id: string;
  name: string;
  slug: string;
  updated_at: string;
};

/**
 * Met à jour les informations de l'organisation courante.
 *
 * Seuls `owner` et `admin` peuvent modifier. Les champs de vérification
 * (`verification_status`, `verified_at`) restent pilotés par la plateforme et ne
 * sont jamais écrits ici.
 *
 * `organizations.slug` est un index UNIQUE de type `citext` : la vérification
 * d'unicité ci-dessous est donc insensible à la casse. Une contrainte de base
 * reste le filet de sécurité en cas de concurrence.
 */
export async function updateOrganization(input: unknown): Promise<UpdatedOrganization> {
  const data = organizationInputSchema.parse(input);
  const organization = await requireOrganization();

  if (organization.role !== "owner" && organization.role !== "admin") {
    throw new Error("Vous n'avez pas les droits pour modifier cette organisation.");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Unicité du slug, insensible à la casse (`citext`), hors ligne courante.
    const { rows: clashes } = await client.query(
      `SELECT 1 FROM organizations WHERE slug = $1 AND id <> $2`,
      [data.slug, organization.id],
    );
    if (clashes.length > 0) {
      throw new Error("Cet identifiant est déjà utilisé par une autre organisation.");
    }

    // On ne conserve que les liens réellement renseignés.
    const socialLinks = Object.fromEntries(
      Object.entries(data.social_links ?? {}).filter(([, value]) => value),
    );

    const { rows } = await client.query<UpdatedOrganization>(
      `UPDATE organizations
          SET name = $1,
              slug = $2,
              description = $3,
              logo_url = $4,
              website_url = $5,
              country_code = $6,
              social_links = $7::jsonb,
              updated_at = now()
        WHERE id = $8 AND deleted_at IS NULL
        RETURNING id, name, slug, updated_at`,
      [
        data.name,
        data.slug,
        data.description || null,
        data.logo_url || null,
        data.website_url || null,
        data.country_code,
        JSON.stringify(socialLinks),
        organization.id,
      ],
    );

    if (!rows[0]) {
      throw new Error("Organisation introuvable.");
    }

    await client.query("COMMIT");

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/organizer/${rows[0].slug}`);

    return {
      id: rows[0].id,
      name: rows[0].name,
      slug: rows[0].slug,
      updated_at: new Date(rows[0].updated_at).toISOString(),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Vérifie la disponibilité d'un slug (appelée depuis le formulaire).
 * Renvoie `true` si l'identifiant est libre pour l'organisation courante.
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const organization = await requireOrganization();
  const candidate = slug.trim().toLowerCase();

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate)) return false;

  const { rowCount } = await pool.query(
    `SELECT 1 FROM organizations WHERE slug = $1 AND id <> $2`,
    [candidate, organization.id],
  );

  return rowCount === 0;
}
