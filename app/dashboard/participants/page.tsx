import { getParticipants } from "@/lib/actions/dashboard/get-dashboard-data";
import ParticipantsClient from "./ParticipantsClient";

export const dynamic = "force-dynamic";

export default async function ParticipantsPage() {
  const data = await getParticipants();

  return <ParticipantsClient data={data} />;
}
