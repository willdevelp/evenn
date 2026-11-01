"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock,
  Copy,
  Loader2,
  Receipt,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Vote,
} from "lucide-react";
import { confirmMockVotePayment } from "@/lib/actions/votes/confirm-mock-payment";
import { getVoteOrder, type VoteOrderStatus } from "@/lib/actions/votes/get-vote-order";
import { formatVoteDateTime, formatVoteMoney } from "@/lib/vote-format";
import { cn } from "@/lib/utils";
import { Container } from "@/src/components/ui/container";
import EmptyState from "@/src/components/ui/empty-state";

const METHOD_LABELS: Record<string, string> = {
  mtn_momo: "MTN MoMo",
  orange_money: "Orange Money",
  card: "Carte bancaire",
  cash: "Espèces",
  other: "Autre",
};

const isTerminal = (order: VoteOrderStatus) =>
  order.orderStatus === "paid" ||
  order.orderStatus === "failed" ||
  order.orderStatus === "cancelled" ||
  order.orderStatus === "refunded" ||
  order.paymentStatus === "succeeded" ||
  order.paymentStatus === "failed";

/** Ligne étiquette / valeur du récapitulatif. */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-1.5 py-4 sm:flex-row sm:items-center sm:gap-4">
      <dt className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="min-w-0 text-sm text-slate-900 sm:text-right">{children}</dd>
    </div>
  );
}

function Step({
  done,
  active,
  isLast,
  icon,
  title,
  description,
}: {
  done: boolean;
  active: boolean;
  isLast: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <li className="relative flex gap-3.5 pb-6 last:pb-0">
      {!isLast && (
        <span
          aria-hidden
          className={cn(
            "absolute bottom-0 left-[15px] top-8 w-px",
            done ? "bg-emerald-200" : "bg-slate-200",
          )}
        />
      )}
      <span
        aria-hidden
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full ring-4",
          done
            ? "bg-emerald-100 text-emerald-700 ring-emerald-50"
            : active
              ? "bg-brand-100 text-brand-600 ring-brand-50"
              : "bg-slate-100 text-slate-400 ring-slate-50",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 pt-1">
        <p className={cn("text-sm font-bold", done || active ? "text-slate-900" : "text-slate-400")}>
          {title}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </li>
  );
}

