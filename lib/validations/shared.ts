import { z } from "zod";
import type { Json } from "@/types/supabase";

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonSchema),
    z.record(z.string(), z.union([jsonSchema, z.undefined()])),
  ]),
);
