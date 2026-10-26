import { z } from "zod";
import { VerificationStatusSchema } from "./enums";
import { jsonSchema } from "./shared";

export const OrganizationsInsertSchema = z.object({
  "country_code": z.string().optional(),
  "created_at": z.string().optional(),
  "deleted_at": z.string().nullable().optional(),
  "description": z.string().nullable().optional(),
  "id": z.string().optional(),
  "logo_url": z.string().nullable().optional(),
  "name": z.string(),
  "owner_id": z.string(),
  "slug": z.string(),
  "social_links": jsonSchema.optional(),
  "updated_at": z.string().optional(),
  "verification_status": VerificationStatusSchema.optional(),
  "verified_at": z.string().nullable().optional(),
  "website_url": z.string().nullable().optional(),
}).strict();

export const OrganizationsUpdateSchema = z.object({
  "country_code": z.string().optional(),
  "created_at": z.string().optional(),
  "deleted_at": z.string().nullable().optional(),
  "description": z.string().nullable().optional(),
  "id": z.string().optional(),
  "logo_url": z.string().nullable().optional(),
  "name": z.string().optional(),
  "owner_id": z.string().optional(),
  "slug": z.string().optional(),
  "social_links": jsonSchema.optional(),
  "updated_at": z.string().optional(),
  "verification_status": VerificationStatusSchema.optional(),
  "verified_at": z.string().nullable().optional(),
  "website_url": z.string().nullable().optional(),
}).strict();

