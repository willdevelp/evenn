import { notFound } from "next/navigation";

import { getEventsById, getSimilarEvents } from "@/lib/actions/events/get-event-by-id";
import EventDetailClient from "./EventDetailClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Événement | Evenn",
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    notFound();
  }

  const storedEvent = await getEventsById(id);

  if (!storedEvent) {
    notFound();
  }

  const similarEvents = await getSimilarEvents(
    storedEvent.id,
    storedEvent.category_id,
    storedEvent.city,
  );

  const event = {
    id: storedEvent.id,
    category: storedEvent.category ?? "Événement",
    title: storedEvent.title,
    date: storedEvent.date ?? "",
    time: storedEvent.time,
    location: storedEvent.location,
    address: storedEvent.address ?? "",
    city: storedEvent.city ?? "",
    latitude: storedEvent.latitude,
    longitude: storedEvent.longitude,
    image: storedEvent.cover_url ?? "",
    organizer: storedEvent.organization_name ?? "",
    description: storedEvent.description ?? "",
    tickets: storedEvent.tickets.map((ticket) => ({
      id: ticket.id,
      name: ticket.name,
      price: ticket.price,
      quantity: ticket.quantity,
      sold: ticket.sold,
      maxPerOrder: ticket.maxPerOrder,
      available: ticket.quantity > ticket.sold,
    })),
    attendees: storedEvent.total_sold,
  };

  return <EventDetailClient event={event} similarEvents={similarEvents} />;
}
