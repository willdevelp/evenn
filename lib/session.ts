"use server";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { pool } from "./db";

/** Session courante (validée en base). Mise en cache le temps d'une requête. */
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/** Page réservée aux utilisateurs connectés. */
export async function requireUser(redirectTo = "/dashboard") {
  const session = await getSession();
  if (!session) redirect(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`);
  return session;
}

/** Page réservée aux administrateurs de la plateforme (role = 'admin'). */
export async function requireAdmin() {
  const session = await requireUser("/admin");
  if (session.user.role !== "admin") redirect("/");
  return session;
}

export type OrgRole = "owner" | "admin" | "manager" | "scanner";

/**
 * Vérifie que l'utilisateur appartient à l'organisation avec l'un des rôles autorisés.
 * À appeler dans CHAQUE action serveur qui touche aux données d'une organisation.
 */
export async function requireOrgRole(organizationId: string, allowed: OrgRole[]) {
  const session = await requireUser();
  const { rows } = await pool.query<{ role: OrgRole }>(
    `SELECT role FROM organization_members WHERE organization_id = $1 AND user_id = $2`,
    [organizationId, session.user.id],
  );
  const role = rows[0]?.role;
  if (!role || !allowed.includes(role)) throw new Error("FORBIDDEN");
  return { session, role };
}
