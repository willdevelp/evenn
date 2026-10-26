import { z } from "zod";
import { ModerationStatusSchema } from "./enums";

export const CandidatesInsertSchema = z.object({
  "bio": z.string().nullable().optional(),
  "category_id": z.string(),
  "contest_id": z.string(),
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "name": z.string(),
  "number": z.number().nullable().optional(),
  "photo_url": z.string().nullable().optional(),
  "status": ModerationStatusSchema.optional(),
  "updated_at": z.string().optional(),
  "video_url": z.string().nullable().optional(),
  "vote_count": z.number().optional(),
}).strict();

export const CandidatesUpdateSchema = z.object({
  "bio": z.string().nullable().optional(),
  "category_id": z.string().optional(),
  "contest_id": z.string().optional(),
  "created_at": z.string().optional(),
  "id": z.string().optional(),
  "name": z.string().optional(),
  "number": z.number().nullable().optional(),
  "photo_url": z.string().nullable().optional(),
  "status": ModerationStatusSchema.optional(),
  "updated_at": z.string().optional(),
  "video_url": z.string().nullable().optional(),
  "vote_count": z.number().optional(),
}).strict();

