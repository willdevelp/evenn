import { z } from "zod";
import { jsonSchema } from "./shared";

export const PlansInsertSchema = z.object({
  "billing_period": z.string().optional(),
  "code": z.string(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "features": jsonSchema.optional(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "name": z.string(),
  "price_amount": z.number().optional(),
}).strict();

export const PlansUpdateSchema = z.object({
  "billing_period": z.string().optional(),
  "code": z.string().optional(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "features": jsonSchema.optional(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "name": z.string().optional(),
  "price_amount": z.number().optional(),
}).strict();

