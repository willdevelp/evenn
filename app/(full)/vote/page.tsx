import { CalendarDays, Check, Sparkles, Trophy, Users, Vote } from "lucide-react";
import { getContests } from "@/lib/actions/votes/get-contests";
import { getContestTiming } from "@/lib/vote-format";
import { Container } from "@/src/components/ui/container";
import EmptyState from "@/src/components/ui/empty-state";
import ContestCard from "@/src/components/vote/contest-card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Votes | Evenn",
  description: "Votez pour vos candidats préférés et soutenez-les en direct.",
};

const reassurances = [
  "Paiement vérifié côté serveur",
  "MTN MoMo & Orange Money",
  "Classement en direct *",
];

export default async function VoteIndexPage() {
  const contests = await getContests();

  const openContests = contests.filter(
    (contest) => getContestTiming(contest.startsAt, contest.endsAt) === "open",
  );
  const candidateCount = contests.reduce((sum, contest) => sum + contest.candidateCount, 0);
  const votesVisible = contests.some((contest) => contest.totalVotes !== null);
  const totalVotes = contests.reduce((sum, contest) => sum + (contest.totalVotes ?? 0), 0);

  const stats = [
    {
      icon: Vote,
      label: "Concours ouverts",
      value: openContests.length.toLocaleString("fr-FR"),
    },
    {
      icon: Users,
      label: "Candidats en compétition",
      value: candidateCount.toLocaleString("fr-FR"),
    },
    votesVisible && {
      icon: Sparkles,
      label: "Votes exprimés",
      value: totalVotes.toLocaleString("fr-FR"),
    },
  ].filter((stat): stat is { icon: typeof Vote; label: string; value: string } =>
    Boolean(stat),
  );

  return (
    <main className="bg-surface pb-20 text-slate-700">
      {/* ===== EN-TÊTE ===== */}
      <section className="relative isolate overflow-hidden bg-brand-600 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-40 size-[480px] rounded-full bg-brand-500/60 blur-3xl"
        />

        <Container
          className={cn(
            "relative grid items-center gap-10 py-14 sm:py-20",
            stats.length > 0 && contests.length > 0 && "lg:grid-cols-[1.1fr_0.9fr] lg:gap-16",
          )}
        >
          <div className="motion-safe:animate-fade-up">
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              Faites gagner votre talent préféré.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-brand-50/90 sm:text-lg sm:leading-8">
              Choisissez votre candidat et achetez des votes en toute sécurité : ils sont
              crédités uniquement après vérification du paiement par notre prestataire.
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
              {reassurances.map((text) => (
                <li key={text} className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                    <Check aria-hidden className="size-3" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Talon : les chiffres des concours */}
          {contests.length > 0 && stats.length > 0 && (
            <dl className="mx-auto w-full max-w-md rounded-3xl bg-white text-slate-950 shadow-pop motion-safe:animate-fade-up [animation-delay:200ms] lg:ml-auto">
              {stats.map(({ icon: Icon, label, value }, i) => (
                <div
                  key={label}
                  className={cn(
                    "relative flex items-center justify-between gap-4 px-6 py-5",
                    i > 0 && "border-t-2 border-dashed border-brand-200",
                  )}
                >
                  {i > 0 && (
                    <>
                      <span
                        aria-hidden
                        className="absolute -left-3 -top-3.5 size-6 rounded-full bg-brand-600"
                      />
                      <span
                        aria-hidden
                        className="absolute -right-3 -top-3.5 size-6 rounded-full bg-brand-600"
                      />
                    </>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                      <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                    </span>
                    <dt className="text-sm text-slate-500">{label}</dt>
                  </div>
                  <dd className="text-3xl font-bold tracking-tight text-slate-950">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Container>
      </section>

      {/* ===== CONCOURS ===== */}
      <Container className="py-12 sm:py-16">
        {contests.length === 0 ? (
          <EmptyState
            icon={<Trophy aria-hidden className="size-7" />}
            title="Aucun concours pour le moment"
            description="Les concours publiés par les organisateurs apparaîtront ici dès qu'ils seront en ligne."
            action={{ href: "/events", label: "Découvrir les événements" }}
          />
        ) : (
          <>
            <h2 className="mb-7 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {contests.length.toLocaleString("fr-FR")} concours à découvrir
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {contests.map((contest, index) => (
                <div
                  key={contest.id}
                  className="motion-safe:animate-fade-up"
                  style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
                >
                  <ContestCard contest={contest} priority={index === 0} />
                </div>
              ))}
            </div>
          </>
        )}

        <p className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500">
          <CalendarDays aria-hidden className="size-3.5" />
          * Selon la configuration de chaque concours, le classement peut être dévoilé à la
          clôture.
        </p>
      </Container>
    </main>
  );
}