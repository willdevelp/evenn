'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardShell from '@/src/components/dashboard/DashboardShell';
import { getEventById, type EventDetail } from '@/lib/actions/events/get-event-by-id';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Clock3,
  DollarSign,
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  Ticket,
  TrendingUp,
  Users,
} from 'lucide-react';

const formatCurrency = (value: number) => `${value.toLocaleString('fr-FR')} FCFA`;

const formatDate = (value: string | null) => {
  if (!value) return 'Date à définir';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date à définir';

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const getStatusLabel = (status: string | null) => {
  const normalized = status?.toLowerCase() ?? '';

  if (normalized.includes('draft')) return 'Brouillon';
  if (normalized.includes('published') || normalized.includes('active') || normalized.includes('live')) return 'Publié';
  if (normalized.includes('archived') || normalized.includes('finished') || normalized.includes('ended')) return 'Terminé';
  if (normalized.includes('cancel')) return 'Annulé';

  return 'À venir';
};

const getStatusStyles = (status: string | null) => {
  const normalized = status?.toLowerCase() ?? '';

  if (normalized.includes('draft')) return 'bg-slate-100 text-slate-700 border-slate-200';
  if (normalized.includes('published') || normalized.includes('active') || normalized.includes('live')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (normalized.includes('archived') || normalized.includes('finished') || normalized.includes('ended')) return 'bg-slate-200 text-slate-700 border-slate-300';
  if (normalized.includes('cancel')) return 'bg-red-100 text-red-700 border-red-200';

  return 'bg-blue-100 text-blue-700 border-blue-200';
};

const emptyCover = '/images/placeholder-event.jpg';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.id;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      router.replace('/dashboard/events');
      setIsLoading(false);
      return;
    }

    let active = true;

    const loadEvent = async () => {
      try {
        const storedEvent = await getEventById(String(eventId));

        if (!active) return;

        if (!storedEvent) {
          router.replace('/dashboard/events');
          return;
        }

        setEvent(storedEvent);
      } catch (error) {
        console.error('Erreur lors du chargement de l’événement:', error);
        router.replace('/dashboard/events');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadEvent();

    return () => {
      active = false;
    };
  }, [eventId, router]);

  if (isLoading) {
    return (
      <DashboardShell title="Événement" description="Chargement en cours...">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Chargement de l’événement...
        </div>
      </DashboardShell>
    );
  }

  if (!event) {
    return (
      <DashboardShell title="Événement introuvable" description="Cet événement n’existe plus ou n’est plus accessible.">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-slate-700">Aucun événement trouvé</p>
          <Link
            href="/dashboard/events"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1d4ed8]"
          >
            <ArrowLeft size={16} /> Retour à la liste
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const statusLabel = getStatusLabel(event.status);
  const statusStyles = getStatusStyles(event.status);
  const eventLocation = event.location || event.venue_name || event.city || 'Lieu à préciser';
  const soldRate = event.total_tickets > 0 ? Math.round((event.total_sold / event.total_tickets) * 100) : 0;

  const stats = [
    {
      label: 'Billets vendus',
      value: `${event.total_sold} / ${event.total_tickets}`,
      icon: Ticket,
      tone: 'bg-[#2563EB]/10 text-[#2563EB]',
    },
    {
      label: 'Revenus',
      value: formatCurrency(event.revenue),
      icon: DollarSign,
      tone: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Participants',
      value: `${event.total_sold}`,
      icon: Users,
      tone: 'bg-violet-100 text-violet-600',
    },
    {
      label: 'Taux de vente',
      value: `${soldRate}%`,
      icon: TrendingUp,
      tone: 'bg-cyan-100 text-cyan-600',
    },
  ];

  const recentActivity = [
    {
      title: 'Ventes enregistrées',
      detail: `${event.total_sold} billets vendus au total`,
      time: 'Aujourd’hui',
    },
    {
      title: 'Disponibilité',
      detail: `${Math.max(event.total_tickets - event.total_sold, 0)} places restantes`,
      time: 'Mise à jour',
    },
    {
      title: 'Revenus générés',
      detail: formatCurrency(event.revenue),
      time: 'Récapitulatif',
    },
  ];

  return (
    <DashboardShell
      title={event.title}
      description={eventLocation}
      action={
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} /> Retour
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1d4ed8]"
          >
            <ExternalLink size={16} /> Modifier
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-64 w-full overflow-hidden md:h-80">
            {event.cover_url || event.image ? (
              <img
                src={event.cover_url ?? event.image ?? emptyCover}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon size={28} />
                  <span className="text-sm font-medium">Aucune image</span>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-slate-950/10" />

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles}`}>
                  {statusLabel}
                </span>
                {event.category ? (
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {event.category}
                  </span>
                ) : null}
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                {event.title}
              </h2>
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <CalendarDays size={15} className="text-slate-500" />
                  {formatDate(event.date)}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Clock3 size={15} className="text-slate-500" />
                  {event.time || 'Heure à définir'}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <MapPin size={15} className="text-slate-500" />
                  {eventLocation}
                </div>
              </div>

              <p className="text-base leading-7 text-slate-600">
                {event.description || 'Aucune description n’a été ajoutée pour cet événement.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Résumé</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">État</dt>
                  <dd className="font-semibold text-slate-800">{statusLabel}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">Ventes</dt>
                  <dd className="font-semibold text-slate-800">{event.total_sold}/{event.total_tickets}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">Taux</dt>
                  <dd className="font-semibold text-slate-800">{soldRate}%</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Lieu</dt>
                  <dd className="max-w-[12rem] text-right font-semibold text-slate-800">{eventLocation}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className={`rounded-xl p-2.5 ${tone}`}>
                  <Icon size={18} />
                </div>
                <span className="text-xl font-black text-slate-900">{value}</span>
              </div>
              <p className="mt-3 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Billets</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">Types de billets</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {event.tickets.length} offres
              </span>
            </div>

            {event.tickets.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                Aucun type de billet n’a encore été configuré pour cet événement.
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nom</th>
                      <th className="px-4 py-3 font-medium">Prix</th>
                      <th className="px-4 py-3 font-medium">Stock</th>
                      <th className="px-4 py-3 font-medium">Vendus</th>
                      <th className="px-4 py-3 font-medium">Progression</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {event.tickets.map((ticket) => {
                      const progress = ticket.quantity > 0 ? Math.min((ticket.sold / ticket.quantity) * 100, 100) : 0;

                      return (
                        <tr key={ticket.id} className="text-slate-700">
                          <td className="px-4 py-3 font-medium text-slate-900">{ticket.name}</td>
                          <td className="px-4 py-3">{formatCurrency(ticket.price)}</td>
                          <td className="px-4 py-3">{ticket.quantity}</td>
                          <td className="px-4 py-3">{ticket.sold}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2.5 w-24 overflow-hidden rounded-full bg-slate-200">
                                <div
                                  className="h-full rounded-full bg-[#2563EB]"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Actions</p>
              <div className="mt-4 space-y-3">
                <Link
                  href="#"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <span className="inline-flex items-center gap-2">
                    <BadgeCheck size={16} className="text-emerald-600" />
                    Scanner les entrées
                  </span>
                  <ExternalLink size={14} className="text-slate-400" />
                </Link>
                <Link
                  href="#"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <span className="inline-flex items-center gap-2">
                    <Ticket size={16} className="text-[#2563EB]" />
                    Gérer les billets
                  </span>
                  <ExternalLink size={14} className="text-slate-400" />
                </Link>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Activité récente</p>
              <div className="mt-4 space-y-3">
                {recentActivity.map((item) => (
                  <div key={item.title} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                      </div>
                      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
