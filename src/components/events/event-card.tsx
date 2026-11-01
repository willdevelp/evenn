import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatEventDateShort, formatEventPlace } from "@/lib/event-format";

/** Forme publique d'un événement pour les listes. */
export type EventListItem = {
  id: string;
  title: string;
  category: string | null;
  image: string | null;
  city: string | null;
  venue: string | null;
  date: string | null;
  ticketsSold: number;
};

/** Carte d'événement pour les listes publiques. Présentation uniquement. */
export default function EventCard({
  event,
  priority = false,
}: {
  event: EventListItem;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30"
    >
      <div className="relative h-48 w-full overflow-hidden bg-brand-900">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900"
          >
            <CalendarDays className="size-10 text-white/25" strokeWidth={1.5} />
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent"
        />

        {event.category && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
            {event.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-brand-700">
          {event.title}
        </h2>

        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3.5 text-slate-400" />{" "}
            {formatEventPlace(event.venue, event.city)}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays aria-hidden className="size-3.5 text-slate-400" />{" "}
            {formatEventDateShort(event.date)}
          </span>
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {event.ticketsSold > 0 ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Users aria-hidden className="size-3.5 text-slate-400" />
              {event.ticketsSold.toLocaleString("fr-FR")} billet
              {event.ticketsSold > 1 ? "s" : ""} vendu{event.ticketsSold > 1 ? "s" : ""}
            </span>
          ) : (
            <span
              className={cn(
                "text-xs font-semibold",
                event.date ? "text-emerald-600" : "text-slate-400",
              )}
            >
              {event.date ? "Billets disponibles" : "Date à confirmer"}
            </span>
          )}
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition duration-300 motion-safe:group-hover:bg-brand-600 motion-safe:group-hover:text-white">
            <ArrowRight className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
