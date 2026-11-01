"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  CalendarDays,
  PlusCircle,
  Scan,
  Ticket,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import type { DashboardOverview } from "@/lib/actions/dashboard/get-dashboard-data";

const tooltipStyle = {
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  backgroundColor: "#FFFFFF",
};

const orderStatusLabels: Record<string, string> = {
  paid: "Payée",
  pending: "En attente",
  failed: "Échouée",
  cancelled: "Annulée",
  expired: "Expirée",
  refunded: "Remboursée",
  partially_refunded: "Part. remboursée",
};

const orderStatusStyles: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
  expired: "bg-slate-100 text-slate-600",
  refunded: "bg-violet-50 text-violet-700",
  partially_refunded: "bg-violet-50 text-violet-700",
};

const dayLabel = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(date);
};

const monthLabel = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(date);
};

export default function DashboardOverviewClient({ data }: { data: DashboardOverview }) {
  const formatCurrency = (value: number) => `${value.toLocaleString("fr-FR")} ${data.currency}`;
  const soldRate = data.capacity > 0 ? Math.round((data.ticketsSold / data.capacity) * 100) : 0;
  const scanRate = data.ticketsSold > 0 ? Math.round((data.checkedIn / data.ticketsSold) * 100) : 0;

  const metrics = [
    { label: "Billets vendus", value: data.ticketsSold.toLocaleString("fr-FR"), icon: Ticket },
    { label: "Revenus", value: formatCurrency(data.revenue), icon: Wallet },
    { label: "Participants", value: data.tickets.toLocaleString("fr-FR"), icon: Users },
    { label: "Entrées scannées", value: data.scans.toLocaleString("fr-FR"), icon: Scan },
  ];

  const salesData = data.salesSeries.map((item) => ({
    day: dayLabel(item.date),
    ventes: item.sales,
  }));

  const revenueData = data.revenueSeries.map((item) => ({
    month: monthLabel(item.month),
    revenus: item.revenue,
  }));

  return (
    <DashboardShell
      title="Vue d’ensemble"
      description={`Activité de ${data.organizationName}.`}
      action={
        <Link
          href="/dashboard/events/create"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <PlusCircle size={16} /> Créer un événement
        </Link>
      }
    >
      {/* Indicateurs */}
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

      {/* Remplissage */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-800">Remplissage global</span>
            <span className="text-slate-500">
              {data.ticketsSold.toLocaleString("fr-FR")} / {data.capacity.toLocaleString("fr-FR")}
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-600"
              style={{ width: `${Math.min(soldRate, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">{soldRate} % des places vendues</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-800">Contrôle d’accès</span>
            <span className="text-slate-500">
              {data.checkedIn.toLocaleString("fr-FR")} entrées validées
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Math.min(scanRate, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">{scanRate} % des billets scannés</p>
        </div>
      </section>

      {/* Graphiques */}
      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">Ventes des 7 derniers jours</h2>
            <p className="mt-1 text-sm text-slate-500">Billets réellement payés par jour.</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value} billet(s)`, "Ventes"]}
              />
              <Area
                type="monotone"
                dataKey="ventes"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#salesFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">Revenus des 6 derniers mois</h2>
            <p className="mt-1 text-sm text-slate-500">Montants encaissés, en {data.currency}.</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickFormatter={(value) => `${Number(value) / 1000}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [formatCurrency(Number(value)), "Revenus"]}
              />
              <Bar dataKey="revenus" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Événements + commandes */}
      <section className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">Événements les plus performants</h2>
              <p className="mt-1 text-sm text-slate-500">Classés par billets vendus.</p>
            </div>
            <TrendingUp className="size-5 shrink-0 text-brand-600" />
          </div>

          {data.topEvents.length === 0 ? (
            <EmptyBlock
              icon={CalendarDays}
              title="Aucun événement"
              text="Créez votre premier événement pour suivre ses ventes."
            />
          ) : (
            <div className="space-y-5">
              {data.topEvents.map((event, index) => {
                const rate =
                  event.capacity > 0 ? Math.round((event.sold / event.capacity) * 100) : 0;
                return (
                  <div key={event.id} className="grid grid-cols-[24px_1fr_auto] items-center gap-3">
                    <span className="text-sm font-semibold text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex justify-between gap-3 text-sm">
                        <Link
                          href={`/dashboard/events/${event.id}`}
                          className="truncate font-semibold text-slate-800 hover:text-brand-600"
                        >
                          {event.title}
                        </Link>
                        <span className="whitespace-nowrap text-slate-500">
                          {event.sold} vendu(s)
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-brand-600"
                          style={{ width: `${Math.min(rate, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-right text-sm font-semibold text-slate-800">
                      {formatCurrency(event.revenue)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5">
            <div>
              <h2 className="font-semibold text-slate-900">Dernières commandes</h2>
              <p className="mt-1 text-sm text-slate-500">Commandes de billets récentes.</p>
            </div>
            <Link
              href="/dashboard/reservations"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Tout voir <ArrowRight className="size-4" />
            </Link>
          </div>

          {data.recentOrders.length === 0 ? (
            <div className="p-5">
              <EmptyBlock
                icon={Ticket}
                title="Aucune commande"
                text="Les ventes de billets apparaîtront ici."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/80">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3">Commande</th>
                    <th className="px-5 py-3">Acheteur</th>
                    <th className="px-5 py-3">Montant</th>
                    <th className="px-5 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-800">{order.orderNumber}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {order.eventTitle}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{order.buyerName}</td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            orderStatusStyles[order.status] ?? "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {orderStatusLabels[order.status] ?? order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}

function EmptyBlock({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-10 text-center">
      <Icon className="mx-auto size-6 text-slate-400" />
      <p className="mt-3 text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{text}</p>
    </div>
  );
}
