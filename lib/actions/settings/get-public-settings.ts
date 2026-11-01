"use server";

import { pool } from "@/lib/db";

/**
 * Réglages publics de la plateforme (table `settings`).
 * Les clés absentes restent `null` : l'interface n'affiche alors rien plutôt
 * qu'une valeur inventée.
 */
export type PublicSettings = {
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  currency: string;
};

const KEYS = ["contact_email", "contact_phone", "contact_address", "default_currency"];

export async function getPublicSettings(): Promise<PublicSettings> {
  const { rows } = await pool.query<{ key: string; value: unknown }>(
    `SELECT key, value FROM settings WHERE key = ANY($1)`,
    [KEYS],
  );

  const map = new Map(rows.map((row) => [row.key, row.value]));

  const asString = (key: string): string | null => {
    const value = map.get(key);
    if (value === null || value === undefined) return null;
    const text = String(value).trim();
    return text.length > 0 ? text : null;
  };

  return {
    contactEmail: asString("contact_email"),
    contactPhone: asString("contact_phone"),
    contactAddress: asString("contact_address"),
    currency: asString("default_currency") ?? "XAF",
  };
}
