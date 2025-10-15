"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/src/components/ui/skeleton";

// Ton type Event à jour
export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image: string;
  prices: number[];
  place: number;
};

// Utilitaire pour formater les dates
function formatDateTime(date: string, time: string): string {
    if (!date || !time) return "Date invalide";
  
    const isoDate = `${date}T${time}`;
    const parsedDate = new Date(isoDate);
  
    if (isNaN(parsedDate.getTime())) return "Date invalide";
  
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  }
  

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Erreur lors du chargement des événements", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className=" py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
          🎟️ Nos Événements à venir
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${encodeURIComponent(event.title)}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-5 space-y-2">
                    <h2 className="text-xl font-semibold text-gray-800 truncate">
                      {event.title}
                    </h2>

                    <p className="text-sm text-gray-500">
                      📍 {event.location}
                    </p>

                    <p className="text-sm text-gray-500">
                      🗓️ {formatDateTime(event.date, event.time)}
                    </p>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between pt-3">
                      <span className="text-indigo-600 font-medium text-sm">
                        À partir de {Math.min(...event.prices)}€
                      </span>
                      <span className="text-sm text-gray-500">
                        {event.place} places
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}