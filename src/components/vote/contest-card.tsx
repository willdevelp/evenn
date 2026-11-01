import Link from "next/link";
import { ArrowRight, CalendarDays, Trophy, Users, Vote } from "lucide-react";

import { getContestTiming, formatVoteDate } from "@/lib/vote-format";
import type { ContestListItem } from "@/lib/actions/votes/get-contests";
import { ContestStatusChip } from "@/src/components/vote/status";

/** Carte de concours pour la page /vote. Rendu serveur, présentation uniquement. */
export default function ContestCard({
  contest,
  priority = false,
}: {
  contest: ContestListItem;
  priority?: boolean;
}) {
  const meta = [
    { icon: CalendarDays, value: formatVoteDate(contest.endsAt) },
    {
      icon: Users,
      value: `${contest.candidateCount} candidat${contest.candidateCount > 1 ? "s" : ""}`,
    },
    contest.totalVotes === null
      ? null
      : {
          icon: Vote,
          value: `${contest.totalVotes.toLocaleString("fr-FR")} vote${contest.totalVotes > 1 ? "s" : ""}`,
        },
  ].filter((item): item is { icon: typeof CalendarDays; value: string } => item !== null);

  return (
    <Link
      href={`/vote/${contest.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30"
    >
      <div className="relative h-44 w-full overflow-hidden bg-brand-900">
        {contest.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={contest.coverUrl}
            alt={`Visuel du concours ${contest.title}`}
            loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900"
          >
            <Trophy className="size-10 text-white/25" />
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent"
        />
        <ContestStatusChip
          timing={getContestTiming(contest.startsAt, contest.endsAt)}
          className="absolute left-4 top-4"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-bold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-brand-700">
          {contest.title}
        </h2>
        {contest.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {contest.description}
          </p>
        )}

        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
          {meta.map(({ icon: Icon, value }) => (
            <span key={value} className="flex items-center gap-1.5">
              <Icon aria-hidden className="size-3.5 text-slate-400" />
              {value}
            </span>
          ))}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {contest.mode === "paid" ? (
            <span className="text-xs font-semibold text-slate-600">
              {contest.pricePerVote.toLocaleString("fr-FR")} {contest.currency}
              <span className="text-slate-400"> / vote</span>
            </span>
          ) : (
            <span className="text-xs font-semibold text-emerald-600">Vote gratuit</span>
          )}
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600">
            Voter
            <ArrowRight className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
