import { getRevenueOverview } from "@/lib/actions/dashboard/get-dashboard-data";
import RevenueClient from "./RevenueClient";

export const dynamic = "force-dynamic";

export default async function RevenuePage() {
  const data = await getRevenueOverview();

  return <RevenueClient data={data} />;
}
