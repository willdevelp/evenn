import { z } from "zod";
import { jsonSchema } from "./shared";

export const SiteVersionsInsertSchema = z.object({
  "created_at": z.string().optional(),
  "created_by": z.string().nullable().optional(),
  "id": z.string().optional(),
  "note": z.string().nullable().optional(),
  "site_id": z.string(),
  "snapshot": jsonSchema,
  "version_number": z.number(),
}).strict();

export const SiteVersionsUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "created_by": z.string().nullable().optional(),
  "id": z.string().optional(),
  "note": z.string().nullable().optional(),
  "site_id": z.string().optional(),
  "snapshot": jsonSchema.optional(),
  "version_number": z.number().optional(),
}).strict();

