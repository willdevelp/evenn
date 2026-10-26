import { z } from "zod";
import { RsvpStatusSchema } from "./enums";

export const RsvpsInsertSchema = z.object({
  "attendees_count": z.number().optional(),
  "created_at": z.string().optional(),
  "dietary_notes": z.string().nullable().optional(),
  "guest_id": z.string(),
  "id": z.string().optional(),
  "message": z.string().nullable().optional(),
  "responded_at": z.string().nullable().optional(),
  "status": RsvpStatusSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

export const RsvpsUpdateSchema = z.object({
  "attendees_count": z.number().optional(),
  "created_at": z.string().optional(),
  "dietary_notes": z.string().nullable().optional(),
  "guest_id": z.string().optional(),
  "id": z.string().optional(),
  "message": z.string().nullable().optional(),
  "responded_at": z.string().nullable().optional(),
  "status": RsvpStatusSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

