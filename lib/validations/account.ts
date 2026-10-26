import { z } from "zod";

export const AccountInsertSchema = z.object({
  "accessToken": z.string().nullable().optional(),
  "accessTokenExpiresAt": z.string().nullable().optional(),
  "accountId": z.string(),
  "createdAt": z.string().optional(),
  "id": z.string().optional(),
  "idToken": z.string().nullable().optional(),
  "password": z.string().nullable().optional(),
  "providerId": z.string(),
  "refreshToken": z.string().nullable().optional(),
  "refreshTokenExpiresAt": z.string().nullable().optional(),
  "scope": z.string().nullable().optional(),
  "updatedAt": z.string().optional(),
  "userId": z.string(),
}).strict();

export const AccountUpdateSchema = z.object({
  "accessToken": z.string().nullable().optional(),
  "accessTokenExpiresAt": z.string().nullable().optional(),
  "accountId": z.string().optional(),
  "createdAt": z.string().optional(),
  "id": z.string().optional(),
  "idToken": z.string().nullable().optional(),
  "password": z.string().nullable().optional(),
  "providerId": z.string().optional(),
  "refreshToken": z.string().nullable().optional(),
  "refreshTokenExpiresAt": z.string().nullable().optional(),
  "scope": z.string().nullable().optional(),
  "updatedAt": z.string().optional(),
  "userId": z.string().optional(),
}).strict();

