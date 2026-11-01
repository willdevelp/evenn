"use server";

import { z } from "zod";
import { pool } from "@/lib/db";
import type { Enums } from "@/types/supabase";

export type VoteOrderStatus = {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  paymentProvider: string;
  paymentReference: string | null;
  paymentMethod: Enums<"payment_method"> | null;
  failureReason: string | null;
  amount: number;
  currency: string;
  votesCount: number;
  createdAt: string;
  paidAt: string | null;
  buyerName: string | null;
  contest: {
    id: string;
    title: string;
    slug: string;
    endsAt: string;
    status: string;
  };
  candidate: {
    id: string;
    name: string;
    photoUrl: string | null;
  };
};

type VoteOrderRow = {
  id: string;
  order_number: string;
  status: string;
  total_amount: string;
  currency: string;
  created_at: Date;
  paid_at: Date | null;
  buyer_name: string | null;
  votes_count: number;
  contest_id: string;
  contest_title: string;
  contest_slug: string;
  contest_ends_at: Date;
  contest_status: string;
  candidate_id: string;
  candidate_name: string;
  candidate_photo_url: string | null;
  payment_status: string | null;
  payment_provider: string | null;
  payment_reference: string | null;
  payment_method: Enums<"payment_method"> | null;
  failure_reason: string | null;
};

const orderIdSchema = z.string().uuid("Commande invalide");

/**
 * Statut public d'une commande de votes (l'UUID de la commande sert de lien
 * privé non devinable). Aucune donnée sensible n'est renvoyée.
 */
export async function getVoteOrder(orderId: string): Promise<VoteOrderStatus | null> {
  const parsed = orderIdSchema.safeParse(orderId);
  if (!parsed.success) return null;

  const { rows } = await pool.query<VoteOrderRow>(
    `SELECT
        o.id,
        o.order_number,
        o.status::text        AS status,
        o.total_amount,
        o.currency,
        o.created_at,
        o.paid_at,
        o.buyer_name,
        vp.votes_count,
        c.id                  AS contest_id,
        c.title               AS contest_title,
        c.slug                AS contest_slug,
        c.ends_at             AS contest_ends_at,
        c.status::text        AS contest_status,
        ca.id                 AS candidate_id,
        ca.name               AS candidate_name,
        ca.photo_url          AS candidate_photo_url,
        p.status::text        AS payment_status,
        p.provider            AS payment_provider,
        p.provider_reference  AS payment_reference,
        p.method::text        AS payment_method,
        p.failure_reason
       FROM orders o
       JOIN vote_purchases vp ON vp.order_id = o.id
       JOIN contests c       ON c.id = vp.contest_id
       JOIN candidates ca    ON ca.id = vp.candidate_id
       LEFT JOIN LATERAL (
         SELECT status, provider, provider_reference, method, failure_reason
           FROM payments
          WHERE order_id = o.id
          ORDER BY created_at DESC
          LIMIT 1
       ) p ON TRUE
      WHERE o.id = $1 AND o.kind = 'vote'
      LIMIT 1`,
    [parsed.data],
  );

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    orderNumber: row.order_number,
    orderStatus: row.status,
    paymentStatus: row.payment_status ?? "pending",
    paymentProvider: row.payment_provider ?? "mock",
    paymentReference: row.payment_reference,
    paymentMethod: row.payment_method,
    failureReason: row.failure_reason,
    amount: Number(row.total_amount),
    currency: row.currency,
    votesCount: row.votes_count,
    createdAt: row.created_at.toISOString(),
    paidAt: row.paid_at ? row.paid_at.toISOString() : null,
    buyerName: row.buyer_name,
    contest: {
      id: row.contest_id,
      title: row.contest_title,
      slug: row.contest_slug,
      endsAt: row.contest_ends_at.toISOString(),
      status: row.contest_status,
    },
    candidate: {
      id: row.candidate_id,
      name: row.candidate_name,
      photoUrl: row.candidate_photo_url,
    },
  };
}
