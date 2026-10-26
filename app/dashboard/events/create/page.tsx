// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Plus, Trash2 } from "lucide-react";
// import toast from "react-hot-toast";

// type Ticket = {
//     id: string;
//     name: string;
//     price: number;
//     quantity: number;
// };

// export default function CreateEventPage() {
//     const router = useRouter();
//     const [loading, setLoading] = useState(false);
//     const [file, setFile] = useState<File | null>(null);
//     const [form, setForm] = useState({
//         title: "",
//         description: "",
//         date: "",
//         time: "",
//         location: "",
//         image: "",
//     });
//     const [tickets, setTickets] = useState<Ticket[]>([
//         { 
//             id: "", 
//             name: "", 
//             price: 0, 
//             quantity: 0 
//         },
//     ]);

//     const addTicket = () => {
//         setTickets([
//             ...tickets,
//             { id: String(Date.now()), name: "", price: 0, quantity: 0 },
//         ]);
//     };

//     const removeTicket = (id: string) => {
//         if (tickets.length === 1) {
//             toast.error("Vous devez avoir au moins un ticket");
//             return;
//         }
//         setTickets(tickets.filter((t) => t.id !== id));
//     };

//     const updateTicket = (id: string, field: keyof Ticket, value: string | number) => {
//         setTickets(
//             tickets.map((t) =>
//                 t.id === id ? { ...t, [field]: value } : t
//             )
//         );
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);

//         // Valider les tickets
//         const invalidTickets = tickets.some((t) => !t.name || t.price <= 0 || t.quantity <= 0);
//         if (invalidTickets) {
//             toast.error("Veuillez remplir tous les champs des tickets");
//             setLoading(false);
//             return;
//         }

//         let uploadedImageUrl = "";

//         if (file && file.size > 0) {
//             const data = new FormData();
//             data.append("file", file);
//             data.append("upload_preset", "evenn_upload");

//             const uploadRes = await fetch(
//                 `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//                 {
//                 method: "POST",
//                 body: data,
//                 }
//             );

//             const uploadData = await uploadRes.json();
//             uploadedImageUrl = uploadData.secure_url;
//         }

//         try {
//             const payload = {
//                 ...form,
//                 image: uploadedImageUrl,
//                 tickets: tickets.map((t) => ({
//                     name: t.name,
//                     price: t.price,
//                     quantity: t.quantity,
//                 })),
//             };

//             // Appel API
//             const res = await fetch("/api/events", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(payload),
//             });

//             if (!res.ok) throw new Error("Erreur création");

//             toast.success("Événement créé avec succès !");
//             router.push("/dashboard/events");
//         } catch (error) {
//             toast.error("Erreur lors de la création" + error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-3xl mx-auto space-y-6">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Créer un événement</h1>

//             <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-6">
//                 {/* Infos générales */}
//                 <div className="space-y-4">
//                     <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Infos générales</h2>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
//                         <input
//                             type="text"
//                             required
//                             value={form.title}
//                             onChange={(e) => setForm({ ...form, title: e.target.value })}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                         <textarea
//                             rows={3}
//                             value={form.description}
//                             onChange={(e) => setForm({ ...form, description: e.target.value })}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
//                             <input
//                                 type="date"
//                                 required
//                                 value={form.date}
//                                 onChange={(e) => setForm({ ...form, date: e.target.value })}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Heure *</label>
//                             <input
//                                 type="time"
//                                 required
//                                 value={form.time}
//                                 onChange={(e) => setForm({ ...form, time: e.target.value })}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Lieu *</label>
//                         <input
//                             type="text"
//                             required
//                             value={form.location}
//                             onChange={(e) => setForm({ ...form, location: e.target.value })}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Image (URL)</label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => {
//                                 if (e.target.files && e.target.files[0]) {
//                                     setFile(e.target.files[0]);
//                                 }
//                             }}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//                 </div>

