import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  CalendarDays,
  CalendarPlus,
  Check,
  CircleHelp,
  CreditCard,
  Download,
  Mail,
  Megaphone,
  Mic2,
  Music,
  PartyPopper,
  Phone,
  PenTool,
  QrCode,
  Scan,
  Share2,
  Shield,
  Smartphone,
  Ticket,
  TrendingUp,
  Users,
  Wifi,
  X,
  GraduationCap,
  Briefcase,
  Church,
  Plus,
} from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Container } from "@/src/components/ui/container";
import { CountUp, Reveal } from "@/src/components/ui/motion";
import EventCard, { type EventListItem } from "@/src/components/events/event-card";
import { getEvent } from "@/lib/actions/events/get-events";
import { getPlatformStats } from "@/lib/actions/stats/get-platform-stats";
import { cn } from "@/lib/utils";

import Header from "@/src/components/ui/header";
import Footer from "@/src/components/ui/footer";

/* Délai d'animation (ms) passé en variable CSS */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/* ------------------------------------------------------------------ */
/* Données                                                             */
/* ------------------------------------------------------------------ */

const heroChecks = ["Sans engagement", "Paiement sécurisé", "100 % mobile"];

const audiences = [
  { icon: Music, label: "Concerts & festivals" },
  { icon: Briefcase, label: "Conférences" },
  { icon: GraduationCap, label: "Formations" },
  { icon: PartyPopper, label: "Soirées privées" },
  { icon: Church, label: "Événements associatifs" },
  { icon: Mic2, label: "Spectacles" },
];

const bento = [
  {
    icon: CalendarPlus,
    title: "Une page événement en 5 minutes",
    desc: "Nom, date, lieu, visuel, tarifs : votre page est prête à être partagée, sans compétence technique.",
    className: "md:col-span-2",
    visual: "page",
  },
  {
    icon: QrCode,
    title: "QR Code unique",
    desc: "Chaque billet est infalsifiable et scannable depuis n’importe quel smartphone.",
    className: "",
    visual: "qr",
  },
  {
    icon: CreditCard,
    title: "Paiement en ligne",
    desc: "Vos participants achètent en quelques secondes. Vous encaissez directement.",
    className: "",
    visual: "pay",
  },
  {
    icon: TrendingUp,
    title: "Statistiques en direct",
    desc: "Ventes, taux de remplissage, heures d’affluence : pilotez jusqu’au jour J.",
    className: "md:col-span-2",
    visual: "stats",
  },
];

const features = [
  { icon: Scan, title: "Scan en 1 seconde", desc: "Validez les entrées d’un geste, même sans connexion." },
  { icon: Mail, title: "Billets par email", desc: "Chaque participant reçoit son billet automatiquement." },
  { icon: Bell, title: "Rappels automatiques", desc: "Réduisez les absents avec des rappels avant l’événement." },
  { icon: Users, title: "Gestion des participants", desc: "Listes, exports CSV et import de contacts." },
  { icon: Megaphone, title: "Codes promo", desc: "Offrez des réductions et suivez ce qui fonctionne." },
  { icon: Shield, title: "Données protégées", desc: "Paiements et informations personnelles sécurisés." },
  { icon: Wifi, title: "Mode hors connexion", desc: "Le scan continue même si le réseau tombe." },
  { icon: Smartphone, title: "Pensé pour le mobile", desc: "Organisez et contrôlez tout depuis votre téléphone." },
];

const steps = [
  {
    icon: PenTool,
    title: "Créez votre événement",
    desc: "Remplissez le formulaire : nom, date, lieu, capacité, prix. Ajoutez une image et une description.",
  },
  {
    icon: Share2,
    title: "Partagez le lien",
    desc: "Diffusez votre page par email, sur les réseaux sociaux ou sur votre site. Les inscriptions arrivent.",
  },
  {
    icon: Phone,
    title: "Scannez à l’entrée",
    desc: "Le jour J, ouvrez l’app Masturi et scannez les QR Codes. Fini les listes papier.",
  },
];

