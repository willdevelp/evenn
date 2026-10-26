// components/Footer.tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-4 pb-6 pt-12 text-slate-300 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-sm">E</span>
            Evenn
          </Link>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Découvrez, créez et partagez des expériences qui rassemblent.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Explorer</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/events" className="transition hover:text-white">Événements</Link></li>
            <li><Link href="/pricing" className="transition hover:text-white">Tarifs</Link></li>
            <li><Link href="/about" className="transition hover:text-white">À propos</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Besoin d’aide ?</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/contact" className="transition hover:text-white">Contactez-nous</Link></li>
            <li>
              <Link href="/auth/register" className="inline-flex items-center gap-1 transition hover:text-white">
                Créer un compte <ArrowUpRight size={14} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Evenn. Tous droits réservés.</p>
        <div className="flex gap-4">
          <Link href="/legal" className="transition hover:text-slate-300">Mentions légales</Link>
          <Link href="/contact" className="transition hover:text-slate-300">Confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}