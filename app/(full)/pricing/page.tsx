"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FiCheck,
  FiX,
  FiZap,
  FiTrendingUp,
  FiShield,
  FiHelpCircle,
  FiChevronDown,
  FiArrowRight,
} from "react-icons/fi";

const cardShadow =
  "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(37,99,235,0.14)]";

export default function PricingPage() {
  return (
    <div className="overflow-hidden bg-[#F5F8FF] text-slate-900">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#2563EB] px-6 pb-32 pt-20 text-center text-white sm:pb-36 sm:pt-24">
        <div className="pointer-events-none absolute -left-24 -top-32 -z-10 h-96 w-96 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-40 -right-16 -z-10 h-[28rem] w-[28rem] rounded-full bg-white/10" />
        <div className="pointer-events-none absolute left-1/3 top-12 -z-10 h-24 w-24 rounded-full bg-white/5" />
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
            Simple et transparent
          </span>
          <h1 className="mb-5 mt-6 text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Une tarification claire, sans surprise
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-blue-100 md:text-xl">
            Aucun abonnement, aucuns frais cachés. Vous ne payez que lorsque vous vendez des billets.
          </p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="relative z-10 -mt-20 px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto grid max-w-6xl items-stretch gap-6 md:grid-cols-3">
          <PricingCard
            name="Gratuit"
            price="0 %"
            unit="de commission"
            description="Pour les événements gratuits, ateliers communautaires ou tests."
            features={[
              "Événements gratuits illimités",
              "Page événement personnalisée",
              "Billets avec QR code",
              "Tableau de bord de suivi",
              "Support par email",
            ]}
            notIncluded={["Billetterie payante", "Support prioritaire"]}
            cta="Créer un événement gratuit"
            highlighted={false}
          />
          <PricingCard
            name="Standard"
            price="5 %"
            unit="par billet vendu"
            description="Pour la majorité des organisateurs vendant des billets payants."
            features={[
              "Tout ce qui est inclus dans Gratuit",
              "Billetterie payante illimitée",
              "Paiement Mobile Money & carte",
              "Check-in par QR code",
              "Reversement automatique des fonds",
              "Support par email sous 24h",
            ]}
            notIncluded={["Tarif dégressif"]}
            cta="Commencer à vendre"
            highlighted={true}
          />
          <PricingCard
            name="Volume"
            price="3 %"
            unit="au-delà de 500 billets/mois"
            description="Pour les organisateurs réguliers et les gros événements."
            features={[
              "Tout ce qui est inclus dans Standard",
              "Commission dégressive automatique",
              "Statistiques avancées",
              "Support prioritaire",
              "Accompagnement dédié",
            ]}
            notIncluded={[]}
            cta="Nous contacter"
            highlighted={false}
          />
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-6 text-slate-500">
          Les frais de transaction Mobile Money ou carte bancaire (environ 1,5 % à 2 %) sont prélevés séparément par les opérateurs de paiement.
        </p>
      </section>

      {/* SIMULATEUR */}
      <CommissionCalculator />

      {/* COMPARATIF DÉTAILLÉ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Comparer les formules
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">
            Toutes les formules incluent les fonctionnalités essentielles. Le tarif dépend uniquement de votre volume de ventes.
          </p>
          <div className={`overflow-x-auto rounded-3xl border border-slate-200/80 bg-white ${cardShadow}`}>
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr>
                  <th className="p-5 text-left font-medium text-slate-400">Fonctionnalité</th>
                  <th className="p-5 text-center font-semibold text-slate-700">Gratuit</th>
                  <th className="bg-[#2563EB] p-5 text-center font-bold text-white">Standard</th>
                  <th className="p-5 text-center font-semibold text-slate-700">Volume</th>
                </tr>
              </thead>
              <tbody>
                <CompareRow label="Page événement personnalisée" values={[true, true, true]} />
                <CompareRow label="Billets avec QR code" values={[true, true, true]} />
                <CompareRow label="Check-in à l’entrée" values={[true, true, true]} />
                <CompareRow label="Tableau de bord des ventes" values={[true, true, true]} />
                <CompareRow label="Billetterie payante" values={[false, true, true]} />
                <CompareRow label="Paiement Mobile Money & carte" values={[false, true, true]} />
                <CompareRow label="Statistiques avancées" values={[false, false, true]} />
                <CompareRow label="Support prioritaire" values={[false, false, true]} />
                <CompareRow label="Commission dégressive" values={[false, false, true]} last />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* POURQUOI CE MODÈLE */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20">
        <h2 className="mx-auto mb-12 max-w-2xl text-balance text-center text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Pourquoi une commission plutôt qu’un abonnement
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <ReasonCard
            icon={<FiZap />}
            title="Aucun risque financier"
            text="Pas d’abonnement mensuel à payer même si votre événement n’a pas encore de public. Vous ne payez que si vous vendez."
          />
          <ReasonCard
            icon={<FiTrendingUp />}
            title="Un intérêt commun"
            text="Notre revenu dépend directement de votre succès. Nous avons donc tout intérêt à vous aider à vendre plus de billets."
          />
          <ReasonCard
            icon={<FiShield />}
            title="Transparence totale"
            text="Le taux de commission est affiché avant chaque publication d’événement, sans frais surprise au moment du paiement."
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-slate-200/80 bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Questions sur la tarification
          </h2>
          <div className="space-y-3">
            <PricingFaqItem
              question="La commission est-elle prélevée sur le prix affiché au participant ?"
              answer="Oui. Le participant paie le prix du billet tel qu’affiché, la commission est déduite du montant reversé à l’organisateur."
            />
            <PricingFaqItem
              question="Puis-je répercuter la commission sur le prix du billet ?"
              answer="Oui, vous pouvez fixer votre prix en tenant compte de la commission pour que le montant net corresponde à vos attentes."
            />
            <PricingFaqItem
              question="Quand passe-t-on au tarif Volume de 3 % ?"
              answer="Dès que vous dépassez 500 billets vendus sur un mois glissant, le tarif dégressif s’applique automatiquement sur les billets supplémentaires."
            />
            <PricingFaqItem
              question="Y a-t-il des frais de mise en ligne d’un événement ?"
              answer="Non, créer et publier un événement, gratuit ou payant, ne coûte rien. La commission n’est prélevée qu’au moment de la vente d’un billet."
            />
            <PricingFaqItem
              question="Sous quel délai suis-je payé après une vente ?"
              answer="Les fonds sont reversés sur votre compte selon la fréquence que vous choisissez lors de la création de l’événement."
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#2563EB] px-6 py-16 text-center text-white shadow-2xl shadow-blue-600/30 sm:px-10">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute bottom-8 left-1/3 h-24 w-24 rounded-full bg-white/5" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="mb-4 text-balance text-3xl font-black tracking-tight sm:text-4xl">
              Prêt à organiser votre prochain événement ?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Créez votre événement en quelques minutes, sans engagement ni frais fixe.
            </p>
            <Link
              href="/events/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 font-bold text-[#2563EB] shadow-xl shadow-blue-950/20 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Créer mon événement
              <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- SOUS-COMPOSANTS ---------- */

function PricingCard({
  name,
  price,
  unit,
  description,
  features,
  notIncluded,
  cta,
  highlighted,
}: {
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  notIncluded: string[];
  cta: string;
  highlighted: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-3xl p-8 transition duration-300 hover:-translate-y-1 ${
        highlighted
          ? "bg-[#2563EB] text-white shadow-2xl shadow-blue-600/40 md:-my-4 md:py-12"
          : `border border-slate-200/80 bg-white ${cardShadow} hover:border-[#2563EB]/30 hover:shadow-2xl hover:shadow-blue-600/15`
      }`}
    >
      {highlighted && (
        <>
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5" />
          <span className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#2563EB] shadow-lg">
            Le plus utilisé
          </span>
        </>
      )}

      <div className="relative flex flex-1 flex-col">
        <h3 className={`mb-1 text-lg font-bold ${highlighted ? "text-white" : "text-slate-950"}`}>{name}</h3>
        <p className={`mb-6 text-sm leading-6 ${highlighted ? "text-blue-100" : "text-slate-500"}`}>
          {description}
        </p>
        <div className="mb-7">
          <span className={`text-5xl font-black tracking-tight ${highlighted ? "text-white" : "text-[#2563EB]"}`}>
            {price}
          </span>
          <span className={`ml-2 text-sm ${highlighted ? "text-blue-100" : "text-slate-500"}`}>{unit}</span>
        </div>

        <ul className="mb-8 flex-1 space-y-3.5">
          {features.map((f) => (
            <li
              key={f}
              className={`flex items-start gap-3 text-sm ${highlighted ? "text-white" : "text-slate-700"}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  highlighted ? "bg-white text-[#2563EB]" : "bg-[#2563EB] text-white"
                }`}
              >
                <FiCheck size={12} strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
          {notIncluded.map((f) => (
            <li
              key={f}
              className={`flex items-start gap-3 text-sm ${highlighted ? "text-blue-200" : "text-slate-400"}`}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                <FiX size={14} />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={`w-full rounded-2xl py-3.5 font-semibold transition focus-visible:outline-none focus-visible:ring-4 ${
            highlighted
              ? "bg-white text-[#2563EB] shadow-lg shadow-blue-950/20 hover:bg-blue-50 focus-visible:ring-white/40"
              : "bg-[#2563EB] text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 focus-visible:ring-[#2563EB]/30"
          }`}
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

function CommissionCalculator() {
  const [price, setPrice] = useState(2500);
  const [quantity, setQuantity] = useState(100);

  const { gmv, commission, net } = useMemo(() => {
    const rate = quantity > 500 ? 0.03 : 0.05;
    const gmvValue = price * quantity;
    const commissionValue = Math.round(gmvValue * rate);
    return { gmv: gmvValue, commission: commissionValue, net: gmvValue - commissionValue };
  }, [price, quantity]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <h2 className="mb-4 text-center text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        Simulez vos revenus
      </h2>
      <p className="mx-auto mb-12 max-w-xl text-center text-slate-600">
        Estimez ce que vous toucherez selon le prix de votre billet et le nombre de ventes prévues.
      </p>

      <div className={`grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white md:grid-cols-2 ${cardShadow}`}>
        <div className="space-y-9 p-8 sm:p-10">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label htmlFor="ticket-price" className="text-sm font-medium text-slate-700">
                Prix du billet
              </label>
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-bold text-[#2563EB]">
                {price.toLocaleString("fr-FR")} XAF
              </span>
            </div>
            <input
              id="ticket-price"
              type="range"
              min={500}
              max={20000}
              step={100}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-[#2563EB]"
            />
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label htmlFor="ticket-qty" className="text-sm font-medium text-slate-700">
                Billets vendus
              </label>
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-bold text-[#2563EB]">
                {quantity.toLocaleString("fr-FR")}
              </span>
            </div>
            <input
              id="ticket-qty"
              type="range"
              min={10}
              max={2000}
              step={10}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-[#2563EB]"
            />
          </div>
          <p className="text-xs text-slate-400">
            Taux appliqué : {quantity > 500 ? "3 % (tarif Volume)" : "5 % (tarif Standard)"}
          </p>
        </div>

        <div className="relative flex flex-col justify-center gap-5 overflow-hidden bg-[#2563EB] p-8 text-white sm:p-10">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-white/5" />
          <div className="relative flex justify-between text-sm">
            <span className="text-blue-100">Volume de billetterie</span>
            <span className="font-semibold">{gmv.toLocaleString("fr-FR")} XAF</span>
          </div>
          <div className="relative flex justify-between text-sm">
            <span className="text-blue-100">Commission Evenn</span>
            <span className="font-semibold">- {commission.toLocaleString("fr-FR")} XAF</span>
          </div>
          <div className="relative border-t border-dashed border-white/30 pt-5">
            <p className="text-sm font-medium text-blue-100">Vous touchez</p>
            <p className="mt-1 text-4xl font-black tracking-tight sm:text-5xl" aria-live="polite">
              {net.toLocaleString("fr-FR")} <span className="text-lg font-bold text-blue-100">XAF</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompareRow({
  label,
  values,
  last = false,
}: {
  label: string;
  values: boolean[];
  last?: boolean;
}) {
  return (
    <tr className={last ? "" : "border-b border-slate-100"}>
      <td className="p-4 pl-5 text-slate-700">{label}</td>
      {values.map((v, i) => (
        <td key={i} className={`p-4 text-center ${i === 1 ? "bg-blue-50/70" : ""}`}>
          {v ? (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB] text-white">
              <FiCheck size={13} strokeWidth={3} />
            </span>
          ) : (
            <FiX className="inline text-slate-300" aria-label="Non inclus" />
          )}
        </td>
      ))}
    </tr>
  );
}

function ReasonCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200/80 bg-white p-8 text-center transition duration-300 hover:-translate-y-1 hover:border-[#2563EB]/30 hover:shadow-2xl hover:shadow-blue-600/15 ${cardShadow}`}
    >
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563EB] text-2xl text-white shadow-lg shadow-blue-600/30">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-950">{title}</h3>
      <p className="leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}

function PricingFaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition ${
        open ? "border-[#2563EB]/50 shadow-lg shadow-blue-600/10" : "border-slate-200 hover:border-[#2563EB]/30"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#2563EB]/20"
      >
        <span className="flex items-center gap-3">
          <FiHelpCircle className="shrink-0 text-[#2563EB]" size={18} />
          {question}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
            open ? "bg-[#2563EB] text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          <FiChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && <div className="px-5 pb-5 pl-14 text-sm leading-7 text-slate-600">{answer}</div>}
    </div>
  );
}