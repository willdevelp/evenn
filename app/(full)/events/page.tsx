import { getEvent } from "@/lib/actions/events/get-events";
import EventsClient from "./EventsClient";
import type { EventListItem } from "@/src/components/events/event-card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Événements | Evenn",
  description:
    "Découvrez les événements près de vous : concerts, conférences, festivals et ateliers. Réservez en quelques clics.",
};

export default async function EventsPage() {
  const storedEvents = await getEvent();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const events: EventListItem[] = storedEvents
    .filter((event) => !event.date || new Date(event.date).getTime() >= startOfToday.getTime())
    .map((event) => ({
      id: event.id,
      title: event.title,
      category: event.category,
      image: event.cover_url,
      city: event.city,
      venue: event.venue_name,
      date: event.date,
      ticketsSold: event.tickets_sold,
    }));

  return <EventsClient events={events} />;
}
