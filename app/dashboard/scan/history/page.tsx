import { getScanHistory } from "@/lib/actions/dashboard/get-dashboard-data";
import ScanHistoryClient from "./ScanHistoryClient";

export const dynamic = "force-dynamic";

export default async function ScanHistoryPage() {
  const rows = await getScanHistory();

  return <ScanHistoryClient rows={rows} />;
}
