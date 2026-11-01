"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CircleAlert,
  Info,
  Loader2,
  LockKeyhole,
  Medal,
  Minus,
  Plus,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trophy,
  Users,
  Vote,
  Wallet,
  X,
} from "lucide-react";
import { createVoteOrder } from "@/lib/actions/votes/create-vote-order";
import type {
  ContestVotePage,
  VoteCandidateView,
} from "@/lib/actions/votes/get-contest-vote-page";
import { formatVoteDateTime, formatVoteMoney, getContestTiming } from "@/lib/vote-format";
import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { ContestStatusChip } from "@/src/components/vote/status";
import { cn } from "@/lib/utils";

const RANK_STYLES: Record<number, string> = {
  1: "bg-amber-100 text-amber-800 ring-amber-200",
  2: "bg-slate-100 text-slate-700 ring-slate-200",
  3: "bg-orange-100 text-orange-800 ring-orange-200",
};

const NOTICE_TONES = {
  warning: {
    border: "border-amber-200/80",
    bg: "bg-amber-50/80",
    icon: "text-amber-500",
    text: "text-amber-800",
  },
  info: {
    border: "border-brand-100",
    bg: "bg-brand-50/60",
    icon: "text-brand-600",
    text: "text-brand-800",
  },
} as const;

function Notice({
  tone,
  icon,
  children,
}: {
  tone: keyof typeof NOTICE_TONES;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const classes = NOTICE_TONES[tone];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-sm leading-6",
        classes.border,
        classes.bg,
        classes.text,
      )}
    >
      <span aria-hidden className={cn("mt-0.5 shrink-0", classes.icon)}>
        {icon}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function CandidatePhoto({ candidate }: { candidate: VoteCandidateView }) {
  if (candidate.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={candidate.photoUrl}
        alt={candidate.name}
        className="h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]"
        loading="lazy"
      />
    );
  }

  return (
    <div
      aria-hidden
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900 text-2xl font-bold text-white/90"
    >
      {candidate.name.slice(0, 1).toUpperCase()}
    </div>
  );
}

