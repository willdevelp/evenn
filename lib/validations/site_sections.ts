import { z } from "zod";
import { jsonSchema } from "./shared";

export const SiteSectionsInsertSchema = z.object({
  "content": jsonSchema.optional(),
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "is_visible": z.boolean().optional(),
  "page_id": z.string(),
  "sort_order": z.number().optional(),
  "type": z.string(),
  "updated_at": z.string().optional(),
}).strict();

export const SiteSectionsUpdateSchema = z.object({
  "content": jsonSchema.optional(),
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "is_visible": z.boolean().optional(),
  "page_id": z.string().optional(),
  "sort_order": z.number().optional(),
  "type": z.string().optional(),
  "updated_at": z.string().optional(),
}).strict();

