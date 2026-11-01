"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/auth-session";
import { withTransaction } from "@/lib/db";
import { getProvider } from "@/lib/payments/providers";
import { MAX_PACKS_PER_ORDER, MAX_VOTES_PER_ORDER, isContestOpenForVotes } from "@/lib/votes";
import type { Enums } from "@/types/supabase";

const voteOrderInputSchema = z
  .object({
    contestId: z.string().uuid("Concours invalide"),
    candidateId: z.string().uuid("Candidat invalide"),
    packId: z.string().uuid("Pack de votes invalide").nullable().optional(),
    packQuantity: z.coerce
      .number()
      .int("Quantité de packs invalide")
      .min(1, "Sélectionnez au moins un pack")
      .max(MAX_PACKS_PER_ORDER, "Trop de packs pour une seule commande")
      .optional(),
    votesCount: z.coerce
      .number()
      .int("Le nombre de votes doit être un entier")
      .min(1, "Sélectionnez au moins un vote")
      .max(MAX_VOTES_PER_ORDER, "Trop de votes pour une seule commande")
      .optional(),
    buyerName: z
      .string()
      .trim()
      .min(2, "Votre nom doit contenir au moins 2 caractères")
      .max(120, "Votre nom est trop long"),
    buyerEmail: z
      .string()
      .trim()
      .min(1, "L'adresse email est obligatoire")
      .email("Adresse email invalide")
      .max(255, "Adresse email trop longue"),
    buyerPhone: z
      .string()
      .trim()
      .min(6, "Le numéro de téléphone est obligatoire pour le paiement")
      .max(30, "Numéro de téléphone trop long")
      .regex(/^[0-9+\s().-]+$/, "Numéro de téléphone invalide"),
    paymentMethod: z.enum(["mtn_momo", "orange_money", "card"]),
  })
  .strict();

export type VoteOrderInput = z.infer<typeof voteOrderInputSchema>;

export type VoteOrderSummary = {
  orderId: string;
  orderNumber: string;
  contestId: string;
  contestSlug: string;
  contestTitle: string;
  candidateId: string;
  candidateName: string;
  votesCount: number;
  amount: number;
  currency: string;
  paymentReference: string;
  paymentStatus: string;
  paymentMethod: Enums<"payment_method">;
};

type ContestRow = {
  id: string;
  organization_id: string;
  title: string;
  slug: string;
  mode: "free" | "paid";
  price_per_vote: string;
  currency: string;
  starts_at: Date;
  ends_at: Date;
  status: string;
};

type CandidateRow = {
  id: string;
  name: string;
  category_id: string;
};

type PackRow = {
  id: string;
  votes_count: number;
  price_amount: string;
};

/**
 * Crée une commande de votes `pending`.
 *
 * Le montant et le nombre de votes sont TOUJOURS recalculés côté serveur à
 * partir du concours, du candidat et du pack en base : le client ne peut pas
 * les falsifier. Aucun vote n'est crédité ici ; ils le seront uniquement par
 * `fulfillPaidOrder`, après vérification de la signature et du montant du
 * webhook de paiement.
 */
