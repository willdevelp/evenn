"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import type { Event } from "@/lib/definition"; // adapte le chemin si nécessaire

export default function EventsListPage() {
  const router = useRouter();

  // 🧪 Données simulées (mock)
  const events: Event[] = [
    {
      id: "1",
      title: "Salon Tech 2025",
      description: "Un grand salon sur les innovations technologiques.",
      location: "Dakar Expo Center",
      date: "2025-10-12",
      time: "10:00",
      image: "/images/tech2025.jpg",
      prices: [5000, 10000],
      place: 200,
    },
    {
      id: "2",
      title: "Conférence RH",
      description: "Une conférence sur les nouvelles pratiques RH.",
      location: "Pullman Abidjan",
      date: "2025-11-05",
      time: "09:00",
      image: "/images/rh2025.jpg",
      prices: [8000],
      place: 120,
    },
    {
      id: "3",
      title: "Festival Digital",
      description: "Un festival pour les passionnés du numérique.",
      location: "Palais des Congrès - Cotonou",
      date: "2025-12-01",
      time: "14:00",
      image: "/images/festival2025.jpg",
      prices: [3000, 6000, 10000],
      place: 500,
    },
  ];

  const handleEdit = (id: string) => {
    router.push(`/dashboard/events/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    alert(`Évènement ${id} supprimé (simulation)`);
  };

  return (
    <div className="py-6 px-2">
      <section className="p-6 rounded-xl shadow border">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Mes évènements</h2>
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <h3 className="font-medium text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {event.date} à {event.time} • {event.location}
                </p>
                <p className="text-sm text-gray-500">
                  Places : {event.place} • Tarifs : {event.prices.join(" FCFA / ")} FCFA
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(event.id)}
                  className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                >
                  <FaEdit />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:underline flex items-center gap-1 text-sm"
                >
                  <FaTrash />
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}