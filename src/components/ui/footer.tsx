// components/Footer.tsx
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { getPublicSettings } from "@/lib/actions/settings/get-public-settings";

const columns = [
  {
    title: "Explorer",
    links: [
      { label: "Événements", href: "/events" },
      { label: "Votes et concours", href: "/vote" },
      { label: "Tarifs", href: "/pricing" },
    ],
  },
  {
    title: "Organisateurs",
    links: [
      { label: "Créer un événement", href: "/auth/register" },
      { label: "Comment ça marche", href: "/#fonctionnement" },
      { label: "Questions fréquentes", href: "/#faq" },
    ],
  },
  {
    title: "Evenn",
    links: [
      { label: "À propos", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Connexion", href: "/auth/login" },
    ],
  },
];

const ring =
  "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";
const link = `transition-colors hover:text-[var(--heading)] ${ring}`;

export default async function Footer() {
  const settings = await getPublicSettings();
  const phoneHref = settings.contactPhone?.replace(/[^\d+]/g, "");

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-muted)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Bandeau d’appel */}
        <div className="flex flex-col gap-6 border-b border-[var(--border)] py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--heading)] sm:text-3xl">
              Ton prochain événement commence ici.
            </h2>
            <p className="mt-2">Cinq minutes pour le créer. Aucune carte bancaire pour essayer.</p>
          </div>
          <Link
            href="/auth/register"
            className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[var(--accent)] px-6 font-semibold text-[var(--on-accent)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--accent)]/40"
          >
            Créer mon événement
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Liens */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Link
              href="/"
              aria-label="Evenn, accueil"
              className={`inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-[var(--heading)] ${ring}`}
            >
              <span className="flex size-8 items-center justify-center rounded-[9px] bg-[var(--accent)] text-lg text-[var(--on-accent)]">
                E
              </span>
              Evenn
            </Link>
            <p className="mt-4 leading-6">
              Découvre, crée et partage des expériences qui rassemblent.
            </p>
            {(settings.contactEmail || phoneHref) && (
              <div className="mt-5 flex gap-2">
                {settings.contactEmail && (
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    aria-label="Nous écrire par email"
                    className={`flex size-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] ${ring}`}
                  >
                    <Mail aria-hidden className="size-[18px]" strokeWidth={1.75} />
                  </a>
                )}
                {phoneHref && (
                  <a
                    href={`tel:${phoneHref}`}
                    aria-label="Nous appeler"
                    className={`flex size-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] ${ring}`}
                  >
                    <Phone aria-hidden className="size-[18px]" strokeWidth={1.75} />
                  </a>
                )}
              </div>
            )}
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-semibold text-[var(--heading)]">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bas de page */}
        <div className="flex flex-col gap-2 border-t border-[var(--border)] py-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Evenn. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}