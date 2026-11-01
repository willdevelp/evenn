'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { authClient, useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Container } from '@/src/components/ui/container';

const navItems = [
  { href: '/events', label: 'Événements' },
  { href: '/vote', label: 'Votes' },
  { href: '/pricing', label: 'Tarifs' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

const isActive = (href: string, pathname: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Vous êtes déconnecté.');
          router.push('/');
          router.refresh();
        },
      },
    });
  }

  const closeMenu = () => setMenuOpen(false);

  const linkClass = (href: string) =>
    cn(
      'text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20 rounded-lg',
      isActive(href, pathname)
        ? 'text-brand-600'
        : 'text-slate-600 hover:text-slate-950',
    );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20"
        >
          <span
            aria-hidden
            className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-sm"
          >
            E
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-950">Evenn</span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href, pathname) ? 'page' : undefined}
              className={cn(linkClass(item.href), 'px-3 py-2')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <span aria-hidden className="h-9 w-28 animate-pulse rounded-lg bg-slate-100" />
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20"
              >
                Mon espace
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Se déconnecter"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20"
            >
              Connexion
            </Link>
          )}

          <Link
            href={session ? '/dashboard/events/create' : '/auth/register'}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30"
          >
            {session ? 'Créer un événement' : 'Créer mon événement'}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Menu mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20 md:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Navigation mobile"
          className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 md:hidden motion-safe:animate-fade-in"
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={isActive(item.href, pathname) ? 'page' : undefined}
                  className={cn(
                    'block rounded-lg px-3 py-2.5 text-sm font-medium transition',
                    isActive(item.href, pathname)
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
            {isPending ? null : session ? (
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="block rounded-lg bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Mon espace
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={closeMenu}
                className="block rounded-lg bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Connexion
              </Link>
            )}
            <Link
              href={session ? '/dashboard/events/create' : '/auth/register'}
              onClick={closeMenu}
              className="block rounded-xl bg-brand-600 px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {session ? 'Créer un événement' : 'Créer mon événement'}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
