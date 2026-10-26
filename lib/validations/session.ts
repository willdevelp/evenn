import { z } from "zod";

export const SessionInsertSchema = z.object({
  "createdAt": z.string().optional(),
  "expiresAt": z.string(),
  "id": z.string().optional(),
  "impersonatedBy": z.string().nullable().optional(),
  "ipAddress": z.string().nullable().optional(),
  "token": z.string(),
  "updatedAt": z.string().optional(),
  "userAgent": z.string().nullable().optional(),
  "userId": z.string(),
}).strict();

export const SessionUpdateSchema = z.object({
  "createdAt": z.string().optional(),
  "expiresAt": z.string().optional(),
  "id": z.string().optional(),
  "impersonatedBy": z.string().nullable().optional(),
  "ipAddress": z.string().nullable().optional(),
  "token": z.string().optional(),
  "updatedAt": z.string().optional(),
  "userAgent": z.string().nullable().optional(),
  "userId": z.string().optional(),
}).strict();

