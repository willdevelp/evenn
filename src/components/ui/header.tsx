'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { authClient, useSession } from '@/lib/auth-client';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: '/events', label: 'Événements' },
    { href: '/pricing', label: 'Tarifs' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

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

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-[#2563EB]">Evenza</span>
            <span className="text-xs font-medium bg-[#0EA5E9]/10 text-[#0EA5E9] px-2 py-0.5 rounded-full">
              SaaS
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/events" className="hover:text-[#2563EB] transition">
              Événements
            </Link>
            <Link href="/pricing" className="hover:text-[#2563EB] transition">
              Tarifs
            </Link>
            <Link href="/about" className="hover:text-[#2563EB] transition">
              À propos
            </Link>
            <Link href="/contact" className="hover:text-[#2563EB] transition">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden sm:inline-block text-sm font-medium text-[#2563EB] hover:underline"
            >
              Connexion
            </Link>

            <Link
              href="/auth/register"
              className="bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/40 hover:bg-[#1d4ed8] transition-all flex items-center gap-1"
            >
              Créer mon événement
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>
  );
}
