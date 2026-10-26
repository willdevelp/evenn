import { z } from "zod";
import { jsonSchema } from "./shared";

export const AuditLogsInsertSchema = z.object({
  "action": z.string(),
  "actor_user_id": z.string().nullable().optional(),
  "after_data": jsonSchema.nullable().optional(),
  "before_data": jsonSchema.nullable().optional(),
  "created_at": z.string().optional(),
  "entity_id": z.string().nullable().optional(),
  "entity_type": z.string(),
  "id": z.never().optional(),
  "ip_address": z.unknown().optional(),
  "user_agent": z.string().nullable().optional(),
}).strict();

export const AuditLogsUpdateSchema = z.object({
  "action": z.string().optional(),
  "actor_user_id": z.string().nullable().optional(),
  "after_data": jsonSchema.nullable().optional(),
  "before_data": jsonSchema.nullable().optional(),
  "created_at": z.string().optional(),
  "entity_id": z.string().nullable().optional(),
  "entity_type": z.string().optional(),
  "id": z.never().optional(),
  "ip_address": z.unknown().optional(),
  "user_agent": z.string().nullable().optional(),
}).strict();

