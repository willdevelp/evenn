import { z } from "zod";
import { MessageChannelSchema, MessageStatusSchema } from "./enums";

export const MessageLogsInsertSchema = z.object({
  "channel": MessageChannelSchema,
  "created_at": z.string().optional(),
  "error": z.string().nullable().optional(),
  "guest_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "order_id": z.string().nullable().optional(),
  "provider_message_id": z.string().nullable().optional(),
  "sent_at": z.string().nullable().optional(),
  "status": MessageStatusSchema.optional(),
  "template": z.string(),
  "to_address": z.string(),
  "user_id": z.string().nullable().optional(),
}).strict();

export const MessageLogsUpdateSchema = z.object({
  "channel": MessageChannelSchema.optional(),
  "created_at": z.string().optional(),
  "error": z.string().nullable().optional(),
  "guest_id": z.string().nullable().optional(),
  "id": z.string().optional(),
  "order_id": z.string().nullable().optional(),
  "provider_message_id": z.string().nullable().optional(),
  "sent_at": z.string().nullable().optional(),
  "status": MessageStatusSchema.optional(),
  "template": z.string().optional(),
  "to_address": z.string().optional(),
  "user_id": z.string().nullable().optional(),
}).strict();

