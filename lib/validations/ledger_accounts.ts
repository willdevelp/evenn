import { z } from "zod";
import { LedgerAccountTypeSchema } from "./enums";

export const LedgerAccountsInsertSchema = z.object({
  "code": z.string(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "id": z.string().optional(),
  "organization_id": z.string().nullable().optional(),
  "type": LedgerAccountTypeSchema,
}).strict();

export const LedgerAccountsUpdateSchema = z.object({
  "code": z.string().optional(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "id": z.string().optional(),
  "organization_id": z.string().nullable().optional(),
  "type": LedgerAccountTypeSchema.optional(),
}).strict();

