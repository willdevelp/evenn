"use server";

import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { pool } from "@/lib/db";

export type OrganizerContest = {
  id: string;
  title: string;
  slug: string;
  status: string;
  startsAt: string;
  endsAt: string;
  pricePerVote: number;
  currency: string;
  candidates: number;
  votes: number;
};

export async function getOrganizerContests(): Promise<OrganizerContest[]> {
  const organization = await requireOrganization();
  const { rows } = await pool.query<{
    id: string;
    title: string;
    slug: string;
    status: string;
    starts_at: Date | string;
    ends_at: Date | string;
    price_per_vote: string;
    currency: string;
    candidates: number;
    votes: string;
  }>(
    `SELECT c.id, c.title, c.slug, c.status::text AS status,
            c.starts_at, c.ends_at, c.price_per_vote, c.currency,
            count(DISTINCT ca.id)::int AS candidates,
            COALESCE((
              SELECT sum(candidate_votes.vote_count)
                FROM candidates candidate_votes
               WHERE candidate_votes.contest_id = c.id
            ), 0)::bigint AS votes
       FROM contests c
       LEFT JOIN candidates ca ON ca.contest_id = c.id
      WHERE c.organization_id = $1
        AND c.deleted_at IS NULL
      GROUP BY c.id
      ORDER BY c.created_at DESC`,
    [organization.id],
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.status,
    startsAt: new Date(row.starts_at).toISOString(),
    endsAt: new Date(row.ends_at).toISOString(),
    pricePerVote: Number(row.price_per_vote),
    currency: row.currency,
    candidates: Number(row.candidates),
    votes: Number(row.votes),
  }));
}
