"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { pool } from "@/lib/db";
import { signMockWebhook } from "@/lib/payments/providers/mock";
import { processWebhook } from "@/lib/payments/webhook";

const inputSchema = z.object({ orderId: z.string().uuid("Commande invalide") }).strict();

export type MockPaymentResult = {
  ok: boolean;
  alreadyPaid: boolean;
  flagged: string | null;
};

/**
 * Simule la notification du fournisseur de paiement EN DÉVELOPPEMENT.
 *
 * Le corps est signé avec le même HMAC que le fournisseur `mock`, puis confié
 * à `processWebhook` : signature, montant, idempotence et livraison passent
 * donc par exactement le même chemin qu'un vrai paiement. Désactivé hors dev.
 */
export async function confirmMockVotePayment(input: {
  orderId: string;
}): Promise<MockPaymentResult> {
  const canUseMock =
    process.env.NODE_ENV !== "production" || process.env.ENABLE_MOCK_PROVIDER === "true";
  if (!canUseMock) {
    throw new Error("Le paiement de test est désactivé en production.");
  }

  const { orderId } = inputSchema.parse(input);

  const { rows } = await pool.query<{
    order_status: string;
    payment_status: string;
    provider: string;
    provider_reference: string | null;
    amount: string;
  }>(
    `SELECT
        o.status::text AS order_status,
        p.status::text AS payment_status,
        p.provider,
        p.provider_reference,
        p.amount
       FROM orders o
       JOIN payments p ON p.order_id = o.id
      WHERE o.id = $1 AND o.kind = 'vote'
      ORDER BY p.created_at DESC
      LIMIT 1`,
    [orderId],
  );

  const payment = rows[0];
  if (!payment) throw new Error("Paiement introuvable pour cette commande.");
  if (payment.provider !== "mock") {
    throw new Error("Cette commande utilise un vrai fournisseur de paiement.");
  }
  if (payment.order_status === "paid" || payment.payment_status === "succeeded") {
    return { ok: true, alreadyPaid: true, flagged: null };
  }
  if (!payment.provider_reference) {
    throw new Error("Référence de paiement manquante.");
  }

  const rawBody = JSON.stringify({
    id: `evt_${randomUUID()}`,
    type: "payment.succeeded",
    reference: payment.provider_reference,
    status: "succeeded",
    amount: Number(payment.amount),
  });
  const headers = new Headers({
    "content-type": "application/json",
    "x-signature": signMockWebhook(rawBody),
  });

  const result = await processWebhook("mock", rawBody, headers);
  if (result.status !== 200) {
    throw new Error("La vérification du paiement a échoué. Réessayez.");
  }

  revalidatePath("/vote");
  revalidatePath("/vote/checkout");

  return {
    ok: true,
    alreadyPaid: false,
    flagged: typeof result.body.flagged === "string" ? result.body.flagged : null,
  };
}
