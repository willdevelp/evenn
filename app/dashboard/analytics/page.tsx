"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Ticket, TrendingUp, Users } from "lucide-react";
import { Menu } from "lucide-react";
import Sidebar from "@/src/components/dashboard/Sidebar";

const dailySales = [
  { day: "Lun", sales: 45 }, { day: "Mar", sales: 52 }, { day: "Mer", sales: 38 },
  { day: "Jeu", sales: 67 }, { day: "Ven", sales: 89 }, { day: "Sam", sales: 112 },
  { day: "Dim", sales: 78 },
];

const ticketTypes = [
  { name: "Standard", value: 45, color: "#2563EB" },
  { name: "VIP", value: 35, color: "#0EA5E9" },
  { name: "Étudiant", value: 20, color: "#93C5FD" },
];

const topEvents = [
  { name: "Concert de Jazz", sales: 285, revenue: 7125, rate: 94 },
  { name: "Festival de la Bière", sales: 218, revenue: 5450, rate: 82 },
  { name: "Conférence Tech", sales: 164, revenue: 7380, rate: 76 },
  { name: "Soirée DJ", sales: 128, revenue: 2560, rate: 68 },
];

const tooltipStyle = { border: "1px solid #E2E8F0", borderRadius: 8, backgroundColor: "#FFFFFF" };

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 400);
    return () => window.clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="space-y-4 animate-pulse"><div className="h-8 w-48 rounded bg-slate-200" /><div className="h-80 rounded-lg bg-slate-200" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {mobileSidebarOpen && (
        <>
          <button
            type="button"
            aria-label="Fermer la navigation"
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/30 md:hidden"
          />
          <div className="md:hidden">
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </>
      )}

      <main className="min-w-0 space-y-8 pb-8 md:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Ouvrir la navigation"
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 md:flex-none">
            <p className="text-sm font-medium text-[#2563EB]">Vue d’ensemble</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Analytics</h1>
            <p className="mt-1 hidden text-sm text-slate-500 sm:block">Suivez les ventes et la performance de vos événements.</p>
          </div>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#2563EB]">
            <option>7 derniers jours</option><option>30 derniers jours</option><option>Cette année</option>
          </select>
        </header>

        <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Ticket} label="Billets vendus" value="1 532" detail="+8,3 % ce mois" />
        <MetricCard icon={TrendingUp} label="Chiffre d’affaires" value="28 450 €" detail="+18,7 % ce mois" />
        <MetricCard icon={Users} label="Visiteurs" value="4 820" detail="3 612 visiteurs uniques" />
        <MetricCard icon={BarChart3} label="Taux de conversion" value="31,8 %" detail="+4,2 points ce mois" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Panel title="Ventes par jour" description="Billets vendus sur les 7 derniers jours">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySales} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} billets`, "Ventes"]} />
              <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: "#2563EB", strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Ventes par type de billet" description="Répartition des billets vendus">
          <div className="relative h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ticketTypes} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={3}>
                  {ticketTypes.map((ticket) => <Cell key={ticket.name} fill={ticket.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} %`, "Part"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-bold text-slate-900">1 532</span><span className="text-xs text-slate-500">billets</span></div>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
            {ticketTypes.map((ticket) => <div key={ticket.name} className="text-center"><span className="mx-auto mb-1 block h-2 w-2 rounded-full" style={{ backgroundColor: ticket.color }} /><p className="text-xs text-slate-500">{ticket.name}</p><p className="text-sm font-semibold text-slate-800">{ticket.value}%</p></div>)}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Événements les plus performants" description="Classés par billets vendus">
          <div className="space-y-5">
            {topEvents.map((event, index) => <div key={event.name} className="grid grid-cols-[24px_1fr_auto] items-center gap-3"><span className="text-sm font-semibold text-slate-400">0{index + 1}</span><div className="min-w-0"><div className="flex justify-between gap-3 text-sm"><span className="truncate font-semibold text-slate-800">{event.name}</span><span className="whitespace-nowrap text-slate-500">{event.sales} billets</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${event.rate}%` }} /></div></div><span className="text-right text-sm font-semibold text-slate-800">{event.revenue.toLocaleString("fr-FR")} €</span></div>)}
          </div>
        </Panel>

        <Panel title="Taux de conversion" description="Du visiteur à l’achat">
          <div className="flex items-center gap-6"><div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full border-[14px] border-[#2563EB]/15 border-t-[#2563EB]"><span className="text-2xl font-bold text-slate-900">31,8%</span></div><div className="space-y-4 text-sm"><div><p className="text-slate-500">Visites de page</p><p className="font-semibold text-slate-900">4 820</p></div><div><p className="text-slate-500">Achats confirmés</p><p className="font-semibold text-slate-900">1 532</p></div></div></div>
          <p className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-600">Votre conversion progresse de <span className="font-semibold text-[#2563EB]">4,2 points</span> par rapport à la période précédente.</p>
        </Panel>
      </section>

      <Panel title="Revenus par événement" description="Comparaison du chiffre d’affaires généré">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topEvents} layout="vertical" margin={{ top: 0, right: 15, left: 15, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} /><XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} tickFormatter={(value) => `${value / 1000}k`} /><YAxis type="category" dataKey="name" width={125} axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 12 }} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} €`, "Revenus"]} /><Bar dataKey="revenue" fill="#0EA5E9" radius={[0, 4, 4, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
        </div>
      </main>
    </div>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5"><div className="mb-5"><h2 className="font-semibold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div>{children}</div>;
}

function MetricCard({ icon: Icon, label, value, detail }: { icon: React.ElementType; label: string; value: string; detail: string }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></div><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]"><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-xs text-slate-500">{detail}</p></div>;
}
