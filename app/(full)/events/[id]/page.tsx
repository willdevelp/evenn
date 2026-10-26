// app/events/[slug]/page.js
import { notFound } from 'next/navigation';
import { getEventsById } from '@/lib/actions/events/get-event-by-id';
import { getEvent } from '@/lib/actions/events/get-events';
import EventDetailClient from './EventDetailClient';

// Génération des paramètres statiques pour le build
export async function generateStaticParams() {
  const events = await getEvent();

  return events.map((event) => ({
    id: String(event.id),
  }));
}

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
  console.log('storedEvent:', storedEvent);

  if (!storedEvent) {
    notFound();
  }

  const event = {
    id: storedEvent.id,
    category: storedEvent.category ?? 'Événement',
    title: storedEvent.title,
    date: storedEvent.date ?? '',
    time: storedEvent.time,
    location: storedEvent.location,
    image: storedEvent.cover_url ?? '',
    city: storedEvent.city ?? storedEvent.location,
    organizer: 'Organisateur',
    description: storedEvent.description ?? '',
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
    rating: 0,
  };

  return <EventDetailClient event={event} similarEvents={[]} />;
}