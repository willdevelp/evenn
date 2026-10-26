import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  phoneNumberClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "./auth";

/**
 * Client d'authentification partagé (navigateur).
 * - `inferAdditionalFields<typeof auth>()` récupère les champs
 *   supplémentaires déclarés côté serveur (countryCode, locale...) pour que
 *   `signUp.email` / `updateUser` soient typés correctement.
 * - Les plugins doivent refléter la configuration serveur (lib/auth.ts).
 */
export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    phoneNumberClient(),
    adminClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