const compare = [
  { label: "Billets", before: "Papier, à imprimer et distribuer", after: "Digitaux avec QR Code unique" },
  { label: "Suivi des ventes", before: "Fichiers Excel mis à jour à la main", after: "Tableau de bord en temps réel" },
  { label: "Contrôle d’accès", before: "Listes interminables et files d’attente", after: "Scan en 1 seconde, même hors connexion" },
  { label: "Paiement", before: "Espèces ou virements à rapprocher", after: "Paiement en ligne sécurisé" },
];

const faqs = [
  {
    q: "Est-ce que je peux vendre des billets payants ?",
    r: "Oui, Masturi intègre un système de paiement sécurisé. Vous fixez le prix de vos billets et encaissez directement.",
  },
  {
    q: "Mes participants ont-ils besoin de l’app Masturi ?",
    r: "Non, ils reçoivent leur billet par email avec un QR Code. Ils le présentent sur leur smartphone ou l’impriment.",
  },
  {
    q: "Puis-je importer des participants existants ?",
    r: "Oui. Importez une liste CSV ou synchronisez vos contacts depuis Google ou Outlook.",
  },
  {
    q: "Que se passe-t-il en cas de problème technique le jour J ?",
    r: "Notre application de scan fonctionne hors connexion, et notre support répond 7j/7 par chat et email.",
  },
  {
    q: "Combien de temps faut-il pour créer un événement ?",
    r: "Environ 5 minutes. Votre page est en ligne dès que vous publiez.",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default async function HomePage() {
  const [platform, storedEvents] = await Promise.all([getPlatformStats(), getEvent()]);

  const now = Date.now();
  const featuredEvents: EventListItem[] = storedEvents
    .filter((event) => !event.date || new Date(event.date).getTime() >= now)
    .slice(0, 3)
    .map((event) => ({
      id: event.id,
      title: event.title,
      category: event.category,
      image: event.cover_url,
      city: event.city,
      venue: event.venue_name,
      date: event.date,
      ticketsSold: event.tickets_sold,
    }));

  const fillRate =
    platform.capacity > 0 ? Math.round((platform.ticketsSold / platform.capacity) * 100) : 0;

  const stats = [
    { value: platform.publishedEvents, label: "Événements publiés", icon: CalendarDays },
    { value: platform.ticketsSold, label: "Billets vendus", icon: Ticket },
    { value: platform.organizations, label: "Organisateurs", icon: Users },
    { value: platform.members, label: "Membres inscrits", icon: Scan },
  ];

  return (
    <>
    <Header />
    <main className="bg-surface text-slate-700">
      {/* ===== HERO ===== */}
      <section className="relative isolate overflow-hidden bg-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="m-drift absolute -right-36 -top-40 size-[520px] rounded-full bg-brand-100/70 blur-3xl" />
          <div className="m-drift absolute -bottom-48 -left-40 size-[440px] rounded-full bg-sky-100/70 blur-3xl [animation-delay:-8s]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f01f_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f01f_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <Container className="relative grid items-center gap-12 pb-16 pt-12 sm:pb-24 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <div className="m-rise" style={d(0)}>
              <Badge variant="soft" className="gap-2 rounded-full px-4 py-1.5 font-semibold">
                <BadgeCheck aria-hidden className="size-4 text-brand-600" />
                La billetterie pensée pour vos événements
              </Badge>
            </div>

            <h1
              className="m-rise mt-6 text-balance text-5xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-6xl"
              style={d(100)}
            >
              Faites de votre prochain événement{" "}
              <span className="text-brand-600">un succès.</span>
            </h1>
            <p
              className="m-rise mt-6 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
              style={d(220)}
            >
              Billetterie, QR Codes et suivi des ventes : tout ce qu’il vous faut pour
              organiser sereinement, dans une seule plateforme.
            </p>

            <div
              className="m-rise mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              style={d(340)}
            >
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:-translate-y-0.5 hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30"
              >
                Créer mon événement{" "}
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="#fonctionnement"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-brand-200 hover:bg-brand-50/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20"
              >
                Découvrir la plateforme
              </Link>
            </div>

            <ul
              className="m-rise mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-500 lg:justify-start"
              style={d(440)}
            >
              {heroChecks.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check aria-hidden className="size-4 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>

            <div
              className="m-rise mt-9 flex items-center justify-center gap-3 border-t border-slate-200/80 pt-6 lg:justify-start"
              style={d(540)}
            >
              <span
                aria-hidden
                className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100"
              >
                <Users className="size-5" />
              </span>
              <p className="text-left text-xs leading-5 text-slate-500">
                <span className="block font-semibold text-slate-800">Une communauté en croissance</span>
                {platform.organizations.toLocaleString("fr-FR")} organisateurs sur Masturi
              </p>
            </div>
          </div>

          <div className="m-rise relative mx-auto w-full max-w-2xl lg:mx-0" style={d(300)}>
            <HeroMockup
              ticketsSold={platform.ticketsSold}
              scans={platform.scans}
              revenue={platform.revenue}
              fillRate={fillRate}
              capacity={platform.capacity}
              upcomingEvents={platform.upcomingEvents}
            />
          </div>
        </Container>
      </section>

      {/* ===== POUR QUI ===== */}
      <section className="border-y border-slate-200/70 bg-white py-10">
        <Container>
          <Reveal>
            <p className="text-center text-sm font-medium text-slate-500">
              Utilisé pour tous types d’événements
            </p>
          </Reveal>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {audiences.map(({ icon: Icon, label }, i) => (
              <Reveal as="li" key={label} delay={i * 70}>
                <div className="flex h-full items-center justify-center gap-2 rounded-xl border border-slate-100 bg-surface px-3 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/50">
                  <Icon aria-hidden className="size-4 shrink-0 text-brand-600" />
                  {label}
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ===== BENTO : SOLUTION ===== */}
      <section id="solution" className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Une plateforme complète"
            title="Tout ce qu’il faut pour organiser, vendre et contrôler"
            description="Des outils intuitifs et sécurisés pour gagner du temps et augmenter vos ventes."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {bento.map((item, i) => (
              <Reveal key={item.title} className={item.className} delay={(i % 2) * 120}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <item.icon aria-hidden className="size-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-1.5 max-w-md text-sm leading-6 text-slate-500">{item.desc}</p>
                  <div className="mt-6 flex-1">
                    <BentoVisual kind={item.visual} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Fonctionnalités complémentaires */}
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal as="li" key={f.title} delay={(i % 4) * 80}>
                <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
                  <f.icon aria-hidden className="size-5 text-brand-600" strokeWidth={1.75} />
                  <h3 className="mt-3 text-sm font-bold text-slate-950">{f.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ===== AVANT / AVEC MASTURI ===== */}
      <section id="probleme" className="border-y border-slate-200/70 bg-white py-16 sm:py-24">
        <Container className="max-w-5xl">
          <SectionHeading
            eyebrow="Moins de contraintes"
            title="Organiser un événement ne devrait pas être compliqué"
            description="Voyez ce qui change quand vous quittez les fichiers Excel et les billets papier."
          />
          <Reveal className="overflow-hidden rounded-3xl border border-slate-200/80 bg-surface">
            <div className="hidden grid-cols-[160px_1fr_1fr] gap-4 border-b border-slate-200/80 bg-white px-6 py-4 text-sm font-bold sm:grid">
              <span />
              <span className="text-slate-500">Sans Masturi</span>
              <span className="text-brand-700">Avec Masturi</span>
            </div>
            {compare.map((row, i) => (
              <Reveal
                key={row.label}
                delay={i * 110}
                className="grid gap-2 border-b border-slate-200/60 px-6 py-5 last:border-b-0 sm:grid-cols-[160px_1fr_1fr] sm:gap-4"
              >
                <span className="text-sm font-bold text-slate-950">{row.label}</span>
                <span className="flex items-start gap-2 text-sm text-slate-500">
                  <X aria-hidden className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  {row.before}
                </span>
                <span className="flex items-start gap-2 text-sm font-medium text-slate-800">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" />
                  {row.after}
                </span>
              </Reveal>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* ===== EN 3 ÉTAPES ===== */}
      <section id="fonctionnement" className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Simple du début à la fin"
            title="Prêt en trois étapes"
            description="De la création au jour J, Masturi vous accompagne."
          />
          <ol className="grid gap-4 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 140}>
                <div className="h-full rounded-3xl border border-slate-200/80 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                      <step.icon aria-hidden className="size-6" strokeWidth={1.75} />
                    </span>
                    <span className="text-sm font-semibold text-slate-400">Étape {i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ===== APP DE SCAN ===== */}
      <section className="border-y border-slate-200/70 bg-white py-16 sm:py-24">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <Badge variant="soft" className="mb-5 gap-2 px-3 py-1.5 font-semibold">
              <Scan aria-hidden className="size-4 text-brand-600" />
              Contrôle d’accès intelligent
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Le jour J, votre téléphone suffit
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-500">
              Plus besoin de scanners dédiés ni de listes imprimées. Votre équipe valide les
              entrées depuis son smartphone et vous suivez l’affluence en direct.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Validation instantanée, billets déjà utilisés signalés",
                "Plusieurs équipiers peuvent scanner en même temps",
                "Fonctionne sans connexion, synchronisation automatique",
              ].map((t, i) => (
                <Reveal as="li" key={t} delay={200 + i * 120} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 ring-1 ring-brand-100">
                    <Check aria-hidden className="size-3 text-brand-600" />
                  </span>
                  {t}
                </Reveal>
              ))}
            </ul>
            <Link
              href="/auth/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30"
            >
              <Download aria-hidden className="size-4" /> Essayer l’app de scan
            </Link>
          </Reveal>

          <Reveal delay={150}>
            <div className="rounded-[2rem] bg-gradient-to-br from-brand-100 via-white to-sky-100 p-6 sm:p-10">
              <PhoneMockup ticketsSold={platform.ticketsSold} scans={platform.scans} fillRate={fillRate} />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ===== CHIFFRES ===== */}
      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div className="h-full rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <s.icon aria-hidden className="mx-auto size-6 text-brand-600" strokeWidth={1.75} />
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    <CountUp value={s.value} />
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== ÉVÉNEMENTS À LA UNE ===== */}
      {featuredEvents.length > 0 && (
        <section className="border-y border-slate-200/70 bg-white py-16 sm:py-24">
          <Container>
            <SectionHeading
              eyebrow="À ne pas manquer"
              title="Les prochains événements"
              description="Découvrez ce qui se prépare sur Masturi et réservez votre place."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event, index) => (
                <Reveal key={event.id} delay={index * 120}>
                  <EventCard event={event} priority={index === 0} />
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-10 text-center">
              <Link
                href="/events"
                className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-brand-200 hover:bg-brand-50/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20"
              >
                Voir tous les événements{" "}
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </Container>
        </section>
      )}

      {/* ===== FAQ ===== */}
      <section id="faq" className="border-y border-slate-200/70 bg-white py-16 sm:py-24">
        <Container className="max-w-3xl">
          <SectionHeading title="Questions fréquentes" />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 80}>
                <details className="group rounded-2xl border border-slate-200/80 bg-surface px-5 py-4 transition open:border-brand-200 open:bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-slate-950 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20 sm:text-base [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-3">
                      <CircleHelp aria-hidden className="size-4 shrink-0 text-brand-600" />
                      {faq.q}
                    </span>
                    <Plus
                      aria-hidden
                      className="size-4 shrink-0 text-slate-400 transition duration-300 group-open:rotate-45"
                    />
                  </summary>
                  <p className="m-open mt-3 pl-7 text-sm leading-6 text-slate-500">{faq.r}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 text-center text-sm text-slate-500">
              Une autre question ?{" "}
              <Link href="/contact" className="font-semibold text-brand-700 hover:underline">
                Écrivez-nous
              </Link>
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ===== CTA FINAL ===== */}
      <Container className="py-20 sm:py-28">
        <Reveal
          as="section"
          className="relative mx-auto grid max-w-5xl md:grid-cols-[1fr_300px]"
        >
          {/* ---------- Corps du billet ---------- */}
          <div className="relative overflow-hidden rounded-t-[2rem] bg-brand-600 px-7 py-12 text-white sm:px-12 sm:py-16 md:rounded-l-[2rem] md:rounded-tr-none">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]"
            />
            <div className="relative max-w-lg">
              <h2 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-[2.75rem]">
                Votre prochain événement mérite une vraie billetterie.
              </h2>
              <p className="mt-5 text-base leading-7 text-brand-50/90">
                Créez votre page en 5 minutes, vendez vos billets en ligne et validez les entrées
                avec votre téléphone.
              </p>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white">
                {["Sans engagement", "Paiement sécurisé", "Scan hors connexion"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                      <Check aria-hidden className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------- Talon détachable ---------- */}
          <div className="relative flex flex-col items-center justify-center gap-5 rounded-b-[2rem] border-t-2 border-dashed border-brand-200 bg-white px-7 py-10 text-center shadow-card md:rounded-bl-none md:rounded-r-[2rem] md:border-l-2 md:border-t-0">
            <span
              aria-hidden
              className="absolute -left-4 -top-4 size-8 rounded-full bg-surface md:-top-4 md:left-[-17px]"
            />
            <span
              aria-hidden
              className="absolute -right-4 -top-4 size-8 rounded-full bg-surface md:-bottom-4 md:left-[-17px] md:right-auto md:top-auto"
            />

            <span className="m-float flex size-20 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <QrCode aria-hidden className="size-12" strokeWidth={1.25} />
            </span>

            <div>
              <p className="text-lg font-bold text-slate-950">Réservez votre place d’organisateur</p>
              <p className="mt-1 text-sm text-slate-500">
                Aucune carte bancaire requise pour l’essai.
              </p>
            </div>

            <Link
              href="/auth/register"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30"
            >
              Créer mon événement{" "}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="#faq"
              className="text-sm font-semibold text-slate-600 underline-offset-4 transition hover:text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20"
            >
              Lire la FAQ
            </Link>
          </div>
        </Reveal>
      </Container>
    </main>
    <Footer />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sous-composants                                                     */
/* ------------------------------------------------------------------ */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">{description}</p>
      )}
    </Reveal>
  );
}

function HeroMockup({
  ticketsSold,
  scans,
  revenue,
  fillRate,
  capacity,
  upcomingEvents,
}: {
  ticketsSold: number;
  scans: number;
  revenue: number;
  fillRate: number;
  capacity: number;
  upcomingEvents: number;
}) {
  const fill = `${Math.min(fillRate, 100)}%`;

  return (
    <div className="relative mx-auto w-full text-left">
      <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_32px_90px_-40px_rgba(15,23,42,0.3)] backdrop-blur sm:p-6">
        {/* barre de fenêtre */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-300" />
            <span className="size-2.5 rounded-full bg-amber-300" />
            <span className="size-2.5 rounded-full bg-emerald-300" />
            <span className="ml-2 truncate rounded-md bg-surface px-3 py-1 text-[10px] text-slate-400 sm:text-xs">
              masturi.app/tableau-de-bord
            </span>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 text-xs font-medium text-emerald-700 sm:flex">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-500 opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            En direct
          </span>
        </div>

        <div className="grid gap-3 pt-4 sm:gap-4 md:grid-cols-3">
          {[
            { label: "Billets vendus", value: ticketsSold, suffix: "", icon: Ticket },
            { label: "Entrées validées", value: scans, suffix: "", icon: Scan },
            { label: "Revenus", value: revenue, suffix: " XAF", icon: CreditCard },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <k.icon aria-hidden className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                <CountUp value={k.value} suffix={k.suffix} duration={1800} />
              </p>
              <p className="text-xs text-slate-500">{k.label}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-4 md:col-span-2">
            <div className="flex items-center justify-between text-sm font-bold text-slate-950">
              <span className="flex items-center gap-2">
                <BarChart3 aria-hidden className="size-4 text-brand-600" /> Capacité globale
              </span>
              <span className="text-xs font-medium text-slate-500">
                {capacity.toLocaleString("fr-FR")} places
              </span>
            </div>
            <div className="mt-4 h-2.5 rounded-full bg-white" aria-hidden>
              <div
                className="m-fill h-full rounded-full bg-brand-600"
                style={{ width: fill, "--w": fill } as CSSProperties}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {ticketsSold.toLocaleString("fr-FR")} billets vendus · {fillRate} % de remplissage
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 p-4">
            <p className="text-sm font-bold text-slate-950">Événements à venir</p>
            <p className="mt-2 text-3xl font-bold text-brand-700">
              <CountUp value={upcomingEvents} />
            </p>
            <p className="mt-2 text-xs text-slate-500">Publiés sur la plateforme</p>
          </div>
        </div>
      </div>

      {/* cartes flottantes */}
      <div
        className="m-float absolute -left-3 top-24 hidden items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-pop lg:flex"
        style={d(0)}
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <QrCode aria-hidden className="size-5" />
        </span>
        <div>
          <p className="text-xs text-slate-500">Contrôle d’accès</p>
          <p className="text-sm font-bold text-slate-950">
            {scans.toLocaleString("fr-FR")} entrées validées
          </p>
        </div>
      </div>
      <div
        className="m-float absolute -bottom-5 -right-3 hidden items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-pop sm:flex"
        style={d(-3000)}
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Ticket aria-hidden className="size-5" />
        </span>
        <div>
          <p className="text-xs text-slate-500">Billetterie</p>
          <p className="text-sm font-bold text-slate-950">
            {ticketsSold.toLocaleString("fr-FR")} billets vendus
          </p>
        </div>
      </div>
    </div>
  );
}

function BentoVisual({ kind }: { kind: string }) {
  if (kind === "page") {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-surface p-4">
        <div className="h-20 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700" aria-hidden />
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-950">Nuit de la Musique</p>
            <p className="text-xs text-slate-500">Samedi 14 août · Douala</p>
          </div>
          <span className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white">
            Réserver
          </span>
        </div>
      </div>
    );
  }
  if (kind === "qr") {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-surface py-6">
        <span className="m-float flex size-24 items-center justify-center rounded-2xl border border-slate-200/80 bg-white">
          <QrCode aria-hidden className="size-16 text-slate-900" strokeWidth={1.25} />
        </span>
      </div>
    );
  }
  if (kind === "pay") {
    return (
      <div className="space-y-2 rounded-2xl bg-surface p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Billet standard</span>
          <span className="font-bold text-slate-950">5 000</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Code promo</span>
          <span className="font-bold text-emerald-600">-10 %</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-2">
          <span className="font-bold text-slate-950">Total</span>
          <span className="font-bold text-brand-700">4 500</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-28 items-end gap-2 rounded-2xl bg-surface p-4" aria-hidden>
      {[30, 45, 38, 60, 52, 78, 70, 92, 100].map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}%`, "--i": i } as CSSProperties}
          className={cn("m-bar flex-1 rounded-t-md", i > 6 ? "bg-brand-600" : "bg-brand-600/25")}
        />
      ))}
    </div>
  );
}

function PhoneMockup({
  ticketsSold,
  scans,
  fillRate,
}: {
  ticketsSold: number;
  scans: number;
  fillRate: number;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div className="rounded-[2.5rem] border-[8px] border-slate-900 bg-white p-4 shadow-card-hover">
        <div className="mx-auto h-1.5 w-16 rounded-full bg-slate-200" aria-hidden />
        <p className="mt-4 text-center text-sm font-bold text-slate-950">Scanner un billet</p>
        <div className="relative mx-auto mt-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-950">
          <QrCode aria-hidden className="size-28 text-white/80" strokeWidth={1} />
          <span aria-hidden className="absolute inset-6 rounded-xl border-2 border-brand-400" />
          {/* ligne de scan */}
          <span
            aria-hidden
            className="m-scan absolute inset-x-6 top-[12%] h-0.5 rounded-full bg-brand-400 shadow-[0_0_14px_3px_rgba(96,165,250,0.7)] motion-reduce:hidden"
          />
        </div>
        <div className="m-pop mt-4 flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check aria-hidden className="size-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-emerald-800">Entrée validée</p>
            <p className="text-xs text-emerald-700">Billet scanné</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>
            {scans.toLocaleString("fr-FR")} / {ticketsSold.toLocaleString("fr-FR")} entrées
          </span>
          <span className="font-semibold text-brand-700">{fillRate} %</span>
        </div>
      </div>
    </div>
  );
}