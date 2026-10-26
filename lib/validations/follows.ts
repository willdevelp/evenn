import { z } from "zod";

export const FollowsInsertSchema = z.object({
  "created_at": z.string().optional(),
  "organization_id": z.string(),
  "user_id": z.string(),
}).strict();

export const FollowsUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "organization_id": z.string().optional(),
  "user_id": z.string().optional(),
}).strict();

