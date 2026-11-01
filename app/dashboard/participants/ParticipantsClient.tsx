"use client";

import { useMemo, useState } from "react";
import { Download, Search, Ticket, UserCheck, Users } from "lucide-react";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import type { ParticipantsOverview } from "@/lib/actions/dashboard/get-dashboard-data";

const ticketStatusLabels: Record<string, string> = {
  valid: "Valide",
  used: "Utilisé",
  cancelled: "Annulé",
  refunded: "Remboursé",
  transferred: "Transféré",
};

const ticketStatusStyles: Record<string, string> = {
  valid: "bg-emerald-50 text-emerald-700",
  used: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-violet-50 text-violet-700",
  transferred: "bg-sky-50 text-sky-700",
};

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function ParticipantsClient({ data }: { data: ParticipantsOverview }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "valid" | "used">("all");

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return data.rows.filter((row) => {
      if (status !== "all" && row.ticketStatus !== status) return false;
      if (!needle) return true;
      return [row.name, row.email, row.phone, row.eventTitle, row.orderNumber, row.ticketType]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [data.rows, search, status]);

  const exportCsv = () => {
    const header = ["Participant", "Email", "Téléphone", "Événement", "Formule", "Commande", "Statut", "Entrée"];
    const lines = rows.map((row) => [
      row.name,
      row.email,
      row.phone,
      row.eventTitle,
      row.ticketType,
      row.orderNumber,
      ticketStatusLabels[row.ticketStatus] ?? row.ticketStatus,
      formatDate(row.checkedInAt),
    ]);
    const csv = [header, ...lines]
      .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"))
      .join("\n");

    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "participants.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const metrics = [
    { label: "Billets émis", value: data.total, icon: Ticket },
    { label: "Entrées validées", value: data.checkedIn, icon: UserCheck },
    { label: "En attente d’entrée", value: data.total - data.checkedIn, icon: Users },
  ];

  return (
    <DashboardShell
      title="Participants"
      description="Titulaires de billets de vos événements."
      action={
        <button
          type="button"
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="size-4" /> Exporter
        </button>
      }
    >
      <section className="grid gap-4 sm:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  {value.toLocaleString("fr-FR")}
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

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "Tous"],
                ["valid", "Valides"],
                ["used", "Utilisés"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  status === value
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="p-5">
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-12 text-center">
              <Users className="mx-auto size-6 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">Aucun participant</p>
              <p className="mt-1 text-xs text-slate-500">
                Les titulaires de billets apparaîtront ici après les premières ventes.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Participant</th>
                  <th className="px-5 py-3">Événement</th>
                  <th className="px-5 py-3">Formule</th>
                  <th className="px-5 py-3">Commande</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Entrée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.ticketId} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{row.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {row.email || row.phone || "—"}
                      </p>
                    </td>
                    <td className="max-w-[220px] px-5 py-4">
                      <p className="truncate text-slate-700">{row.eventTitle}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{row.ticketType}</td>
                    <td className="px-5 py-4 text-slate-600">{row.orderNumber}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          ticketStatusStyles[row.ticketStatus] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {ticketStatusLabels[row.ticketStatus] ?? row.ticketStatus}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(row.checkedInAt)}
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