//                 {/* Tickets */}
//                 <div className="space-y-4">
//                     <div className="flex items-center justify-between border-b pb-2">
//                         <h2 className="text-lg font-semibold text-gray-800">Tickets</h2>
//                         <button
//                             type="button"
//                             onClick={addTicket}
//                             className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
//                         >
//                             <Plus className="h-4 w-4" />
//                             Ajouter un ticket
//                         </button>
//                     </div>

//                     {tickets.map((ticket, index) => (
//                         <div key={ticket.id} className="bg-gray-50 p-4 rounded-xl space-y-3">
//                             <div className="flex items-center justify-between">
//                                 <span className="text-sm font-medium text-gray-700">Ticket #{index + 1}</span>
//                                 <button
//                                     type="button"
//                                     onClick={() => removeTicket(ticket.id)}
//                                     className="text-red-500 hover:text-red-700 transition"
//                                 >
//                                     <Trash2 className="h-4 w-4" />
//                                 </button>
//                             </div>
//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                                 <div>
//                                     <label className="block text-xs font-medium text-gray-600">Nom</label>
//                                     <input
//                                         type="text"
//                                         value={ticket.name}
//                                         onChange={(e) => updateTicket(ticket.id, "name", e.target.value)}
//                                         placeholder="VIP, Standard..."
//                                         className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-xs font-medium text-gray-600">Prix (FCFA)</label>
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         step="0.01"
//                                         value={ticket.price}
//                                         onChange={(e) => updateTicket(ticket.id, "price", Number(e.target.value))}
//                                         className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-xs font-medium text-gray-600">Quantité</label>
//                                     <input
//                                         type="number"
//                                         min="0"
//                                         value={ticket.quantity}
//                                         onChange={(e) => updateTicket(ticket.id, "quantity", Number(e.target.value))}
//                                         className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Boutons */}
//                 <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
//                     <button
//                         type="button"
//                         onClick={() => router.back()}
//                         className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
//                     >
//                         Annuler
//                     </button>
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
//                     >
//                         {loading ? "Création en cours..." : "Créer l'événement"}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// // import { EventForm } from "@/src/components/ui/event-form"

// // export default function CreateEventPage() {
// //     return (
// //         <div className="p-2">
// //             <EventForm />
// //         </div>
// //     )
// // }


// app/dashboard/events/new/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/actions/events/create-event";
import { getEventCategories, type EventCategory } from "@/lib/actions/events/get-event-categories";
import {
  Ticket,
  MapPin,
  Calendar,
  PlusCircle,
  X,
  Image as ImageIcon,
  Clock,
  Tag,
  Save,
  AlertCircle,
} from "lucide-react";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import { toast } from "sonner";

type Ticket = {
  name: string;
  price: number;
  quantity: number;
};

/**
 * Convertit une date ("2026-08-20") + une heure locale ("20:00") en ISO 8601
 * avec le décalage de Yaoundé (UTC+1, sans heure d'été), attendu par les
 * colonnes `timestamptz` de `event_dates`.
 */
function toDoualaISO(date: string, time: string): string {
  if (!date || !time) return "";
  const [hours, minutes] = time.split(":");
  const hh = (hours ?? "00").padStart(2, "0");
  const mm = (minutes ?? "00").padStart(2, "0");
  return `${date}T${hh}:${mm}:00+01:00`;
}

