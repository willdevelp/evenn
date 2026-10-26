import { z } from "zod";

export const FundraiserUpdatesInsertSchema = z.object({
  "author_id": z.string().nullable().optional(),
  "body": z.string(),
  "created_at": z.string().optional(),
  "fundraiser_id": z.string(),
  "id": z.string().optional(),
  "title": z.string(),
}).strict();

export const FundraiserUpdatesUpdateSchema = z.object({
  "author_id": z.string().nullable().optional(),
  "body": z.string().optional(),
  "created_at": z.string().optional(),
  "fundraiser_id": z.string().optional(),
  "id": z.string().optional(),
  "title": z.string().optional(),
}).strict();

