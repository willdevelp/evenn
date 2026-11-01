import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Globe,
  Link2,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import { getOrganizerProfile } from "@/lib/actions/dashboard/get-dashboard-data";

export const dynamic = "force-dynamic";

const formatDate = (value: string | null) => {
  if (!value) return "Date à définir";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date à définir";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const socialLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X / Twitter",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export default async function OrganizerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const organizer = await getOrganizerProfile(slug);

  if (!organizer) {
    notFound();
  }

  const now = Date.now();
  const upcoming = organizer.events.filter(
    (event) => !event.date || new Date(event.date).getTime() >= now,
  );
  const past = organizer.events.filter(
    (event) => event.date && new Date(event.date).getTime() < now,
  );

  const socialEntries = Object.entries(organizer.socialLinks).filter(
    ([, value]) => typeof value === "string" && value.trim().length > 0,
  );

  const totalCapacity = organizer.events.reduce((total, event) => total + event.capacity, 0);

  return (
    <DashboardShell
      title={organizer.name}
      description="Profil public de l’organisation."
      action={
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="size-4" /> Tableau de bord
        </Link>
      }
    >
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="h-24 bg-gradient-to-r from-brand-600 to-brand-500" />
        <div className="px-5 pb-6 sm:px-6">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {organizer.logoUrl ? (
                <Image
                  src={organizer.logoUrl}
                  alt={`Logo de ${organizer.name}`}
                  width={80}
                  height={80}
                  unoptimized
                  className="size-20 rounded-2xl border-4 border-white bg-white object-cover shadow-sm"
                />
              ) : (
                <span className="flex size-20 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-2xl font-bold text-white shadow-sm">
                  {organizer.name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">{organizer.name}</h1>
                  {organizer.verificationStatus === "verified" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      <BadgeCheck className="size-3.5" /> Vérifié
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {organizer.countryCode} · {organizer.events.length} événement(s)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {organizer.websiteUrl && (
                <a
                  href={organizer.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Globe className="size-4" /> Site web
                </a>
              )}
              {socialEntries.map(([key, value]) => (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Link2 className="size-4" /> {socialLabels[key] ?? key}
                </a>
              ))}
            </div>
          </div>

          {organizer.description && (
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-600">
              {organizer.description}
            </p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Événements", value: organizer.events.length, icon: CalendarDays },
              { label: "Billets vendus", value: organizer.participants, icon: Users },
              { label: "Places proposées", value: totalCapacity, icon: Ticket },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <Icon className="size-4" /> {label}
                </div>
                <p className="mt-2 text-xl font-bold text-slate-900">
                  {value.toLocaleString("fr-FR")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Événements à venir</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Événements passés</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} muted />
            ))}
          </div>
        </section>
      )}

      {organizer.events.length === 0 && (
        <section className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
          <CalendarDays className="mx-auto size-7 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-slate-700">Aucun événement publié</p>
          <p className="mt-1 text-xs text-slate-500">
            Les événements publiés par cette organisation apparaîtront ici.
          </p>
        </section>
      )}
    </DashboardShell>
  );
}

function EventCard({
  event,
  muted = false,
}: {
  event: {
    id: string;
    title: string;
    city: string | null;
    date: string | null;
    price: number | null;
    sold: number;
    capacity: number;
  };
  muted?: boolean;
}) {
  const rate = event.capacity > 0 ? Math.min((event.sold / event.capacity) * 100, 100) : 0;

  return (
    <Link
      href={`/events/${event.id}`}
      className={`group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 transition hover:border-brand-200 hover:shadow-md ${
        muted ? "opacity-80" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">{event.title}</h3>
        <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {event.price === null
            ? "Gratuit / non défini"
            : `${event.price.toLocaleString("fr-FR")} FCFA`}
        </span>
      </div>
      <div className="mt-3 space-y-1.5 text-sm text-slate-500">
        <p className="flex items-center gap-2">
          <CalendarDays className="size-4" /> {formatDate(event.date)}
        </p>
        {event.city && (
          <p className="flex items-center gap-2">
            <MapPin className="size-4" /> {event.city}
          </p>
        )}
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500">
          <span>
            {event.sold} / {event.capacity} billets
          </span>
          <span>{Math.round(rate)} %</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-600" style={{ width: `${rate}%` }} />
        </div>
      </div>
    </Link>
  );
}
