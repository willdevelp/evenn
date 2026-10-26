import { z } from "zod";

export const GuestsInsertSchema = z.object({
  "checked_in_at": z.string().nullable().optional(),
  "companions_allowed": z.number().optional(),
  "created_at": z.string().optional(),
  "email": z.string().nullable().optional(),
  "full_name": z.string(),
  "group_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "invite_token": z.string().optional(),
  "invited_at": z.string().nullable().optional(),
  "phone": z.string().nullable().optional(),
  "qr_token": z.string().optional(),
  "updated_at": z.string().optional(),
  "wedding_id": z.string(),
}).strict();

export const GuestsUpdateSchema = z.object({
  "checked_in_at": z.string().nullable().optional(),
  "companions_allowed": z.number().optional(),
  "created_at": z.string().optional(),
  "email": z.string().nullable().optional(),
  "full_name": z.string().optional(),
  "group_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "invite_token": z.string().optional(),
  "invited_at": z.string().nullable().optional(),
  "phone": z.string().nullable().optional(),
  "qr_token": z.string().optional(),
  "updated_at": z.string().optional(),
  "wedding_id": z.string().optional(),
}).strict();

