import { z } from "zod";
import { ContributionStatusSchema } from "./enums";

export const ContributionsInsertSchema = z.object({
  "amount": z.number(),
  "created_at": z.string().optional(),
  "display_name": z.string().nullable().optional(),
  "fundraiser_id": z.string(),
  "id": z.string().optional(),
  "is_anonymous": z.boolean().optional(),
  "message": z.string().nullable().optional(),
  "order_id": z.string(),
  "status": ContributionStatusSchema.optional(),
  "updated_at": z.string().optional(),
  "user_id": z.string().nullable().optional(),
}).strict();

export const ContributionsUpdateSchema = z.object({
  "amount": z.number().optional(),
  "created_at": z.string().optional(),
  "display_name": z.string().nullable().optional(),
  "fundraiser_id": z.string().optional(),
  "id": z.string().optional(),
  "is_anonymous": z.boolean().optional(),
  "message": z.string().nullable().optional(),
  "order_id": z.string().optional(),
  "status": ContributionStatusSchema.optional(),
  "updated_at": z.string().optional(),
  "user_id": z.string().nullable().optional(),
}).strict();

