import { z } from "zod";
import { VerificationStatusSchema } from "./enums";

export const OrganizationVerificationsInsertSchema = z.object({
  "created_at": z.string().optional(),
  "document_type": z.string(),
  "file_url": z.string(),
  "id": z.string().optional(),
  "organization_id": z.string(),
  "rejection_reason": z.string().nullable().optional(),
  "reviewed_at": z.string().nullable().optional(),
  "reviewed_by": z.string().nullable().optional(),
  "status": VerificationStatusSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

export const OrganizationVerificationsUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "document_type": z.string().optional(),
  "file_url": z.string().optional(),
  "id": z.string().optional(),
  "organization_id": z.string().optional(),
  "rejection_reason": z.string().nullable().optional(),
  "reviewed_at": z.string().nullable().optional(),
  "reviewed_by": z.string().nullable().optional(),
  "status": VerificationStatusSchema.optional(),
  "updated_at": z.string().optional(),
}).strict();

