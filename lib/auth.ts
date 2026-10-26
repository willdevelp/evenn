import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin, phoneNumber } from "better-auth/plugins";
import { pool } from "./db";

/**
 * Mappage explicite des colonnes.
 *
 * Le schéma SQL n'utilise PAS la convention snake_case par défaut de Better Auth
 * (phone, role, country_code, email_verified, created_at...). On déclare donc
 * chaque champ avec son nom réel de colonne, sinon les requêtes échouent.
 *
 * Format : clé Better Auth -> nom de la colonne SQL.
 */
export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  // Les IDs sont des UUID (colonnes uuid du schéma SQL)
  advanced: {
    database: { generateId: "uuid" },
  },

  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,   // à activer quand l'envoi d'emails est prêt
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Table "user"
  user: {
    fields: {
      name: "name",
      email: "email",
      emailVerified: "emailVerified",
      image: "image",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    // Colonnes applicatives exposées dans la session
    additionalFields: {
      countryCode: {
        type: "string",
        required: false,
        defaultValue: "CM",
        input: true,
        fieldName: "countryCode",
      },
      locale: {
        type: "string",
        required: false,
        defaultValue: "fr",
        input: true,
        fieldName: "locale",
      },
      lastLoginAt: {
        type: "date",
        required: false,
        input: false,
        fieldName: "lastLoginAt",
      },
      deletedAt: {
        type: "date",
        required: false,
        input: false,
        fieldName: "deletedAt",
      },
    },
  },

  // Table "session"
  session: {
    fields: {
      expiresAt: "expiresAt",
      token: "token",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      ipAddress: "ipAddress",
      userAgent: "userAgent",
      userId: "userId",
      impersonatedBy: "impersonatedBy", // plugin admin
    },
  },

  /**
   * Table "account" : stocke le mot de passe haché et les jetons OAuth.
   * accessTokenExpiresAt / refreshTokenExpiresAt sont des timestamptz -> Date.
   */
  account: {
    fields: {
      accountId: "accountId",
      providerId: "providerId",
      userId: "userId",
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      idToken: "idToken",
      accessTokenExpiresAt: "accessTokenExpiresAt",
      refreshTokenExpiresAt: "refreshTokenExpiresAt",
      scope: "scope",
      password: "password",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },

  // Table "verification" (OTP, tokens de réinitialisation...)
  verification: {
    fields: {
      identifier: "identifier",
      value: "value",
      expiresAt: "expiresAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },

  plugins: [
    phoneNumber({
      otpLength: 6,
      sendOTP: async ({ phoneNumber, code }) => {
        // Branche ici ton fournisseur SMS/WhatsApp. Ne pas await : répondre vite.
        // void sms.send({ to: phoneNumber, body: `Votre code : ${code}` });
        if (process.env.NODE_ENV !== "production") {
          console.info(`[Better Auth] OTP ${phoneNumber} -> ${code}`);
        }
      },
      // Inscription directe par téléphone (l'email est obligatoire dans Better Auth)
      signUpOnVerification: {
        getTempEmail: (phone) => `${phone.replace("+", "")}@phone.invalid`,
        getTempName: (phone) => phone,
      },
      // Table "user" : "phone" -> "phoneNumber", "phone_number_verified" -> "phoneNumberVerified"
      schema: {
        user: {
          fields: {
            phoneNumber: "phoneNumber",
            phoneNumberVerified: "phoneNumberVerified",
          },
        },
      },
    }),
    admin({
      // Table "user" : "role" et "banned" sont des ENUM SQL
      schema: {
        user: {
          fields: {
            role: "role",
            banned: "banned",
            banReason: "banReason",
            banExpires: "banExpires",
          },
        },
      },
    }), // rôle plateforme : user | admin, bannissement, impersonation
    nextCookies(), // toujours en dernier
  ],
});

export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session;
