"use server";

import { pool } from "@/lib/db";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";

export type OrganizationProfile = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  country_code: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  verification_status: "unverified" | "pending" | "verified" | "rejected";
  verified_at: string | null;
  created_at: string;
  updated_at: string;

  /** Rôle de l'utilisateur connecté dans cette organisation. */
  role: "owner" | "admin" | "manager" | "scanner";
  /** Vrai si le rôle autorise la modification des informations. */
  can_edit: boolean;
};

/** Détail de l'organisation courante, pour la page paramètres. */
export async function getOrganization(): Promise<OrganizationProfile> {
  const organization = await requireOrganization();

  const { rows } = await pool.query(
    `SELECT id, name, slug, description, logo_url, website_url, country_code,
            social_links, verification_status::text AS verification_status,
            verified_at, created_at, updated_at
       FROM organizations
      WHERE id = $1 AND deleted_at IS NULL`,
    [organization.id],
  );

  const row = rows[0];
  if (!row) {
    throw new Error("Organisation introuvable.");
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    logo_url: row.logo_url,
    website_url: row.website_url,
    country_code: row.country_code.trim(),
    social_links: (row.social_links ?? {}) as OrganizationProfile["social_links"],
    verification_status: row.verification_status,
    verified_at: row.verified_at ? new Date(row.verified_at).toISOString() : null,
    created_at: new Date(row.created_at).toISOString(),
    updated_at: new Date(row.updated_at).toISOString(),
    role: organization.role,
    can_edit: organization.role === "owner" || organization.role === "admin",
  };
}
