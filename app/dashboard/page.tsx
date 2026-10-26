// app/dashboard/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Ticket,
  DollarSign,
  Users,
  ArrowRight,
  PlusCircle,
  Menu,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import Sidebar from "@/src/components/dashboard/Sidebar";

const salesData = [
  { day: "Lun", ventes: 45 },
  { day: "Mar", ventes: 62 },
  { day: "Mer", ventes: 38 },
  { day: "Jeu", ventes: 71 },
  { day: "Ven", ventes: 89 },
  { day: "Sam", ventes: 120 },
  { day: "Dim", ventes: 95 },
];

const revenueData = [
  { month: "Jan", revenus: 180000 },
  { month: "Fév", revenus: 210000 },
  { month: "Mar", revenus: 250000 },
  { month: "Avr", revenus: 320000 },
  { month: "Mai", revenus: 290000 },
  { month: "Juin", revenus: 410000 },
  { month: "Juil", revenus: 450000 },
  { month: "Août", revenus: 390000 },
];

const participantsData = [
  { event: "Concert Afro", participants: 342 },
  { event: "Atelier Cuisine", participants: 87 },
  { event: "Conférence Tech", participants: 210 },
  { event: "Festival Jazz", participants: 560 },
  { event: "Stand-up Comedy", participants: 180 },
];

const stats = [
  { label: "Événements", value: "12", icon: CalendarDays },
  { label: "Billets vendus", value: "850", icon: Ticket },
  { label: "Revenus", value: "2 500 000 FCFA", icon: DollarSign },
  { label: "Participants", value: "700", icon: Users },
];

const activity = [
  { title: "Nouvelle vente", detail: "Concert Afro • 15 billets", time: "2 min" },
  { title: "Nouvel événement", detail: "Soirée Stand-up créée", time: "1h" },
  { title: "Participant inscrit", detail: "Marie K. a rejoint Festival Jazz", time: "3h" },
];

export default function DashboardPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="hidden md:block"><Sidebar /></div>
      {mobileSidebarOpen && (
        <>
          <button type="button" aria-label="Fermer la navigation" onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden" />
          <div className="md:hidden"><Sidebar onClose={() => setMobileSidebarOpen(false)} /></div>
        </>
      )}

      <div className="min-w-0 md:ml-64">
        <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Ouvrir la navigation" onClick={() => setMobileSidebarOpen(true)} className="rounded-xl border border-slate-200 p-2 text-slate-600 md:hidden">
              <Menu size={19} />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Espace organisateur</p>
              <h1 className="text-xl font-bold text-slate-900">Tableau de bord</h1>
              <p className="hidden text-sm text-slate-500 sm:block">Résumé de votre activité</p>
            </div>
          </div>
          <Link
            href="/dashboard/events/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-3 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-[#1d4ed8] sm:px-4"
          >
            <PlusCircle size={16} /><span className="hidden sm:inline">Créer un événement</span><span className="sm:hidden">Créer</span>
          </Link>
        </header>

        <div className="mx-auto max-w-[1440px] space-y-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a8a] via-[#2563EB] to-[#4f46e5] p-6 text-white shadow-lg shadow-blue-900/10 sm:p-8">
            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/10" />
            <div className="absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-blue-50"><TrendingUp size={14} /> Votre activité en un coup d&apos;œil</span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Bonjour, prêt à faire vivre vos événements ?</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">Retrouvez vos indicateurs clés et gardez le fil de vos ventes depuis votre espace organisateur.</p>
            </div>
          </section>

          {/* Statistiques */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]"><stat.icon size={19} /></span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">Indicateur clé</span>
                </div>
                <p className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Graphiques */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-6">
              <div className="mb-4"><h2 className="font-semibold text-slate-900">Ventes par jour</h2><p className="mt-1 text-xs text-slate-500">Évolution des billets vendus cette semaine</p></div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid #f0f0f0" }}
                      formatter={(value) => [`${value} billets`, "Ventes"]}
                    />
                    <Bar dataKey="ventes" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-6">
              <div className="mb-4"><h2 className="font-semibold text-slate-900">Revenus (FCFA)</h2><p className="mt-1 text-xs text-slate-500">Revenus générés au fil des derniers mois</p></div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid #f0f0f0" }}
                      formatter={(value) => [`${Number(value ?? 0).toLocaleString()} FCFA`, "Revenus"]}
                    />
                    <Area type="monotone" dataKey="revenus" stroke="#2563EB" strokeWidth={2} fill="#2563EB" fillOpacity={0.08} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Participants + activité */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 lg:col-span-2 sm:p-6">
              <div className="mb-4"><h2 className="font-semibold text-slate-900">Participants par événement</h2><p className="mt-1 text-xs text-slate-500">Événements les plus suivis</p></div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={participantsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
                    <YAxis dataKey="event" type="category" stroke="#9ca3af" fontSize={12} width={110} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #f0f0f0" }} />
                    <Bar dataKey="participants" fill="#2563EB" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-6">
              <h2 className="font-semibold text-slate-900">Activité récente</h2>
              <div className="space-y-4">
                {activity.map((a) => (
                  <div key={a.title} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 text-sm last:border-0 last:pb-0">
                    <div className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#2563EB]" />
                      <div><p className="font-medium text-slate-800">{a.title}</p>
                      <p className="text-xs text-slate-500">{a.detail}</p></div>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{a.time}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/analytics" className="mt-5 flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline">
                Voir toute l&apos;activité <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Quick action */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div>
              <h3 className="font-semibold text-slate-900">Prêt à lancer votre prochain événement ?</h3>
              <p className="text-sm text-slate-500">Créez-le en quelques minutes et commencez à vendre des billets.</p>
            </div>
            <Link
              href="/dashboard/events/create"
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
            >
              <PlusCircle size={16} /> Nouvel événement
            </Link>
          </div>
        </div>

        <footer className="border-t border-slate-200 px-6 py-5 text-center text-xs text-slate-400">
          © 2026 Evenn. Tous droits réservés.
        </footer>
      </div>
    </main>
  );
}