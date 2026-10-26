"use server";

import { pool } from "@/lib/db";

export type EventCategory = {
  id: string;
  slug: string;
  name_fr: string;
  name_en: string;
};

/** Catégories disponibles pour la portée "event" (table `categories`). */
export async function getEventCategories(): Promise<EventCategory[]> {
  const { rows } = await pool.query<EventCategory>(
    `SELECT id, slug, name_fr, name_en
       FROM categories
      WHERE scope = 'event' AND is_active = true
      ORDER BY sort_order ASC, name_fr ASC`,
  );
  return rows;
}
