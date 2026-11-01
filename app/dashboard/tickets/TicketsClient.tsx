"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Download,
  Edit,
  Loader2,
  PlusCircle,
  Ticket,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import { deleteTicket } from "@/lib/actions/tickets/delete-ticket";
import { updateTicket } from "@/lib/actions/tickets/update-ticket";
import type { TicketTypeRow } from "@/lib/actions/tickets/get-tickets";

type EditValues = { name: string; price: string; total: string };

export default function TicketsClient({
  tickets,
  eventId,
  currency,
}: {
  tickets: TicketTypeRow[];
  eventId?: string;
  currency: string;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({ name: "", price: "", total: "" });
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const formatCurrency = (value: number) => `${value.toLocaleString("fr-FR")} ${currency}`;
  const totalCapacity = tickets.reduce((sum, ticket) => sum + ticket.total, 0);
  const totalSold = tickets.reduce((sum, ticket) => sum + ticket.sold, 0);
  const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.sold * ticket.price, 0);
  const eventTitle = eventId ? tickets[0]?.eventTitle : null;

  const startEdit = (ticket: TicketTypeRow) => {
    setEditingId(ticket.id);
    setEditValues({
      name: ticket.name,
      price: String(ticket.price),
      total: String(ticket.total),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: "", price: "", total: "" });
  };

  const saveEdit = async (id: string) => {
    setPendingId(id);
    try {
      await updateTicket(id, {
        name: editValues.name,
        price_amount: Number(editValues.price),
        quantity_total: Number(editValues.total),
      });
      toast.success("Type de billet mis à jour.");
      cancelEdit();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "La mise à jour a échoué.");
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setPendingId(id);
    try {
      await deleteTicket(id);
      toast.success("Type de billet supprimé.");
      setDeleteId(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "La suppression a échoué.");
    } finally {
      setPendingId(null);
    }
  };

  const exportTickets = () => {
    const header = ["Billet", "Événement", "Prix", "Vendus", "Quota", "Devise"];
    const rows = tickets.map((ticket) => [
      ticket.name,
      ticket.eventTitle,
      ticket.price,
      ticket.sold,
      ticket.total,
      ticket.currency,
    ]);
    const csv = [header, ...rows]
      .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = eventId ? `billets-${eventId}.csv` : "billets.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const metrics = [
    { label: "Places au total", value: totalCapacity.toLocaleString("fr-FR") },
    { label: "Billets vendus", value: totalSold.toLocaleString("fr-FR") },
    { label: "Revenus", value: formatCurrency(totalRevenue) },
  ];

  return (
    <DashboardShell
      title="Gestion des billets"
      description={
        eventTitle
          ? `Types de billets de « ${eventTitle} ».`
          : "Suivez les billets proposés pour tous vos événements."
      }
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportTickets}
            disabled={tickets.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="size-4" /> Exporter
          </button>
          <Link
            href={eventId ? `/dashboard/events/${eventId}` : "/dashboard/events"}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <PlusCircle className="size-4" /> {eventId ? "Gérer l’événement" : "Voir les événements"}
          </Link>
        </div>
      }
    >
      {eventId && (
        <Link
          href={`/dashboard/events/${eventId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft className="size-4" /> Retour à l’événement
        </Link>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50"
          >
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Tous les billets</h2>
          <p className="mt-1 text-sm text-slate-500">
            Modifiez vos tarifs et vos quotas, suivez les ventes.
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="p-5">
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-12 text-center">
              <Ticket className="mx-auto size-6 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">Aucun billet</p>
              <p className="mt-1 text-xs text-slate-500">
                {eventId
                  ? "Cet événement n’a pas encore de type de billet."
                  : "Créez un événement pour proposer des billets."}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Billet</th>
                  {!eventId && <th className="px-5 py-3">Événement</th>}
                  <th className="px-5 py-3">Prix</th>
                  <th className="px-5 py-3">Vendu / Quota</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket) => {
                  const editing = editingId === ticket.id;
                  const pending = pendingId === ticket.id;
                  const rate =
                    ticket.total > 0 ? Math.min((ticket.sold / ticket.total) * 100, 100) : 0;

                  return (
                    <tr key={ticket.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        {editing ? (
                          <input
                            value={editValues.name}
                            onChange={(event) =>
                              setEditValues({ ...editValues, name: event.target.value })
                            }
                            className="w-36 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                          />
                        ) : (
                          <span className="font-medium text-slate-800">{ticket.name}</span>
                        )}
                        {!ticket.isActive && !editing && (
                          <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            Inactif
                          </span>
                        )}
                      </td>
                      {!eventId && (
                        <td className="max-w-[220px] px-5 py-4 text-slate-600">
                          <span className="block truncate">{ticket.eventTitle}</span>
                        </td>
                      )}
                      <td className="px-5 py-4">
                        {editing ? (
                          <input
                            type="number"
                            min={0}
                            value={editValues.price}
                            onChange={(event) =>
                              setEditValues({ ...editValues, price: event.target.value })
                            }
                            className="w-28 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                          />
                        ) : (
                          <span className="text-slate-700">{formatCurrency(ticket.price)}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {editing ? (
                          <input
                            type="number"
                            min={ticket.sold}
                            value={editValues.total}
                            onChange={(event) =>
                              setEditValues({ ...editValues, total: event.target.value })
                            }
                            className="w-24 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                          />
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-slate-800">{ticket.sold}</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-600">{ticket.total}</span>
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-brand-600"
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {editing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => saveEdit(ticket.id)}
                                disabled={pending}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
                              >
                                {pending && <Loader2 className="size-3.5 animate-spin" />}
                                Enregistrer
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={pending}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                              >
                                Annuler
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEdit(ticket)}
                                title="Modifier"
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                              >
                                <Edit className="size-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteId(ticket.id)}
                                title="Supprimer"
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="size-7" />
              <h3 className="text-xl font-bold">Confirmer la suppression</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Êtes-vous sûr de vouloir supprimer ce type de billet ? Cette action est
              irréversible.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={pendingId === deleteId}
                className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                disabled={pendingId === deleteId}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700 disabled:opacity-60"
              >
                {pendingId === deleteId && <Loader2 className="size-4 animate-spin" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
