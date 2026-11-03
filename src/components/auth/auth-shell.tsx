/*
  À placer dans : src/components/auth/auth-shell.tsx  (remplace l'existant)

  Même API que votre version actuelle :
  - AuthShell({ maxWidth?: "md" | "lg", children })
  - AuthHeader({ icon?, title, subtitle? })
  - AuthDivider, AuthSwitch
  - authInputClass, authFieldIcon, authFieldError, authLabelClass

  Utilisé par la connexion, l'inscription et la vérification SMS.
  Dépend des animations de motion.css (classes m-rise / m-float).
*/

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const perks = [
  "Billets avec QR Code unique",
  "Paiement en ligne sécurisé",
  "Scan même hors connexion",
];

/**
 * Enveloppe partagée des écrans d'authentification (connexion, inscription,
 * vérification SMS) : panneau de marque à gauche (desktop) et carte unique.
 */
export default function AuthShell({
  maxWidth = "md",
  children,
}: {
  maxWidth?: "md" | "lg";
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-[80vh] flex-1 bg-surface lg:grid-cols-[0.85fr_1.15fr]">
      {/* ---------- Panneau de marque (desktop) ---------- */}
      <aside className="relative isolate hidden overflow-hidden bg-brand-600 text-white lg:block">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]"
        />
        {/* 祭 : « fête, festival » */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-10 select-none text-[24rem] font-bold leading-none text-white/[0.07]"
        >
          祭
        </span>

        <div className="relative flex h-full flex-col justify-between gap-12 p-12 xl:p-16">
          <Link
            href="/"
            className="flex w-fit items-center gap-3 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/50"
          >
            <Lantern className="size-9 text-white" />
            <span className="text-lg font-medium uppercase tracking-[0.22em]">Masturi</span>
          </Link>

          <div className="m-rise max-w-md">
            <Lantern className="m-float mb-8 size-20 text-white/90" />
            <h2 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight xl:text-4xl">
              Chaque grand moment commence par un billet.
            </h2>
            <ul className="mt-8 space-y-3 text-sm font-medium">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <span className="flex size-5 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                    <Check aria-hidden className="size-3" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-brand-100">La billetterie pensée pour vos événements.</p>
        </div>
      </aside>

      {/* ---------- Carte du formulaire ---------- */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8 sm:py-16">
        <div
          className={cn(
            "m-rise w-full",
            maxWidth === "md" ? "max-w-md" : "max-w-lg",
          )}
        >
          {/* repère de marque sur mobile */}
          <Link href="/" className="mb-6 flex w-fit items-center gap-2.5 text-brand-600 lg:hidden">
            <Lantern className="size-8" />
            <span className="text-base font-medium uppercase tracking-[0.22em] text-slate-950">
              Masturi
            </span>
          </Link>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-9">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

/** En-tête de carte auth : icône (lanterne par défaut), titre, sous-titre. */
export function AuthHeader({
  icon,
  title,
  subtitle,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <header>
      <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
        {icon ?? <Lantern className="size-7" />}
      </span>
      <h1 className="mt-4 text-balance text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>}
    </header>
  );
}

/** Séparateur « OU » en pointillés, comme une perforation de billet. */
export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-4" aria-hidden>
      <span className="flex-1 border-t-2 border-dashed border-brand-200" />
      <span className="text-xs font-medium text-slate-400">OU</span>
      <span className="flex-1 border-t-2 border-dashed border-brand-200" />
    </div>
  );
}

export function AuthSwitch({
  question,
  href,
  linkLabel,
}: {
  question: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <p className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
      {question}{" "}
      <Link
        href={href}
        className="font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20"
      >
        {linkLabel}
      </Link>
    </p>
  );
}

/* Styles de champs partagés par les formulaires auth.
   (Pas de padding horizontal ici : comme avant, il vient de vos styles
   globaux ou des classes ajoutées par chaque formulaire, ex. `pr-12`.) */
export const authInputClass =
  "w-full rounded-xl border border-slate-200 bg-surface py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-brand-200 focus:border-brand-600 focus:bg-white focus:ring-4 focus:ring-brand-600/10 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-rose-100";

export const authFieldIcon =
  "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400";

export const authFieldError = "mt-1.5 text-xs font-medium text-rose-600";

export const authLabelClass = "block text-sm font-semibold text-slate-800";

/* ------------------------------------------------------------------ */
/* Lanterne japonaise : l'icône de Masturi                             */
/* ------------------------------------------------------------------ */

function Lantern({ className }: { className?: string }) {
  const clipId = React.useId();
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