import { z } from "zod";

export const SubscriptionsInsertSchema = z.object({
  "cancel_at_period_end": z.boolean().optional(),
  "created_at": z.string().optional(),
  "current_period_end": z.string(),
  "current_period_start": z.string().optional(),
  "id": z.string().optional(),
  "order_id": z.string().nullable().optional(),
  "organization_id": z.string(),
  "plan_id": z.string(),
  "status": z.string().optional(),
  "updated_at": z.string().optional(),
}).strict();

export const SubscriptionsUpdateSchema = z.object({
  "cancel_at_period_end": z.boolean().optional(),
  "created_at": z.string().optional(),
  "current_period_end": z.string().optional(),
  "current_period_start": z.string().optional(),
  "id": z.string().optional(),
  "order_id": z.string().nullable().optional(),
  "organization_id": z.string().optional(),
  "plan_id": z.string().optional(),
  "status": z.string().optional(),
  "updated_at": z.string().optional(),
}).strict();

