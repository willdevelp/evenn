import { notFound } from "next/navigation";

import { getTicketForQr } from "@/lib/actions/dashboard/get-dashboard-data";
import TicketQrClient from "./TicketQrClient";

export const dynamic = "force-dynamic";

export default async function TicketQRPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicketForQr(id);

  if (!ticket) {
    notFound();
  }

  return <TicketQrClient ticket={ticket} />;
}
