import { z } from "zod";

export const WeddingEventsInsertSchema = z.object({
  "address": z.string().nullable().optional(),
  "ends_at": z.string().nullable().optional(),
  "id": z.string().optional(),
  "latitude": z.number().nullable().optional(),
  "longitude": z.number().nullable().optional(),
  "notes": z.string().nullable().optional(),
  "sort_order": z.number().optional(),
  "starts_at": z.string(),
  "title": z.string(),
  "venue_name": z.string().nullable().optional(),
  "wedding_id": z.string(),
}).strict();

export const WeddingEventsUpdateSchema = z.object({
  "address": z.string().nullable().optional(),
  "ends_at": z.string().nullable().optional(),
  "id": z.string().optional(),
  "latitude": z.number().nullable().optional(),
  "longitude": z.number().nullable().optional(),
  "notes": z.string().nullable().optional(),
  "sort_order": z.number().optional(),
  "starts_at": z.string().optional(),
  "title": z.string().optional(),
  "venue_name": z.string().nullable().optional(),
  "wedding_id": z.string().optional(),
}).strict();

