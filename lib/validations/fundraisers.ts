import { z } from "zod";
import { ContentStatusSchema, VisibilityLevelSchema } from "./enums";
import { jsonSchema } from "./shared";

export const FundraisersInsertSchema = z.object({
  "category_id": z.string().nullable().optional(),
  "collected_amount": z.number().optional(),
  "contributors_count": z.number().optional(),
  "cover_url": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "deleted_at": z.string().nullable().optional(),
  "description": z.string().nullable().optional(),
  "ends_at": z.string().nullable().optional(),
  "goal_amount": z.number().nullable().optional(),
  "id": z.string().optional(),
  "organization_id": z.string(),
  "published_at": z.string().nullable().optional(),
  "show_contributors": z.boolean().optional(),
  "slug": z.string(),
  "status": ContentStatusSchema.optional(),
  "suggested_amounts": jsonSchema.optional(),
  "title": z.string(),
  "updated_at": z.string().optional(),
  "video_url": z.string().nullable().optional(),
  "visibility": VisibilityLevelSchema.optional(),
}).strict();

export const FundraisersUpdateSchema = z.object({
  "category_id": z.string().nullable().optional(),
  "collected_amount": z.number().optional(),
  "contributors_count": z.number().optional(),
  "cover_url": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "deleted_at": z.string().nullable().optional(),
  "description": z.string().nullable().optional(),
  "ends_at": z.string().nullable().optional(),
  "goal_amount": z.number().nullable().optional(),
  "id": z.string().optional(),
  "organization_id": z.string().optional(),
  "published_at": z.string().nullable().optional(),
  "show_contributors": z.boolean().optional(),
  "slug": z.string().optional(),
  "status": ContentStatusSchema.optional(),
  "suggested_amounts": jsonSchema.optional(),
  "title": z.string().optional(),
  "updated_at": z.string().optional(),
  "video_url": z.string().nullable().optional(),
  "visibility": VisibilityLevelSchema.optional(),
}).strict();

