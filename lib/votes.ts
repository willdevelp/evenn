import { createHash } from "node:crypto";

/** Nombre maximum de votes achetables en une seule commande. */
export const MAX_VOTES_PER_ORDER = 100_000;

/** Nombre maximum de packs identiques achetables en une seule commande. */
export const MAX_PACKS_PER_ORDER = 20;

/**
 * Empreinte non réversible du téléphone du votant.
 * Le poivre (`VOTE_HASH_PEPPER`) permet de rendre les empreintes inutilisables
 * si la base seule est compromise.
 */
export const hashVoterPhone = (phone: string) =>
  createHash("sha256")
    .update(`${process.env.VOTE_HASH_PEPPER ?? ""}${phone.trim()}`)
    .digest("hex");

export type ResultsVisibilityMode =
  | "live"
  | "hidden_until_close"
  | "ranking_only";

export type ResultsDisplay = {
  /** Afficher le nombre de voix par candidat. */
  showCounts: boolean;
  /** Afficher le classement (rang). */
  showRank: boolean;
};

/**
 * Détermine ce que le public peut voir, en respectant `contests.results_visibility`.
 * - `live` : tout est visible en direct ;
 * - `hidden_until_close` : rien n'est visible avant `ends_at` ;
 * - `ranking_only` : seul le classement est visible, jamais les compteurs.
 */
export function resolveResultsDisplay(
  visibility: ResultsVisibilityMode,
  endsAt: Date | string,
  now: Date = new Date(),
): ResultsDisplay {
  const ended = new Date(endsAt).getTime() <= now.getTime();

  if (visibility === "hidden_until_close") {
    return ended ? { showCounts: true, showRank: true } : { showCounts: false, showRank: false };
  }

  if (visibility === "ranking_only") {
    return { showCounts: false, showRank: true };
  }

  return { showCounts: true, showRank: true };
}

/** Un concours accepte-t-il encore des votes ? */
export function isContestOpenForVotes(input: {
  status: string;
  startsAt: Date | string;
  endsAt: Date | string;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const startsAt = new Date(input.startsAt).getTime();
  const endsAt = new Date(input.endsAt).getTime();
  return (
    input.status === "published" &&
    Number.isFinite(startsAt) &&
    Number.isFinite(endsAt) &&
    now.getTime() >= startsAt &&
    now.getTime() <= endsAt
  );
}
