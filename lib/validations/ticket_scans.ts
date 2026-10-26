import { z } from "zod";
import { ScanResultSchema } from "./enums";

export const TicketScansInsertSchema = z.object({
  "device_info": z.string().nullable().optional(),
  "event_id": z.string(),
  "id": z.string().optional(),
  "raw_code": z.string().nullable().optional(),
  "result": ScanResultSchema,
  "scanned_at": z.string().optional(),
  "scanned_by": z.string().nullable().optional(),
  "ticket_id": z.string().nullable().optional(),
}).strict();

export const TicketScansUpdateSchema = z.object({
  "device_info": z.string().nullable().optional(),
  "event_id": z.string().optional(),
  "id": z.string().optional(),
  "raw_code": z.string().nullable().optional(),
  "result": ScanResultSchema.optional(),
  "scanned_at": z.string().optional(),
  "scanned_by": z.string().nullable().optional(),
  "ticket_id": z.string().nullable().optional(),
}).strict();

