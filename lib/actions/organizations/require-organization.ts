"use server";

import { pool } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { toSlug } from "@/lib/slug";

export type ActiveOrganization = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "admin" | "manager" | "scanner";
};

/**
 * Renvoie l'organisation de l'utilisateur connecté, ou la crée s'il n'en a pas.
 *
 * Le schéma impose `events.organization_id NOT NULL` : un organisateur doit donc
 * toujours avoir une organisation avant de pouvoir créer un événement. À la
 * première création, on génère une organisation personnelle avec le rôle `owner`.
 */
export async function requireOrganization(): Promise<ActiveOrganization> {
  const session = await requireUser();
  const userId = session.user.id;

  // Priorité au rôle owner/admin s'il appartient à plusieurs organisations.
  // On inclut aussi les organisations dont l'utilisateur est `owner_id` sans
  // ligne d'adhésion : cela évite de créer un doublon si l'adhésion a été
  // perdue ou si le compte a été initialisé autrement.
  const { rows: existing } = await pool.query<ActiveOrganization>(
    `SELECT o.id, o.name, o.slug,
            COALESCE(m.role, 'owner') AS role
       FROM organizations o
       LEFT JOIN organization_members m
              ON m.organization_id = o.id AND m.user_id = $1
      WHERE (m.user_id = $1 OR o.owner_id = $1)
        AND o.deleted_at IS NULL
      ORDER BY (COALESCE(m.role, 'owner') = 'owner') DESC, o.created_at ASC
      LIMIT 1`,
    [userId],
  );

  if (existing[0]) {
    // Adhésion manquante pour une organisation possédée : on la rétablit.
    if (existing[0].role === "owner") {
      await pool.query(
        `INSERT INTO organization_members (organization_id, user_id, role)
         VALUES ($1, $2, 'owner')
         ON CONFLICT (organization_id, user_id) DO NOTHING`,
        [existing[0].id, userId],
      );
    }
    return existing[0];
  }

  // Première connexion : on provisionne une organisation personnelle.
  const baseName = session.user.name?.trim() || session.user.email.split("@")[0];

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verrou sur l'utilisateur : deux requêtes simultanées (double clic, deux
    // onglets) seraient sinon en course et inséreraient deux organisations.
    await client.query(`SELECT 1 FROM "user" WHERE id = $1 FOR UPDATE`, [userId]);

    // Un autre appel a pu créer l'organisation pendant l'attente du verrou.
    const { rows: already } = await client.query<ActiveOrganization>(
      `SELECT o.id, o.name, o.slug, COALESCE(m.role, 'owner') AS role
         FROM organizations o
         LEFT JOIN organization_members m
                ON m.organization_id = o.id AND m.user_id = $1
        WHERE (m.user_id = $1 OR o.owner_id = $1)
          AND o.deleted_at IS NULL
        ORDER BY (COALESCE(m.role, 'owner') = 'owner') DESC, o.created_at ASC
        LIMIT 1`,
      [userId],
    );
    if (already[0]) {
      await client.query("COMMIT");
      return already[0];
    }

    // Un slug unique est requis ; on suffixe en cas de collision.
    const baseSlug = toSlug(baseName);
    let slug = baseSlug;
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const { rows: conflicts } = await client.query(
        `SELECT 1 FROM organizations WHERE slug = $1`,
        [slug],
      );
      if (conflicts.length === 0) break;
      slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const { rows: created } = await client.query<{ id: string; name: string; slug: string }>(
      `INSERT INTO organizations (name, slug, owner_id, country_code)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, slug`,
      [baseName, slug, userId, session.user.countryCode ?? "CM"],
    );

    const organization = created[0];

    await client.query(
      `INSERT INTO organization_members (organization_id, user_id, role)
       VALUES ($1, $2, 'owner')
       ON CONFLICT (organization_id, user_id) DO NOTHING`,
      [organization.id, userId],
    );

    await client.query("COMMIT");

    return { ...organization, role: "owner" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
