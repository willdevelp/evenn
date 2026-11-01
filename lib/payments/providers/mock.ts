import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentProvider } from "../types";

/**
 * Secret utilisé pour signer les webhooks du fournisseur factice.
 * En production, `MOCK_WEBHOOK_SECRET` doit être défini (et le fournisseur mock
 * désactivé). En développement, une valeur par défaut permet de tester le flux
 * complet sans configuration supplémentaire.
 */
export const getMockWebhookSecret = () =>
  process.env.MOCK_WEBHOOK_SECRET ??
  (process.env.NODE_ENV !== "production" ? "evenn-dev-mock-webhook-secret" : "");

/** Signature HMAC-SHA256 (hex) d'un corps de webhook mock. */
export const signMockWebhook = (rawBody: string) =>
  createHmac("sha256", getMockWebhookSecret()).update(rawBody).digest("hex");

/**
 * Fournisseur factice pour le développement et les tests.
 * Signature attendue : en-tête "x-signature" = HMAC-SHA256 hex du corps brut.
 * Pour brancher ton vrai agrégateur, copie ce fichier et suis SA documentation de signature.
 */
export const mockProvider: PaymentProvider = {
  name: "mock",
  verifyAndParse(rawBody, headers) {
    const secret = getMockWebhookSecret();
    const given = headers.get("x-signature") ?? "";
    const expected = signMockWebhook(rawBody);
    const a = Buffer.from(given);
    const b = Buffer.from(expected);
    if (!secret || a.length !== b.length || !timingSafeEqual(a, b)) return { valid: false };

    const body = JSON.parse(rawBody) as {
      id: string; type: string; reference: string; status: "succeeded" | "failed" | "pending"; amount?: number; reason?: string;
    };
    return {
      valid: true,
      event: {
        eventId: body.id,
        eventType: body.type,
        providerReference: body.reference,
        status: body.status,
        amount: body.amount,
        failureReason: body.reason,
        raw: body,
      },
    };
  },
};
