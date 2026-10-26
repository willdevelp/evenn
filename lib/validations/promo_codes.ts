import { z } from "zod";
import { DiscountTypeSchema } from "./enums";

export const PromoCodesInsertSchema = z.object({
  "code": z.string(),
  "created_at": z.string().optional(),
  "discount_type": DiscountTypeSchema,
  "discount_value": z.number(),
  "event_id": z.string(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "max_uses": z.number().nullable().optional(),
  "used_count": z.number().optional(),
  "valid_from": z.string().nullable().optional(),
  "valid_until": z.string().nullable().optional(),
}).strict();

export const PromoCodesUpdateSchema = z.object({
  "code": z.string().optional(),
  "created_at": z.string().optional(),
  "discount_type": DiscountTypeSchema.optional(),
  "discount_value": z.number().optional(),
  "event_id": z.string().optional(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "max_uses": z.number().nullable().optional(),
  "used_count": z.number().optional(),
  "valid_from": z.string().nullable().optional(),
  "valid_until": z.string().nullable().optional(),
}).strict();

