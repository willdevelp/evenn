import { useId } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Heart,
  Rocket,
  Search,
  Ticket,
  TicketCheck,
  Users,
} from "lucide-react";

import { Container } from "@/src/components/ui/container";
import { getPlatformStats } from "@/lib/actions/stats/get-platform-stats";
import { cn } from "@/lib/utils";
import FaqItem from "./faq-item";

import Header from "@/src/components/ui/header";
import Footer from "@/src/components/ui/footer";

export const metadata = {
  title: "À propos | Masturi",
  description:
    "Masturi connecte les organisateurs d’événements à leur public avec une billetterie en ligne, des QR Codes et un contrôle d’accès simple.",
};

export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: Search,
    title: "Découvrez",
    text: "Parcourez les événements près de chez vous : concerts, conférences, soirées, ateliers et bien plus.",
  },
  {
    icon: TicketCheck,
    title: "Réservez",
    text: "Achetez votre billet en quelques clics, recevez-le directement sur votre téléphone avec son QR code.",
  },
  {
    icon: CalendarCheck,
    title: "Profitez",
    text: "Présentez votre billet à l’entrée et vivez l’événement l’esprit tranquille, sans papier ni file d’attente.",
  },
];

const VALUES = [
  {
    icon: Heart,
    title: "Passion",
    text: "Nous mettons notre énergie à créer des expériences uniques pour chaque événement.",
  },
  {
    icon: Rocket,
    title: "Innovation",
    text: "Nous repoussons les limites avec une technologie de pointe pour faciliter la gestion.",
  },
  {
    icon: Users,
    title: "Communauté",
    text: "Nous créons des liens forts entre organisateurs et participants pour des moments partagés.",
  },
];

const FAQ = [
  {
    question: "Masturi est-il gratuit pour les organisateurs ?",
    answer:
      "La création d’un compte et la mise en ligne d’un événement sont gratuites. Une commission n’est prélevée que sur les billets effectivement vendus, selon la règle tarifaire affichée sur la page Tarifs.",
  },
  {
    question: "Comment reçoit-on son billet après l’achat ?",
    answer:
      "Votre billet est envoyé immédiatement par email et reste accessible dans votre espace personnel, avec un QR code à présenter à l’entrée.",
  },
  {
    question: "Puis-je me faire rembourser un billet ?",
    answer:
      "Les conditions de remboursement dépendent de chaque organisateur. Elles sont indiquées sur la page de l’événement avant l’achat.",
  },
  {
    question: "Comment un organisateur reçoit-il ses revenus ?",
    answer:
      "Les revenus des ventes sont reversés directement sur le compte de l’organisateur selon la fréquence choisie lors de la création de l’événement.",
  },
];

