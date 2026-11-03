import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Container } from "@/src/components/ui/container";
import { getFeeRule } from "@/lib/actions/pricing/get-fee-rule";
import { getPublicSettings } from "@/lib/actions/settings/get-public-settings";
import PricingCalculator from "./pricing-calculator";
import PricingFaqList, { type PricingFaq } from "./pricing-faq";

import Header from "@/src/components/ui/header";
import Footer from "@/src/components/ui/footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tarifs | Evenn",
  description:
    "Une commission claire sur la billetterie, sans abonnement. Consultez la règle réellement appliquée et simulez vos revenus.",
};

export default async function PricingPage() {
  const [rule, settings] = await Promise.all([getFeeRule("ticket"), getPublicSettings()]);

  const currency = rule?.currency ?? settings.currency;
  const percent = rule?.percent ?? 0;
  const fixedAmount = rule?.fixedAmount ?? 0;
  const hasCommission = percent > 0 || fixedAmount > 0;

  const formatAmount = (value: number) =>
    `${value.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} ${currency}`;

  const paidByLabel =
    rule?.paidBy === "buyer"
      ? "Ajoutée au montant payé par le participant"
      : rule?.paidBy === "organizer"
        ? "Déduite du montant reversé à l’organisateur"
        : (rule?.paidBy ?? "—");

  const details = rule
    ? [
        {
          label: "Commission",
          value: `${percent.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %`,
        },
        { label: "Frais fixes par commande", value: formatAmount(fixedAmount) },
        {
          label: "Minimum par commande",
          value: rule.minFee === null ? "Aucun" : formatAmount(rule.minFee),
        },
        {
          label: "Maximum par commande",
          value: rule.maxFee === null ? "Aucun" : formatAmount(rule.maxFee),
        },
        { label: "Payée par", value: paidByLabel },
        { label: "Devise", value: currency },
      ]
    : [];

  const faqs: PricingFaq[] = [
    {
      question: "Comment est calculée la commission ?",
      answer: rule
        ? `La commission correspond à ${percent.toLocaleString("fr-FR", {
            maximumFractionDigits: 2,
          })} % du montant de la commande${
            fixedAmount > 0 ? `, plus ${formatAmount(fixedAmount)} de frais fixes` : ""
          }.${
            rule.minFee !== null && rule.minFee > 0
              ? ` Un minimum de ${formatAmount(rule.minFee)} s’applique.`
              : ""
          }${
            rule.maxFee !== null
              ? ` Le montant est plafonné à ${formatAmount(rule.maxFee)}.`
              : ""
          }`
        : "Aucune règle de commission n’est configurée pour le moment. Contactez-nous pour connaître les conditions applicables.",
    },
    {
      question: "La commission est-elle prélevée sur le prix affiché au participant ?",
      answer: rule
        ? paidByLabel === "Ajoutée au montant payé par le participant"
          ? "Le participant paie le prix du billet auquel s’ajoute la commission."
          : "Le participant paie le prix du billet tel qu’affiché ; la commission est déduite du montant reversé à l’organisateur."
        : "Cette information sera précisée dès la configuration de la tarification.",
    },
    {
      question: "Y a-t-il des frais de mise en ligne d’un événement ?",
      answer:
        "Non. Créer et publier un événement ne coûte rien. La commission ne s’applique qu’au moment d’une vente.",
    },
    {
      question: "Puis-je répercuter la commission sur le prix du billet ?",
      answer:
        "Oui, vous fixez librement le prix de vos billets. Vous pouvez en tenir compte pour que le montant net corresponde à vos attentes.",
    },
    {
      question: "Sous quel délai suis-je payé après une vente ?",
      answer:
        "Les fonds sont reversés sur votre compte selon la fréquence choisie lors de la création de l’événement.",
    },
  ];

  return (
    <>
    <Header />
    <div className="bg-surface">
      {/* En-tête */}
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 size-[420px] rounded-full bg-brand-100/60 blur-3xl" />
          <div className="absolute -left-32 top-24 size-[360px] rounded-full bg-brand-100/40 blur-3xl" />
        </div>

        <Container className="py-16 text-center sm:py-24">
          <div className="mx-auto max-w-3xl motion-safe:animate-fade-up">
            <Badge variant="soft" className="px-4 py-1.5 font-bold uppercase tracking-wide">
              <Sparkles aria-hidden size={14} /> Simple et transparent
            </Badge>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">
              Une tarification claire, <span className="text-brand-600">sans surprise</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {hasCommission
                ? `Une commission de ${percent.toLocaleString("fr-FR", {
                    maximumFractionDigits: 2,
                  })} % sur la billetterie, sans abonnement.`
                : "Aucune commission n’est prélevée sur la billetterie actuellement."}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="grid items-stretch gap-6 md:grid-cols-2">
          {/* Règle de commission (base de données) */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl bg-brand-600 p-8 text-white shadow-card-hover">
            <h2 className="text-lg font-bold">Commission billetterie</h2>
            <p className="mt-1.5 text-sm leading-6 text-brand-100">
              Règle appliquée à chaque commande de billets.
            </p>

            {rule ? (
              <>
                <div className="mt-6 flex flex-wrap items-end gap-2">
                  <span className="text-5xl font-bold tracking-tight">
                    {percent.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %
                  </span>
                  <span className="pb-1 text-sm text-brand-100">
                    {fixedAmount > 0 ? `+ ${formatAmount(fixedAmount)} / commande` : "du montant"}
                  </span>
                </div>

                <dl className="mt-7 flex-1 space-y-3 border-t border-white/20 pt-5 text-sm">
                  {details.map((detail) => (
                    <div key={detail.label} className="flex justify-between gap-4">
                      <dt className="text-brand-100">{detail.label}</dt>
                      <dd className="text-right font-semibold">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <p className="mt-6 flex-1 text-sm leading-7 text-brand-100">
                La tarification de la billetterie n’est pas encore configurée. Contactez notre
                équipe pour connaître les conditions applicables à votre événement.
              </p>
            )}

            <Link
              href="/auth/register"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/50"
            >
              Créer mon événement <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>

          {/* Ce qui est inclus */}
          <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card">
            <h2 className="text-lg font-bold text-slate-950">Toujours inclus</h2>
            <p className="mt-1.5 text-sm leading-6 text-slate-500">
              Les fonctionnalités essentielles, quel que soit votre volume.
            </p>
            <ul className="mt-7 flex-1 space-y-3.5">
              {[
                "Page événement personnalisable",
                "Billets avec QR code unique",
                "Contrôle d’accès par scan",
                "Tableau de bord des ventes en direct",
                "Paiement en ligne sécurisé",
                "Reversement des fonds à l’organisateur",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600"
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-slate-400">
              <BadgeCheck aria-hidden className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
              Sans abonnement : la plateforme ne se rémunère que sur les ventes.
            </p>
          </div>
        </div>
      </Container>

      {rule && (
        <PricingCalculator
          percent={rule.percent}
          fixedAmount={rule.fixedAmount}
          minFee={rule.minFee}
          maxFee={rule.maxFee}
          currency={currency}
        />
      )}

      {/* Pourquoi ce modèle */}
      <Container className="pb-12 sm:pb-16">
        <div className="mb-12 text-center">
          <h2 className="mx-auto max-w-2xl text-balance text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Pourquoi une commission plutôt qu’un abonnement
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Notre modèle aligne nos intérêts sur les vôtres : nous ne gagnons que lorsque vous
            vendez.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <ReasonCard
            icon={<Zap aria-hidden className="size-6" />}
            title="Aucun risque financier"
            text="Pas d’abonnement mensuel à payer même si votre événement n’a pas encore de public. Vous ne payez que si vous vendez."
          />
          <ReasonCard
            icon={<TrendingUp aria-hidden className="size-6" />}
            title="Un intérêt commun"
            text="Notre revenu dépend directement de votre succès. Nous avons donc tout intérêt à vous aider à vendre plus de billets."
          />
          <ReasonCard
            icon={<ShieldCheck aria-hidden className="size-6" />}
            title="Transparence totale"
            text="Le taux de commission affiché ici provient directement de la configuration de la plateforme, sans frais surprise au moment du paiement."
          />
        </div>
      </Container>

      {/* FAQ */}
      <section className="border-y border-slate-200/70 bg-white">
        <Container className="max-w-3xl py-12 sm:py-16">
          <div className="mb-12 text-center">
            <h2 className="mx-auto max-w-2xl text-balance text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Questions sur la tarification
            </h2>
          </div>
          <PricingFaqList items={faqs} />
        </Container>
      </section>

      {/* CTA final */}
      <Container className="py-12 sm:py-16">
        <section className="relative overflow-hidden rounded-2xl bg-brand-600 px-6 py-14 text-center text-white sm:px-10">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 -top-20 size-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 -right-10 size-72 rounded-full bg-white/10 blur-2xl" />
          </div>
          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Prêt à organiser votre prochain événement ?
            </h2>
            <p className="mt-3 text-sm leading-7 text-brand-100 sm:text-base">
              Créez votre événement en quelques minutes, sans engagement ni frais fixe.
            </p>
            <Link
              href="/auth/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-sm transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/50"
            >
              Créer mon événement <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </section>
      </Container>
    </div>
    <Footer />
    </>
  );
}

function ReasonCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover">
      <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}
