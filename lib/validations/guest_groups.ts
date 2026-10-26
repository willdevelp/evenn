import { z } from "zod";

export const GuestGroupsInsertSchema = z.object({
  "id": z.string().optional(),
  "name": z.string(),
  "wedding_id": z.string(),
}).strict();

export const GuestGroupsUpdateSchema = z.object({
  "id": z.string().optional(),
  "name": z.string().optional(),
  "wedding_id": z.string().optional(),
}).strict();

