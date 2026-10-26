import type { PaymentProvider } from "../types";
import { mockProvider } from "./mock";

const providers: Record<string, PaymentProvider> = {
  // Ajoute ici ton agrégateur : monAgregateur: monAgregateurProvider,
  ...(process.env.NODE_ENV !== "production" || process.env.ENABLE_MOCK_PROVIDER === "true"
    ? { mock: mockProvider }
    : {}),
};

export const getProvider = (name: string): PaymentProvider | undefined => providers[name];
