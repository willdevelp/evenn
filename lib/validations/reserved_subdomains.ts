import { z } from "zod";

export const ReservedSubdomainsInsertSchema = z.object({
  "name": z.string(),
}).strict();

export const ReservedSubdomainsUpdateSchema = z.object({
  "name": z.string().optional(),
}).strict();

