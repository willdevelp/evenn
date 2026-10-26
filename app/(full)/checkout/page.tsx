import { getReservation } from "@/lib/actions/reservations/get-reservation";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckOut({
  searchParams,
}: {
  searchParams: Promise<{ order?: string | string[] }>;
}) {
  const params = await searchParams;
  const orderId = Array.isArray(params.order) ? params.order[0] : params.order;
  const reservation = orderId ? await getReservation(orderId) : null;

  return <CheckoutClient orderId={orderId} reservation={reservation} />;
}
