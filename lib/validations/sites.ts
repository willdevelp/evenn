import { z } from "zod";
import { SiteStatusSchema } from "./enums";
import { jsonSchema } from "./shared";

export const SitesInsertSchema = z.object({
  "created_at": z.string().optional(),
  "created_by": z.string().nullable().optional(),
  "deleted_at": z.string().nullable().optional(),
  "id": z.string().optional(),
  "name": z.string(),
  "organization_id": z.string(),
  "published_at": z.string().nullable().optional(),
  "published_version_id": z.string().nullable().optional(),
  "seo": jsonSchema.optional(),
  "status": SiteStatusSchema.optional(),
  "subdomain": z.string(),
  "template_id": z.string(),
  "theme": jsonSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

export const SitesUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "created_by": z.string().nullable().optional(),
  "deleted_at": z.string().nullable().optional(),
  "id": z.string().optional(),
  "name": z.string().optional(),
  "organization_id": z.string().optional(),
  "published_at": z.string().nullable().optional(),
  "published_version_id": z.string().nullable().optional(),
  "seo": jsonSchema.optional(),
  "status": SiteStatusSchema.optional(),
  "subdomain": z.string().optional(),
  "template_id": z.string().optional(),
  "theme": jsonSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

