"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Session courante (validée en base) pour une Server Action.
 * Pour les Server Components, préférer `getSession` de "@/lib/session" (mis en cache).
 */
export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}
