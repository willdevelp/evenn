import { z } from "zod";

export const UserInsertSchema = z.object({
  "banExpires": z.string().nullable().optional(),
  "banned": z.boolean().optional(),
  "banReason": z.string().nullable().optional(),
  "countryCode": z.string().optional(),
  "createdAt": z.string().optional(),
  "deletedAt": z.string().nullable().optional(),
  "email": z.string(),
  "emailVerified": z.boolean().optional(),
  "id": z.string().optional(),
  "image": z.string().nullable().optional(),
  "lastLoginAt": z.string().nullable().optional(),
  "locale": z.string().optional(),
  "name": z.string(),
  "phoneNumber": z.string().nullable().optional(),
  "phoneNumberVerified": z.boolean().optional(),
  "role": z.string().optional(),
  "updatedAt": z.string().optional(),
}).strict();

export const UserUpdateSchema = z.object({
  "banExpires": z.string().nullable().optional(),
  "banned": z.boolean().optional(),
  "banReason": z.string().nullable().optional(),
  "countryCode": z.string().optional(),
  "createdAt": z.string().optional(),
  "deletedAt": z.string().nullable().optional(),
  "email": z.string().optional(),
  "emailVerified": z.boolean().optional(),
  "id": z.string().optional(),
  "image": z.string().nullable().optional(),
  "lastLoginAt": z.string().nullable().optional(),
  "locale": z.string().optional(),
  "name": z.string().optional(),
  "phoneNumber": z.string().nullable().optional(),
  "phoneNumberVerified": z.boolean().optional(),
  "role": z.string().optional(),
  "updatedAt": z.string().optional(),
}).strict();

