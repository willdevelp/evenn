export type NormalizedWebhook = {
  eventId: string;            // identifiant unique de l'événement chez le fournisseur (sert à l'idempotence)
  eventType: string;
  providerReference: string;  // référence de la transaction chez le fournisseur
  status: "succeeded" | "failed" | "pending";
  amount?: number;            // montant confirmé par le fournisseur (XAF)
  failureReason?: string;
  raw: unknown;
};

export interface PaymentProvider {
  name: string;
  /** Vérifie la signature du webhook puis normalise son contenu. */
  verifyAndParse(rawBody: string, headers: Headers): { valid: boolean; event?: NormalizedWebhook };
}
