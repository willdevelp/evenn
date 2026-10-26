import { z } from "zod";

export const TicketTypesInsertSchema = z.object({
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "description": z.string().nullable().optional(),
  "event_id": z.string(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "max_per_order": z.number().optional(),
  "name": z.string(),
  "price_amount": z.number().optional(),
  "quantity_sold": z.number().optional(),
  "quantity_total": z.number(),
  "sales_end_at": z.string().nullable().optional(),
  "sales_start_at": z.string().nullable().optional(),
  "sort_order": z.number().optional(),
  "updated_at": z.string().optional(),
}).strict();

export const TicketTypesUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "currency": z.string().optional(),
  "description": z.string().nullable().optional(),
  "event_id": z.string().optional(),
  "id": z.string().optional(),
  "is_active": z.boolean().optional(),
  "max_per_order": z.number().optional(),
  "name": z.string().optional(),
  "price_amount": z.number().optional(),
  "quantity_sold": z.number().optional(),
  "quantity_total": z.number().optional(),
  "sales_end_at": z.string().nullable().optional(),
  "sales_start_at": z.string().nullable().optional(),
  "sort_order": z.number().optional(),
  "updated_at": z.string().optional(),
}).strict();

