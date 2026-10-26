import { z } from "zod";

export const SiteDomainsInsertSchema = z.object({
  "created_at": z.string().optional(),
  "domain": z.string(),
  "id": z.string().optional(),
  "site_id": z.string(),
  "ssl_status": z.string().optional(),
  "verification_token": z.string().optional(),
  "verified_at": z.string().nullable().optional(),
}).strict();

export const SiteDomainsUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "domain": z.string().optional(),
  "id": z.string().optional(),
  "site_id": z.string().optional(),
  "ssl_status": z.string().optional(),
  "verification_token": z.string().optional(),
  "verified_at": z.string().nullable().optional(),
}).strict();

