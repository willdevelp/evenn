"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/src/components/dashboard/Sidebar";

type DashboardShellProps = {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
};

export default function DashboardShell({
  title,
  description,
  action,
  children,
}: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="hidden md:block"><Sidebar /></div>
      {mobileNavOpen && (
        <>
          <button
            type="button"
            aria-label="Fermer la navigation"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          />
          <div className="md:hidden">
            <Sidebar onClose={() => setMobileNavOpen(false)} />
          </div>
        </>
      )}

      <div className="min-w-0 md:ml-64">
        <header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 md:hidden"
              aria-label="Ouvrir la navigation"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Espace organisateur</p>
              <h1 className="mt-0.5 text-xl font-bold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
          </div>
          {action}
        </header>

        <div className="mx-auto w-full max-w-[1440px] space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>

        <footer className="border-t border-slate-200 px-6 py-5 text-center text-xs text-slate-400">
          © 2026 Evenn. Tous droits réservés.
        </footer>
      </div>
    </main>
  );
}
