"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  MapPin,
  QrCode,
  Search,
  TicketCheck,
  Users,
  X,
} from "lucide-react";
import { Container } from "@/src/components/ui/container";
import EmptyState from "@/src/components/ui/empty-state";
import EventCard, { type EventListItem } from "@/src/components/events/event-card";
import { cn } from "@/lib/utils";

import Header from "@/src/components/ui/header";
import Footer from "@/src/components/ui/footer";

const selectClass =
  "w-full cursor-pointer appearance-none border-0 bg-transparent py-3.5 pl-0 pr-7 text-sm font-medium text-slate-700 outline-none focus:ring-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m4 6 4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_0.25rem_center] bg-no-repeat";

const SORTS = [
  { value: "date-asc", label: "Date la plus proche" },
  { value: "date-desc", label: "Date la plus éloignée" },
  { value: "title", label: "Ordre alphabétique" },
] as const;

type SortValue = (typeof SORTS)[number]["value"];

export default function EventsClient({ events }: { events: EventListItem[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<SortValue>("date-asc");

  const cities = useMemo(
    () =>
      [...new Set(events.map((event) => event.city).filter(Boolean) as string[])].sort((a, b) =>
        a.localeCompare(b, "fr"),
      ),
    [events],
  );
  const categories = useMemo(
    () =>
      [...new Set(events.map((event) => event.category).filter(Boolean) as string[])].sort((a, b) =>
        a.localeCompare(b, "fr"),
      ),
    [events],
  );
  const ticketsSold = useMemo(
    () => events.reduce((sum, event) => sum + event.ticketsSold, 0),
    [events],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = events.filter((event) => {
      if (city && event.city !== city) return false;
      if (category && event.category !== category) return false;
      if (!needle) return true;
      return `${event.title} ${event.city ?? ""} ${event.venue ?? ""}`
        .toLowerCase()
        .includes(needle);
    });

    return list.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : Number.POSITIVE_INFINITY;
      const dateB = b.date ? new Date(b.date).getTime() : Number.POSITIVE_INFINITY;

      if (sort === "title") return a.title.localeCompare(b.title, "fr");
      if (sort === "date-desc") return dateB - dateA;
      return dateA - dateB;
    });
  }, [events, query, city, category, sort]);

  const filtersActive = query !== "" || city !== "" || category !== "";
  const resetFilters = () => {
    setQuery("");
    setCity("");
    setCategory("");
  };

  const stats = [
    {
      icon: CalendarDays,
      label: "Événements à venir",
      value: events.length.toLocaleString("fr-FR"),
    },
    {
      icon: MapPin,
      label: "Villes couvertes",
      value: cities.length.toLocaleString("fr-FR"),
    },
    {
      icon: TicketCheck,
      label: "Billets déjà vendus",
      value: ticketsSold.toLocaleString("fr-FR"),
    },
  ];

  return (
    <>
    <Header />
    <main className="min-h-screen bg-surface pb-20 text-slate-700">
      {/* ===== EN-TÊTE ===== */}
      <section className="relative isolate overflow-hidden bg-brand-600 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-40 size-[480px] rounded-full bg-brand-500/60 blur-3xl"
        />

        <Container className="relative grid items-center gap-10 pb-24 pt-14 sm:pb-28 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="motion-safe:animate-fade-up">
            <h1 className="max-w-2xl text-balance text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              Vos prochaines sorties commencent ici.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-brand-50/90 sm:text-lg sm:leading-8">
              Concerts, conférences, festivals et ateliers : trouvez l’événement qui vous
              ressemble et réservez votre place en quelques clics.
            </p>
            <a
              href="#evenements"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/50"
            >
              Explorer les événements <ArrowRight aria-hidden className="size-4" />
            </a>
          </div>

          {/* Talon : les chiffres de la plateforme */}
          <div className="motion-safe:animate-fade-up [animation-delay:200ms]">
            {events.length > 0 ? (
              <dl className="mx-auto w-full max-w-md rounded-3xl bg-white text-slate-950 shadow-pop lg:ml-auto">
                {stats.map(({ icon: Icon, label, value }, i) => (
                  <div
                    key={label}
                    className={cn(
                      "relative flex items-center justify-between gap-4 px-6 py-5",
                      i > 0 && "border-t-2 border-dashed border-brand-200",
                    )}
                  >
                    {i > 0 && (
                      <>
                        <span
                          aria-hidden
                          className="absolute -left-3 -top-3.5 size-6 rounded-full bg-brand-600"
                        />
                        <span
                          aria-hidden
                          className="absolute -right-3 -top-3.5 size-6 rounded-full bg-brand-600"
                        />
                      </>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                        <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                      </span>
                      <dt className="text-sm text-slate-500">{label}</dt>
                    </div>
                    <dd className="text-3xl font-bold tracking-tight text-slate-950">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mx-auto max-w-md rounded-3xl bg-white p-6 text-sm leading-6 text-slate-600 shadow-pop lg:ml-auto">
                Les prochains rendez-vous arrivent bientôt. Revenez découvrir les nouveautés.
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* ===== RECHERCHE + FILTRES ===== */}
      <Container className="relative z-10 -mt-12">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
            <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-surface px-4 transition focus-within:border-brand-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-600/10">
              <Search aria-hidden className="size-5 shrink-0 text-brand-600" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Un événement, une ville, un lieu…"
                aria-label="Rechercher un événement"
                className="w-full border-0 bg-transparent py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-600/10">
              <MapPin aria-hidden className="size-4 shrink-0 text-brand-600" />
              <select
                className={selectClass}
                aria-label="Filtrer par ville"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              >
                <option value="">Toutes les villes</option>
                {cities.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {categories.length > 0 && (
            <div
              role="group"
              aria-label="Filtrer par catégorie"
              className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {["", ...categories].map((name) => {
                const active = category === name;
                return (
                  <button
                    key={name || "all"}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(name)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/25",
                      active
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:bg-brand-50/60 hover:text-brand-700",
                    )}
                  >
                    {active && <Check aria-hidden className="size-3.5" />}
                    {name || "Toutes les catégories"}
                  </button>
                );
              })}
            </div>
          )}

          {filtersActive && (
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                {filtered.length.toLocaleString("fr-FR")} résultat{filtered.length > 1 ? "s" : ""}{" "}
                sur {events.length.toLocaleString("fr-FR")}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20"
              >
                <X aria-hidden className="size-4" /> Effacer les filtres
              </button>
            </div>
          )}
        </div>
      </Container>

      {/* ===== RÉSULTATS ===== */}
      <Container id="evenements" className="scroll-mt-24 py-12 sm:py-16">
        {events.length === 0 ? (
          <EmptyState
            icon={<CalendarDays aria-hidden className="size-7" />}
            title="Aucun événement pour le moment"
            description="Revenez bientôt ou publiez le premier événement depuis votre espace organisateur."
            action={{ href: "/auth/register", label: "Créer mon compte" }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search aria-hidden className="size-7" />}
            title="Aucun résultat pour ces filtres"
            description="Essayez d’élargir votre recherche ou réinitialisez les filtres."
            action={{ label: "Réinitialiser les filtres", onClick: resetFilters }}
          />
        ) : (
          <div>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <h2
                className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
                aria-live="polite"
              >
                {filtered.length.toLocaleString("fr-FR")} événement
                {filtered.length > 1 ? "s" : ""} à découvrir
              </h2>
              <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-600/10 sm:w-60">
                <span className="shrink-0 text-xs font-medium text-slate-400">Trier</span>
                <select
                  className={selectClass}
                  aria-label="Trier les événements"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortValue)}
                >
                  {SORTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {filtered.map((event, index) => (
                <div
                  key={event.id}
                  className="motion-safe:animate-fade-up"
                  style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
                >
                  <EventCard event={event} priority={index === 0} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* ===== CTA ORGANISATEUR (billet) ===== */}
      <Container>
        <section
          aria-labelledby="organizer-cta"
          className="relative mx-auto grid max-w-5xl md:grid-cols-[1fr_280px]"
        >
          <div className="relative overflow-hidden rounded-t-[2rem] bg-brand-600 px-7 py-11 text-white sm:px-12 sm:py-14 md:rounded-l-[2rem] md:rounded-tr-none">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]"
            />
            <div className="relative max-w-lg">
              <h2
                id="organizer-cta"
                className="text-balance text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Vous organisez un événement ?
              </h2>
              <p className="mt-4 text-sm leading-7 text-brand-50/90 sm:text-base">
                Créez votre événement en quelques minutes, vendez vos billets et contrôlez les
                accès par QR Code.
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                {["Page prête en 5 minutes", "Paiement sécurisé", "Scan hors connexion"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                        <Check aria-hidden className="size-3" />
                      </span>
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center gap-5 rounded-b-[2rem] border-t-2 border-dashed border-brand-200 bg-white px-7 py-9 text-center shadow-card md:rounded-bl-none md:rounded-r-[2rem] md:border-l-2 md:border-t-0">
            <span
              aria-hidden
              className="absolute -left-4 -top-4 size-8 rounded-full bg-surface md:left-[-17px]"
            />
            <span
              aria-hidden
              className="absolute -right-4 -top-4 size-8 rounded-full bg-surface md:-bottom-4 md:left-[-17px] md:right-auto md:top-auto"
            />
            <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <QrCode aria-hidden className="size-10" strokeWidth={1.25} />
            </span>
            <p className="text-sm text-slate-500">Aucune carte bancaire requise pour l’essai.</p>
            <Link
              href="/auth/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30"
            >
              Créer mon événement <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </section>
      </Container>
    </main>
    <Footer />
    </>
  );
}