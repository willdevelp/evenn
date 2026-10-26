import { z } from "zod";

export const ContestCategoriesInsertSchema = z.object({
  "contest_id": z.string(),
  "description": z.string().nullable().optional(),
  "id": z.string().optional(),
  "name": z.string(),
  "sort_order": z.number().optional(),
}).strict();

export const ContestCategoriesUpdateSchema = z.object({
  "contest_id": z.string().optional(),
  "description": z.string().nullable().optional(),
  "id": z.string().optional(),
  "name": z.string().optional(),
  "sort_order": z.number().optional(),
}).strict();

