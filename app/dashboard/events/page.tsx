// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Plus, Eye, Edit, Trash2, Search } from "lucide-react";
// import { Event } from "@/lib/definition";
// import Image from "next/image";


// export default function EventsPage() {

//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const res = await fetch("/api/events");
//         if (!res.ok) throw new Error("Erreur réseau");
//         const data = await res.json();
//         setEvents(data);
//       } catch (err) {
//         setError("Impossible de charger les événements.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const filtered = events.filter((e) =>
//     e.title.toLowerCase().includes(search.toLowerCase()) ||
//     e.location.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleEdit = (event: Event) => {
//     setSelectedEvent(event);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Supprimer définitivement cet événement ?")) return;
//     try {
//       const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Erreur suppression");
//       setEvents((prev) => prev.filter((e) => e.id !== id));
//     } catch (err) {
//       alert("Erreur lors de la suppression");
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-4 animate-pulse">
//         <div className="h-8 w-48 bg-gray-200 rounded"></div>
//         <div className="h-12 bg-gray-200 rounded"></div>
//         <div className="space-y-3">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="h-20 bg-gray-200 rounded"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes événements</h1>
//         <Link
//           href="/dashboard/events/create"
//           className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-sm"
//         >
//           <Plus className="h-5 w-5" />
//           Créer un événement
//         </Link>
//       </div>

//       {/* Recherche */}
//       <div className="relative max-w-sm">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Rechercher un événement..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//         />
//       </div>

//       {/* Liste */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 border-b border-gray-100">
//               <tr>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-600">Événement</th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-600">Lieu</th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-600">Heure</th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-600">Tickets</th>
//                 <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((event) => (
//                 <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
//                         {/* Image placeholder */}
//                         <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs">
//                           <Image src={event.image} width={400} height={400} alt={event.title} className="w-full h-full object-cover" />
//                         </div>
//                       </div>
//                       <span className="font-medium text-gray-800">{event.title}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-gray-600">
//                     {new Date(event.date).toLocaleDateString("fr-FR")}
//                   </td>
//                   <td className="px-4 py-3 text-gray-600">{event.location}</td>
//                   <td className="px-4 py-3 text-gray-600">{event.time}</td>
//                   <td className="px-4 py-3">
//                     <span className="text-gray-700">{event.ticketsSold}</span>
//                     <span className="text-gray-400"> / {event.place}</span>
//                     <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
//                       <div
//                         className="h-full bg-indigo-600 rounded-full"
//                         style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
//                       />
//                     </div>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-2">
//                       <button className="p-1 hover:bg-gray-100 rounded transition" title="Voir">
//                         <Eye className="h-4 w-4 text-gray-500" />
//                       </button>
//                       <button className="p-1 hover:bg-gray-100 rounded transition" title="Modifier" onClick={() => handleEdit(event)}>
//                         <Edit className="h-4 w-4 text-indigo-500" />
//                       </button>
//                       <button className="p-1 hover:bg-red-100 rounded transition" title="Supprimer" onClick={() => handleDelete(event.id)}>
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {isModalOpen && selectedEvent && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">

//           {/* Overlay */}
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={() => setIsModalOpen(false)}
//           />

//           {/* Modal */}
//           <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl z-10">
//             <h2 className="text-xl font-bold mb-4">Modifier l&apos;événement</h2>

//             <form
//               onSubmit={async (e) => {
//                 e.preventDefault();

//                 try {
//                   const res = await fetch(`/api/events/${selectedEvent.id}`, {
//                     method: "PUT",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(selectedEvent),
//                   });

//                   if (!res.ok) throw new Error("Erreur update");

//                   // Update UI
//                   setEvents((prev) =>
//                     prev.map((ev) =>
//                       ev.id === selectedEvent.id ? selectedEvent : ev
//                     )
//                   );

//                   setIsModalOpen(false);
//                 } catch (err) {
//                   alert("Erreur lors de la modification");
//                   console.error(err);
//                 }
//               }}
//               className="space-y-4"
//             >
//               {/* Title */}
//               <input
//                 type="text"
//                 value={selectedEvent.title}
//                 onChange={(e) =>
//                   setSelectedEvent({ ...selectedEvent, title: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//                 placeholder="Titre"
//               />

//               {/* Description */}
//               <textarea
//                 value={selectedEvent.description}
//                 onChange={(e) =>
//                   setSelectedEvent({ ...selectedEvent, description: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//                 placeholder="Description"
//                 rows={4}
//               />

//               {/* Location */}
//               <input
//                 type="text"
//                 value={selectedEvent.location}
//                 onChange={(e) =>
//                   setSelectedEvent({ ...selectedEvent, location: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//                 placeholder="Lieu"
//               />

//               {/* Date */}
//               <input
//                 type="date"
//                 value={selectedEvent.date.split("T")[0]}
//                 onChange={(e) =>
//                   setSelectedEvent({ ...selectedEvent, date: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />

//               {/* Time */}
//               <input
//                 type="time"
//                 value={selectedEvent.time}
//                 onChange={(e) =>
//                   setSelectedEvent({ ...selectedEvent, time: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />

//               {/* Actions */}
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 bg-gray-200 rounded"
//                 >
//                   Annuler
//                 </button>

//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-indigo-600 text-white rounded"
//                 >
//                   Enregistrer
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaImage } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import type { Event } from "@/lib/definition";
// // 👇 Optionnel mais FORTEMENT recommandé pour l'optimisation Next.js
// // import Image from "next/image";

