import { getDashboardOverview } from "@/lib/actions/dashboard/get-dashboard-data";
import DashboardOverviewClient from "./OverviewClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardOverview();

  return <DashboardOverviewClient data={data} />;
}
