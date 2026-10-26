"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Download, Eye, Menu, Search, X } from "lucide-react";
import Sidebar from "@/src/components/dashboard/Sidebar";
import { getReservations } from "@/lib/actions/reservations/get-reservations";
import { updateReservationStatus } from "@/lib/actions/reservations/update-reservation-status";

type Reservation = {
  id: string;
  name: string;
  email: string;
  event: string;
  ticketType: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
};

const statusLabels = { confirmed: "Confirmée", pending: "En attente", cancelled: "Annulée" };

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Reservation["status"] | "all">("all");
  const [ticketFilter, setTicketFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await getReservations();
        setReservations(data.map((reservation) => ({
          id: reservation.id,
          name: reservation.buyerName,
          email: reservation.buyerEmail,
          event: reservation.eventTitle,
          ticketType: reservation.ticketType,
          date: reservation.createdAt,
          status: reservation.status,
        })));
      } catch (error) {
        console.error("Erreur lors du chargement des réservations:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadReservations();
  }, []);

  const filtered = useMemo(() => reservations.filter((reservation) => {
    const query = search.toLowerCase();
    const matchesSearch = [reservation.name, reservation.email, reservation.event].some((value) => value.toLowerCase().includes(query));
    return matchesSearch && (statusFilter === "all" || reservation.status === statusFilter) && (ticketFilter === "all" || reservation.ticketType === ticketFilter);
  }), [reservations, search, statusFilter, ticketFilter]);

  const ticketTypes = useMemo(
    () => [...new Set(reservations.map((reservation) => reservation.ticketType).filter(Boolean))],
    [reservations],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => setCurrentPage(1), [search, statusFilter, ticketFilter]);

  const exportReservations = () => {
    const csv = ["Nom;Email;Événement;Type de billet;Date;Statut", ...filtered.map((reservation) => [reservation.name, reservation.email, reservation.event, reservation.ticketType, reservation.date, statusLabels[reservation.status]].join(";"))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reservations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateStatus = async (id: string, status: Reservation["status"]) => {
    try {
      await updateReservationStatus(id, status);
      setReservations((current) => current.map((reservation) => reservation.id === id ? { ...reservation, status } : reservation));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réservation:", error);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="hidden md:block"><Sidebar /></div>
      {mobileSidebarOpen && <><button type="button" aria-label="Fermer la navigation" onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-900/30 md:hidden" /><div className="md:hidden"><Sidebar onClose={() => setMobileSidebarOpen(false)} /></div></>}

      <main className="min-w-0 md:ml-64">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <button type="button" aria-label="Ouvrir la navigation" onClick={() => setMobileSidebarOpen(true)} className="rounded-lg border border-slate-200 p-2 text-slate-600 md:hidden"><Menu className="h-5 w-5" /></button>
          <div className="flex-1 md:flex-none"><p className="text-sm font-medium text-[#2563EB]">Gestion</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Réservations</h1><p className="mt-1 hidden text-sm text-slate-500 sm:block">Consultez et gérez les participants de vos événements.</p></div>
          <button type="button" onClick={exportReservations} className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]"><Download className="h-4 w-4" /><span className="hidden sm:inline">Exporter</span></button>
        </header>

        <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between"><div><h2 className="font-semibold text-slate-900">Toutes les réservations</h2><p className="mt-1 text-sm text-slate-500">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</p></div></div>

          <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:flex-row">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher par nom, email ou événement..." className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2563EB]" /></div>
            <select value={ticketFilter} onChange={(event) => setTicketFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#2563EB]"><option value="all">Tous les billets</option>{ticketTypes.map((ticketType) => <option key={ticketType} value={ticketType}>{ticketType}</option>)}</select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as Reservation["status"] | "all")} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#2563EB]"><option value="all">Tous les statuts</option><option value="confirmed">Confirmée</option><option value="pending">En attente</option><option value="cancelled">Annulée</option></select>
          </section>

          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead className="border-b border-slate-200 bg-slate-50"><tr>{["Nom", "Email", "Événement", "Type de billet", "Date", "Statut", "Actions"].map((heading) => <th key={heading} className="px-5 py-3 text-left font-semibold text-slate-600">{heading}</th>)}</tr></thead><tbody>{pageItems.length === 0 ? <tr><td colSpan={7} className="p-8 text-center text-slate-500">Aucune réservation trouvée.</td></tr> : pageItems.map((reservation) => <tr key={reservation.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50"><td className="px-5 py-4 font-medium text-slate-800">{reservation.name}</td><td className="px-5 py-4 text-slate-500">{reservation.email}</td><td className="px-5 py-4 text-slate-700">{reservation.event}</td><td className="px-5 py-4 text-slate-600">{reservation.ticketType}</td><td className="px-5 py-4 text-slate-500">{new Date(reservation.date).toLocaleDateString("fr-FR")}</td><td className="px-5 py-4"><StatusBadge status={reservation.status} /></td><td className="px-5 py-4"><div className="flex gap-2"><button type="button" title="Voir les détails" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"><Eye className="h-4 w-4" /></button>{reservation.status === "pending" && <><button type="button" title="Confirmer" onClick={() => updateStatus(reservation.id, "confirmed")} className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50"><Check className="h-4 w-4" /></button><button type="button" title="Annuler" onClick={() => updateStatus(reservation.id, "cancelled")} className="rounded-md p-1.5 text-red-600 hover:bg-red-50"><X className="h-4 w-4" /></button></>}</div></td></tr>)}</tbody></table></div>
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-500"><span>{filtered.length === 0 ? "0" : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} sur {filtered.length}</span><div className="flex gap-2"><button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-40">Précédent</button><button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-40">Suivant</button></div></div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: Reservation["status"] }) {
  const colors = { confirmed: "bg-emerald-50 text-emerald-700", pending: "bg-amber-50 text-amber-700", cancelled: "bg-red-50 text-red-700" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colors[status]}`}>{statusLabels[status]}</span>;
}

function LoadingState() {
  return <div className="space-y-4 p-6 animate-pulse"><div className="h-8 w-48 rounded bg-slate-200" /><div className="h-12 rounded bg-slate-200" /><div className="h-72 rounded-lg bg-slate-200" /></div>;
}
