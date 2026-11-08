import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Link2,
  Mail,
  MessageCircle,
  Palette,
  Sparkles,
} from "lucide-react";

import DashboardShell from "@/src/components/dashboard/DashboardShell";
import CopyLinkButton from "@/src/components/dashboard/CopyLinkButton";
import { getEventSiteContext } from "@/lib/actions/sites/get-event-site-context";
import { EVENT_TYPE_META } from "@/lib/sites/catalog";
import SiteBuilderClient from "./SiteBuilderClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Site de l'événement | Evenn",
};

type Props = { params: Promise<{ id: string }> };

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

export default async function EventSitePage({ params }: Props) {
  const { id } = await params;
  const context = await getEventSiteContext(id);

  if (!context) notFound();

  const backAction = (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/dashboard/sites"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <ArrowLeft size={16} /> Mes sites
      </Link>
      <Link
        href={`/dashboard/events/${context.event.id}`}
        className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1d4ed8]"
      >
        <CalendarDays size={16} /> L&apos;événement
      </Link>
    </div>
  );

  if (!context.eventType) {
    return (
      <DashboardShell
        title="Site web"
        description={`${context.event.title} · ${context.event.category ?? "Événement"}`}
        action={backAction}
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
            <Globe2 size={26} />
          </span>
          <h2 className="mt-4 text-xl font-bold text-amber-950">Type d&apos;événement non pris en charge</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-amber-800">
            Les sites personnalisés sont disponibles uniquement pour les mariages, concours,
            baptêmes, deuils, anniversaires, formations et festivals. Modifiez la catégorie de
            l&apos;événement pour l&apos;un de ces types, puis revenez ici.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {Object.values(EVENT_TYPE_META).map((meta) => (
              <span key={meta.label} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-amber-800">
                {meta.label}
              </span>
            ))}
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (context.site) {
    const site = context.site;
    const theme = site.theme;
    const emailBody = [
      `Bonjour,`,
      ``,
      `Découvrez le site de l'événement « ${context.event.title} » :`,
      site.url,
      ``,
      `À très vite !`,
    ].join("\n");
    const mailto = `mailto:?subject=${encodeURIComponent(`Site de ${context.event.title}`)}&body=${encodeURIComponent(emailBody)}`;
    const whatsapp = `https://wa.me/?text=${encodeURIComponent(`Découvrez le site de ${context.event.title} : ${site.url}`)}`;

    return (
      <DashboardShell
        title="Site web de l'événement"
        description={`${context.event.title} · ${context.eventTypeLabel}`}
        action={backAction}
      >
        <div className="mx-auto max-w-4xl space-y-6">
          <section
            className="overflow-hidden rounded-3xl p-6 text-white shadow-lg sm:p-8"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor ?? "#1d4ed8"}, ${theme.accentColor ?? "#f59e0b"})`,
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  <CheckCircle2 size={14} /> Site publié
                </span>
                <h2 className="mt-4 text-3xl font-black tracking-tight">{context.event.title}</h2>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-white/90 underline-offset-4 hover:underline"
                >
                  <Link2 size={15} /> {site.url}
                </a>
              </div>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-100"
              >
                <ExternalLink size={16} /> Voir le site
              </a>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Modèle</p>
              <p className="mt-2 flex items-center gap-2 font-semibold text-slate-900">
                <Palette size={17} className="text-[#2563EB]" /> {site.templateName}
              </p>
              <div className="mt-4 flex gap-1.5">
                {[theme.primaryColor, theme.accentColor, theme.backgroundColor, theme.textColor]
                  .filter(Boolean)
                  .map((color) => (
                    <span
                      key={color}
                      className="h-8 w-8 rounded-full border border-slate-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Détails</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="font-semibold text-slate-800">{context.eventTypeLabel}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Date</dt>
                  <dd className="font-semibold text-slate-800">{formatDate(context.event.date)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Sous-domaine</dt>
                  <dd className="font-semibold text-slate-800">{site.subdomain}</dd>
                </div>
              </dl>
            </div>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                  <Mail size={18} className="text-[#2563EB]" /> Envoyer le lien
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Partagez l&apos;adresse du site avec vos invités par email ou sur WhatsApp.
                </p>
              </div>
              <CopyLinkButton url={site.url} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={mailto}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
              >
                <Mail size={16} /> Envoyer par email
              </a>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                <MessageCircle size={16} /> Partager sur WhatsApp
              </a>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Sparkles size={15} className="text-[#2563EB]" />
              Un seul site par événement. Le lien reste actif tant que le site est publié.
            </span>
            <Link href="/dashboard/sites" className="font-semibold text-[#2563EB] hover:text-[#1d4ed8]">
              Voir tous mes sites
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Créer le site de l'événement"
      description={`${context.event.title} · ${context.eventTypeLabel}`}
      action={backAction}
    >
      <SiteBuilderClient context={context} />
    </DashboardShell>
  );
}
