import { z } from "zod";

export const MediaAssetsInsertSchema = z.object({
  "created_at": z.string().optional(),
  "height": z.number().nullable().optional(),
  "id": z.string().optional(),
  "mime_type": z.string(),
  "organization_id": z.string().nullable().optional(),
  "size_bytes": z.number(),
  "storage_key": z.string(),
  "uploaded_by": z.string().nullable().optional(),
  "url": z.string(),
  "width": z.number().nullable().optional(),
}).strict();

export const MediaAssetsUpdateSchema = z.object({
  "created_at": z.string().optional(),
  "height": z.number().nullable().optional(),
  "id": z.string().optional(),
  "mime_type": z.string().optional(),
  "organization_id": z.string().nullable().optional(),
  "size_bytes": z.number().optional(),
  "storage_key": z.string().optional(),
  "uploaded_by": z.string().nullable().optional(),
  "url": z.string().optional(),
  "width": z.number().nullable().optional(),
}).strict();

