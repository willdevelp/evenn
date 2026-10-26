import { z } from "zod";
import { jsonSchema } from "./shared";

export const SitePagesInsertSchema = z.object({
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "is_home": z.boolean().optional(),
  "path": z.string().optional(),
  "seo": jsonSchema.optional(),
  "site_id": z.string(),
  "sort_order": z.number().optional(),
  "title": z.string(),
  "updated_at": z.string().optional(),
}).strict();

export const SitePagesUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "is_home": z.boolean().optional(),
  "path": z.string().optional(),
  "seo": jsonSchema.optional(),
  "site_id": z.string().optional(),
  "sort_order": z.number().optional(),
  "title": z.string().optional(),
  "updated_at": z.string().optional(),
}).strict();

