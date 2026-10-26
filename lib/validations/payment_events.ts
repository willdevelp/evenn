import { z } from "zod";
import { jsonSchema } from "./shared";

export const PaymentEventsInsertSchema = z.object({
  "event_id": z.string(),
  "event_type": z.string().nullable().optional(),
  "id": z.string().optional(),
  "payload": jsonSchema,
  "payment_id": z.string().nullable().optional(),
  "processed_at": z.string().nullable().optional(),
  "processing_error": z.string().nullable().optional(),
  "provider": z.string(),
  "received_at": z.string().optional(),
  "signature_valid": z.boolean(),
}).strict();

export const PaymentEventsUpdateSchema = z.object({
  "event_id": z.string().optional(),
  "event_type": z.string().nullable().optional(),
  "id": z.string().optional(),
  "payload": jsonSchema.optional(),
  "payment_id": z.string().nullable().optional(),
  "processed_at": z.string().nullable().optional(),
  "processing_error": z.string().nullable().optional(),
  "provider": z.string().optional(),
  "received_at": z.string().optional(),
  "signature_valid": z.boolean().optional(),
}).strict();

