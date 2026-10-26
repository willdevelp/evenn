import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentProvider } from "../types";

/**
 * Fournisseur factice pour le développement et les tests.
 * Signature attendue : en-tête "x-signature" = HMAC-SHA256 hex du corps brut.
 * Pour brancher ton vrai agrégateur, copie ce fichier et suis SA documentation de signature.
 */
export const mockProvider: PaymentProvider = {
  name: "mock",
  verifyAndParse(rawBody, headers) {
    const secret = process.env.MOCK_WEBHOOK_SECRET ?? "";
    const given = headers.get("x-signature") ?? "";
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
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
