import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

/**
 * Point d'entrée HTTP de Better Auth (App Router).
 *
 * Toutes les routes `/api/auth/*` (get-session, sign-in/email, sign-up/email,
 * phone-number/*, callback Google, etc.) sont servies par ce handler. Sans ce
 * fichier, le client (`@/lib/auth-client`) reçoit un 404 et la session n'est
 * jamais récupérée.
 */
export const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler(auth);
