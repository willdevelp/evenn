"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, Scan, Ticket, TrendingUp, Users, Wallet } from "lucide-react";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import type { AnalyticsData } from "@/lib/actions/dashboard/get-dashboard-data";

const COLORS = ["#2563EB", "#0EA5E9", "#93C5FD", "#6366F1", "#38BDF8", "#A5B4FC"];

const dayLabel = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(date);
};

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const formatCurrency = (value: number) => `${value.toLocaleString("fr-FR")} ${data.currency}`;
  const fillRate = data.capacity > 0 ? Math.round((data.ticketsSold / data.capacity) * 100) : 0;

  const salesData = data.dailySales.map((item) => ({
    day: dayLabel(item.date),
    ventes: item.sales,
  }));

  const ticketTypes = data.ticketTypes.filter((item) => item.sold > 0);

  const metrics = [
    { label: "Billets vendus", value: data.ticketsSold.toLocaleString("fr-FR"), icon: Ticket },
    { label: "Revenus", value: formatCurrency(data.revenue), icon: Wallet },
    { label: "Participants", value: data.participants.toLocaleString("fr-FR"), icon: Users },
    { label: "Scans enregistrés", value: data.scans.toLocaleString("fr-FR"), icon: Scan },
  ];

  return (
    <DashboardShell
      title="Analytics"
      description="Performance réelle de vos événements et de vos ventes."
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-900">Remplissage global</h2>
            <p className="mt-1 text-sm text-slate-500">
              {data.ticketsSold.toLocaleString("fr-FR")} billets vendus sur{" "}
              {data.capacity.toLocaleString("fr-FR")} places.
            </p>
          </div>
          <span className="text-2xl font-bold text-slate-900">{fillRate} %</span>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-600"
            style={{ width: `${Math.min(fillRate, 100)}%` }}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">Ventes des 7 derniers jours</h2>
            <p className="mt-1 text-sm text-slate-500">Billets payés par jour.</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
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
                contentStyle={{ border: "1px solid #E2E8F0", borderRadius: 8 }}
                formatter={(value) => [`${value} billet(s)`, "Ventes"]}
              />
              <Area
                type="monotone"
                dataKey="ventes"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#analyticsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">Répartition par formule</h2>
            <p className="mt-1 text-sm text-slate-500">Billets vendus par type de billet.</p>
          </div>

          {ticketTypes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-12 text-center">
              <Ticket className="mx-auto size-6 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">Aucune vente</p>
              <p className="mt-1 text-xs text-slate-500">
                La répartition apparaîtra après les premières ventes.
              </p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={ticketTypes}
                    dataKey="sold"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {ticketTypes.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ border: "1px solid #E2E8F0", borderRadius: 8 }}
                    formatter={(value) => [`${value} billet(s)`, "Vendus"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-2 space-y-2">
                {ticketTypes.map((entry, index) => (
                  <li key={entry.name} className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2 text-slate-600">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate">{entry.name}</span>
                    </span>
                    <span className="font-medium text-slate-800">{entry.sold}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5">
          <div>
            <h2 className="font-semibold text-slate-900">Événements les plus performants</h2>
            <p className="mt-1 text-sm text-slate-500">Classement par billets vendus.</p>
          </div>
          <TrendingUp className="size-5 shrink-0 text-brand-600" />
        </div>

        {data.topEvents.length === 0 ? (
          <div className="p-5">
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-12 text-center">
              <Ticket className="mx-auto size-6 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">Aucun événement</p>
              <p className="mt-1 text-xs text-slate-500">
                Créez un événement pour suivre ses performances.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Événement</th>
                  <th className="px-5 py-3">Vendus</th>
                  <th className="px-5 py-3">Remplissage</th>
                  <th className="px-5 py-3">Revenus</th>
                  <th className="px-5 py-3 text-right">Détail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.topEvents.map((event) => {
                  const rate =
                    event.capacity > 0 ? Math.round((event.sold / event.capacity) * 100) : 0;
                  return (
                    <tr key={event.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4 font-medium text-slate-800">{event.title}</td>
                      <td className="px-5 py-4 text-slate-600">
                        {event.sold} / {event.capacity}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-brand-600"
                              style={{ width: `${Math.min(rate, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">{rate} %</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {formatCurrency(event.revenue)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/dashboard/events/${event.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
                        >
                          Voir <ArrowRight className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
