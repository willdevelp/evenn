/** Utilitaires d'affichage partagés par les pages d'événements (serveur et client). */

const EVENT_DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Douala",
});

const EVENT_DATE_SHORT_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Douala",
});

const EVENT_TIME_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Douala",
});

const safeFormat = (format: Intl.DateTimeFormat, value: string | Date | null | undefined) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return format.format(date);
};

export const formatEventDate = (value: string | Date | null | undefined) =>
  safeFormat(EVENT_DATE_FORMAT, value) ?? "Date à confirmer";

export const formatEventDateShort = (value: string | Date | null | undefined) =>
  safeFormat(EVENT_DATE_SHORT_FORMAT, value) ?? "—";

export const formatEventTime = (value: string | Date | null | undefined) =>
  safeFormat(EVENT_TIME_FORMAT, value);

/** City + venue, pour les meta de cartes et la ligne de détail. */
export const formatEventPlace = (venue: string | null, city: string | null) =>
  [venue, city].filter(Boolean).join(", ") || "Lieu à confirmer";
