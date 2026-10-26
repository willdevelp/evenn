import { z } from "zod";
import { FraudStatusSchema } from "./enums";
import { jsonSchema } from "./shared";

export const FraudFlagsInsertSchema = z.object({
  "contest_id": z.string(),
  "created_at": z.string().optional(),
  "details": jsonSchema.optional(),
  "id": z.string().optional(),
  "kind": z.string(),
  "reviewed_at": z.string().nullable().optional(),
  "reviewed_by": z.string().nullable().optional(),
  "severity": z.number().optional(),
  "status": FraudStatusSchema.optional(),
  "vote_id": z.string().nullable().optional(),
}).strict();

export const FraudFlagsUpdateSchema = z.object({
  "contest_id": z.string().optional(),
  "created_at": z.string().optional(),
  "details": jsonSchema.optional(),
  "id": z.string().optional(),
  "kind": z.string().optional(),
  "reviewed_at": z.string().nullable().optional(),
  "reviewed_by": z.string().nullable().optional(),
  "severity": z.number().optional(),
  "status": FraudStatusSchema.optional(),
  "vote_id": z.string().nullable().optional(),
}).strict();

