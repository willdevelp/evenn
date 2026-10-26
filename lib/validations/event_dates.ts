import { z } from "zod";

export const EventDatesInsertSchema = z.object({
  "doors_open_at": z.string().nullable().optional(),
  "ends_at": z.string().nullable().optional(),
  "event_id": z.string(),
  "id": z.string().optional(),
  "starts_at": z.string(),
}).strict();

export const EventDatesUpdateSchema = z.object({
  "doors_open_at": z.string().nullable().optional(),
  "ends_at": z.string().nullable().optional(),
  "event_id": z.string().optional(),
  "id": z.string().optional(),
  "starts_at": z.string().optional(),
}).strict();

