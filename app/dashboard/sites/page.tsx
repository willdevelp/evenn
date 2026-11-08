import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  Globe2,
  Link2,
  Palette,
  PlusCircle,
  Sparkles,
} from "lucide-react";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import CopyLinkButton from "@/src/components/dashboard/CopyLinkButton";
import { getSitesOverview } from "@/lib/actions/sites/get-sites-overview";
import { EVENT_TYPE_META } from "@/lib/sites/catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sites web | Evenn",
  description: "Créez et partagez le site web personnalisé de vos événements.",
};

function formatDate(value: string | null) {
  if (!value) return "Date à définir";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date à définir";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function SitesPage() {
  const { sites, eligibleEvents } = await getSitesOverview();

  return (
    <DashboardShell
      title="Sites web"
      description="Donnez à vos événements une adresse et un site à leur image."
    >
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Sites créés", value: sites.length, icon: Globe2 },
          { label: "Sites en ligne", value: sites.filter((site) => site.status === "published").length, icon: Sparkles },
          { label: "Événements éligibles", value: eligibleEvents.length, icon: Palette },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
            <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
              <stat.icon size={19} />
            </span>
            <p className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-950 via-blue-800 to-indigo-700 p-6 text-white shadow-lg shadow-blue-900/10 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Site événementiel</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Votre événement mérite sa propre adresse.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
          Choisissez parmi trois modèles conçus pour les mariages, concours, baptêmes, deuils,
          anniversaires, formations et festivals. Personnalisez les couleurs, publiez, puis
          partagez le lien de votre sous-domaine.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-blue-50">
          {Object.values(EVENT_TYPE_META).map((meta) => (
            <span key={meta.label} className="rounded-full bg-white/10 px-3 py-1.5">
              {meta.label}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-900">Mes sites</h2>
            <p className="mt-1 text-sm text-slate-500">Un site est rattaché à un événement et à un sous-domaine.</p>
          </div>
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <CalendarDays size={16} /> Voir mes événements
          </Link>
        </div>

        {sites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
              <Globe2 size={26} />
            </span>
            <p className="mt-4 text-lg font-semibold text-slate-800">Aucun site créé pour le moment</p>
            <p className="mx-auto mt-1 max-w-lg text-sm text-slate-500">
              Choisissez un événement éligible ci-dessous, sélectionnez un modèle et un thème,
              puis réservez votre sous-domaine.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {sites.map((site) => {
              const theme = site.theme ?? {};
              return (
                <article key={site.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
                  <div
                    className="flex items-center justify-between gap-3 px-5 py-4 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor ?? "#1d4ed8"}, ${theme.accentColor ?? "#f59e0b"})`,
                    }}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{site.eventTitle ?? site.name}</p>
                      <p className="mt-0.5 truncate text-xs text-white/80">{site.subdomain}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
                      {site.status === "published" ? "En ligne" : site.status}
                    </span>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                        <Palette size={13} /> {site.templateName}
                      </span>
                      {site.eventType ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                          <Sparkles size={13} /> {EVENT_TYPE_META[site.eventType].label}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CopyLinkButton url={site.url} />
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
                      >
                        <ExternalLink size={15} /> Ouvrir
                      </a>
                      {site.eventId ? (
                        <Link
                          href={`/dashboard/events/${site.eventId}/site`}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <Link2 size={15} /> Gérer
                        </Link>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-400">Créé le {formatDate(site.createdAt)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold text-slate-900">Événements éligibles sans site</h2>
          <p className="mt-1 text-sm text-slate-500">
            Seuls les mariages, concours, baptêmes, deuils, anniversaires, formations et festivals
            peuvent recevoir un site personnalisé.
          </p>
        </div>

        {eligibleEvents.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
            Tous vos événements éligibles possèdent déjà un site.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
            <div className="divide-y divide-slate-100">
              {eligibleEvents.map((event) => (
                <div key={event.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-800">{event.title}</p>
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#2563EB]">
                        {EVENT_TYPE_META[event.eventType].label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {event.category ?? "Événement"} · {formatDate(event.date)}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/events/${event.id}/site`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-[#1d4ed8]"
                  >
                    <PlusCircle size={16} /> Créer le site <ArrowRight size={15} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
