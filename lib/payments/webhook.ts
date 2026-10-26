import { createHash } from "node:crypto";
import { pool, withTransaction } from "../db";
import { failOrder, fulfillPaidOrder } from "./fulfill";
import { getProvider } from "./providers";

export type WebhookResult = { status: number; body: Record<string, unknown> };

class PaymentNotFound extends Error {}

/**
 * Traite un webhook de paiement de façon sûre :
 *  1. vérifie la signature (sinon 401, et trace de la tentative)
 *  2. idempotence : un même événement n'est jamais traité deux fois
 *  3. vérifie que le montant confirmé correspond au paiement attendu
 *  4. tout se passe dans UNE transaction : en cas d'erreur, rien n'est enregistré et le
 *     fournisseur peut réessayer
 */
export async function processWebhook(providerName: string, rawBody: string, headers: Headers): Promise<WebhookResult> {
  const provider = getProvider(providerName);
  if (!provider) return { status: 404, body: { error: "unknown_provider" } };

  const parsed = provider.verifyAndParse(rawBody, headers);
  if (!parsed.valid || !parsed.event) {
    await pool.query(
      `INSERT INTO payment_events (provider, event_id, payload, signature_valid, processing_error)
       VALUES ($1, $2, $3::jsonb, false, 'invalid signature') ON CONFLICT (provider, event_id) DO NOTHING`,
      [providerName, `invalid-${createHash("sha256").update(rawBody).digest("hex")}`, JSON.stringify({ rawBody: rawBody.slice(0, 2000) })],
    );
    return { status: 401, body: { error: "invalid_signature" } };
  }
  const ev = parsed.event;

  try {
    return await withTransaction(async (client): Promise<WebhookResult> => {
      // Idempotence : si l'événement existe déjà, on ne refait rien
      const ins = await client.query<{ id: string }>(
        `INSERT INTO payment_events (provider, event_id, event_type, payload, signature_valid)
         VALUES ($1, $2, $3, $4::jsonb, true) ON CONFLICT (provider, event_id) DO NOTHING RETURNING id`,
        [providerName, ev.eventId, ev.eventType, JSON.stringify(ev.raw)],
      );
      if (ins.rowCount === 0) return { status: 200, body: { ok: true, duplicate: true } };
      const eventRowId = ins.rows[0].id;

      const { rows } = await client.query<{ id: string; order_id: string; amount: string; status: string }>(
        `SELECT id, order_id, amount, status FROM payments WHERE provider = $1 AND provider_reference = $2 FOR UPDATE`,
        [providerName, ev.providerReference],
      );
      const payment = rows[0];
      if (!payment) throw new PaymentNotFound(); // annule la transaction : le fournisseur réessaiera

      await client.query(`UPDATE payment_events SET payment_id = $1 WHERE id = $2`, [payment.id, eventRowId]);

      // Paiement déjà finalisé : on ignore les événements tardifs
      if (payment.status === "succeeded" || payment.status === "refunded") {
        await client.query(`UPDATE payment_events SET processed_at = now() WHERE id = $1`, [eventRowId]);
        return { status: 200, body: { ok: true, ignored: "already_final" } };
      }

      if (ev.status === "succeeded") {
        if (ev.amount !== undefined && ev.amount !== Number(payment.amount)) {
          // Montant inattendu : on ne livre RIEN et on signale pour vérification manuelle
          await client.query(
            `UPDATE payment_events SET processed_at = now(), processing_error = $1 WHERE id = $2`,
            [`amount mismatch: expected ${payment.amount}, got ${ev.amount}`, eventRowId]);
          return { status: 200, body: { ok: true, flagged: "amount_mismatch" } };
        }
        await client.query(`UPDATE payments SET status = 'succeeded', paid_at = now(), response_payload = $2::jsonb WHERE id = $1`,
          [payment.id, JSON.stringify(ev.raw)]);
        await fulfillPaidOrder(client, payment.order_id, payment.id);
      } else if (ev.status === "failed") {
        await client.query(`UPDATE payments SET status = 'failed', failure_reason = $2, response_payload = $3::jsonb WHERE id = $1`,
          [payment.id, ev.failureReason ?? null, JSON.stringify(ev.raw)]);
        await failOrder(client, payment.order_id);
      } else {
        await client.query(`UPDATE payments SET status = 'pending' WHERE id = $1`, [payment.id]);
      }

      await client.query(`UPDATE payment_events SET processed_at = now() WHERE id = $1`, [eventRowId]);
      return { status: 200, body: { ok: true } };
    });
  } catch (err) {
    if (err instanceof PaymentNotFound) return { status: 404, body: { error: "payment_not_found" } };
    console.error("[webhook] erreur de traitement", err);
    return { status: 500, body: { error: "processing_failed" } }; // le fournisseur réessaiera
  }
}
