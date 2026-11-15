import { getEvent } from "@/lib/actions/events/get-events";
import EventsClient from "./EventsClient";
import type { EventListItem } from "@/src/components/events/event-card";
import Footer from "@/src/components/ui/footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Événements | Evenn",
  description:
    "Découvrez les événements près de vous : concerts, conférences, festivals et ateliers. Réservez en quelques clics.",
};

export default async function EventsPage() {
  const storedEvents = await getEvent();
  const events: EventListItem[] = storedEvents.map((event) => ({
      id: event.id,
      title: event.title,
      category: event.category,
      image: event.cover_url,
      city: event.city,
      venue: event.venue_name,
      date: event.date,
      ticketsSold: event.tickets_sold,
    }));

  return (
    <>
      <EventsClient events={events} />
      <Footer />
    </>
  );
}
