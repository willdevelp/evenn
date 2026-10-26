import { z } from "zod";
import { PayoutStatusSchema } from "./enums";

export const PayoutsInsertSchema = z.object({
  "amount": z.number(),
  "approved_at": z.string().nullable().optional(),
  "approved_by": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "failure_reason": z.string().nullable().optional(),
  "fee_amount": z.number().optional(),
  "id": z.string().optional(),
  "organization_id": z.string(),
  "payout_account_id": z.string(),
  "processed_at": z.string().nullable().optional(),
  "provider_reference": z.string().nullable().optional(),
  "requested_at": z.string().optional(),
  "requested_by": z.string().nullable().optional(),
  "status": PayoutStatusSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

export const PayoutsUpdateSchema = z.object({
  "amount": z.number().optional(),
  "approved_at": z.string().nullable().optional(),
  "approved_by": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "failure_reason": z.string().nullable().optional(),
  "fee_amount": z.number().optional(),
  "id": z.string().optional(),
  "organization_id": z.string().optional(),
  "payout_account_id": z.string().optional(),
  "processed_at": z.string().nullable().optional(),
  "provider_reference": z.string().nullable().optional(),
  "requested_at": z.string().optional(),
  "requested_by": z.string().nullable().optional(),
  "status": PayoutStatusSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

