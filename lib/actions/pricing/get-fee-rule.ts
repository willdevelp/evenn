"use server";

import { pool } from "@/lib/db";

/** Règle de commission active pour un module (global : organization_id NULL). */
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
  const [{ rows: rules }, { rows: settings }] = await Promise.all([
    pool.query(
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
    ),
    pool.query(`SELECT value FROM settings WHERE key = 'default_currency' LIMIT 1`),
  ]);

  const rule = rules[0];
  if (!rule) return null;

  return {
    module: rule.module,
    percent: Number(rule.percent_bps) / 100,
    fixedAmount: Number(rule.fixed_amount),
    minFee: rule.min_fee === null ? null : Number(rule.min_fee),
    maxFee: rule.max_fee === null ? null : Number(rule.max_fee),
    paidBy: rule.paid_by,
    currency: settings[0] ? String(settings[0].value) : "XAF",
  };
}
