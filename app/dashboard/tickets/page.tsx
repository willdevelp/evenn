// app/dashboard/tickets/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { deleteTicket } from '@/lib/actions/tickets/delete-ticket';
import { getTickets } from '@/lib/actions/tickets/get-tickets';
import { updateTicket } from '@/lib/actions/tickets/update-ticket';
import {
  PlusCircle,
  ArrowRight,
  Edit,
  Trash2,
  Download,
  AlertCircle,
  Menu,
} from 'lucide-react';
import Sidebar from '@/src/components/dashboard/Sidebar';

type TicketItem = {
  id: number;
  type: string;
  price: number;
  sold: number;
  total: number;
  eventTitle: string;
};

export default function TicketManagementPage() {
  const params = useParams<{ id?: string }>();
  const eventId = params.id;

  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ type: '', price: '', total: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data
          .filter((ticket) => !eventId || String(ticket.event_id) === eventId)
          .map((ticket) => ({
            id: Number(ticket.id),
            type: ticket.name,
            price: Number(ticket.price),
            sold: Number(ticket.sold ?? 0),
            total: Number(ticket.quantity),
            eventTitle: ticket.event_title,
          })));
      } catch (error) {
        console.error('Erreur lors du chargement des tickets:', error);
      }
    };

    void loadTickets();
  }, [eventId, params.id]);

  // Handle edit
  const startEdit = (ticket: TicketItem) => {
    setEditingId(ticket.id);
    setEditValues({
      type: ticket.type,
      price: ticket.price.toString(),
      total: ticket.total.toString(),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ type: '', price: '', total: '' });
  };

  const saveEdit = async (id: number) => {
    try {
      const updatedTicket = await updateTicket(id, {
        name: editValues.type,
        price: parseInt(editValues.price, 10) || 0,
        quantity: parseInt(editValues.total, 10) || 0,
      });
      setTickets((current) => current.map((ticket) => ticket.id === id ? {
        ...ticket,
        type: updatedTicket.name,
        price: Number(updatedTicket.price),
        total: Number(updatedTicket.quantity),
      } : ticket));
      setEditingId(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du ticket:', error);
    }
  };

  // Handle delete
  const confirmDelete = (id: number) => {
    setShowDeleteConfirm(id);
  };

  const handleDeleteTicket = async (id: number) => {
    try {
      await deleteTicket(id);
      setTickets((current) => current.filter((ticket) => ticket.id !== id));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression du ticket:', error);
    }
  };

  // Handle export
  const exportTickets = () => {
    // Create CSV content
    const headers = ['Type', 'Prix (FCFA)', 'Vendus', 'Total'];
    const rows = tickets.map(t => [t.type, t.price, t.sold, t.total]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billets_${eventId ?? "tous-evenements"}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Stats
  const totalSold = tickets.reduce((sum, t) => sum + t.sold, 0);
  const totalRevenue = tickets.reduce((sum, t) => sum + t.sold * t.price, 0);

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
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Ouvrir la navigation" onClick={() => setMobileSidebarOpen(true)} className="rounded-xl border border-slate-200 p-2 text-slate-600 md:hidden">
                <Menu size={19} />
              </button>
              <Link href={eventId ? `/dashboard/events/${eventId}` : "/dashboard/events"} className="text-slate-400 transition hover:text-slate-600">
                <ArrowRight size={20} className="rotate-180" />
              </Link>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Catalogue</p>
                <h1 className="text-xl font-bold text-slate-900">Gestion des billets</h1>
              </div>
            </div>
            <p className="mt-1 pl-0 text-sm text-slate-500 sm:pl-11">
              {eventId ? <>Événement : <span className="font-medium text-slate-700">{tickets[0]?.eventTitle ?? "Chargement…"}</span></> : "Suivez les billets proposés pour tous vos événements."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportTickets}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Download size={18} /> Exporter
            </button>
            <Link
              href={eventId ? `/dashboard/events/${eventId}/tickets/new` : "/dashboard/events"}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-[#1d4ed8]"
            >
              <PlusCircle size={18} /><span className="hidden sm:inline">{eventId ? "Ajouter un billet" : "Gérer les événements"}</span><span className="sm:hidden">{eventId ? "Ajouter" : "Événements"}</span>
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
            <p className="text-sm text-slate-500">Total billets</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{tickets.reduce((sum, t) => sum + t.total, 0)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
            <p className="text-sm text-slate-500">Billets vendus</p>
            <p className="mt-2 text-2xl font-bold text-[#2563EB]">{totalSold}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
            <p className="text-sm text-slate-500">Revenus totaux</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{totalRevenue.toLocaleString()} FCFA</p>
          </div>
        </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="font-semibold text-slate-900">Tous les billets</h2>
            <p className="mt-1 text-sm text-slate-500">Modifiez vos tarifs, quotas et suivez les ventes.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Billet</th>
                  {!eventId && <th className="px-6 py-4">Événement</th>}
                  <th className="px-6 py-4">Prix</th>
                  <th className="px-6 py-4">Vendu / Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.length === 0 ? (
                  <tr><td colSpan={eventId ? 4 : 5} className="px-6 py-16 text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]"><Download size={21} /></span>
                    <p className="mt-4 font-semibold text-slate-800">Aucun billet à afficher</p>
                    <p className="mt-1 text-sm text-slate-500">{eventId ? "Cet événement n'a pas encore de billet." : "Créez un événement pour commencer à proposer des billets."}</p>
                  </td></tr>
                ) : tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      {editingId === ticket.id ? (
                        <input
                          type="text"
                          value={editValues.type}
                          onChange={(e) => setEditValues({ ...editValues, type: e.target.value })}
                          className="w-32 px-3 py-1 border border-gray-200 rounded-lg focus:border-[#2563EB] outline-none text-sm"
                        />
                      ) : (
                        <span className="font-medium text-gray-800">{ticket.type}</span>
                      )}
                    </td>
                    {!eventId && <td className="px-6 py-4 text-sm text-slate-600">{ticket.eventTitle}</td>}
                    <td className="px-6 py-4">
                      {editingId === ticket.id ? (
                        <input
                          type="number"
                          value={editValues.price}
                          onChange={(e) => setEditValues({ ...editValues, price: e.target.value })}
                          className="w-28 px-3 py-1 border border-gray-200 rounded-lg focus:border-[#2563EB] outline-none text-sm"
                        />
                      ) : (
                        <span>{ticket.price.toLocaleString()} FCFA</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{ticket.sold}</span>
                        <span className="text-gray-400">/</span>
                        <span>{ticket.total}</span>
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[#2563EB]"
                            style={{ width: `${ticket.total > 0 ? Math.min((ticket.sold / ticket.total) * 100, 100) : 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === ticket.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => saveEdit(ticket.id)}
                            className="px-3 py-1 bg-[#2563EB] text-white rounded-lg text-xs font-medium hover:bg-[#1d4ed8] transition"
                          >
                            Enregistrer
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(ticket)}
                            className="p-2 text-gray-400 hover:text-[#2563EB] hover:bg-[#2563EB]/10 rounded-xl transition"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => confirmDelete(ticket.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              // Quick export single ticket
                              const csv = `Type,Prix,Vendu,Total\n${ticket.type},${ticket.price},${ticket.sold},${ticket.total}`;
                              const blob = new Blob([csv], { type: 'text/csv' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${ticket.type}.csv`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="p-2 text-gray-400 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10 rounded-xl transition"
                            title="Exporter"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal de confirmation de suppression */}
          {showDeleteConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle size={28} />
                  <h3 className="text-xl font-bold">Confirmer la suppression</h3>
                </div>
                <p className="text-gray-600 mt-3">
                  Êtes-vous sûr de vouloir supprimer ce type de billet ? Cette action est irréversible.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(showDeleteConfirm)}
                    className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:bg-red-700 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        {/* Footer */}
        </section>
        </div>
        <footer className="border-t border-slate-200 px-6 py-5 text-center text-xs text-slate-400">
          © 2026 Evenn. Tous droits réservés.
        </footer>
      </div>
    </main>
  );
}