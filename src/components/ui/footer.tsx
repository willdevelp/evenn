// components/Footer.tsx
import Link from "next/link";
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-700 pb-10">
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Evenn</h2>
          <p className="text-sm">
            Plateforme dédiée aux événements uniques, professionnels ou festifs.
            Explorez, réservez et vivez des expériences inoubliables.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:underline">Accueil</Link></li>
            <li><Link href="/events" className="hover:underline">Événements</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/about" className="hover:underline">À propos</Link></li>
            <li><Link href="/legal" className="hover:underline">Mentions légales</Link></li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Suivez-nous</h3>
          <div className="flex space-x-5 text-xl">
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook" className="hover:text-white">
              <FaFacebook />
            </Link>
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram" className="hover:text-white">
              <FaInstagram />
            </Link>
            <Link href="https://twitter.com" target="_blank" aria-label="Twitter / X" className="hover:text-white">
              <FaXTwitter />
            </Link>
            <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn" className="hover:text-white">
              <FaLinkedin />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-sm text-gray-500 pt-6">
        © {new Date().getFullYear()} Evenn. Tous droits réservés.
      </div>
    </footer>
  );
}