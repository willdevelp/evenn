import { z } from "zod";

export const VotePurchasesInsertSchema = z.object({
  "amount": z.number(),
  "candidate_id": z.string(),
  "contest_id": z.string(),
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "order_id": z.string(),
  "pack_id": z.string().nullable().optional(),
  "votes_count": z.number(),
}).strict();

export const VotePurchasesUpdateSchema = z.object({
  "amount": z.number().optional(),
  "candidate_id": z.string().optional(),
  "contest_id": z.string().optional(),
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "order_id": z.string().optional(),
  "pack_id": z.string().nullable().optional(),
  "votes_count": z.number().optional(),
}).strict();

