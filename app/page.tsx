"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Event } from "@/lib/definition";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import Header from "@/src/components/ui/header";
import Footer from "@/src/components/ui/footer";
// import Image from "next/image";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <>
      <Header />
      <main className="bg-white text-gray-800">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Vivez des expériences inoubliables avec <span className="text-yellow-300">Evenn</span>
            </h1>
            <p className="text-lg mb-8">
              Découvrez, réservez ou organisez des événements exceptionnels en quelques clics.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/events"
                className="bg-white text-indigo-700 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 transition"
              >
                Explorer les événements
              </Link>
              <Link
                href="/organize"
                className="border border-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-indigo-700 transition"
              >
                Organiser un événement
              </Link>
            </div>
          </div>
        </section>

        {/* Section à propos */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Qui sommes-nous ?</h2>
            <p className="text-gray-600 text-lg">
              Evenn est une plateforme innovante conçue pour connecter les amoureux de la culture, de la musique, des affaires
              ou des loisirs à des événements qui leur ressemblent. Réservez facilement, vivez pleinement.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <div className="bg-gray-50">
          <section className="py-20 max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Evenn ?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Téléchargement unique", desc: "Vos participants téléchargent leurs billets QR immédiatement après la réservation." },
                { title: "Pas de compte requis", desc: "Les participants réservent et obtiennent leurs billets sans créer de compte." },
                { title: "QR Code sécurisé", desc: "Chaque billet est unique et vérifié à l’entrée." },
                { title: "Intégration simple", desc: "Export PDF ou accès API pour automatiser vos événements." },
                { title: "Support rapide", desc: "Nous sommes disponibles pour aider vos organisateurs rapidement." },
                { title: "Tarifs clairs", desc: "Free / Pro / Entreprise, choisissez ce qui vous convient." },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow text-center">
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Événements à venir */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Événements à venir</h2>

            {events.length === 0 ? (
              <p className="text-center text-gray-500">Aucun événement à venir pour le moment.</p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {events.slice(0, 6).map((event) => (
                  <Link key={event.id} href={`/events/${event.title}`} className="group">
                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        width={500}
                        height={300}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 gap-2 mb-1">
                          <FaCalendarAlt /> <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                          <FaMapMarkerAlt /> <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-indigo-50 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Vous êtes organisateur ?</h2>
            <p className="text-gray-700 text-lg mb-6">
              Publiez vos événements sur Evenn, touchez un large public et gérez vos réservations en toute simplicité.
            </p>
            <Link
              href="/organize"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              Créer un événement
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}