export async function createVoteOrder(
  input: VoteOrderInput,
): Promise<VoteOrderSummary> {
  const values = voteOrderInputSchema.parse(input);
  // Aucun agrégateur réel n'est encore branché : hors développement, refuser la
  // commande plutôt que de la laisser bloquée en attente d'un webhook inexistant.
  if (!getProvider("mock")) {
    throw new Error("Le paiement en ligne n'est pas encore disponible pour les votes.");
  }
  const session = await getSession().catch(() => null);
  const buyerUserId = session?.user?.id ?? null;

  const summary = await withTransaction(async (client) => {
    const { rows: contests } = await client.query<ContestRow>(
      `SELECT id, organization_id, title, slug, mode::text AS mode,
              price_per_vote, currency, starts_at, ends_at, status::text AS status
         FROM contests
        WHERE id = $1 AND deleted_at IS NULL
        FOR SHARE`,
      [values.contestId],
    );
    const contest = contests[0];

    if (!contest) throw new Error("Ce concours est introuvable.");
    if (
      !isContestOpenForVotes({
        status: contest.status,
        startsAt: contest.starts_at,
        endsAt: contest.ends_at,
      })
    ) {
      throw new Error("Ce concours n'accepte plus de votes.");
    }
    if (contest.mode !== "paid") {
      throw new Error("Ce concours n'accepte que les votes gratuits.");
    }

    const { rows: candidates } = await client.query<CandidateRow>(
      `SELECT ca.id, ca.name, ca.category_id
         FROM candidates ca
         JOIN contest_categories cc
           ON cc.id = ca.category_id
          AND cc.contest_id = ca.contest_id
        WHERE ca.id = $1
          AND ca.contest_id = $2
          AND ca.status = 'approved'
        FOR SHARE OF ca`,
      [values.candidateId, contest.id],
    );
    const candidate = candidates[0];
    if (!candidate) {
      throw new Error("Ce candidat n'est pas disponible pour ce concours.");
    }

    let votesCount: number;
    let amount: number;
    let packId: string | null = null;

    if (values.packId) {
      const { rows: packs } = await client.query<PackRow>(
        `SELECT id, votes_count, price_amount
           FROM vote_packs
          WHERE id = $1 AND contest_id = $2 AND is_active = TRUE
          FOR SHARE`,
        [values.packId, contest.id],
      );
      const pack = packs[0];
      if (!pack) throw new Error("Ce pack de votes n'est plus disponible.");

      const packQuantity = values.packQuantity ?? 1;
      votesCount = pack.votes_count * packQuantity;
      amount = Number(pack.price_amount) * packQuantity;
      packId = pack.id;
    } else {
      if (!values.votesCount) {
        throw new Error("Indiquez le nombre de votes souhaité.");
      }
      votesCount = values.votesCount;
      amount = Number(contest.price_per_vote) * votesCount;
    }

    if (votesCount < 1 || votesCount > MAX_VOTES_PER_ORDER) {
      throw new Error("Nombre de votes invalide.");
    }
    if (!Number.isFinite(amount) || amount < 1) {
      throw new Error("Le montant de la commande est invalide.");
    }

    const { rows: orders } = await client.query<{ id: string; order_number: string }>(
      `INSERT INTO orders (
          organization_id, kind, status, buyer_user_id,
          buyer_name, buyer_email, buyer_phone, currency,
          subtotal_amount, discount_amount, fee_amount,
          platform_commission_amount, total_amount, metadata
       )
       VALUES ($1, 'vote', 'pending', $2, $3, $4, $5, $6, $7, 0, 0, 0, $7, $8::jsonb)
       RETURNING id, order_number`,
      [
        contest.organization_id,
        buyerUserId,
        values.buyerName,
        values.buyerEmail,
        values.buyerPhone,
        contest.currency,
        amount,
        JSON.stringify({
          contest_id: contest.id,
          candidate_id: candidate.id,
          pack_id: packId,
          votes_count: votesCount,
        }),
      ],
    );
    const order = orders[0];
    if (!order) throw new Error("Impossible de créer la commande.");

    await client.query(
      `INSERT INTO vote_purchases (order_id, contest_id, candidate_id, pack_id, votes_count, amount)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [order.id, contest.id, candidate.id, packId, votesCount, amount],
    );

    const paymentReference = `VOTE-${randomUUID()}`;
    const { rows: payments } = await client.query<{ status: string }>(
      `INSERT INTO payments (
          order_id, provider, provider_reference, method, status,
          amount, currency, payer_phone
       )
       VALUES ($1, 'mock', $2, $3, 'pending', $4, $5, $6)
       RETURNING status::text AS status`,
      [
        order.id,
        paymentReference,
        values.paymentMethod,
        amount,
        contest.currency,
        values.buyerPhone,
      ],
    );
    const payment = payments[0];
    if (!payment) throw new Error("Impossible d'initialiser le paiement.");

    return {
      orderId: order.id,
      orderNumber: order.order_number,
      contestId: contest.id,
      contestSlug: contest.slug,
      contestTitle: contest.title,
      candidateId: candidate.id,
      candidateName: candidate.name,
      votesCount,
      amount,
      currency: contest.currency,
      paymentReference,
      paymentStatus: payment.status,
      paymentMethod: values.paymentMethod,
    } satisfies VoteOrderSummary;
  });

  revalidatePath("/vote");
  revalidatePath(`/vote/${summary.contestSlug}`);

  return summary;
}
