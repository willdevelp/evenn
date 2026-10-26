import { z } from "zod";
import { ModerationStatusSchema } from "./enums";

export const WeddingGalleryInsertSchema = z.object({
  "asset_id": z.string(),
  "caption": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "guest_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "status": ModerationStatusSchema.optional(),
  "wedding_id": z.string(),
}).strict();

export const WeddingGalleryUpdateSchema = z.object({
  "asset_id": z.string().optional(),
  "caption": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "guest_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "status": ModerationStatusSchema.optional(),
  "wedding_id": z.string().optional(),
}).strict();

