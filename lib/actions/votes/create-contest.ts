"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireOrganization } from "@/lib/actions/organizations/require-organization";
import { withTransaction } from "@/lib/db";
import { toSlug } from "@/lib/slug";

const contestInputSchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    description: z.string().trim().max(5000).nullable(),
    coverUrl: z.string().url().nullable(),
    rules: z.string().trim().max(10000).nullable(),
    pricePerVote: z.number().int().min(1).max(1_000_000_000),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    status: z.enum(["draft", "published"]),
    candidates: z
      .array(
        z.object({
          name: z.string().trim().min(2).max(120),
          number: z.number().int().min(1).max(9999).nullable(),
          bio: z.string().trim().max(2000).nullable(),
          photoUrl: z.string().url().nullable(),
        }),
      )
      .min(1)
      .max(200),
  })
  .strict()
  .refine((data) => Date.parse(data.endsAt) > Date.parse(data.startsAt), {
    message: "La fin du concours doit être après son début.",
    path: ["endsAt"],
  });

export type CreateContestInput = z.infer<typeof contestInputSchema>;

export async function createContest(input: unknown): Promise<{ id: string; slug: string }> {
  const data = contestInputSchema.parse(input);
  const organization = await requireOrganization();
  if (organization.role === "scanner") {
    throw new Error("Vous n'avez pas les droits pour créer un concours.");
  }

  const candidateNumbers = data.candidates
    .map((candidate) => candidate.number)
    .filter((number): number is number => number !== null);
  if (new Set(candidateNumbers).size !== candidateNumbers.length) {
    throw new Error("Chaque numéro de candidat doit être unique.");
  }

  const contest = await withTransaction(async (client) => {
    const baseSlug = toSlug(data.title) || "concours";
    let slug = baseSlug;

    for (let attempt = 0; attempt < 50; attempt += 1) {
      const { rowCount } = await client.query(
        `SELECT 1 FROM contests WHERE slug = $1 AND deleted_at IS NULL`,
        [slug],
      );
      if (rowCount === 0) break;
      slug = `${baseSlug}-${attempt + 2}`;
      if (attempt === 49) throw new Error("Impossible de générer une URL unique pour ce concours.");
    }

    const { rows } = await client.query<{ id: string; slug: string }>(
  `INSERT INTO contests (
     organization_id,
     title,
     slug,
     description,
     cover_url,
     rules,
     mode,
     price_per_vote,
     currency,
     starts_at,
     ends_at,
     results_visibility,
     status,
     published_at
   )
   VALUES (
     $1, $2, $3, $4, $5, $6,
     'paid',
     $7,
     'XAF',
     $8,
     $9,
     'live',
     $10::public.content_status,
     CASE
       WHEN $11::text = 'published' THEN now()
       ELSE NULL
     END
   )
   RETURNING id, slug`,
  [
    organization.id,
    data.title,
    slug,
    data.description,
    data.coverUrl,
    data.rules,
    data.pricePerVote,
    data.startsAt,
    data.endsAt,
    data.status,
    data.status,
  ],
);
    const created = rows[0];
    if (!created) throw new Error("Impossible de créer le concours.");

    const { rows: categoryRows } = await client.query<{ id: string }>(
      `INSERT INTO contest_categories (contest_id, name, sort_order)
       VALUES ($1, 'Candidats', 0)
       RETURNING id`,
      [created.id],
    );
    const category = categoryRows[0];
    if (!category) throw new Error("Impossible de créer la catégorie du concours.");

    for (const candidate of data.candidates) {
      await client.query(
        `INSERT INTO candidates (
           contest_id, category_id, name, number, bio, photo_url, status
         )
         VALUES ($1, $2, $3, $4, $5, $6, 'approved')`,
        [
          created.id,
          category.id,
          candidate.name,
          candidate.number,
          candidate.bio,
          candidate.photoUrl,
        ],
      );
    }

    return created;
  });

  revalidatePath("/dashboard/contests");
  revalidatePath("/vote");
  revalidatePath(`/vote/${contest.slug}`);
  return contest;
}
