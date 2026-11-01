/** Utilitaires d'affichage partagés par les pages de vote (serveur et client). */

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Douala",
});

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Douala",
});

export const formatVoteDate = (value: string | Date) => DATE_FORMAT.format(new Date(value));

export const formatVoteDateTime = (value: string | Date) =>
  DATE_TIME_FORMAT.format(new Date(value));

export const formatVoteMoney = (amount: number, currency = "XAF") =>
  `${amount.toLocaleString("fr-FR")} ${currency}`;

export function getContestTiming(startsAt: string, endsAt: string) {
  const now = Date.now();
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();

  if (Number.isFinite(start) && now < start) return "upcoming" as const;
  if (Number.isFinite(end) && now > end) return "closed" as const;
  return "open" as const;
}
