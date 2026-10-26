import { z } from "zod";
import { PaymentMethodSchema, PaymentStatusSchema } from "./enums";
import { jsonSchema } from "./shared";

export const PaymentsInsertSchema = z.object({
  "amount": z.number(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "failure_reason": z.string().nullable().optional(),
  "id": z.string().optional(),
  "method": PaymentMethodSchema,
  "order_id": z.string(),
  "paid_at": z.string().nullable().optional(),
  "payer_phone": z.string().nullable().optional(),
  "provider": z.string(),
  "provider_reference": z.string().nullable().optional(),
  "request_payload": jsonSchema.nullable().optional(),
  "response_payload": jsonSchema.nullable().optional(),
  "status": PaymentStatusSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

export const PaymentsUpdateSchema = z.object({
  "amount": z.number().optional(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "failure_reason": z.string().nullable().optional(),
  "id": z.string().optional(),
  "method": PaymentMethodSchema.optional(),
  "order_id": z.string().optional(),
  "paid_at": z.string().nullable().optional(),
  "payer_phone": z.string().nullable().optional(),
  "provider": z.string().optional(),
  "provider_reference": z.string().nullable().optional(),
  "request_payload": jsonSchema.nullable().optional(),
  "response_payload": jsonSchema.nullable().optional(),
  "status": PaymentStatusSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

