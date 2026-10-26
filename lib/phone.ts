/**
 * Utilitaires de normalisation des numéros de téléphone.
 * Format de stockage côté Better Auth : E.164 (ex: "+237690000000").
 */

/** Indicatifs gérés en priorité (Afrique centrale / diaspora). */
export const DEFAULT_COUNTRY_CODE = "CM";

const COUNTRY_CODES: Record<string, string> = {
  CM: "237",
  CI: "225",
  SN: "221",
  GA: "241",
  CG: "242",
  CD: "243",
  TD: "235",
  FR: "33",
  BE: "32",
  CA: "1",
  US: "1",
};

/**
 * Convertit un numéro saisi par l'utilisateur en E.164.
 * Accepte : "690000000", "06 90 00 00 00", "+237690000000", "00237690000000".
 * @returns le numéro au format "+237690000000" ou null si invalide.
 */
export function toE164(input: string, countryCode = DEFAULT_COUNTRY_CODE): string | null {
  const raw = input.replace(/[\s.\-()]/g, "");
  if (!raw) return null;

  let digits: string;

  if (raw.startsWith("+")) {
    digits = raw.slice(1);
  } else if (raw.startsWith("00")) {
    digits = raw.slice(2);
  } else {
    const dial = COUNTRY_CODES[countryCode.toUpperCase()] ?? COUNTRY_CODES[DEFAULT_COUNTRY_CODE];
    // Numéro local : retire un éventuel 0 initial avant d'ajouter l'indicatif.
    digits = dial + raw.replace(/^0/, "");
  }

  if (!/^[1-9]\d{7,14}$/.test(digits)) return null;
  return `+${digits}`;
}

/** Vérifie qu'une chaîne est déjà au format E.164. */
export function isE164(value: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(value);
}
