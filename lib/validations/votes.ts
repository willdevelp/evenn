import { z } from "zod";
import { VoteSourceSchema } from "./enums";

export const VotesInsertSchema = z.object({
  "cancelled_at": z.string().nullable().optional(),
  "cancelled_by": z.string().nullable().optional(),
  "cancelled_reason": z.string().nullable().optional(),
  "candidate_id": z.string(),
  "category_id": z.string(),
  "contest_id": z.string(),
  "created_at": z.string().optional(),
  "device_fingerprint": z.string().nullable().optional(),
  "id": z.string().optional(),
  "ip_address": z.unknown().optional(),
  "is_cancelled": z.boolean().optional(),
  "quantity": z.number().optional(),
  "source": VoteSourceSchema,
  "user_agent": z.string().nullable().optional(),
  "vote_purchase_id": z.string().nullable().optional(),
  "voter_phone_hash": z.string().nullable().optional(),
  "voter_user_id": z.string().nullable().optional(),
}).strict();

export const VotesUpdateSchema = z.object({
  "cancelled_at": z.string().nullable().optional(),
  "cancelled_by": z.string().nullable().optional(),
  "cancelled_reason": z.string().nullable().optional(),
  "candidate_id": z.string().optional(),
  "category_id": z.string().optional(),
  "contest_id": z.string().optional(),
  "created_at": z.string().optional(),
  "device_fingerprint": z.string().nullable().optional(),
  "id": z.string().optional(),
  "ip_address": z.unknown().optional(),
  "is_cancelled": z.boolean().optional(),
  "quantity": z.number().optional(),
  "source": VoteSourceSchema.optional(),
  "user_agent": z.string().nullable().optional(),
  "vote_purchase_id": z.string().nullable().optional(),
  "voter_phone_hash": z.string().nullable().optional(),
  "voter_user_id": z.string().nullable().optional(),
}).strict();

