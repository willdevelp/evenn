import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/** État vide normalisé : icône dans un pavé, titre, description et action optionnelle (lien ou handler). */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}) {
  const buttonClass =
    "inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30";

  return (
    <section
      className={cn(
        "flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-10 text-center shadow-card sm:p-14",
        className,
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
        {icon}
      </span>
      <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      )}
      {action &&
        (action.href ? (
          <Link href={action.href} className={cn(buttonClass, "mt-6")}>
            {action.label} <ArrowRight className="size-4" />
          </Link>
        ) : (
          <button type="button" onClick={action.onClick} className={cn(buttonClass, "mt-6")}>
            {action.label}
          </button>
        ))}
    </section>
  );
}
