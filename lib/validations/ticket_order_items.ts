import { z } from "zod";

export const TicketOrderItemsInsertSchema = z.object({
  "event_date_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "order_id": z.string(),
  "quantity": z.number(),
  "ticket_type_id": z.string(),
  "total_amount": z.number(),
  "unit_price": z.number(),
}).strict();

export const TicketOrderItemsUpdateSchema = z.object({
  "event_date_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "order_id": z.string().optional(),
  "quantity": z.number().optional(),
  "ticket_type_id": z.string().optional(),
  "total_amount": z.number().optional(),
  "unit_price": z.number().optional(),
}).strict();

