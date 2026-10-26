import { z } from "zod";
import { LedgerDirectionSchema } from "./enums";

export const LedgerLinesInsertSchema = z.object({
  "account_id": z.string(),
  "amount": z.number(),
  "direction": LedgerDirectionSchema,
  "id": z.never().optional(),
  "transaction_id": z.string(),
}).strict();

export const LedgerLinesUpdateSchema = z.object({
  "account_id": z.string().optional(),
  "amount": z.number().optional(),
  "direction": LedgerDirectionSchema.optional(),
  "id": z.never().optional(),
  "transaction_id": z.string().optional(),
}).strict();

