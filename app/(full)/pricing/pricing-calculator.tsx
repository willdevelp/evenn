"use client";

import { useMemo, useState } from "react";
import { BadgeCheck } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Container } from "@/src/components/ui/container";

export default function PricingCalculator({
  percent,
  fixedAmount,
  minFee,
  maxFee,
  currency,
}: {
  percent: number;
  fixedAmount: number;
  minFee: number | null;
  maxFee: number | null;
  currency: string;
}) {
  const [price, setPrice] = useState(2500);
  const [quantity, setQuantity] = useState(100);

  const { gmv, commission, net } = useMemo(() => {
    const gmvValue = price * quantity;
    let commissionValue = gmvValue * (percent / 100) + fixedAmount;
    if (minFee !== null) commissionValue = Math.max(commissionValue, minFee);
    if (maxFee !== null) commissionValue = Math.min(commissionValue, maxFee);
    commissionValue = Math.round(commissionValue);
    return { gmv: gmvValue, commission: commissionValue, net: gmvValue - commissionValue };
  }, [price, quantity, percent, fixedAmount, minFee, maxFee]);

  const format = (value: number) =>
    `${value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} ${currency}`;

  return (
    <Container className="max-w-5xl py-12 sm:py-16">
      <div className="mb-12 text-center">
        <h2 className="mx-auto max-w-2xl text-balance text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Simulez vos revenus
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Estimation calculée avec la règle de commission réellement appliquée à la
          billetterie.
        </p>
      </div>

      <div className="grid overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card md:grid-cols-2">
        <div className="space-y-8 p-8 sm:p-10">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label htmlFor="ticket-price" className="text-sm font-medium text-slate-700">
                Prix du billet
              </label>
              <Badge variant="soft" className="rounded-lg px-2.5 py-1 font-bold">
                {format(price)}
              </Badge>
            </div>
            <input
              id="ticket-price"
              type="range"
              min={500}
              max={20000}
              step={100}
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-brand-600"
            />
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label htmlFor="ticket-qty" className="text-sm font-medium text-slate-700">
                Billets vendus
              </label>
              <Badge variant="soft" className="rounded-lg px-2.5 py-1 font-bold">
                {quantity.toLocaleString("fr-FR")}
              </Badge>
            </div>
            <input
              id="ticket-qty"
              type="range"
              min={10}
              max={2000}
              step={10}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-brand-600"
            />
          </div>
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <BadgeCheck aria-hidden className="size-3.5 text-brand-500" />
            Taux appliqué : {percent.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %
            {fixedAmount > 0 && ` + ${format(fixedAmount)} par commande`}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-5 bg-brand-600 p-8 text-white sm:p-10">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-brand-100">Volume de billetterie</span>
            <span className="text-right font-semibold">{format(gmv)}</span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-brand-100">Commission Evenn</span>
            <span className="text-right font-semibold">- {format(commission)}</span>
          </div>
          <div className="border-t border-dashed border-white/30 pt-5">
            <p className="text-sm font-medium text-brand-100">Vous touchez</p>
            <p
              className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl"
              aria-live="polite"
            >
              {net.toLocaleString("fr-FR")}{" "}
              <span className="text-lg font-bold text-brand-100">{currency}</span>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
