import { z } from "zod";

export const VotePacksInsertSchema = z.object({
  "contest_id": z.string(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "name": z.string(),
  "price_amount": z.number(),
  "sort_order": z.number().optional(),
  "votes_count": z.number(),
}).strict();

export const VotePacksUpdateSchema = z.object({
  "contest_id": z.string().optional(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "name": z.string().optional(),
  "price_amount": z.number().optional(),
  "sort_order": z.number().optional(),
  "votes_count": z.number().optional(),
}).strict();

