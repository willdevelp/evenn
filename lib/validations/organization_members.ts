import { z } from "zod";
import { OrgRoleSchema } from "./enums";

export const OrganizationMembersInsertSchema = z.object({
  "created_at": z.string().optional(),
  "invited_by": z.string().nullable().optional(),
  "organization_id": z.string(),
  "role": OrgRoleSchema,
  "user_id": z.string(),
}).strict();

export const OrganizationMembersUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "invited_by": z.string().nullable().optional(),
  "organization_id": z.string().optional(),
  "role": OrgRoleSchema.optional(),
  "user_id": z.string().optional(),
}).strict();

