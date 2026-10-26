import { z } from "zod";
import { TicketStatusSchema } from "./enums";

export const TicketsInsertSchema = z.object({
  "created_at": z.string().optional(),
  "event_date_id": z.string().nullable().optional(),
  "event_id": z.string(),
  "holder_email": z.string().nullable().optional(),
  "holder_name": z.string().nullable().optional(),
  "holder_phone": z.string().nullable().optional(),
  "id": z.string().optional(),
  "order_id": z.string(),
  "order_item_id": z.string().nullable().optional(),
  "qr_token": z.string(),
  "status": TicketStatusSchema.optional(),
  "ticket_type_id": z.string(),
  "transferred_from_ticket_id": z.string().nullable().optional(),
  "updated_at": z.string().optional(),
  "used_at": z.string().nullable().optional(),
  "used_by": z.string().nullable().optional(),
}).strict();

export const TicketsUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "event_date_id": z.string().nullable().optional(),
  "event_id": z.string().optional(),
  "holder_email": z.string().nullable().optional(),
  "holder_name": z.string().nullable().optional(),
  "holder_phone": z.string().nullable().optional(),
  "id": z.string().optional(),
  "order_id": z.string().optional(),
  "order_item_id": z.string().nullable().optional(),
  "qr_token": z.string().optional(),
  "status": TicketStatusSchema.optional(),
  "ticket_type_id": z.string().optional(),
  "transferred_from_ticket_id": z.string().nullable().optional(),
  "updated_at": z.string().optional(),
  "used_at": z.string().nullable().optional(),
  "used_by": z.string().nullable().optional(),
}).strict();

