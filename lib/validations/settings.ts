import { z } from "zod";
import { jsonSchema } from "./shared";

export const SettingsInsertSchema = z.object({
  "key": z.string(),
  "updated_at": z.string().optional(),
  "updated_by": z.string().nullable().optional(),
  "value": jsonSchema,
}).strict();

export const SettingsUpdateSchema = z.object({
  "key": z.string().optional(),
  "updated_at": z.string().optional(),
  "updated_by": z.string().nullable().optional(),
  "value": jsonSchema.optional(),
}).strict();

