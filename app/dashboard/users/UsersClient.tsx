"use client";

import { useMemo, useState } from "react";
import { Search, ShieldCheck, UserCheck, Users } from "lucide-react";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import type { DirectoryUser } from "@/lib/actions/dashboard/get-dashboard-data";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function UsersClient({ users }: { users: DirectoryUser[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return users;
    return users.filter((user) =>
      [user.name, user.email].join(" ").toLowerCase().includes(needle),
    );
  }, [users, search]);

  const buyers = users.filter((user) => user.ordersCount > 0).length;
  const suspended = users.filter((user) => user.banned).length;

  const metrics = [
    { label: "Clients", value: users.length, icon: Users },
    { label: "Avec commande", value: buyers, icon: UserCheck },
    { label: "Comptes suspendus", value: suspended, icon: ShieldCheck },
  ];

  return (
    <DashboardShell
      title="Clients"
      description="Utilisateurs ayant commandé des billets pour vos événements."
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
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un client…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-5">
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-12 text-center">
              <Users className="mx-auto size-6 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">Aucun client</p>
              <p className="mt-1 text-xs text-slate-500">
                Les acheteurs de vos billets apparaîtront ici.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Commandes</th>
                  <th className="px-5 py-3">Rôle</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Inscrit le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{user.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{user.ordersCount}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.banned
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {user.banned ? "Suspendu" : "Actif"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(user.createdAt)}
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
