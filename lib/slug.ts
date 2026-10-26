/**
 * Slug URL-safe : sans accents, minuscules, séparateurs `-`.
 *
 * Utilisé pour `events.slug` et `organizations.slug` (tous deux NOT NULL avec un
 * index unique). Ce fichier n'est volontairement pas un module `"use server"` :
 * dans un tel module, seule une fonction asynchrone peut être exportée, et une
 * fonction synchrone y serait transformée en server action (elle renverrait
 * alors une Promise).
 */
export function toSlug(value: string, fallback = "evenement"): string {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || fallback
  );
}
