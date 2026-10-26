// app/events/[slug]/EventDetailClient.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Ticket,
  Users,
  Star,
  ArrowLeft,
  CheckCircle,
  XCircle,
  ArrowRight,
  Send,
  MessageCircle,
  X,
  CalendarDays,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { createReservation } from "@/lib/actions/reservations/create-reservation";

type TicketType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  maxPerOrder: number;
  available: boolean;
};

type EventType = {
  id: string;
  category: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  city: string;
  organizer: string;
  description: string;
  tickets: TicketType[];
  attendees: number;
  rating: number;
};

type SimilarEvent = {
  id: number;
  slug: string;
  title: string;
  date: string;
  price: string;
};

/* ===== CHAT ===== */
function EventChat() {
  const [messages, setMessages] = useState([
    { id: 1, user: "Jean D.", text: "Qui vient au concert ?", timestamp: "10:30" },
    { id: 2, user: "Marie K.", text: "Moi ! avec des amis", timestamp: "10:35" },
    { id: 3, user: "Pierre N.", text: "Il y aura du parking ?", timestamp: "10:40" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || isSending) return;
    setIsSending(true);
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { id: Date.now(), user: "Moi", text: newMessage.trim(), timestamp }]);
    setNewMessage("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          user: "Evenza",
          text: "Merci pour votre message, l'organisateur vous répondra bientôt.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsSending(false);
    }, 1000);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(37,99,235,0.12)]">
      <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-md shadow-blue-600/30">
          <MessageCircle size={17} />
        </span>
        <div>
          <h2 className="text-base font-bold leading-tight text-slate-950">Discussion</h2>
          <p className="text-xs text-slate-400">Échangez avec les autres participants</p>
        </div>
      </header>

      <div className="h-56 space-y-4 overflow-y-auto bg-slate-50/70 px-5 py-5 sm:px-7">
        {messages.map((msg) => {
          const mine = msg.user === "Moi";
          return (
            <div key={msg.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <div className="mb-1 flex items-baseline gap-2 text-xs">
                <span className="font-semibold text-slate-700">{msg.user}</span>
                <span className="text-slate-400">{msg.timestamp}</span>
              </div>
              <p
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  mine
                    ? "rounded-br-md bg-[#2563EB] text-white shadow-md shadow-blue-600/20"
                    : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {msg.text}
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 border-t border-slate-100 p-4 sm:px-7">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Écrivez un message..."
          disabled={isSending}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || isSending}
          aria-label="Envoyer"
          className="flex w-12 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30 disabled:opacity-40 disabled:shadow-none"
        >
          <Send size={16} />
        </button>
      </div>
    </section>
  );
}

/* ===== MODAL D'ACHAT ===== */
function PurchaseModal({
  eventId,
  eventTitle,
  tickets,
  isOpen,
  onClose,
}: {
  eventId: string;
  eventTitle: string;
  tickets: TicketType[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const availableTickets = tickets.filter((t) => t.available);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    availableTickets[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedTicketId(tickets.find((ticket) => ticket.available)?.id ?? "");
    setQuantity(1);
    setError(null);
  }, [isOpen, tickets]);

  if (!isOpen) return null;

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);
  const remaining = selectedTicket
    ? Math.max(selectedTicket.quantity - selectedTicket.sold, 0)
    : 0;
  const maxQuantity = selectedTicket
    ? Math.max(Math.min(remaining, selectedTicket.maxPerOrder), 1)
    : 1;
  const total = (selectedTicket?.price ?? 0) * quantity;

  const handlePurchase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTicket) {
      setError("Sélectionnez un billet.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const reservation = await createReservation({
        eventId,
        ticketTypeId: selectedTicket.id,
        quantity,
        buyerName,
        buyerEmail,
        buyerPhone,
      });
      router.push(`/checkout?order=${reservation.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de finaliser la réservation. Réessayez.",
      );
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Réserver mes billets"
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-md sm:items-center sm:p-4"
    >
      <form
        onSubmit={handlePurchase}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-2xl shadow-blue-950/40 sm:rounded-3xl"
      >
        {/* En-tête bleu */}
        <div className="relative overflow-hidden bg-[#2563EB] px-6 pb-6 pt-5 text-white sm:px-8">
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 right-10 h-32 w-32 rounded-full bg-white/5" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Réserver mes billets</h3>
              <p className="mt-1 line-clamp-1 text-sm text-blue-100">{eventTitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="rounded-xl bg-white/15 p-2 text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="space-y-2.5">
            {availableTickets.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-500">
                Aucun billet disponible pour le moment.
              </p>
            )}
            {availableTickets.map((ticket) => {
              const active = selectedTicketId === ticket.id;
              return (
                <label
                  key={ticket.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 p-4 transition ${
                    active
                      ? "border-[#2563EB] bg-blue-50/70 shadow-md shadow-blue-600/10"
                      : "border-slate-200 hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="ticketType"
                      checked={active}
                      className="h-4 w-4 accent-[#2563EB]"
                      onChange={() => {
                        setSelectedTicketId(ticket.id);
                        setQuantity(1);
                      }}
                    />
                    <div>
                      <span className="text-sm font-semibold text-slate-900">{ticket.name}</span>
                      <p className="text-xs text-slate-500">
                        {Math.max(ticket.quantity - ticket.sold, 0)} place(s) disponible(s)
                      </p>
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-sm font-bold text-[#2563EB]">
                    {ticket.price.toLocaleString("fr-FR")} FCFA
                  </span>
                </label>
              );
            })}
          </div>

          {availableTickets.length > 0 && (
            <>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                  Quantité
                  <span className="ml-2 text-xs font-normal text-slate-400">max. {maxQuantity}</span>
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(
                        maxQuantity,
                        Math.max(1, parseInt(e.target.value, 10) || 1),
                      ),
                    )
                  }
                  className="w-20 rounded-xl border border-slate-200 bg-white px-2 py-2 text-center text-sm font-semibold outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                />
              </div>

              <div className="mt-5 space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Nom complet
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Votre nom"
                    required
                    minLength={2}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Adresse email
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="vous@email.com"
                    required
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Téléphone <span className="font-normal text-slate-400">(optionnel)</span>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+237 6 00 00 00 00"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-dashed border-slate-200 pt-5">
                <span className="text-sm text-slate-500">Total à payer</span>
                <span className="text-2xl font-black tracking-tight text-[#2563EB]">
                  {total.toLocaleString("fr-FR")} <span className="text-sm font-bold">FCFA</span>
                </span>
              </div>

              {error && (
                <p role="alert" className="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !selectedTicket}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] py-4 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30 disabled:opacity-50 disabled:shadow-none"
              >
                {loading ? "Enregistrement..." : "Confirmer la réservation"}
                {!loading && <ArrowRight size={18} />}
              </button>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <QrCode size={13} /> Billet électronique avec QR code, réservation immédiate
              </p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

/* ===== PAGE PRINCIPALE ===== */
export default function EventDetailClient({
  event,
  similarEvents,
}: {
  event: EventType;
  similarEvents: SimilarEvent[];
}) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const startingPrice = event.tickets.find((t) => t.available)?.price ?? null;
  const hasAvailableTickets = event.tickets.some((t) => t.available);

  const quickInfo = [
    { icon: Calendar, label: "Date", value: event.date },
    { icon: Clock, label: "Heure", value: event.time || "À préciser" },
    { icon: MapPin, label: "Lieu", value: event.city },
    { icon: User, label: "Organisateur", value: event.organizer },
  ];

  const cardClass =
    "rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(37,99,235,0.12)] sm:p-8";

  return (
    <main className="min-h-screen bg-[#F5F8FF] pb-28 text-slate-900 lg:pb-12">
      {/* ===== HERO ===== */}
      <div className="relative h-[26rem] w-full overflow-hidden bg-[#2563EB] md:h-[34rem]">
        {event.image ? (
          <Image
            src={event.image}
            fill
            sizes="100vw"
            priority
            alt={event.title}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            <CalendarDays size={72} strokeWidth={1} />
          </div>
        )}
        {/* Voile bleu de marque */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a] via-[#2563EB]/55 to-[#2563EB]/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />

        <Link
          href="/events"
          className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30 sm:left-8 sm:top-8"
        >
          <ArrowLeft size={16} /> Retour
        </Link>

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:pb-28 lg:px-8">
          <span className="mb-4 inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#2563EB] shadow-lg">
            {event.category}
          </span>
          <h1 className="max-w-3xl text-balance text-4xl font-black leading-[1.05] tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl">
            {event.title}
          </h1>
        </div>
      </div>

      {/* ===== INFOS RAPIDES (carte flottante) ===== */}
      <div className="relative z-20 mx-auto -mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-200/70 shadow-2xl shadow-blue-900/15 sm:grid-cols-2 lg:grid-cols-4">
          {quickInfo.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 bg-white p-5 sm:p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-lg shadow-blue-600/30">
                <Icon size={20} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">{label}</p>
                <p className="mt-0.5 truncate font-bold text-slate-900">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        {/* Colonne gauche */}
        <div className="space-y-8">
          <section className={cardClass}>
            <h2 className="mb-4 text-xl font-bold text-slate-950">À propos</h2>
            <p className="max-w-prose whitespace-pre-line text-[15px] leading-8 text-slate-600">
              {event.description || "Aucune description n’a été ajoutée pour cet événement."}
            </p>
          </section>

          <section className={cardClass}>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-950">
              <MapPin size={20} className="text-[#2563EB]" /> Lieu
            </h2>
            <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] text-white">
              <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-12 right-6 h-36 w-36 rounded-full bg-white/10" />
              <div className="relative text-center">
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#2563EB] shadow-lg">
                  <MapPin size={22} />
                </span>
                <p className="px-4 text-lg font-bold">{event.location}</p>
                <p className="mt-0.5 text-sm text-blue-100">{event.city}</p>
              </div>
            </div>
          </section>

          <EventChat />

          {similarEvents.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-950">Événements similaires</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {similarEvents.map((e) => (
                  <Link
                    key={e.id}
                    href={`/events/${e.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#2563EB]/40 hover:shadow-lg hover:shadow-blue-600/10"
                  >
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-slate-900 group-hover:text-[#2563EB]">
                        {e.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400">{e.date}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#2563EB]">
                      {e.price}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Colonne droite : billets */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-blue-900/10">
            {/* En-tête bleu */}
            <div className="relative overflow-hidden bg-[#2563EB] p-6 text-white">
              <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-14 left-16 h-32 w-32 rounded-full bg-white/5" />
              <div className="relative">
                <p className="text-sm text-blue-100">
                  {startingPrice !== null ? "À partir de" : "Billetterie"}
                </p>
                <p className="mt-1 text-4xl font-black tracking-tight">
                  {startingPrice !== null ? (
                    <>
                      {startingPrice.toLocaleString("fr-FR")}{" "}
                      <span className="text-lg font-bold text-blue-100">FCFA</span>
                    </>
                  ) : (
                    "Complet"
                  )}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-blue-50">
                  <span className="flex items-center gap-1.5">
                    <Users size={15} /> {event.attendees} participants
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star size={15} className="fill-yellow-300 text-yellow-300" /> {event.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Perforation façon billet */}
            <div className="relative h-0">
              <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#F5F8FF] ring-1 ring-slate-200/80" />
              <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#F5F8FF] ring-1 ring-slate-200/80" />
            </div>

            <div className="space-y-5 p-6">
              <h2 className="flex items-center gap-2 font-bold text-slate-950">
                <Ticket size={18} className="text-[#2563EB]" /> Billets
              </h2>
              <div className="space-y-2.5">
                {event.tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`rounded-2xl border p-4 transition ${
                      ticket.available
                        ? "border-slate-200 bg-white hover:border-[#2563EB]/40"
                        : "border-slate-100 bg-slate-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-900">{ticket.name}</span>
                      <span className="whitespace-nowrap font-bold text-[#2563EB]">
                        {ticket.price.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {Math.max(ticket.quantity - ticket.sold, 0)} place(s) disponible(s)
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          ticket.available ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        {ticket.available ? <CheckCircle size={13} /> : <XCircle size={13} />}
                        {ticket.available ? "Disponible" : "Épuisé"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowPurchaseModal(true)}
                disabled={!hasAvailableTickets}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] py-4 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {hasAvailableTickets ? "Réserver mon billet" : "Billets épuisés"}
                {hasAvailableTickets && <ArrowRight size={18} />}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck size={14} className="text-[#2563EB]" /> Réservation sécurisée
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ===== CTA FINAL ===== */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#2563EB] px-6 py-14 text-center text-white shadow-2xl shadow-blue-600/30 sm:px-10">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute bottom-6 left-1/3 h-24 w-24 rounded-full bg-white/5" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-black tracking-tight sm:text-4xl">
              Vous organisez un événement similaire ?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-blue-100">
              Publiez-le sur Evenn et touchez votre public.
            </p>
            <Link
              href="/auth/register"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 font-bold text-[#2563EB] shadow-xl shadow-blue-950/20 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Créer mon événement
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BARRE D'ACHAT MOBILE ===== */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400">À partir de</p>
            <p className="text-lg font-black leading-tight text-[#2563EB]">
              {startingPrice !== null ? `${startingPrice.toLocaleString("fr-FR")} FCFA` : "Complet"}
            </p>
          </div>
          <button
            onClick={() => setShowPurchaseModal(true)}
            disabled={!hasAvailableTickets}
            className="flex items-center gap-2 rounded-2xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {hasAvailableTickets ? "Réserver" : "Épuisé"}
            {hasAvailableTickets && <ArrowRight size={16} />}
          </button>
        </div>
      </div>

      {/* ===== MODAL D'ACHAT ===== */}
      <PurchaseModal
        eventId={event.id}
        eventTitle={event.title}
        tickets={event.tickets}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
    </main>
  );
}