// // Skeleton avec un rectangle pour l'image
// const EventSkeleton = () => (
//   <div className="animate-pulse bg-white rounded-xl shadow overflow-hidden border border-gray-100">
//     <div className="h-48 bg-gray-200"></div> {/* Squelette de l'image */}
//     <div className="p-5 space-y-3">
//       <div className="h-5 bg-gray-200 rounded w-3/4"></div>
//       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//       <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//       <div className="flex justify-end gap-3 mt-4">
//         <div className="h-8 w-16 bg-gray-200 rounded"></div>
//         <div className="h-8 w-16 bg-gray-200 rounded"></div>
//       </div>
//     </div>
//   </div>
// );

// export default function EventsListPage() {
//   const router = useRouter();
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const res = await fetch("/api/events");
//         if (!res.ok) throw new Error("Erreur réseau");
//         const data = await res.json();
//         setEvents(data);
//       } catch (err) {
//         setError("Impossible de charger les événements.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const handleEdit = (id: string) => {
//     router.push(`/dashboard/events/edit/${id}`);
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Supprimer définitivement cet événement ?")) return;
//     try {
//       const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Erreur suppression");
//       setEvents((prev) => prev.filter((e) => e.id !== id));
//     } catch (err) {
//       alert("Erreur lors de la suppression");
//       console.error(err);
//     }
//   };

//   // ⏳ LOADING
//   if (loading) {
//     return (
//       <div className="py-6 px-4 max-w-6xl mx-auto">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes événements</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[...Array(6)].map((_, i) => (
//             <EventSkeleton key={i} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-center text-red-600">
//         <p>{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 bg-red-100 px-4 py-2 rounded hover:bg-red-200"
//         >
//           Réessayer
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="py-6 px-4 max-w-6xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Mes événements</h2>
//         <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//           {events.length} événement{events.length > 1 ? "s" : ""}
//         </span>
//       </div>

