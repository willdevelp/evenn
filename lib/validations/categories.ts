import { z } from "zod";
import { CategoryScopeSchema } from "./enums";

export const CategoriesInsertSchema = z.object({
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "name_en": z.string(),
  "name_fr": z.string(),
  "scope": CategoryScopeSchema,
  "slug": z.string(),
  "sort_order": z.number().optional(),
}).strict();

export const CategoriesUpdateSchema = z.object({
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "name_en": z.string().optional(),
  "name_fr": z.string().optional(),
  "scope": CategoryScopeSchema.optional(),
  "slug": z.string().optional(),
  "sort_order": z.number().optional(),
}).strict();

