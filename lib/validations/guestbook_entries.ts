import { z } from "zod";
import { ModerationStatusSchema } from "./enums";

export const GuestbookEntriesInsertSchema = z.object({
  "author_name": z.string(),
  "created_at": z.string().optional(),
  "guest_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "message": z.string(),
  "status": ModerationStatusSchema.optional(),
  "wedding_id": z.string(),
}).strict();

export const GuestbookEntriesUpdateSchema = z.object({
  "author_name": z.string().optional(),
  "created_at": z.string().optional(),
  "guest_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "message": z.string().optional(),
  "status": ModerationStatusSchema.optional(),
  "wedding_id": z.string().optional(),
}).strict();

