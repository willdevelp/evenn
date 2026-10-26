import { z } from "zod";

export const PayoutAccountsInsertSchema = z.object({
  "account_name": z.string(),
  "account_number": z.string(),
  "created_at": z.string().optional(),
  "deleted_at": z.string().nullable().optional(),
  "id": z.string().optional(),
  "is_default": z.boolean().optional(),
  "kind": z.string(),
  "organization_id": z.string(),
  "provider": z.string(),
  "verified_at": z.string().nullable().optional(),
}).strict();

export const PayoutAccountsUpdateSchema = z.object({
  "account_name": z.string().optional(),
  "account_number": z.string().optional(),
  "created_at": z.string().optional(),
  "deleted_at": z.string().nullable().optional(),
  "id": z.string().optional(),
  "is_default": z.boolean().optional(),
  "kind": z.string().optional(),
  "organization_id": z.string().optional(),
  "provider": z.string().optional(),
  "verified_at": z.string().nullable().optional(),
}).strict();

