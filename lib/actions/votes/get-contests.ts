"use server";

import { pool } from "@/lib/db";
import { resolveResultsDisplay, type ResultsVisibilityMode } from "@/lib/votes";

export type ContestListItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  mode: "free" | "paid";
  currency: string;
  pricePerVote: number;
  startsAt: string;
  endsAt: string;
  status: string;
  candidateCount: number;
  /** `null` quand les compteurs sont masqués par le concours. */
  totalVotes: number | null;
};

type ContestListRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  mode: "free" | "paid";
  currency: string;
  price_per_vote: string;
  starts_at: Date;
  ends_at: Date;
  status: string;
  results_visibility: ResultsVisibilityMode;
  candidate_count: string;
  total_votes: string;
};

/** Concours publiés ou terminés, visibles sur la page publique /vote. */
export async function getContests(): Promise<ContestListItem[]> {
  const { rows } = await pool.query<ContestListRow>(
    `SELECT
        c.id,
        c.title,
        c.slug,
        c.description,
        c.cover_url,
        c.mode::text AS mode,
        c.currency,
        c.price_per_vote,
        c.starts_at,
        c.ends_at,
        c.status::text AS status,
        c.results_visibility::text AS results_visibility,
        COUNT(ca.id)::text AS candidate_count,
        COALESCE(SUM(ca.vote_count), 0)::text AS total_votes
       FROM contests c
       LEFT JOIN candidates ca
         ON ca.contest_id = c.id
        AND ca.status = 'approved'
      WHERE c.deleted_at IS NULL
        AND c.status IN ('published', 'closed')
      GROUP BY c.id
      ORDER BY
        (c.ends_at > now()) DESC,
        CASE WHEN c.ends_at > now() THEN c.ends_at END ASC,
        c.ends_at DESC`,
  );

  return rows.map((row) => {
    const results = resolveResultsDisplay(row.results_visibility, row.ends_at);

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      coverUrl: row.cover_url,
      mode: row.mode,
      currency: row.currency,
      pricePerVote: Number(row.price_per_vote),
      startsAt: row.starts_at.toISOString(),
      endsAt: row.ends_at.toISOString(),
      status: row.status,
      candidateCount: Number(row.candidate_count),
      totalVotes: results.showCounts ? Number(row.total_votes) : null,
    };
  });
}
