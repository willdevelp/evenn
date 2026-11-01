"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, QrCode, Search } from "lucide-react";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import type { ScanHistoryRow } from "@/lib/actions/dashboard/get-dashboard-data";

const resultLabels: Record<string, string> = {
  valid: "Valide",
  already_used: "Déjà utilisé",
  invalid: "Invalide",
  wrong_event: "Mauvais événement",
  cancelled: "Annulé",
  expired: "Expiré",
};

const resultStyles: Record<string, string> = {
  valid: "bg-emerald-50 text-emerald-700",
  already_used: "bg-amber-50 text-amber-700",
  invalid: "bg-red-50 text-red-700",
  wrong_event: "bg-orange-50 text-orange-700",
  cancelled: "bg-slate-100 text-slate-600",
  expired: "bg-slate-100 text-slate-600",
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function ScanHistoryClient({ rows }: { rows: ScanHistoryRow[] }) {
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (resultFilter !== "all" && row.result !== resultFilter) return false;
      if (!needle) return true;
      return [row.holderName, row.eventTitle, row.ticketType, row.scannedBy]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [rows, search, resultFilter]);

  const validCount = rows.filter((row) => row.result === "valid").length;
  const duplicateCount = rows.filter((row) => row.result === "already_used").length;

  return (
    <DashboardShell
      title="Historique des scans"
      description="Toutes les validations d’entrée enregistrées pour vos événements."
      action={
        <Link
          href="/dashboard/scan"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <QrCode className="size-4" /> Scanner
        </Link>
      }
    >
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Scans enregistrés", value: rows.length },
          { label: "Entrées validées", value: validCount },
          { label: "Doublons détectés", value: duplicateCount },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50"
          >
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {metric.value.toLocaleString("fr-FR")}
            </p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un participant…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <select
            value={resultFilter}
            onChange={(event) => setResultFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="all">Tous les résultats</option>
            <option value="valid">Valides</option>
            <option value="already_used">Déjà utilisés</option>
            <option value="invalid">Invalides</option>
            <option value="cancelled">Annulés</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="p-5">
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-12 text-center">
              <QrCode className="mx-auto size-6 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">Aucun scan</p>
              <p className="mt-1 text-xs text-slate-500">
                Les validations d’entrée apparaîtront ici.
              </p>
              <Link
                href="/dashboard/scan"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                <ArrowLeft className="size-4" /> Ouvrir le scanner
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Participant</th>
                  <th className="px-5 py-3">Événement</th>
                  <th className="px-5 py-3">Formule</th>
                  <th className="px-5 py-3">Résultat</th>
                  <th className="px-5 py-3">Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDateTime(row.scannedAt)}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800">{row.holderName}</td>
                    <td className="max-w-[220px] px-5 py-4 text-slate-600">
                      <span className="block truncate">{row.eventTitle}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{row.ticketType}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          resultStyles[row.result] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {resultLabels[row.result] ?? row.result}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{row.scannedBy}</td>
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
