import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  ShieldCheck,
  Ticket,
  User,
} from "lucide-react";
import type { ReservationDetail } from "@/lib/actions/reservations/get-reservation";
import TicketCodes from "@/src/components/ui/code";

const formatCurrency = (value: number) =>
  `${value.toLocaleString("fr-FR")} FCFA`;

const formatDate = (value: string | null) => {
  if (!value) return "Date à préciser";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date à préciser";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const statusLabel = (status: string) => {
  if (status === "paid") return "Réservation confirmée";
  if (status === "cancelled") return "Réservation annulée";
  if (status === "pending") return "En attente de confirmation";
  return status;
};

export default function CheckoutClient({
  orderId,
  reservation,
}: {
  orderId?: string;
  reservation: ReservationDetail | null;
}) {
  if (!reservation) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 py-16">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Ticket size={25} />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
            {orderId ? "Réservation introuvable" : "Aucune réservation en cours"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {orderId
              ? "Ce lien de réservation est invalide ou la réservation n'existe plus."
              : "Choisissez un événement pour sélectionner vos billets et retrouver votre récapitulatif ici."}
          </p>
          <Link
            href="/events"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={16} /> Parcourir les événements
          </Link>
        </section>
      </main>
    );
  }

  const quantity = reservation.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = reservation.items.reduce((sum, item) => sum + item.amount, 0);
  const isConfirmed = reservation.status === "paid";

  return (
    <main className="min-h-[65vh] bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/events/${reservation.eventId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft size={16} /> Retour à l&apos;événement
        </Link>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Ticket size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                  Votre réservation
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                  Récapitulatif
                </h1>
              </div>
            </div>

            <div
              className={`mt-6 flex items-center gap-2 rounded-xl border p-3 text-sm ${
                isConfirmed
                  ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                  : "border-amber-100 bg-amber-50 text-amber-800"
              }`}
            >
              <CheckCircle2 size={17} />
              <span className="font-semibold">{statusLabel(reservation.status)}</span>
              <span className="ml-auto text-xs opacity-70">
                {reservation.orderNumber}
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Événement
              </p>
              <h2 className="mt-2 text-lg font-bold text-slate-900">
                {reservation.eventTitle}
              </h2>
              <div className="mt-3 space-y-1.5 text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <Calendar size={14} /> {formatDate(reservation.eventDate)}
                </p>
                {(reservation.venue || reservation.city) && (
                  <p className="flex items-center gap-2">
                    <MapPin size={14} />
                    {reservation.venue || reservation.city}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Billets
              </p>
              <div className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                {reservation.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.ticketTypeName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-slate-700">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Quantité totale</dt>
                <dd className="font-semibold text-slate-800">{quantity} billet(s)</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-200 pt-4">
                <dt className="font-semibold text-slate-800">Total</dt>
                <dd className="text-lg font-extrabold text-blue-700">
                  {formatCurrency(total)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 p-4 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2 text-slate-600">
                <User size={14} className="text-slate-400" />
                {reservation.buyerName ?? "Client"}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Mail size={14} className="text-slate-400" />
                {reservation.buyerEmail ?? "Email non renseigné"}
              </p>
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ShieldCheck size={18} className="text-emerald-600" />
              Vos billets électroniques
            </div>
            {isConfirmed ? (
              <TicketCodes
                tickets={reservation.tickets}
                eventTitle={reservation.eventTitle}
              />
            ) : (
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                Vos billets seront disponibles dès que la réservation sera confirmée.
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
