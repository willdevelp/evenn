import { z } from "zod";
import { RefundStatusSchema } from "./enums";

export const RefundsInsertSchema = z.object({
  "amount": z.number(),
  "approved_by": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "order_id": z.string(),
  "payment_id": z.string(),
  "processed_at": z.string().nullable().optional(),
  "provider_reference": z.string().nullable().optional(),
  "reason": z.string().nullable().optional(),
  "requested_by": z.string().nullable().optional(),
  "status": RefundStatusSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

export const RefundsUpdateSchema = z.object({
  "amount": z.number().optional(),
  "approved_by": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "order_id": z.string().optional(),
  "payment_id": z.string().optional(),
  "processed_at": z.string().nullable().optional(),
  "provider_reference": z.string().nullable().optional(),
  "reason": z.string().nullable().optional(),
  "requested_by": z.string().nullable().optional(),
  "status": RefundStatusSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

