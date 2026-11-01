import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Enveloppe partagée des écrans d'authentification (connexion, inscription,
 * vérification SMS) : surface, halo brand doux et carte unique.
 */
export default function AuthShell({
  maxWidth = "md",
  children,
}: {
  maxWidth?: "md" | "lg";
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-[70vh] flex-1 items-center justify-center bg-surface px-4 py-14 sm:px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 size-80 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 size-80 rounded-full bg-brand-100/40 blur-3xl" />
      </div>

      <div
        className={cn(
          "relative w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-9",
          maxWidth === "md" ? "max-w-md" : "max-w-lg",
        )}
      >
        {children}
      </div>
    </main>
  );
}

/** En-tête de carte auth : monogramme, titre, sous-titre. */
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
    <div className="text-center">
      {icon ? (
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
          {icon}
        </span>
      ) : (
        <span
          aria-hidden
          className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white shadow-sm"
        >
          E
        </span>
      )}
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="my-6 flex items-center" aria-hidden>
      <span className="h-px flex-1 bg-slate-200" />
      <span className="px-4 text-xs font-medium text-slate-400">OU</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export function AuthSwitch({ question, href, linkLabel }: { question: string; href: string; linkLabel: string }) {
  return (
    <p className="mt-6 text-center text-sm text-slate-500">
      {question}{" "}
      <Link href={href} className="font-semibold text-brand-600 underline-offset-4 hover:underline">
        {linkLabel}
      </Link>
    </p>
  );
}

/* Styles de champs partagés par les formulaires auth. */
export const authInputClass =
  "w-full rounded-xl border border-slate-200 bg-white py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10 aria-[invalid=true]:border-rose-300";

export const authFieldIcon =
  "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400";

export const authFieldError =
  "mt-1.5 text-xs text-rose-600";

export const authLabelClass = "block text-sm font-medium text-slate-700";
