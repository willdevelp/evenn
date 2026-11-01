import { getVoteOrder } from "@/lib/actions/votes/get-vote-order";
import VoteCheckoutClient from "./VoteCheckoutClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Suivi du paiement | Evenn",
};

export default async function VoteCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string | string[] }>;
}) {
  const params = await searchParams;
  const orderId = Array.isArray(params.order) ? params.order[0] : params.order;
  const order = orderId ? await getVoteOrder(orderId) : null;

  const allowMockConfirm =
    process.env.NODE_ENV !== "production" || process.env.ENABLE_MOCK_PROVIDER === "true";

  return (
    <VoteCheckoutClient
      orderId={orderId}
      initialOrder={order}
      allowMockConfirm={allowMockConfirm}
    />
  );
}
