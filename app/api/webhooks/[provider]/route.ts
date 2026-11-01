import { processWebhook } from "@/lib/payments/webhook";

/**
 * Point d'entrée des notifications de paiement.
 *
 * La signature est vérifiée par le fournisseur avant toute écriture, le montant
 * confirmé est comparé au montant attendu, puis la commande est livrée dans une
 * seule transaction. Les votes ne sont donc crédités qu'après un paiement
 * authentifié et du montant exact.
 *
 * Exemple : POST /api/webhooks/mock
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  const rawBody = await request.text();
  const result = await processWebhook(provider, rawBody, request.headers);

  return Response.json(result.body, { status: result.status });
}
