// app/organizer/[slug]/page.js
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  CalendarDays,
  ArrowRight,
} from 'lucide-react';
import { getOrganizerBySlug, getEventsByOrganizerId, organizersData } from '@/lib/bd';

// Génération des paramètres statiques
export async function generateStaticParams() {
  return organizersData.map((org) => ({
    slug: org.slug,
  }));
}

export default async function OrganizerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const organizer = getOrganizerBySlug(slug);

  if (!organizer) {
    notFound();
  }

  const events = getEventsByOrganizerId(organizer.id);
  const pastEvents = events.filter(e => e.status === 'past');
  const upcomingEvents = events.filter(e => e.status === 'upcoming' || e.status === 'ongoing');

  // Social icons mapping
  const socialIcons: Record<string, typeof Facebook> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    website: Globe,
  };

  return (
    <main className="font-sans antialiased bg-white text-gray-900 min-h-screen">

      {/* ===== HEADER ===== */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-extrabold text-[#2563EB]">Evenza</Link>
            <span className="text-xs font-medium bg-[#0EA5E9]/10 text-[#0EA5E9] px-2 py-0.5 rounded-full">Organisateur</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-[#2563EB] transition">Accueil</Link>
            <Link href="/events" className="hover:text-[#2563EB] transition">Explorer</Link>
            <Link href="#" className="hover:text-[#2563EB] transition">À venir</Link>
            <Link href="#" className="hover:text-[#2563EB] transition">Mon compte</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="#" className="hidden sm:inline-block text-sm font-medium text-[#2563EB] hover:underline">Se connecter</Link>
            <Link href="#" className="bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/40 hover:bg-[#1d4ed8] transition-all flex items-center gap-1">
              Créer un événement
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* ===== SECTION PROFIL ===== */}
      <section className="relative bg-gradient-to-r from-[#0EA5E9]/10 to-[#2563EB]/10 py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Logo */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white shadow-xl border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {organizer.logo ? (
                <Image src={organizer.logo} alt={organizer.name} width={160} height={160} className="object-cover" />
              ) : (
                <span className="text-4xl font-extrabold text-[#2563EB]">
                  {organizer.name.charAt(0)}
                </span>
              )}
            </div>
            {/* Infos */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{organizer.name}</h1>
              <p className="text-gray-600 mt-2 max-w-2xl leading-relaxed">
                {organizer.description}
              </p>
              {/* Réseaux sociaux */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {Object.entries(organizer.social || {}).map(([key, url]) => {
                  const Icon = socialIcons[key as keyof typeof socialIcons];
                  if (!Icon) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white border border-gray-200 rounded-xl hover:border-[#2563EB] hover:shadow-md transition text-gray-600 hover:text-[#2563EB]"
                      title={key}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
                {(!organizer.social || Object.keys(organizer.social).length === 0) && (
                  <span className="text-sm text-gray-400">Aucun réseau social renseigné</span>
                )}
              </div>
            </div>
            {/* Statistiques rapides */}
            <div className="flex md:flex-col gap-4 md:gap-2 text-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div>
                <p className="text-2xl font-extrabold text-[#2563EB]">{events.length}</p>
                <p className="text-xs text-gray-500">Événements</p>
              </div>
              <div className="hidden md:block w-12 h-px bg-gray-200 mx-auto" />
              <div>
                <p className="text-2xl font-extrabold text-[#0EA5E9]">
                  {events.reduce((acc, e) => acc + e.attendees, 0)}
                </p>
                <p className="text-xs text-gray-500">Participants</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ÉVÉNEMENTS ===== */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        {/* Événements à venir */}
        {upcomingEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CalendarDays size={24} className="text-[#2563EB]" /> Événements à venir
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-5 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-2xl flex-shrink-0">
                      🎫
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{event.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} /> {event.city}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Calendar size={14} /> {event.date}
                    </span>
                    <span className="font-bold text-[#2563EB]">{event.price}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <Users size={12} /> {event.attendees} participants
                    <span className="ml-auto flex items-center gap-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" /> {event.rating}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Événements passés */}
        {pastEvents.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar size={24} className="text-gray-400" /> Événements passés
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-5 opacity-75 hover:opacity-100 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
                      🎫
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{event.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} /> {event.city}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Calendar size={14} /> {event.date}
                    </span>
                    <span className="text-gray-400 line-through">{event.price}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <Users size={12} /> {event.attendees} participants
                    <span className="ml-auto flex items-center gap-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" /> {event.rating}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 inline-block">
                    Terminé
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Cet organisateur n&apos;a pas encore publié d&apos;événements.</p>
          </div>
        )}
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-extrabold text-white flex items-center gap-2">
              <CalendarDays size={24} className="text-[#0EA5E9]" /> Evenza
            </span>
            <p className="text-sm text-gray-400 mt-2">La plateforme événementielle pour organisateurs et participants.</p>
            <p className="text-xs text-gray-500 mt-4">© 2026 Evenza. Tous droits réservés.</p>
          </div>
          <div>
            <h5 className="font-semibold text-white">Découvrir</h5>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/events" className="hover:text-white">Événements</Link></li>
              <li><a href="#" className="hover:text-white">Catégories</a></li>
              <li><a href="#" className="hover:text-white">Villes</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white">Organisateurs</h5>
            <ul className="mt-2 space-y-1 text-sm">
              <li><a href="#" className="hover:text-white">Créer un événement</a></li>
              <li><a href="#" className="hover:text-white">Tarifs</a></li>
              <li><a href="#" className="hover:text-white">Aide</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white">Légal</h5>
            <ul className="mt-2 space-y-1 text-sm">
              <li><a href="#" className="hover:text-white">Confidentialité</a></li>
              <li><a href="#" className="hover:text-white">CGU</a></li>
              <li><a href="#" className="hover:text-white">Cookies</a></li>
            </ul>
          </div>
        </div>
      </footer>

    </main>
  );
}