//       {events.length === 0 ? (
//         <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
//           <p className="text-gray-500">Aucun événement pour le moment</p>
//           <button
//             onClick={() => router.push("/dashboard/events/create")}
//             className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Créer mon premier événement
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {events.map((event) => {
//             // 🖼️ Adaptez 'event.image' selon votre schéma (ex: event.imageUrl, event.cover, etc.)
//             const imageSrc = event.image;

//             return (
//               <div
//                 key={event.id}
//                 className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col"
//               >
//                 {/* --- BANDEAU IMAGE --- */}
//                 <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
//                   {imageSrc ? (
//                     // 👇 Option 1 : Balise <img> classique (plus simple)
//                     <img
//                       src={imageSrc}
//                       alt={`Affiche de ${event.title}`}
//                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                     />
//                     /*
//                     // 👇 Option 2 : <Image> de Next.js (optimisé, recommandé)
//                     // Décommentez cette partie et commentez le <img> ci-dessus
//                     // <Image
//                     //   src={imageSrc}
//                     //   alt={`Affiche de ${event.title}`}
//                     //   fill
//                     //   className="object-cover hover:scale-105 transition-transform duration-300"
//                     //   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                     // />
//                     */
//                   ) : (
//                     // Fallback si pas d'image
//                     <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-200">
//                       <FaImage className="w-10 h-10 mb-1 opacity-50" />
//                       <span className="text-sm font-medium">Pas d&apos;affiche</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* --- CONTENU TEXTE --- */}
//                 <div className="p-5 flex flex-col flex-1">
//                   <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
//                     {event.title}
//                   </h3>

//                   <div className="mt-3 space-y-1.5 text-sm text-gray-600">
//                     <div className="flex items-center gap-2">
//                       <FaCalendarAlt className="w-4 h-4 text-blue-500 flex-shrink-0" />
//                       <span>
//                         {event.date} à {event.time}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <FaMapMarkerAlt className="w-4 h-4 text-red-400 flex-shrink-0" />
//                       <span className="truncate">{event.location}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <FaTicketAlt className="w-4 h-4 text-green-500 flex-shrink-0" />
//                       <span>
//                         {event.place} places • {event.prices?.join(" / ")} FCFA
//                       </span>
//                     </div>
//                   </div>

//                   {/* Badge de statut */}
//                   <div className="mt-4">
//                     <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                       Disponible
//                     </span>
//                   </div>

//                   {/* Actions */}
//                   <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t pt-4">
//                     <button
//                       onClick={() => handleEdit(event.id)}
//                       className="flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
//                     >
//                       <FaEdit className="w-3.5 h-3.5" />
//                       Modifier
//                     </button>
//                     <button
//                       onClick={() => handleDelete(event.id)}
//                       className="flex items-center gap-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
//                     >
//                       <FaTrash className="w-3.5 h-3.5" />
//                       Supprimer
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// app/dashboard/events/page.js
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { deleteEvent } from '@/lib/actions/events/delete-event';
import { getEvents } from '@/lib/actions/events/get-events';
import {
  CalendarDays,
  MapPin,
  Calendar,
  PlusCircle,
  Edit,
  Eye,
  Ticket,
  Trash2,
} from 'lucide-react';
import DashboardShell from '@/src/components/dashboard/DashboardShell';

// Fonction pour le badge de statut
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'En cours': 'bg-emerald-100 text-emerald-700',
    'À venir': 'bg-blue-100 text-blue-700',
    'Brouillon': 'bg-gray-100 text-gray-700',
    'Terminé': 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles['Brouillon']}`}>
      {status}
    </span>
  );
};

export default function DashboardEventsPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Array<{
    id: string;
    title: string;
    city: string;
    date: string;
    ticketsSold: number;
    totalTickets: number;
    status: string;
    revenue: number;
  }>>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data.map((event) => {
          const eventDate = event.date ? new Date(event.date) : null;
          const hasValidDate = eventDate && !Number.isNaN(eventDate.getTime());

          return {
            id: event.id,
            title: event.title,
            city: event.location || event.city || '',
            date: hasValidDate
              ? eventDate.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
              : '',
            ticketsSold: event.tickets_sold,
            totalTickets: event.total_tickets,
            revenue: event.revenue,
            status: !event.date
              ? 'Brouillon'
              : hasValidDate && eventDate < new Date()
                ? 'Terminé'
                : 'À venir',
          };
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer définitivement cet événement ?')) return;

    try {
      await deleteEvent(id);
      setEvents((current) => current.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de l’événement:', error);
      window.alert('Impossible de supprimer cet événement.');
    }
  };

  return (
    <DashboardShell
      title="Mes événements"
      description="Gérez tous vos événements depuis cet espace."
      action={
        <Link
          href="/dashboard/events/create"
          className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-3 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-[#1d4ed8] sm:px-4"
        >
          <PlusCircle size={16} />
          <span className="hidden sm:inline">Créer un événement</span><span className="sm:hidden">Créer</span>
        </Link>
      }
    >
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Événements', value: events.length, icon: CalendarDays },
            { label: 'À venir', value: events.filter((event) => event.status === 'À venir').length, icon: Calendar },
            { label: 'Billets disponibles', value: events.reduce((total, event) => total + event.totalTickets, 0), icon: Ticket },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]"><stat.icon size={19} /></span>
              <p className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">Vos événements</h2>
              <p className="mt-1 text-sm text-slate-500">Consultez et gérez vos événements publiés.</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#2563EB]">
              {events.length} événement{events.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="border-b border-slate-100 bg-slate-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Événement</th>
                  <th className="px-6 py-4">Lieu</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Billets vendus</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                      Chargement des événements…
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]"><Calendar className="h-6 w-6" /></span>
                      <p className="mt-4 font-semibold text-slate-800">Aucun événement pour le moment</p>
                      <p className="mt-1 text-sm text-slate-500">Créez votre premier événement pour le retrouver ici.</p>
                      <Link
                        href="/dashboard/events/create"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-[#1d4ed8]"
                      >
                        <PlusCircle size={16} /> Créer un événement
                      </Link>
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="transition hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{event.title}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{event.revenue.toLocaleString()} FCFA</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <MapPin size={14} className="text-[#2563EB]" /> {event.city}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Calendar size={14} className="text-[#2563EB]" /> {event.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{event.ticketsSold}</span>
                          <span className="text-xs text-gray-400">/ {event.totalTickets}</span>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-[#2563EB]"
                              style={{ width: `${event.totalTickets > 0 ? (event.ticketsSold / event.totalTickets) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={event.status} /></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/events/${event.id}`}
                            aria-label={`Voir ${event.title}`}
                            className="rounded-lg p-2 text-[#2563EB] transition hover:bg-[#2563EB]/10"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/dashboard/events/${event.id}/edit`}
                            aria-label={`Modifier ${event.title}`}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-[#2563EB]/10 hover:text-[#2563EB]"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            type="button"
                            aria-label={`Supprimer ${event.title}`}
                            onClick={() => handleDelete(event.id)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
    </DashboardShell>
  );
}