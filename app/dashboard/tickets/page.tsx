import { getTickets } from "@/lib/actions/tickets/get-tickets";
import { getPublicSettings } from "@/lib/actions/settings/get-public-settings";
import TicketsClient from "./TicketsClient";

export const dynamic = "force-dynamic";

export default async function TicketManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const { event } = await searchParams;
  const eventId = typeof event === "string" ? event : undefined;
  const [tickets, settings] = await Promise.all([getTickets(eventId), getPublicSettings()]);

  return (
    <TicketsClient tickets={tickets} eventId={eventId} currency={settings.currency} />
  );
}
