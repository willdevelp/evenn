// app/events/page.js
import Link from "next/link";
import { getEvent } from "@/lib/actions/events/get-events";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";

const selectClass =
  "appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:border-[#2563EB]/40 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m4 6 4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat";

export default async function EventsPage() {
  const storedEvents = await getEvent();
  const events = storedEvents.map((event) => ({
    id: event.id,
    title: event.title,
    category: "Événement",
    city: event.location,
    date: String(event.date),
    price: "Prix selon le billet",
    attendees: 0,
    image: event.cover_url,
  }));
  const cities = [...new Set(events.map((event) => event.city))];
  const categories = [...new Set(events.map((event) => event.category))];

  return (
    <main className="min-h-screen bg-[#F5F8FF] font-sans text-slate-900 antialiased">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[#2563EB] pb-28 pt-16 text-white md:pb-32 md:pt-20">
        <div className="pointer-events-none absolute -left-24 -top-32 h-96 w-96 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-40 right-[-4rem] h-[28rem] w-[28rem] rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-1/3 top-10 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-6xl px-6">
          <h1 className="max-w-2xl text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Découvrez les événements près de vous
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-blue-100">
            Concerts, conférences, festivals, ateliers… trouvez ce qui vous correspond et réservez en quelques clics.
          </p>
        </div>
      </section>

      {/* ===== RECHERCHE + FILTRES (carte flottante) ===== */}
      <section className="relative z-10 mx-auto -mt-16 max-w-6xl px-6">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-2xl shadow-blue-900/15 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 ring-1 ring-slate-200 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2563EB]">
              <Search size={18} className="shrink-0 text-[#2563EB]" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                className="w-full border-0 bg-transparent py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
            <button className="rounded-2xl bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30">
              Rechercher
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <SlidersHorizontal size={15} /> Filtres
            </span>
            <select className={selectClass} aria-label="Ville">
              <option value="">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select className={selectClass} aria-label="Catégorie">
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select className={selectClass} aria-label="Prix">
              <option value="">Tous les prix</option>
              <option value="free">Gratuit</option>
              <option value="low">Moins de 5 000 FCFA</option>
              <option value="mid">5 000 – 15 000 FCFA</option>
              <option value="high">Plus de 15 000 FCFA</option>
            </select>
          </div>
        </div>
      </section>

      {/* ===== RÉSULTATS ===== */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-950">
              <span className="mr-2 inline-flex min-w-9 items-center justify-center rounded-xl bg-[#2563EB] px-2.5 py-1 text-base font-black text-white shadow-md shadow-blue-600/25">
                {events.length}
              </span>
              {events.length > 1 ? "événements trouvés" : "événement trouvé"}
            </h2>
            <select
              className="cursor-pointer rounded-xl border-0 bg-transparent py-2 pr-2 text-sm font-medium text-slate-600 outline-none hover:text-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
              aria-label="Trier"
            >
              <option>Trier par pertinence</option>
              <option>Date la plus proche</option>
              <option>Prix croissant</option>
            </select>
          </div>

          {events.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-lg shadow-blue-600/30">
                <CalendarDays size={26} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-950">Aucun événement pour le moment</h3>
              <p className="mt-1 text-sm text-slate-500">
                Revenez bientôt ou publiez le premier événement.
              </p>
              <Link
                href="/events/create"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
              >
                Créer mon événement <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(37,99,235,0.14)] transition duration-300 hover:-translate-y-1 hover:border-[#2563EB]/30 hover:shadow-2xl hover:shadow-blue-600/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/30"
                >
                  <div className="relative h-52 overflow-hidden bg-[#2563EB]">
                    {event.image ? (
                      <Image
                        src={event.image}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        alt={event.title}
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/40">
                        <CalendarDays size={48} strokeWidth={1.2} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/70 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#2563EB] shadow-lg">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-950 transition group-hover:text-[#2563EB]">
                      {event.title}
                    </h3>

                    <div className="mt-4 space-y-2.5 text-sm text-slate-500">
                      <div className="flex items-center gap-2.5">
                        <MapPin size={15} className="shrink-0 text-[#2563EB]" />
                        <span className="truncate">{event.city}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Calendar size={15} className="shrink-0 text-[#2563EB]" />
                        <span className="truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Users size={15} className="shrink-0 text-[#2563EB]" />
                        <span>{event.attendees} participants</span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-dashed border-slate-200 pt-5">
                      <span className="text-sm font-bold text-slate-900">{event.price}</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] transition group-hover:bg-[#2563EB] group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/30">
                        <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2 text-sm">
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-600 shadow-sm transition hover:border-[#2563EB]/40 hover:text-[#2563EB]">
              Précédent
            </button>
            <button
              aria-current="page"
              className="h-10 w-10 rounded-xl bg-[#2563EB] font-bold text-white shadow-lg shadow-blue-600/30"
            >
              1
            </button>
            <button className="h-10 w-10 rounded-xl border border-slate-200 bg-white font-medium text-slate-600 shadow-sm transition hover:border-[#2563EB]/40 hover:text-[#2563EB]">
              2
            </button>
            <button className="h-10 w-10 rounded-xl border border-slate-200 bg-white font-medium text-slate-600 shadow-sm transition hover:border-[#2563EB]/40 hover:text-[#2563EB]">
              3
            </button>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-600 shadow-sm transition hover:border-[#2563EB]/40 hover:text-[#2563EB]">
              Suivant
            </button>
          </nav>
        </div>
      </section>

      {/* ===== CTA ORGANISATEUR ===== */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#2563EB] px-6 py-16 text-center text-white shadow-2xl shadow-blue-600/30 sm:px-10">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute bottom-8 left-1/3 h-24 w-24 rounded-full bg-white/5" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-black tracking-tight sm:text-4xl">
              Vous organisez un événement ?
            </h2>
            <p className="mt-3 text-blue-100">
              Créez votre événement en quelques minutes et vendez vos billets sur Evenza.
            </p>
            <Link
              href="/events/create"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 font-bold text-[#2563EB] shadow-xl shadow-blue-950/20 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Créer mon événement
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-950 py-14 text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-4">
          <div>
            <span className="flex items-center gap-2.5 text-xl font-extrabold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] shadow-lg shadow-blue-600/30">
                <CalendarDays size={18} />
              </span>
              Evenza
            </span>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              La plateforme événementielle pour organisateurs et participants.
            </p>
            <p className="mt-5 text-xs text-slate-500">© 2026 Evenza. Tous droits réservés.</p>
          </div>
          <div>
            <h5 className="font-semibold text-white">Découvrir</h5>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/events" className="transition hover:text-white">
                  Événements
                </Link>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Catégories
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Villes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white">Organisateurs</h5>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#" className="transition hover:text-white">
                  Créer un événement
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Aide
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white">Légal</h5>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#" className="transition hover:text-white">
                  Confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  CGU
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}