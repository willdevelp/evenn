import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContestVotePage } from "@/lib/actions/votes/get-contest-vote-page";
import VoteClient from "./VoteClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const contest = await getContestVotePage(slug);
  if (!contest) return { title: "Concours introuvable | Evenn" };

  return {
    title: `${contest.title} | Votes Evenn`,
    description:
      contest.description ??
      `Votez pour votre candidat préféré dans le concours ${contest.title}.`,
  };
}

export default async function ContestVotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contest = await getContestVotePage(slug);
  if (!contest) notFound();

  return <VoteClient contest={contest} />;
}
