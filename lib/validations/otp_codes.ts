import { z } from "zod";
import { MessageChannelSchema } from "./enums";

export const OtpCodesInsertSchema = z.object({
  "attempts": z.number().optional(),
  "channel": MessageChannelSchema,
  "code_hash": z.string(),
  "consumed_at": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "destination": z.string(),
  "expires_at": z.string(),
  "id": z.string().optional(),
  "purpose": z.string(),
  "user_id": z.string().nullable().optional(),
}).strict();

export const OtpCodesUpdateSchema = z.object({
  "attempts": z.number().optional(),
  "channel": MessageChannelSchema.optional(),
  "code_hash": z.string().optional(),
  "consumed_at": z.string().nullable().optional(),
  "created_at": z.string().optional(),
  "destination": z.string().optional(),
  "expires_at": z.string().optional(),
  "id": z.string().optional(),
  "purpose": z.string().optional(),
  "user_id": z.string().nullable().optional(),
}).strict();

