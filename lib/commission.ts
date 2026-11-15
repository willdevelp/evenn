export const PLATFORM_COMMISSION_PERCENT = 10;

export function calculatePlatformCommission(subtotal: number): number {
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new Error("Montant de commande invalide.");
  }

  return Math.round((subtotal * PLATFORM_COMMISSION_PERCENT) / 100);
}
