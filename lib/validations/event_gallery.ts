import { z } from "zod";

export const EventGalleryInsertSchema = z.object({
  "asset_id": z.string(),
  "event_id": z.string(),
  "id": z.string().optional(),
  "sort_order": z.number().optional(),
}).strict();

export const EventGalleryUpdateSchema = z.object({
  "asset_id": z.string().optional(),
  "event_id": z.string().optional(),
  "id": z.string().optional(),
  "sort_order": z.number().optional(),
}).strict();

