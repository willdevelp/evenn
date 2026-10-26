// app/events/[slug]/not-found.js (ou app/not-found.js global)
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-slate-50 px-4 py-16">
      <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 sm:p-12">
        <span className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">Evenn · 404</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Événement introuvable</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">Cet événement n&apos;existe pas ou a été supprimé. Découvrez les autres expériences disponibles.</p>
        <Link href="/events" className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
          Voir tous les événements
        </Link>
      </div>
    </div>
  );
}