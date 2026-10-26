import { z } from "zod";
import { ReportStatusSchema, ReportTargetSchema } from "./enums";

export const ReportsInsertSchema = z.object({
  "created_at": z.string().optional(),
  "details": z.string().nullable().optional(),
  "handled_at": z.string().nullable().optional(),
  "handled_by": z.string().nullable().optional(),
  "id": z.string().optional(),
  "reason": z.string(),
  "reporter_user_id": z.string().nullable().optional(),
  "status": ReportStatusSchema.optional(),
  "target_id": z.string(),
  "target_type": ReportTargetSchema,
  "updated_at": z.string().optional(),
}).strict();

export const ReportsUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "details": z.string().nullable().optional(),
  "handled_at": z.string().nullable().optional(),
  "handled_by": z.string().nullable().optional(),
  "id": z.string().optional(),
  "reason": z.string().optional(),
  "reporter_user_id": z.string().nullable().optional(),
  "status": ReportStatusSchema.optional(),
  "target_id": z.string().optional(),
  "target_type": ReportTargetSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