function RankBadge({ rank }: { rank: number | null }) {
  if (rank === null) return null;
  const label = rank === 1 ? "1er" : `${rank}e`;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
        RANK_STYLES[rank] ?? "bg-brand-50 text-brand-700 ring-brand-100"
      }`}
    >
      <Medal aria-hidden className="size-3.5" /> {label}
    </span>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0 bg-white p-4 sm:p-5">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        <Icon aria-hidden className="size-3.5 text-brand-500" />
        <span className="truncate">{label}</span>
      </p>
      <p
        className={cn(
          "mt-1.5 truncate text-sm font-bold",
          accent ? "text-brand-600" : "text-slate-900",
        )}
      >
        {value}
      </p>
    </div>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

function VoteModal({
  contest,
  candidate,
  onClose,
}: {
  contest: ContestVotePage;
  candidate: VoteCandidateView;
  onClose: () => void;
}) {
  const router = useRouter();
  const panelRef = useRef<HTMLFormElement>(null);
  const [packId, setPackId] = useState<string>(contest.packs[0]?.id ?? "");
  const [packQuantity, setPackQuantity] = useState(1);
  const [votesCount, setVotesCount] = useState(5);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"mtn_momo" | "orange_money">("mtn_momo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPack = contest.packs.find((pack) => pack.id === packId) ?? null;
  const totalVotes = selectedPack ? selectedPack.votesCount * packQuantity : votesCount;
  const totalAmount = selectedPack
    ? selectedPack.priceAmount * packQuantity
    : contest.pricePerVote * votesCount;

  /* Accessibilité : fermeture au clavier et verrouillage du défilement. */
  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    try {
      const order = await createVoteOrder({
        contestId: contest.id,
        candidateId: candidate.id,
        packId: selectedPack?.id ?? null,
        packQuantity: selectedPack ? packQuantity : undefined,
        votesCount: selectedPack ? undefined : votesCount,
        buyerName,
        buyerEmail,
        buyerPhone,
        paymentMethod,
      });
      router.push(`/vote/checkout?order=${order.orderId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de créer la commande. Réessayez.",
      );
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vote-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm motion-safe:animate-fade-in sm:items-center sm:p-6"
    >
      <form
        ref={panelRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex max-h-[94dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white text-slate-900 shadow-pop outline-none motion-safe:animate-scale-in sm:rounded-2xl"
      >
        <header className="relative shrink-0 bg-brand-600 px-6 pt-5 text-white sm:px-8">
          <div className="flex items-start justify-between gap-4 pb-5">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-base font-bold"
              >
                {candidate.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-100">
                  Voter pour
                </p>
                <h2
                  id="vote-modal-title"
                  className="mt-0.5 truncate text-xl font-bold tracking-tight"
                >
                  {candidate.name}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le formulaire de vote"
              className="rounded-lg p-2 text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/40"
            >
              <X aria-hidden size={18} />
            </button>
          </div>
          <div className="border-t border-white/15 py-3">
            <p className="text-sm text-brand-100">
              <span className="font-bold text-white">
                {totalVotes.toLocaleString("fr-FR")} vote{totalVotes > 1 ? "s" : ""}
              </span>{" "}
              pour{" "}
              <span className="font-bold text-white">
                {formatVoteMoney(totalAmount, contest.currency)}
              </span>
            </p>
          </div>
        </header>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
          {contest.packs.length > 0 ? (
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-slate-800">
                Choisissez un pack
                {selectedPack && (
                  <span className="ml-2 text-xs font-medium text-slate-400">
                    × {packQuantity} = {(selectedPack.votesCount * packQuantity).toLocaleString("fr-FR")} votes
                  </span>
                )}
              </legend>
              {contest.packs.map((pack) => {
                const active = pack.id === packId;

                return (
                  <label
                    key={pack.id}
                    className={cn(
                      "group flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-brand-600/20",
                      active
                        ? "border-brand-600 bg-brand-50/50 ring-1 ring-brand-600"
                        : "border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50/60",
                    )}
                  >
                    <input
                      type="radio"
                      name="vote-pack"
                      checked={active}
                      onChange={() => setPackId(pack.id)}
                      className="sr-only"
                    />
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border transition",
                          active
                            ? "border-brand-600 bg-brand-600 text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {active && <Check aria-hidden className="size-3" strokeWidth={3} />}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-slate-900">
                          {pack.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {pack.votesCount.toLocaleString("fr-FR")} vote
                          {pack.votesCount > 1 ? "s" : ""}
                        </span>
                      </span>
                    </span>
                    <span className="whitespace-nowrap text-sm font-bold text-brand-700">
                      {formatVoteMoney(pack.priceAmount, contest.currency)}
                    </span>
                  </label>
                );
              })}

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">Nombre de packs</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPackQuantity((value) => Math.max(1, value - 1))}
                    disabled={packQuantity <= 1}
                    aria-label="Retirer un pack"
                    className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-brand-300 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus aria-hidden className="size-4" />
                  </button>
                  <span aria-live="polite" className="w-6 text-center text-sm font-bold text-slate-900">
                    {packQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPackQuantity((value) => Math.min(20, value + 1))}
                    disabled={packQuantity >= 20}
                    aria-label="Ajouter un pack"
                    className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-brand-300 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus aria-hidden className="size-4" />
                  </button>
                </div>
              </div>
            </fieldset>
          ) : (
            <fieldset>
              <legend className="text-sm font-semibold text-slate-800">Nombre de votes</legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {[1, 5, 10, 25, 50].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setVotesCount(value)}
                    aria-pressed={votesCount === value}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20",
                      votesCount === value
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600",
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <label htmlFor="custom-votes" className="text-sm font-medium text-slate-700">
                  Votes personnalisés
                </label>
                <input
                  id="custom-votes"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={100000}
                  value={votesCount}
                  onChange={(event) =>
                    setVotesCount(Math.max(1, Math.min(100000, Number(event.target.value) || 1)))
                  }
                  className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-bold text-slate-900 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Soit {formatVoteMoney(contest.pricePerVote, contest.currency)} par vote.
              </p>
            </fieldset>
          )}

          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Smartphone aria-hidden className="size-4 text-brand-600" />
              Paiement mobile money
            </legend>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              {(
                [
                  { value: "mtn_momo", label: "MTN MoMo" },
                  { value: "orange_money", label: "Orange Money" },
                ] as const
              ).map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  aria-pressed={paymentMethod === method.value}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20",
                    paymentMethod === method.value
                      ? "border-brand-600 bg-brand-50/60 text-brand-700 ring-1 ring-brand-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-600",
                  )}
                >
                  <Wallet aria-hidden className="size-4" />
                  {method.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Nom complet
              <input
                type="text"
                value={buyerName}
                onChange={(event) => setBuyerName(event.target.value)}
                placeholder="Votre nom"
                required
                minLength={2}
                autoComplete="name"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Adresse email
              <input
                type="email"
                value={buyerEmail}
                onChange={(event) => setBuyerEmail(event.target.value)}
                placeholder="vous@email.com"
                required
                autoComplete="email"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Téléphone mobile money
              <input
                type="tel"
                value={buyerPhone}
                onChange={(event) => setBuyerPhone(event.target.value)}
                placeholder="+237 6 00 00 00 00"
                required
                minLength={6}
                autoComplete="tel"
                className={inputClass}
              />
            </label>
          </div>

          <p className="flex items-start gap-2.5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            <ShieldCheck aria-hidden size={15} className="mt-0.5 shrink-0 text-emerald-600" />
            Les votes ne sont crédités qu’après la vérification du paiement, signature
            et montant contrôlés côté serveur.
          </p>
        </div>

        <footer className="shrink-0 space-y-3 border-t border-slate-100 bg-white px-6 pb-5 pt-4 sm:px-8">
          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700"
            >
              <CircleAlert aria-hidden size={16} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total à payer</span>
            <span className="text-xl font-bold tracking-tight text-slate-950">
              {formatVoteMoney(totalAmount, contest.currency)}
            </span>
          </div>
          <Button
            type="submit"
            variant="brand"
            disabled={loading || totalAmount < 1 || totalVotes < 1}
            className="h-12 w-full rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 active:translate-y-px"
          >
            {loading ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" />
                Création de la commande…
              </>
            ) : (
              <>
                Payer {formatVoteMoney(totalAmount, contest.currency)}
                <ArrowRight aria-hidden className="size-4" />
              </>
            )}
          </Button>
        </footer>
      </form>
    </div>
  );
}

export default function VoteClient({ contest }: { contest: ContestVotePage }) {
  const [selectedCandidate, setSelectedCandidate] = useState<VoteCandidateView | null>(null);
  const timing = getContestTiming(contest.startsAt, contest.endsAt);

  const candidatesCount = useMemo(
    () => contest.categories.reduce((sum, category) => sum + category.candidates.length, 0),
    [contest.categories],
  );

  const canVote = contest.isOpen && contest.mode === "paid";

  const steps = [
    {
      title: "Choisissez un candidat",
      description: "Sélectionnez un pack de votes ou un montant personnalisé.",
    },
    {
      title: "Renseignez vos coordonnées",
      description: "Nom, email et numéro mobile money.",
    },
    {
      title: "Payez via mobile money",
      description: "MTN MoMo ou Orange Money.",
    },
    {
      title: "Votes crédités",
      description: "Dès la confirmation du paiement par le prestataire.",
    },
  ];

  return (
    <main className="bg-surface pb-20 text-slate-900">
      {/* Couverture du concours */}
      <section className="relative h-72 w-full overflow-hidden bg-brand-900 sm:h-80">
        {contest.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={contest.coverUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-950"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-slate-950/10"
        />

        <Link
          href="/vote"
          className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-slate-950/25 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-slate-950/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/40 sm:left-8 sm:top-8 sm:text-sm"
        >
          <ArrowLeft aria-hidden className="size-4" /> Tous les concours
        </Link>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <Container className="pb-8 sm:pb-10">
            <ContestStatusChip timing={timing} />
            <h1 className="mt-3 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-sm sm:text-5xl">
              {contest.title}
            </h1>
            {contest.organizationName && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-200">
                <Users aria-hidden className="size-4 text-brand-200" />
                Organisé par {contest.organizationName}
              </p>
            )}
          </Container>
        </div>
      </section>

      {/* Chiffres clés */}
      <Container className="relative z-20 -mt-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/60 shadow-card sm:grid-cols-4">
          <StatTile
            icon={CalendarDays}
            label="Clôture"
            value={formatVoteDateTime(contest.endsAt)}
          />
          <StatTile icon={Users} label="Candidats" value={candidatesCount} />
          <StatTile
            icon={Vote}
            label="Votes exprimés"
            value={
              contest.totalVotes === null
                ? "Masqués"
                : contest.totalVotes.toLocaleString("fr-FR")
            }
          />
          <StatTile
            icon={BadgeCheck}
            label="Prix du vote"
            value={
              contest.mode === "paid"
                ? formatVoteMoney(contest.pricePerVote, contest.currency)
                : "Gratuit"
            }
            accent
          />
        </div>
      </Container>

      <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-8">
          {!contest.isOpen && (
            <Notice
              tone="warning"
              icon={<LockKeyhole size={18} />}
            >
              {timing === "upcoming"
                ? "Les votes ouvrent bientôt. Vous pouvez déjà découvrir les candidats."
                : "Ce concours est terminé : les votes sont fermés."}
            </Notice>
          )}

          {contest.resultsVisibility !== "live" && (
            <Notice tone="info" icon={<Sparkles size={18} />}>
              {contest.resultsVisibility === "hidden_until_close"
                ? "Le classement et les compteurs seront dévoilés à la clôture du concours."
                : "Seul le classement est public ; le nombre de voix reste confidentiel."}
            </Notice>
          )}

          {contest.description && (
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
              <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950">
                <Info aria-hidden className="size-5 text-brand-600" />
                À propos du concours
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                {contest.description}
              </p>
            </section>
          )}

          {contest.categories.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-card">
              <span className="flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-300 ring-1 ring-slate-200/70">
                <Users aria-hidden className="size-6" />
              </span>
              <p className="mt-4 text-sm text-slate-500">
                Aucun candidat approuvé pour le moment.
              </p>
            </div>
          ) : (
            contest.categories.map((category) => (
              <section key={category.id}>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold tracking-tight text-slate-950">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-1 text-sm text-slate-500">{category.description}</p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                    {category.candidates.length} candidat
                    {category.candidates.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {category.candidates.map((candidate) => (
                    <article
                      key={candidate.id}
                      className="group flex overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition duration-300 hover:border-brand-200 hover:shadow-card-hover"
                    >
                      <div className="relative w-24 shrink-0 overflow-hidden bg-slate-100 sm:w-28">
                        <CandidatePhoto candidate={candidate} />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate font-bold text-slate-950">
                              {candidate.name}
                            </h3>
                            {candidate.number !== null && (
                              <p className="mt-0.5 text-xs text-slate-400">
                                N° {candidate.number}
                              </p>
                            )}
                          </div>
                          <RankBadge rank={candidate.rank} />
                        </div>

                        {candidate.bio && (
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                            {candidate.bio}
                          </p>
                        )}

                        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <Vote aria-hidden className="size-3.5 text-brand-600" />
                            {candidate.voteCount === null
                              ? "Voix masquées"
                              : `${candidate.voteCount.toLocaleString("fr-FR")} vote${candidate.voteCount > 1 ? "s" : ""}`}
                          </span>
                          <Button
                            variant="brand"
                            size="sm"
                            onClick={() => setSelectedCandidate(candidate)}
                            disabled={!canVote}
                            className="rounded-lg px-3"
                          >
                            Voter
                            <ArrowRight aria-hidden className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        <aside className="space-y-5">
          <div className="sticky top-24 space-y-5">
            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
              <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
                <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Trophy aria-hidden className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-950">Comment voter</p>
                  <p className="text-xs text-slate-500">
                    Un vote vérifié, crédité après paiement.
                  </p>
                </div>
              </div>
              <ol className="p-5">
                {steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="relative flex gap-3.5 pb-5 after:absolute after:bottom-0 after:left-[15px] after:top-8 after:w-px after:bg-slate-100 after:content-[''] last:pb-0 last:after:hidden"
                  >
                    <span
                      aria-hidden
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600 ring-1 ring-brand-100"
                    >
                      {index + 1}
                    </span>
                    <div className="pt-1">
                      <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-5">
              <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Paiement vérifié</p>
                <p className="mt-1.5 text-xs leading-6 text-emerald-800/90">
                  Signature du webhook, montant attendu et idempotence sont contrôlés côté
                  serveur. Aucun vote n’est ajouté avant confirmation.
                </p>
              </div>
            </section>

            {contest.packs.length > 0 && (
              <section className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-card">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
                  <BadgeCheck aria-hidden className="size-4 text-brand-600" />
                  Packs disponibles
                </p>
                <div className="mt-1 divide-y divide-slate-100">
                  {contest.packs.map((pack) => (
                    <div
                      key={pack.id}
                      className="flex items-center justify-between gap-3 py-2.5 text-xs"
                    >
                      <span className="font-semibold text-slate-700">{pack.name}</span>
                      <span className="font-bold text-brand-700">
                        {formatVoteMoney(pack.priceAmount, contest.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {contest.rules && (
              <section className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-card">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
                  <Check aria-hidden className="size-4 text-brand-600" />
                  Règlement
                </p>
                <p className="mt-2 whitespace-pre-line text-xs leading-6 text-slate-500">
                  {contest.rules}
                </p>
              </section>
            )}

            <p className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <CalendarDays aria-hidden size={13} />
              {formatVoteDateTime(contest.startsAt)} — {formatVoteDateTime(contest.endsAt)}
            </p>
          </div>
        </aside>
      </Container>

      {selectedCandidate && (
        <VoteModal
          key={selectedCandidate.id}
          contest={contest}
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </main>
  );
}
