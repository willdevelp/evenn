import { createHash, randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { makeTicketToken } from "../tickets";

type OrderRow = {
  id: string; organization_id: string; kind: "ticket" | "contribution" | "vote" | "subscription";
  status: string; buyer_user_id: string | null; buyer_phone: string | null;
  subtotal_amount: string; discount_amount: string; fee_amount: string;
  platform_commission_amount: string; total_amount: string;
};

const hashPhone = (phone: string) =>
  createHash("sha256").update(`${process.env.VOTE_HASH_PEPPER ?? ""}${phone}`).digest("hex");

/**
 * Finalise une commande payée. DOIT être appelée dans une transaction.
 * Idempotente : si la commande est déjà payée, ne fait rien.
 */
export async function fulfillPaidOrder(client: PoolClient, orderId: string, paymentId: string): Promise<{ alreadyPaid: boolean }> {
  const { rows } = await client.query<OrderRow>(`SELECT * FROM orders WHERE id = $1 FOR UPDATE`, [orderId]);
  const order = rows[0];
  if (!order) throw new Error(`Commande introuvable : ${orderId}`);
  if (order.status === "paid") return { alreadyPaid: true };

  await client.query(`UPDATE orders SET status = 'paid', paid_at = now() WHERE id = $1`, [orderId]);

  if (order.kind === "ticket") {
    const { rows: items } = await client.query<{
      id: string; ticket_type_id: string; event_date_id: string | null; quantity: number; event_id: string;
    }>(
      `SELECT oi.id, oi.ticket_type_id, oi.event_date_id, oi.quantity, tt.event_id
         FROM ticket_order_items oi JOIN ticket_types tt ON tt.id = oi.ticket_type_id
        WHERE oi.order_id = $1`,
      [orderId],
    );
    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        const ticketId = randomUUID();
        await client.query(
          `INSERT INTO tickets (id, order_id, order_item_id, ticket_type_id, event_id, event_date_id,
                                holder_name, holder_email, holder_phone, qr_token)
           SELECT $1, o.id, $2, $3, $4, $5, o.buyer_name, o.buyer_email, o.buyer_phone, $6 FROM orders o WHERE o.id = $7`,
          [ticketId, item.id, item.ticket_type_id, item.event_id, item.event_date_id, makeTicketToken(ticketId), orderId],
        );
      }
    }
  } else if (order.kind === "contribution") {
    await client.query(`UPDATE contributions SET status = 'confirmed' WHERE order_id = $1`, [orderId]);
  } else if (order.kind === "vote") {
    const { rows: purchases } = await client.query<{
      id: string; contest_id: string; candidate_id: string; votes_count: number; category_id: string;
    }>(
      `SELECT vp.id, vp.contest_id, vp.candidate_id, vp.votes_count, c.category_id
         FROM vote_purchases vp JOIN candidates c ON c.id = vp.candidate_id
        WHERE vp.order_id = $1`,
      [orderId],
    );
    for (const p of purchases) {
      await client.query(
        `INSERT INTO votes (contest_id, category_id, candidate_id, vote_purchase_id, source, quantity, voter_user_id, voter_phone_hash)
         VALUES ($1, $2, $3, $4, 'paid', $5, $6, $7)`,
        [p.contest_id, p.category_id, p.candidate_id, p.id, p.votes_count, order.buyer_user_id,
         order.buyer_phone ? hashPhone(order.buyer_phone) : null],
      );
    }
  }

  // ---- Écritures comptables (partie double) ----
  const total = Number(order.total_amount);
  const fee = Number(order.fee_amount);
  const commission = Number(order.platform_commission_amount);
  const organizerShare = Number(order.subtotal_amount) - Number(order.discount_amount) - commission;
  const platformShare = fee + commission;
  if (organizerShare < 0) throw new Error("Commission supérieure au montant net de la commande");

  const { rows: accts } = await client.query<{ code: string; id: string }>(
    `SELECT code, id FROM ledger_accounts
      WHERE code IN ('PLATFORM-PROVIDER-CLEARING', 'PLATFORM-REVENUE', $1)`,
    [`ORG-${order.organization_id}`],
  );
  const acct = Object.fromEntries(accts.map((a) => [a.code, a.id]));
  const clearing = acct["PLATFORM-PROVIDER-CLEARING"];
  const revenue = acct["PLATFORM-REVENUE"];
  const orgAcct = acct[`ORG-${order.organization_id}`];
  if (!clearing || !revenue || !orgAcct) throw new Error("Comptes comptables manquants");

  const { rows: [tx] } = await client.query<{ id: string }>(
    `INSERT INTO ledger_transactions (order_id, payment_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [orderId, paymentId, `Paiement commande ${orderId}`],
  );
  const lines: [string, "debit" | "credit", number][] = [
    [clearing, "debit", total],
    [orgAcct, "credit", organizerShare],
    [revenue, "credit", platformShare],
  ];
  for (const [account, direction, amount] of lines) {
    if (amount > 0) {
      await client.query(
        `INSERT INTO ledger_lines (transaction_id, account_id, direction, amount) VALUES ($1, $2, $3, $4)`,
        [tx.id, account, direction, amount],
      );
    }
  }
  return { alreadyPaid: false };
}

/** Commande échouée/annulée : rend le stock de billets et met à jour les statuts. */
export async function failOrder(client: PoolClient, orderId: string) {
  const { rows } = await client.query<{ status: string; kind: string }>(
    `SELECT status, kind FROM orders WHERE id = $1 FOR UPDATE`, [orderId]);
  const order = rows[0];
  if (!order || order.status !== "pending") return; // ne jamais défaire une commande payée

  await client.query(`UPDATE orders SET status = 'failed' WHERE id = $1`, [orderId]);
  if (order.kind === "ticket") {
    const { rows: items } = await client.query<{ ticket_type_id: string; quantity: number }>(
      `SELECT ticket_type_id, quantity FROM ticket_order_items WHERE order_id = $1`, [orderId]);
    for (const it of items) {
      await client.query(`SELECT release_ticket_stock($1, $2)`, [it.ticket_type_id, it.quantity]);
    }
  } else if (order.kind === "contribution") {
    await client.query(`UPDATE contributions SET status = 'failed' WHERE order_id = $1`, [orderId]);
  }
}
