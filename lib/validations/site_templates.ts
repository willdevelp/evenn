import { z } from "zod";
import { TemplateKindSchema } from "./enums";
import { jsonSchema } from "./shared";

export const SiteTemplatesInsertSchema = z.object({
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "key": z.string(),
  "kind": TemplateKindSchema,
  "name": z.string(),
  "preview_url": z.string().nullable().optional(),
  "schema": jsonSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

export const SiteTemplatesUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "key": z.string().optional(),
  "kind": TemplateKindSchema.optional(),
  "name": z.string().optional(),
  "preview_url": z.string().nullable().optional(),
  "schema": jsonSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