export default async function AboutPage() {
  const platform = await getPlatformStats();

  const stats = [
    { value: platform.publishedEvents, label: "Événements publiés", icon: CalendarDays },
    { value: platform.ticketsSold, label: "Billets vendus", icon: Ticket },
    { value: platform.organizations, label: "Organisateurs", icon: Users },
    { value: platform.members, label: "Membres inscrits", icon: TicketCheck },
  ];

  return (
    <>
    <Header />
    <main className="bg-surface text-slate-700">
      {/* ===== EN-TÊTE ===== */}
      <section className="relative isolate overflow-hidden bg-brand-600 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]"
        />
        {/* 祭 : « fête, festival » */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-4 select-none text-[22rem] font-bold leading-none text-white/[0.07] lg:right-24"
        >
          祭
        </span>

        <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-2xl motion-safe:animate-fade-up">
            <h1 className="text-balance text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              Les plus beaux moments se vivent ensemble.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-brand-50/90 sm:text-lg sm:leading-8">
              Masturi réunit les organisateurs et leur public pour rendre chaque événement
              plus simple à créer, à découvrir et à vivre.
            </p>
            <Link
              href="/events"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/50"
            >
              Explorer les événements <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>

          <div className="mx-auto w-full max-w-md motion-safe:animate-fade-up [animation-delay:200ms] lg:ml-auto">
            <figure className="rounded-3xl bg-white p-7 text-slate-950 shadow-pop sm:p-8">
              <Lantern className="size-14 text-brand-600" />
              <blockquote className="mt-5 text-2xl font-semibold leading-snug tracking-tight sm:text-[1.65rem]">
                La technologie doit rapprocher les gens, pas compliquer les rencontres.
              </blockquote>
              <figcaption className="mt-6 border-t-2 border-dashed border-brand-200 pt-5 text-sm text-slate-500">
                Une plateforme conçue pour les organisateurs et les participants.
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* ===== MANIFESTE ===== */}
      <Container className="py-16 sm:py-20">
        <div className="grid gap-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14 lg:p-12">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
            Chaque événement mérite d’être inoubliable.
          </h2>
          <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            <p>
              <strong className="font-semibold text-slate-950">Masturi</strong> est une
              plateforme dédiée à la découverte, la gestion et la réservation d’événements
              uniques.
            </p>
            <p>
              Que vous soyez amateur de musique, passionné de culture ou professionnel à la
              recherche d’un salon ou d’une conférence, Masturi vous permet de trouver des
              événements adaptés à vos envies, partout.
            </p>
            <p>
              Notre mission est de connecter les organisateurs d’événements à leur public à
              travers une expérience fluide, moderne et immersive. Grâce à une interface
              intuitive, la réservation n’a jamais été aussi simple.
            </p>
            <p className="border-l-2 border-brand-600 pl-4 font-medium text-slate-950">
              Merci de faire partie de l’aventure Masturi. Ensemble, rendons chaque moment
              inoubliable.
            </p>
          </div>
        </div>
      </Container>

      {/* ===== CHIFFRES CLÉS : un billet ===== */}
      <Container className="max-w-5xl pb-16 sm:pb-20">
        <dl className="grid grid-cols-2 rounded-3xl border border-slate-200/80 bg-white shadow-card md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "relative px-5 py-7 text-center sm:px-6 sm:py-9",
                // séparateurs en pointillés (perforation)
                i % 2 === 1 && "border-l-2 border-dashed border-brand-200",
                i >= 2 && "border-t-2 border-dashed border-brand-200 md:border-t-0",
                i >= 1 && "md:border-l-2 md:border-dashed md:border-brand-200",
              )}
            >
              {/* encoches aux extrémités de chaque perforation (md) */}
              {i > 0 && (
                <>
                  <span
                    aria-hidden
                    className="absolute -top-3.5 left-[-14px] hidden size-6 rounded-full bg-surface md:block"
                  />
                  <span
                    aria-hidden
                    className="absolute -bottom-3.5 left-[-14px] hidden size-6 rounded-full bg-surface md:block"
                  />
                </>
              )}
              <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <stat.icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <dd className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {stat.value.toLocaleString("fr-FR")}
              </dd>
              <dt className="mt-1 text-sm text-slate-500">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section className="border-y border-slate-200/70 bg-white py-16 sm:py-24">
        <Container>
          <SectionHeading
            title="Comment ça marche"
            description="Trois étapes suffisent pour trouver votre prochain événement ou vendre vos premiers billets."
          />
          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative rounded-3xl border border-slate-200/80 bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                    <step.icon aria-hidden className="size-6" strokeWidth={1.75} />
                  </span>
                  <span aria-hidden className="text-3xl font-bold tracking-tight text-brand-200">
                    {`0${index + 1}`}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ===== NOS VALEURS ===== */}
      <Container className="py-16 sm:py-24">
        <SectionHeading title="Nos valeurs" />
        <ul className="grid rounded-3xl border border-slate-200/80 bg-white shadow-card md:grid-cols-3">
          {VALUES.map((value, i) => (
            <li
              key={value.title}
              className={cn(
                "p-7 sm:p-9",
                i > 0 &&
                  "border-t-2 border-dashed border-brand-200 md:border-l-2 md:border-t-0",
              )}
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <value.icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{value.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{value.text}</p>
            </li>
          ))}
        </ul>
      </Container>

      {/* ===== FAQ ===== */}
      <section className="border-y border-slate-200/70 bg-white">
        <Container className="max-w-3xl py-16 sm:py-24">
          <SectionHeading title="Questions fréquentes" />
          <div className="space-y-3">
            {FAQ.map((item) => (
              <FaqItem key={item.question} {...item} />
            ))}
          </div>
        </Container>
      </section>

      {/* ===== CTA : billet ===== */}
      <Container className="py-16 sm:py-24">
        <section
          aria-labelledby="about-cta"
          className="relative mx-auto grid max-w-5xl md:grid-cols-[1fr_280px]"
        >
          <div className="relative overflow-hidden rounded-t-[2rem] bg-brand-600 px-7 py-11 text-white sm:px-12 sm:py-14 md:rounded-l-[2rem] md:rounded-tr-none">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]"
            />
            <div className="relative max-w-lg">
              <h2
                id="about-cta"
                className="text-balance text-2xl font-bold tracking-tight sm:text-3xl"
              >
                Prêt à vivre des expériences uniques ?
              </h2>
              <p className="mt-4 text-sm leading-7 text-brand-50/90 sm:text-base">
                Rejoignez Masturi dès maintenant et découvrez des événements qui vous
                correspondent.
              </p>
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center gap-5 rounded-b-[2rem] border-t-2 border-dashed border-brand-200 bg-white px-7 py-9 text-center shadow-card md:rounded-bl-none md:rounded-r-[2rem] md:border-l-2 md:border-t-0">
            <span
              aria-hidden
              className="absolute -left-4 -top-4 size-8 rounded-full bg-surface md:left-[-17px]"
            />
            <span
              aria-hidden
              className="absolute -right-4 -top-4 size-8 rounded-full bg-surface md:-bottom-4 md:left-[-17px] md:right-auto md:top-auto"
            />
            <Lantern className="size-12 text-brand-600" />
            <Link
              href="/events"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30"
            >
              Explorer les événements <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </section>
      </Container>
    </main>
    <Footer />
    </>
  );
}

function SectionHeading({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 text-center", className)}>
      <h2 className="mx-auto max-w-2xl text-balance text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

/** Lanterne japonaise (chōchin) : l'icône de Masturi, en couleur courante. */
function Lantern({ className }: { className?: string }) {
  const clipId = useId();
  const body = "M21 11H43C53 21 53 43 43 53H21C11 43 11 21 21 11Z";
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className} fill="none">
      <defs>
        <clipPath id={clipId}>
          <path d={body} />
        </clipPath>
      </defs>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d={body} strokeWidth="3" />
        <g clipPath={`url(#${clipId})`} strokeWidth="2.4">
          <path d="M8 21Q32 27 56 21" />
          <path d="M8 29Q32 35 56 29" />
          <path d="M8 37Q32 43 56 37" />
          <path d="M8 45Q32 51 56 45" />
        </g>
      </g>
      <g fill="currentColor">
        <rect x="21" y="6" width="22" height="5" rx="1.6" />
        <rect x="21" y="53" width="22" height="5" rx="1.6" />
        <rect x="30.5" y="58" width="3" height="5.5" rx="1.5" />
        <rect x="30.5" y="1.5" width="3" height="4.5" rx="1.5" />
      </g>
    </svg>
  );
}