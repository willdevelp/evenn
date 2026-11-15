"use server";

import { pool } from "@/lib/db";
import { PLATFORM_COMMISSION_PERCENT } from "@/lib/commission";

/** Règle de commission appliquée à un module. */
export type FeeRule = {
  module: string;
  /** Commission en pourcentage (ex. 5 pour 5 %). */
  percent: number;
  fixedAmount: number;
  minFee: number | null;
  maxFee: number | null;
  paidBy: string;
  currency: string;
};

export async function getFeeRule(module: "ticket" | "vote" | "contribution" = "ticket"): Promise<FeeRule | null> {
  const { rows: settings } = await pool.query(
    `SELECT value FROM settings WHERE key = 'default_currency' LIMIT 1`,
  );
  const currency = settings[0] ? String(settings[0].value) : "XAF";

  if (module === "ticket" || module === "vote") {
    return {
      module,
      percent: PLATFORM_COMMISSION_PERCENT,
      fixedAmount: 0,
      minFee: null,
      maxFee: null,
      paidBy: "organizer",
      currency,
    };
  }

  const { rows: rules } = await pool.query(
    `SELECT module::text AS module, percent_bps, fixed_amount, min_fee, max_fee, paid_by::text AS paid_by
       FROM fee_rules
      WHERE module::text = $1
        AND organization_id IS NULL
        AND is_active = true
        AND valid_from <= now()
        AND (valid_until IS NULL OR valid_until > now())
      ORDER BY valid_from DESC
      LIMIT 1`,
    [module],
  );

  const rule = rules[0];
  if (!rule) return null;

  return {
    module: rule.module,
    percent: Number(rule.percent_bps) / 100,
    fixedAmount: Number(rule.fixed_amount),
    minFee: rule.min_fee === null ? null : Number(rule.min_fee),
    maxFee: rule.max_fee === null ? null : Number(rule.max_fee),
    paidBy: rule.paid_by,
    currency,
  };
}
