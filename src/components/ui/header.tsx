'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 py-4 lg:px-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Evenn
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-indigo-600 transition">Accueil</Link>
          <Link href="/events" className="hover:text-indigo-600 transition">Événements</Link>
          <Link href="/pricing" className="hover:text-indigo-600 transition">Pricing</Link>
          <Link href="/about" className="hover:text-indigo-600 transition">À propos</Link>
          <Link href="/contact" className="hover:text-indigo-600 transition">Contact</Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu mobile"
            className="text-2xl text-gray-700 focus:outline-none"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-3 text-sm font-medium text-gray-700">
          <Link href="/" className="block hover:text-indigo-600 transition">Accueil</Link>
          <Link href="/events" className="block hover:text-indigo-600 transition">Événements</Link>
          <Link href="/pricing" className="hover:text-indigo-600 transition">Pricing</Link>
          <Link href="/about" className="block hover:text-indigo-600 transition">À propos</Link>
          <Link href="/contact" className="block hover:text-indigo-600 transition">Contact</Link>
        </div>
      )}
    </header>
  );
}