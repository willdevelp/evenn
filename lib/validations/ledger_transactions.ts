import { z } from "zod";

export const LedgerTransactionsInsertSchema = z.object({
  "created_at": z.string().optional(),
  "description": z.string().nullable().optional(),
  "id": z.string().optional(),
  "order_id": z.string().nullable().optional(),
  "payment_id": z.string().nullable().optional(),
  "payout_id": z.string().nullable().optional(),
  "refund_id": z.string().nullable().optional(),
}).strict();

export const LedgerTransactionsUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "description": z.string().nullable().optional(),
  "id": z.string().optional(),
  "order_id": z.string().nullable().optional(),
  "payment_id": z.string().nullable().optional(),
  "payout_id": z.string().nullable().optional(),
  "refund_id": z.string().nullable().optional(),
}).strict();

