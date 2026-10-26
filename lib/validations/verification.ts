import { z } from "zod";

export const VerificationInsertSchema = z.object({
  "createdAt": z.string().optional(),
  "expiresAt": z.string(),
  "id": z.string().optional(),
  "identifier": z.string(),
  "updatedAt": z.string().optional(),
  "value": z.string(),
}).strict();

export const VerificationUpdateSchema = z.object({
  "createdAt": z.string().optional(),
  "expiresAt": z.string().optional(),
  "id": z.string().optional(),
  "identifier": z.string().optional(),
  "updatedAt": z.string().optional(),
  "value": z.string().optional(),
}).strict();

