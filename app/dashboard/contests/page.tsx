import Link from "next/link";
import { ArrowRight, Plus, Trophy } from "lucide-react";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import { getOrganizerContests } from "@/lib/actions/votes/get-organizer-contests";
import { formatVoteDateTime, formatVoteMoney } from "@/lib/vote-format";

export const dynamic = "force-dynamic";

export default async function OrganizerContestsPage() {
  const contests = await getOrganizerContests();

  return (
    <DashboardShell
      title="Mes concours"
      description="Créez un concours, ajoutez les candidats et suivez leur activité."
      action={
        <Link
          href="/dashboard/contests/create"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Plus className="size-4" /> Créer un concours
        </Link>
      }
    >
      {contests.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Trophy className="mx-auto size-9 text-brand-600" />
          <h2 className="mt-4 text-lg font-bold text-slate-900">Aucun concours pour le moment</h2>
          <p className="mt-2 text-sm text-slate-500">
            Ajoutez vos candidats avec leurs photos puis partagez la page de vote.
          </p>
        </section>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {contests.map((contest) => (
            <article
              key={contest.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900">{contest.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {contest.candidates} candidats · {contest.votes.toLocaleString("fr-FR")} votes
                  </p>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold capitalize text-brand-700">
                  {contest.status === "published" ? "Publié" : contest.status}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                {formatVoteMoney(contest.pricePerVote, contest.currency)} par vote
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatVoteDateTime(contest.startsAt)} — {formatVoteDateTime(contest.endsAt)}
              </p>
              {contest.status === "published" ? (
                <Link
                  href={`/vote/${contest.slug}`}
                  target="_blank"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Voir la page publique <ArrowRight className="size-4" />
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
