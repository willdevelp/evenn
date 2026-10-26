import { z } from "zod";
import { ContentStatusSchema } from "./enums";

export const WeddingsInsertSchema = z.object({
  "access_code_hash": z.string().nullable().optional(),
  "cover_url": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "deleted_at": z.string().nullable().optional(),
  "fundraiser_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "organization_id": z.string(),
  "owner_user_id": z.string(),
  "partner1_name": z.string(),
  "partner2_name": z.string(),
  "published_at": z.string().nullable().optional(),
  "rsvp_deadline": z.string().nullable().optional(),
  "site_id": z.string().nullable().optional(),
  "slug": z.string(),
  "status": ContentStatusSchema.optional(),
  "story": z.string().nullable().optional(),
  "updated_at": z.string().optional(),
  "wedding_date": z.string().nullable().optional(),
}).strict();

export const WeddingsUpdateSchema = z.object({
  "access_code_hash": z.string().nullable().optional(),
  "cover_url": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "deleted_at": z.string().nullable().optional(),
  "fundraiser_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "organization_id": z.string().optional(),
  "owner_user_id": z.string().optional(),
  "partner1_name": z.string().optional(),
  "partner2_name": z.string().optional(),
  "published_at": z.string().nullable().optional(),
  "rsvp_deadline": z.string().nullable().optional(),
  "site_id": z.string().nullable().optional(),
  "slug": z.string().optional(),
  "status": ContentStatusSchema.optional(),
  "story": z.string().nullable().optional(),
  "updated_at": z.string().optional(),
  "wedding_date": z.string().nullable().optional(),
}).strict();

