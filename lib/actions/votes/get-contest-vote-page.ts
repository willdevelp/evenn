"use server";

import { pool } from "@/lib/db";
import {
  isContestOpenForVotes,
  resolveResultsDisplay,
  type ResultsDisplay,
  type ResultsVisibilityMode,
} from "@/lib/votes";

export type VoteCandidateView = {
  id: string;
  name: string;
  number: number | null;
  bio: string | null;
  photoUrl: string | null;
  videoUrl: string | null;
  categoryId: string;
  categoryName: string;
  /** `null` quand les compteurs sont masqués par le concours. */
  voteCount: number | null;
  /** `null` quand le classement est masqué par le concours. */
  rank: number | null;
};

export type VoteCategoryView = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  candidates: VoteCandidateView[];
};

export type ContestVotePage = {
  id: string;
  organizationName: string | null;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  rules: string | null;
  mode: "free" | "paid";
  pricePerVote: number;
  currency: string;
  status: string;
  startsAt: string;
  endsAt: string;
  resultsVisibility: ResultsVisibilityMode;
  results: ResultsDisplay;
  isOpen: boolean;
  categories: VoteCategoryView[];
  totalCandidates: number;
  totalVotes: number | null;
};

type ContestRow = {
  id: string;
  organization_name: string | null;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  rules: string | null;
  mode: "free" | "paid";
  price_per_vote: string;
  currency: string;
  results_visibility: ResultsVisibilityMode;
  starts_at: Date;
  ends_at: Date;
  status: string;
};

type CategoryRow = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

type CandidateRow = {
  id: string;
  name: string;
  number: number | null;
  bio: string | null;
  photo_url: string | null;
  video_url: string | null;
  category_id: string;
  vote_count: string;
};

/**
 * Charge la page publique d'un concours : informations, catégories, candidats
 * approuvés et classement (selon `results_visibility`).
 *
 * Les montants `bigint` et `vote_count` sont convertis en `number` : `pg` les
 * renvoie sous forme de chaînes, contrairement aux types Supabase générés.
 */
export async function getContestVotePage(slug: string): Promise<ContestVotePage | null> {
  const cleanSlug = slug.trim();
  if (!cleanSlug) return null;

  const { rows: contestRows } = await pool.query<ContestRow>(
    `SELECT
        c.id,
        o.name             AS organization_name,
        c.title,
        c.slug,
        c.description,
        c.cover_url,
        c.rules,
        c.mode::text       AS mode,
        c.price_per_vote,
        c.currency,
        c.results_visibility::text AS results_visibility,
        c.starts_at,
        c.ends_at,
        c.status::text     AS status
       FROM contests c
       LEFT JOIN organizations o ON o.id = c.organization_id
      WHERE c.slug = $1
        AND c.deleted_at IS NULL
        AND c.status IN ('published', 'closed')
      LIMIT 1`,
    [cleanSlug],
  );

  const contest = contestRows[0];
  if (!contest) return null;

  const [categoriesResult, candidatesResult] = await Promise.all([
    pool.query<CategoryRow>(
      `SELECT id, name, description, sort_order
         FROM contest_categories
        WHERE contest_id = $1
        ORDER BY sort_order ASC, name ASC`,
      [contest.id],
    ),
    pool.query<CandidateRow>(
      `SELECT id, name, number, bio, photo_url, video_url, category_id, vote_count
         FROM candidates
        WHERE contest_id = $1
          AND status = 'approved'
        ORDER BY vote_count DESC, name ASC`,
      [contest.id],
    ),
  ]);

  const results = resolveResultsDisplay(contest.results_visibility, contest.ends_at);
  const categoryById = new Map(categoriesResult.rows.map((row) => [row.id, row]));

  // Classement « compétition » : deux ex æquo partagent le même rang.
  let previousCount: number | null = null;
  let previousRank = 0;
  const candidates: VoteCandidateView[] = candidatesResult.rows.map((row, index) => {
    const voteCount = Number(row.vote_count);
    const rank =
      previousCount !== null && voteCount === previousCount ? previousRank : index + 1;
    previousCount = voteCount;
    previousRank = rank;

    return {
      id: row.id,
      name: row.name,
      number: row.number,
      bio: row.bio,
      photoUrl: row.photo_url,
      videoUrl: row.video_url,
      categoryId: row.category_id,
      categoryName: categoryById.get(row.category_id)?.name ?? "Candidats",
      voteCount: results.showCounts ? voteCount : null,
      rank: results.showRank ? rank : null,
    };
  });

  const grouped = new Map<string, VoteCategoryView>();
  for (const category of categoriesResult.rows) {
    grouped.set(category.id, {
      id: category.id,
      name: category.name,
      description: category.description,
      sortOrder: category.sort_order,
      candidates: [],
    });
  }
  for (const candidate of candidates) {
    const category = grouped.get(candidate.categoryId);
    if (category) category.candidates.push(candidate);
  }

  const visibleCategories = [...grouped.values()]
    .filter((category) => category.candidates.length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

  return {
    id: contest.id,
    organizationName: contest.organization_name,
    title: contest.title,
    slug: contest.slug,
    description: contest.description,
    coverUrl: contest.cover_url,
    rules: contest.rules,
    mode: contest.mode,
    pricePerVote: Number(contest.price_per_vote),
    currency: contest.currency,
    status: contest.status,
    startsAt: contest.starts_at.toISOString(),
    endsAt: contest.ends_at.toISOString(),
    resultsVisibility: contest.results_visibility,
    results,
    isOpen: isContestOpenForVotes({
      status: contest.status,
      startsAt: contest.starts_at,
      endsAt: contest.ends_at,
    }),
    categories: visibleCategories,
    totalCandidates: candidates.length,
    totalVotes: results.showCounts
      ? candidates.reduce((sum, candidate) => sum + (candidate.voteCount ?? 0), 0)
      : null,
  };
}