export default function CreateEventPage() {
  const router = useRouter();
  // États du formulaire
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [venueName, setVenueName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [publishNow, setPublishNow] = useState(true);
  const [loading, setLoading] = useState(false);

  // Les catégories viennent de la table `categories` (portée "event").
  useEffect(() => {
    getEventCategories()
      .then((list) => setCategories(list))
      .catch((error) => {
        console.error("Erreur lors du chargement des catégories:", error);
        toast.error("Impossible de charger les catégories.");
      });
  }, []);

  // Gestion des billets
  const [tickets, setTickets] = useState<Ticket[]>([
    { name: "VIP", price: 50000, quantity: 100 },
    { name: "Standard", price: 10000, quantity: 200 },
  ]);

  const addTicket = () => {
    setTickets([...tickets, { name: "", price: 0, quantity: 0 }]);
  };

  const removeTicket = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const updateTicket = <K extends keyof Ticket>(index: number, field: K, value: Ticket[K]) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (tickets.length === 0 || tickets.some((ticket) => !ticket.name.trim() || ticket.price < 0 || ticket.quantity <= 0)) {
      toast.error("Ajoutez au moins un billet valide.");
      setLoading(false);
      return;
    }

    const startsAt = toDoualaISO(date, time);
    if (!startsAt) {
      toast.error("La date et l'heure de début sont obligatoires.");
      setLoading(false);
      return;
    }

    const endsAt = endTime ? toDoualaISO(date, endTime) : "";

    let uploadedImageUrl = "";
    try {
      if (image) {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "evenn_upload");
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: data },
        );

        if (!uploadResponse.ok) {
          throw new Error("Échec du téléchargement de l’image");
        }
        const uploadData = await uploadResponse.json();
        uploadedImageUrl = uploadData.secure_url ?? '';
      }

      await createEvent({
        title: eventName,
        description,
        category_id: categoryId || null,
        cover_url: uploadedImageUrl,
        venue_name: venueName,
        address,
        city,
        starts_at: startsAt,
        ends_at: endsAt || null,
        status: publishNow ? "published" : "draft",
        tickets: tickets.map((ticket) => ({
          name: ticket.name,
          price_amount: ticket.price,
          quantity_total: ticket.quantity,
        })),
      });

      toast.success(publishNow ? "Événement publié avec succès !" : "Brouillon enregistré.");
      router.push("/dashboard/events");
    } catch (error) {
      console.error("Erreur lors de la création de l’événement:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de créer l’événement. Vérifiez les informations saisies.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell
      title="Créer un événement"
      description="Rassemblez les informations pour publier votre prochain événement."
      action={
        <Link
          href="/dashboard/events"
          className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          Annuler
        </Link>
      }
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-950 via-blue-800 to-indigo-700 p-6 text-white shadow-lg shadow-blue-900/10 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Nouvel événement</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Faites de votre idée un rendez-vous.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
            Présentez votre événement, choisissez où et quand il aura lieu, puis configurez vos billets.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-blue-50">
            {["Informations", "Date et lieu", "Billetterie"].map((step, index) => (
              <span key={step} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">{index + 1}</span>
                {step}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-7">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]"><Calendar className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-semibold text-slate-900">Informations générales</h3>
                  <p className="mt-1 text-sm text-slate-500">Donnez à votre événement une identité claire.</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Nom de l&apos;événement <span className="text-[#2563EB]">*</span></label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10"
                    placeholder="Ex. : Concert Afro Night"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Catégorie <span className="text-[#2563EB]">*</span></label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10"
                    required
                  >
                    <option value="" disabled>Choisir une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name_fr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Description <span className="text-[#2563EB]">*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10"
                  placeholder="Qu'est-ce qui rend votre événement unique ?"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Image de couverture</label>
                <div className="relative">
                  <input
                    id="event-cover"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                    className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center transition peer-hover:border-[#2563EB] peer-focus-visible:border-[#2563EB] peer-focus-visible:ring-4 peer-focus-visible:ring-[#2563EB]/10">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-sm"><ImageIcon className="h-5 w-5" /></span>
                    <p className="mt-3 text-sm font-medium text-slate-700">{image ? image.name : "Choisir une image de couverture"}</p>
                    <p className="mt-1 text-xs text-slate-500">Cliquez pour parcourir vos fichiers</p>
                  </div>
                </div>
                {image && (
                  <button type="button" onClick={() => setImage(null)} className="mt-2 text-xs font-medium text-red-600 hover:text-red-700">
                    Retirer l’image
                  </button>
                )}
              </div>
            </section>

            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-7">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700"><Clock className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-semibold text-slate-900">Date et heure</h3>
                  <p className="mt-1 text-sm text-slate-500">Quand souhaitez-vous accueillir votre public ?</p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Date <span className="text-[#2563EB]">*</span></label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10" required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Début <span className="text-[#2563EB]">*</span></label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10" required />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Fin <span className="text-slate-400 font-normal">(optionnel)</span></label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10" />
                </div>
              </div>
            </section>

            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-7">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><MapPin className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-semibold text-slate-900">Lieu de l&apos;événement</h3>
                  <p className="mt-1 text-sm text-slate-500">Indiquez où les participants doivent se rendre.</p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Nom du lieu <span className="text-slate-400 font-normal">(optionnel)</span></label>
                  <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10" placeholder="Ex. : Salle des fêtes de Douala" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Ville <span className="text-[#2563EB]">*</span></label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10" placeholder="Ex. : Douala" required />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Adresse <span className="text-[#2563EB]">*</span></label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10" placeholder="Ex. : Bonanjo, rue Joss" required />
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500">
                <MapPin className="h-5 w-5 shrink-0 text-[#2563EB]" />
                <span>{venueName || city || address ? [venueName, address, city].filter(Boolean).join(", ") : "L’emplacement détaillé sera affiché sur la page de l’événement."}</span>
              </div>
            </section>

            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Ticket className="h-5 w-5" /></span>
                  <div>
                    <h3 className="font-semibold text-slate-900">Billetterie</h3>
                    <p className="mt-1 text-sm text-slate-500">Créez une ou plusieurs catégories de billets.</p>
                  </div>
                </div>
                <button type="button" onClick={addTicket} className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-[#2563EB] transition hover:bg-blue-100">
                  <PlusCircle className="h-4 w-4" /> Ajouter un billet
                </button>
              </div>

              <div className="space-y-3">
                {tickets.map((ticket, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">Catégorie {index + 1}</p>
                      <button type="button" onClick={() => removeTicket(index)} disabled={tickets.length === 1} aria-label={`Supprimer la catégorie ${index + 1}`} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">Nom du billet <span className="text-[#2563EB]">*</span></label>
                        <input type="text" value={ticket.name} onChange={(e) => updateTicket(index, 'name', e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10" placeholder="Ex. : VIP" required />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">Prix (FCFA) <span className="text-[#2563EB]">*</span></label>
                        <input type="number" value={ticket.price} onChange={(e) => updateTicket(index, 'price', Number(e.target.value))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10" placeholder="50000" min="0" required />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">Quantité <span className="text-[#2563EB]">*</span></label>
                        <input type="number" value={ticket.quantity} onChange={(e) => updateTicket(index, 'quantity', Number(e.target.value))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10" placeholder="100" min="1" required />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]"><Tag className="h-4 w-4" /></span>
                <h3 className="font-semibold text-slate-900">Récapitulatif</h3>
              </div>
              <p className="mt-4 break-words text-lg font-bold text-slate-900">{eventName || "Nom de votre événement"}</p>
              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-start gap-2.5 text-slate-600"><Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" /><span>{date || "Date à définir"}{time ? ` à ${time}` : ""}{endTime ? ` – ${endTime}` : ""}</span></div>
                <div className="flex items-start gap-2.5 text-slate-600"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" /><span>{[venueName, address, city].filter(Boolean).join(", ") || "Lieu à définir"}</span></div>
                <div className="flex items-start gap-2.5 text-slate-600"><Ticket className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" /><span>{tickets.length} catégorie{tickets.length > 1 ? "s" : ""} · {tickets.reduce((total, ticket) => total + (ticket.quantity || 0), 0)} places</span></div>
              </div>
            </section>

            <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                <div>
                  <p className="text-sm font-semibold text-blue-950">Avant de publier</p>
                  <p className="mt-1 text-xs leading-5 text-blue-800">Vérifiez la date, l’adresse et les quotas de billets. Les champs marqués * sont obligatoires.</p>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={publishNow}
                  onChange={(e) => setPublishNow(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]/30"
                />
                Publier immédiatement
              </label>
              <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60">
                <Save className="h-4 w-4" /> {loading ? "Enregistrement…" : publishNow ? "Publier l’événement" : "Enregistrer le brouillon"}
              </button>
              <Link href="/dashboard/events" className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                Retour aux événements
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </DashboardShell>
  );
}