export default function VoteCheckoutClient({
  orderId,
  initialOrder,
  allowMockConfirm,
}: {
  orderId?: string;
  initialOrder: VoteOrderStatus | null;
  allowMockConfirm: boolean;
}) {
  const [order, setOrder] = useState<VoteOrderStatus | null>(initialOrder);
  const [confirming, setConfirming] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paid = order?.orderStatus === "paid" || order?.paymentStatus === "succeeded";
  const failed =
    order?.orderStatus === "failed" ||
    order?.orderStatus === "cancelled" ||
    order?.orderStatus === "refunded" ||
    order?.paymentStatus === "failed" ||
    order?.paymentStatus === "cancelled";
  const pending = !paid && !failed;

  useEffect(() => {
    if (!order || isTerminal(order)) return;

    const timer = setInterval(async () => {
      try {
        const next = await getVoteOrder(order.id);
        if (next) setOrder(next);
      } catch {
        // La prochaine tentative réessaiera ; on n'affiche pas d'erreur de fond.
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [order]);

  const refresh = async () => {
    if (!order) return;
    setRefreshing(true);
    try {
      const next = await getVoteOrder(order.id);
      if (next) setOrder(next);
    } finally {
      setRefreshing(false);
    }
  };

  const confirmMock = async () => {
    if (!order) return;
    setConfirming(true);
    setError(null);
    try {
      await confirmMockVotePayment({ orderId: order.id });
      const next = await getVoteOrder(order.id);
      if (next) setOrder(next);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de confirmer le paiement de test.",
      );
    } finally {
      setConfirming(false);
    }
  };

  const copyOrderNumber = () => {
    if (!order || typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(order.orderNumber).catch(() => undefined);
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  if (!order) {
    return (
      <main className="bg-surface">
        <Container className="flex min-h-[65vh] items-center pb-16 pt-10">
          <EmptyState
            className="w-full"
            icon={<Receipt aria-hidden className="size-7" />}
            title={orderId ? "Commande introuvable" : "Aucune commande en cours"}
            description={
              orderId
                ? "Ce lien de commande est invalide ou la commande n'existe plus."
                : "Choisissez un concours et un candidat pour acheter des votes."
            }
            action={{ href: "/vote", label: "Voir les concours" }}
          />
        </Container>
      </main>
    );
  }

  const status = paid
    ? {
        icon: <CheckCircle2 aria-hidden className="size-6" />,
        tile: "bg-emerald-600 text-white",
        title: "Paiement vérifié, votes crédités !",
        description: `${order.votesCount.toLocaleString("fr-FR")} vote${order.votesCount > 1 ? "s" : ""} viennent d'être ajoutés à ${order.candidate.name}.`,
        badge: "Payée",
      }
    : failed
      ? {
          icon: <AlertTriangle aria-hidden className="size-6" />,
          tile: "bg-rose-600 text-white",
          title: "Paiement échoué",
          description: order.failureReason ?? "Le prestataire n'a pas confirmé ce paiement.",
          badge: "Échec",
        }
      : {
          icon: <Clock aria-hidden className="size-6" />,
          tile: "bg-brand-600 text-white",
          title: "En attente de vérification du paiement",
          description:
            "Dès que le prestataire confirme la transaction, les votes sont crédités automatiquement.",
          badge: "En attente",
        };

  const steps = [
    {
      done: true,
      active: false,
      icon: <Receipt aria-hidden className="size-4" />,
      title: "Commande créée",
      description: "Montant et nombre de votes calculés côté serveur.",
    },
    {
      done: Boolean(paid),
      active: Boolean(pending),
      icon: <ShieldCheck aria-hidden className="size-4" />,
      title: "Vérification du paiement",
      description: paid
        ? "Signature et montant vérifiés par le serveur."
        : failed
          ? "Le paiement n'a pas été confirmé."
          : "En attente de la notification signée du prestataire.",
    },
    {
      done: Boolean(paid),
      active: false,
      icon: <Vote aria-hidden className="size-4" />,
      title: "Votes crédités",
      description: paid
        ? `${order.votesCount.toLocaleString("fr-FR")} vote${order.votesCount > 1 ? "s" : ""} ajoutés au compteur.`
        : "Les votes seront ajoutés après confirmation.",
    },
  ];

  return (
    <main className="bg-surface">
      <Container className="py-10 sm:py-14">
        <Link
          href={`/vote/${order.contest.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-brand-600"
        >
          <ArrowLeft aria-hidden className="size-4" /> Retour au concours
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
            <header className="border-b border-slate-100 bg-slate-50/60 px-6 py-6 sm:px-8 sm:py-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl",
                      status.tile,
                    )}
                  >
                    {status.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold uppercase tracking-wide">Commande</span>
                      <code className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-700 ring-1 ring-slate-200">
                        {order.orderNumber}
                      </code>
                      <button
                        type="button"
                        onClick={copyOrderNumber}
                        aria-label="Copier le numéro de commande"
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold transition",
                          copied
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-500 hover:border-brand-200 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20",
                        )}
                      >
                        {copied ? <Check aria-hidden className="size-3" /> : <Copy aria-hidden className="size-3" />}
                        {copied ? "Copié" : "Copier"}
                      </button>
                    </p>
                    <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                      {status.title}
                    </h1>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-bold",
                    paid && "border-emerald-200 bg-emerald-50 text-emerald-700",
                    failed && "border-rose-200 bg-rose-50 text-rose-700",
                    pending && "border-brand-100 bg-brand-50 text-brand-700",
                  )}
                >
                  {status.badge}
                </span>
              </div>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
                {status.description}
              </p>
            </header>

            <dl className="divide-y divide-slate-100 px-6 py-2 sm:px-8">
              <Row label="Candidat">
                <span className="flex items-center justify-end gap-2.5 sm:justify-end">
                  {order.candidate.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={order.candidate.photoUrl}
                      alt=""
                      aria-hidden
                      className="size-9 rounded-full object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600 ring-1 ring-brand-100"
                    >
                      {order.candidate.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span className="text-right">
                    <span className="block font-bold">{order.candidate.name}</span>
                    <Link
                      href={`/vote/${order.contest.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                    >
                      {order.contest.title} <ArrowRight aria-hidden className="size-3" />
                    </Link>
                  </span>
                </span>
              </Row>
              <Row label="Montant">
                <span className="font-bold">{formatVoteMoney(order.amount, order.currency)}</span>
                <span className="block text-xs text-slate-500 sm:text-right sm:mt-0.5">
                  {order.votesCount.toLocaleString("fr-FR")} vote
                  {order.votesCount > 1 ? "s" : ""}
                </span>
              </Row>
              <Row label="Moyen de paiement">
                {order.paymentMethod ? (
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <Smartphone aria-hidden className="size-4 text-brand-600" />
                    {METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
                  </span>
                ) : (
                  "—"
                )}
              </Row>
              <Row label="Référence">
                <span className="break-all font-mono text-xs font-semibold text-slate-700">
                  {order.paymentReference ?? "—"}
                </span>
              </Row>
            </dl>

            <p className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400 sm:px-8">
              Commande créée le {formatVoteDateTime(order.createdAt)}
            </p>

            {error && (
              <p
                role="alert"
                className="mx-6 mb-6 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700 sm:mx-8"
              >
                <CircleAlert aria-hidden size={16} className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <Receipt aria-hidden className="size-4 text-brand-600" /> Suivi du paiement
              </p>
              <ol className="mt-5">
                {steps.map((step, index) => (
                  <Step key={step.title} {...step} isLast={index === steps.length - 1} />
                ))}
              </ol>

              {pending && (
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-brand-50/70 px-3 py-2.5 text-xs font-semibold text-brand-800">
                    <span aria-hidden className="relative flex size-2.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 motion-safe:animate-ping" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-brand-500" />
                    </span>
                    Actualisation automatique toutes les 4 secondes
                  </div>

                  {allowMockConfirm && (
                    <button
                      type="button"
                      onClick={confirmMock}
                      disabled={confirming}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 shadow-xs transition hover:border-emerald-300 hover:bg-emerald-50/60 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {confirming ? (
                        <>
                          <Loader2 aria-hidden className="size-4 animate-spin" /> Vérification…
                        </>
                      ) : (
                        <>
                          <Sparkles aria-hidden className="size-4" /> Simuler le paiement (dev)
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={refresh}
                    disabled={refreshing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {refreshing ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
                    Vérifier maintenant
                  </button>
                </div>
              )}

              {paid && (
                <Link
                  href={`/vote/${order.contest.slug}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30"
                >
                  Voir le classement <ArrowRight aria-hidden className="size-4" />
                </Link>
              )}

              {failed && (
                <Link
                  href={`/vote/${order.contest.slug}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20"
                >
                  Nouvelle tentative <ArrowRight aria-hidden className="size-4" />
                </Link>
              )}
            </section>

            <p className="flex items-start gap-2.5 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4 text-xs leading-6 text-emerald-800">
              <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
              Les votes ne sont jamais crédités avant la vérification complète du paiement
              (signature, montant et idempotence).
            </p>
          </aside>
        </div>
      </Container>
    </main>
  );
}
