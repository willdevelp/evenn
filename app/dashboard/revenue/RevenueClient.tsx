"use client";

import { Banknote, Clock, Receipt, Wallet } from "lucide-react";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import type { RevenueOverview } from "@/lib/actions/dashboard/get-dashboard-data";

const statusLabels: Record<string, string> = {
  paid: "Payée",
  pending: "En attente",
  failed: "Échouée",
  cancelled: "Annulée",
  expired: "Expirée",
  refunded: "Remboursée",
  partially_refunded: "Part. remboursée",
};

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
  expired: "bg-slate-100 text-slate-600",
  refunded: "bg-violet-50 text-violet-700",
  partially_refunded: "bg-violet-50 text-violet-700",
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function RevenueClient({ data }: { data: RevenueOverview }) {
  const formatCurrency = (value: number) => `${value.toLocaleString("fr-FR")} ${data.currency}`;

  const metrics = [
    { label: "Solde disponible", value: formatCurrency(data.balance), icon: Wallet },
    { label: "Encaissé", value: formatCurrency(data.totalPaid), icon: Banknote },
    { label: "Commission plateforme", value: formatCurrency(data.totalCommission), icon: Receipt },
    { label: "En attente", value: formatCurrency(data.pendingAmount), icon: Clock },
  ];

  return (
    <DashboardShell
      title="Revenus"
      description="Suivi des encaissements et des commissions de votre organisation."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900">
                  {value}
                </p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="size-5" />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="border-b border-slate-100 px-5 py-5">
          <h2 className="font-semibold text-slate-900">Transactions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Commandes de billets rattachées à votre organisation.
          </p>
        </div>

        {data.transactions.length === 0 ? (
          <div className="p-5">
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-12 text-center">
              <Receipt className="mx-auto size-6 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">Aucune transaction</p>
              <p className="mt-1 text-xs text-slate-500">
                Les paiements de billets apparaîtront ici.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Commande</th>
                  <th className="px-5 py-3">Acheteur</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Montant</th>
                  <th className="px-5 py-3">Commission</th>
                  <th className="px-5 py-3">Net</th>
                  <th className="px-5 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{transaction.orderNumber}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {transaction.eventTitle}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{transaction.buyerName}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatCurrency(transaction.commission)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                      {formatCurrency(transaction.net)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[transaction.status] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {statusLabels[transaction.status] ?? transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
