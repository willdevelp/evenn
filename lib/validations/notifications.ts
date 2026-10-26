import { z } from "zod";
import { jsonSchema } from "./shared";

export const NotificationsInsertSchema = z.object({
  "body": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "data": jsonSchema.optional(),
  "id": z.string().optional(),
  "read_at": z.string().nullable().optional(),
  "title": z.string(),
  "type": z.string(),
  "user_id": z.string(),
}).strict();

export const NotificationsUpdateSchema = z.object({
  "body": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "data": jsonSchema.optional(),
  "id": z.string().optional(),
  "read_at": z.string().nullable().optional(),
  "title": z.string().optional(),
  "type": z.string().optional(),
  "user_id": z.string().optional(),
}).strict();

