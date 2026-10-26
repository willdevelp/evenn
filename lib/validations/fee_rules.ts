import { z } from "zod";
import { OrderKindSchema, FeePayerSchema } from "./enums";

export const FeeRulesInsertSchema = z.object({
  "created_at": z.string().optional(),
  "created_by": z.string().nullable().optional(),
  "fixed_amount": z.number().optional(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "max_fee": z.number().nullable().optional(),
  "min_fee": z.number().optional(),
  "module": OrderKindSchema,
  "organization_id": z.string().nullable().optional(),
  "paid_by": FeePayerSchema.optional(),
  "percent_bps": z.number().optional(),
  "valid_from": z.string().optional(),
  "valid_until": z.string().nullable().optional(),
}).strict();

export const FeeRulesUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "created_by": z.string().nullable().optional(),
  "fixed_amount": z.number().optional(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "max_fee": z.number().nullable().optional(),
  "min_fee": z.number().optional(),
  "module": OrderKindSchema.optional(),
  "organization_id": z.string().nullable().optional(),
  "paid_by": FeePayerSchema.optional(),
  "percent_bps": z.number().optional(),
  "valid_from": z.string().optional(),
  "valid_until": z.string().nullable().optional(),
}).strict();

