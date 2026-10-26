// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Event } from "@/lib/definition";
// import { 
//   FaCalendarAlt, 
//   FaMapMarkerAlt, 
//   FaTicketAlt, 
//   FaStar,
//   FaUserPlus,
//   FaCheckCircle
// } from "react-icons/fa";
// import Header from "@/src/components/ui/header";
// import Footer from "@/src/components/ui/footer";

// export default function HomePage() {
//   const [events, setEvents] = useState<Event[]>([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const res = await fetch("/api/events");
//       const data = await res.json();
//       setEvents(data);
//     };
//     fetchEvents();
//   }, []);

//   return (
//     <>
//       <Header />
//       <main className="bg-white text-gray-800">
//         {/* ========== HERO ========== */}
//         <section className="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-24 px-6 text-center">
//           <div className="max-w-4xl mx-auto">
//             <h1 className="text-5xl font-extrabold mb-6 leading-tight">
//               Vivez des expériences inoubliables avec <span className="text-yellow-300">Evenn</span>
//             </h1>
//             <p className="text-lg mb-8">
//               Découvrez, réservez ou organisez des événements exceptionnels en quelques clics.
//             </p>
//             <div className="flex justify-center gap-4 flex-wrap">
//               <Link
//                 href="/events"
//                 className="bg-white text-indigo-700 px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 transition"
//               >
//                 Explorer les événements
//               </Link>
//               <Link
//                 href="/pricing"
//                 className="border border-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-indigo-700 transition"
//               >
//                 Organiser un événement
//               </Link>
//             </div>
//           </div>
//         </section>

//         {/* ========== NOUVEAU : CHIFFRES CLÉS ========== */}
//         <section className="py-16 px-6 bg-white border-b border-gray-100">
//           <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             <div>
//               <div className="text-4xl font-bold text-indigo-600">150+</div>
//               <div className="text-gray-500 text-sm mt-1">Événements organisés</div>
//             </div>
//             <div>
//               <div className="text-4xl font-bold text-indigo-600">2 500</div>
//               <div className="text-gray-500 text-sm mt-1">Participants</div>
//             </div>
//             <div>
//               <div className="text-4xl font-bold text-indigo-600">98%</div>
//               <div className="text-gray-500 text-sm mt-1">Satisfaction</div>
//             </div>
//             <div>
//               <div className="text-4xl font-bold text-indigo-600">50+</div>
//               <div className="text-gray-500 text-sm mt-1">Organisateurs actifs</div>
//             </div>
//           </div>
//         </section>

//         {/* ========== QUI SOMMES-NOUS ? ========== */}
//         <section className="py-20 px-6">
//           <div className="max-w-5xl mx-auto text-center">
//             <h2 className="text-3xl font-bold mb-4">Qui sommes-nous ?</h2>
//             <p className="text-gray-600 text-lg">
//               Evenn est une plateforme innovante conçue pour connecter les amoureux de la culture, de la musique, des affaires
//               ou des loisirs à des événements qui leur ressemblent. Réservez facilement, vivez pleinement.
//             </p>
//           </div>
//         </section>

//         {/* ========== FEATURES (Pourquoi Evenn ?) ========== */}
//         <div className="bg-gray-50">
//           <section className="py-20 max-w-6xl mx-auto px-6">
//             <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Evenn ?</h2>
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[
//                 { title: "Téléchargement unique", desc: "Vos participants téléchargent leurs billets QR immédiatement après la réservation." },
//                 { title: "Pas de compte requis", desc: "Les participants réservent et obtiennent leurs billets sans créer de compte." },
//                 { title: "QR Code sécurisé", desc: "Chaque billet est unique et vérifié à l’entrée." },
//                 { title: "Intégration simple", desc: "Export PDF ou accès API pour automatiser vos événements." },
//                 { title: "Support rapide", desc: "Nous sommes disponibles pour aider vos organisateurs rapidement." },
//                 { title: "Tarifs clairs", desc: "Free / Pro / Entreprise, choisissez ce qui vous convient." },
//               ].map((feature, idx) => (
//                 <div key={idx} className="bg-white p-6 rounded-2xl shadow text-center">
//                   <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
//                   <p className="text-gray-600">{feature.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* ========== NOUVEAU : COMMENT ÇA MARCHE ========== */}
//         <section className="py-20 px-6">
//           <div className="max-w-6xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
//             <div className="grid md:grid-cols-3 gap-8">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <FaUserPlus className="text-indigo-600 text-2xl" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">1. Créez votre événement</h3>
//                 <p className="text-gray-500">Remplissez les infos, ajoutez une description et fixez le prix.</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <FaTicketAlt className="text-indigo-600 text-2xl" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">2. Partagez la billetterie</h3>
//                 <p className="text-gray-500">Diffusez votre lien unique et recevez les réservations en direct.</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <FaCheckCircle className="text-indigo-600 text-2xl" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">3. Gérez l’événement</h3>
//                 <p className="text-gray-500">Suivez les inscriptions, scannez les QR codes et profitez de l’événement.</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ========== ÉVÉNEMENTS À VENIR ========== */}
//         <section className="py-20 px-6 bg-gray-50">
//           <div className="max-w-6xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-12">Événements à venir</h2>

//             {events.length === 0 ? (
//               <p className="text-center text-gray-500">Aucun événement à venir pour le moment.</p>
//             ) : (
//               <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//                 {events.slice(0, 6).map((event) => (
//                   <Link key={event.id} href={`/events/${event.title}`} className="group">
//                     <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
//                       <img
//                         src={event.image || "/vercel.svg"} // utilisez l'image de l'événement si disponible
//                         alt={event.title}
//                         width={500}
//                         height={300}
//                         className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
//                       />
//                       <div className="p-4">
//                         <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
//                         <div className="flex items-center text-sm text-gray-500 gap-2 mb-1">
//                           <FaCalendarAlt /> <span>{new Date(event.date).toLocaleDateString()}</span>
//                         </div>
//                         <div className="flex items-center text-sm text-gray-500 gap-2">
//                           <FaMapMarkerAlt /> <span>{event.location}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>

//         {/* ========== NOUVEAU : TÉMOIGNAGES ========== */}
//         <section className="py-20 px-6 bg-white">
//           <div className="max-w-6xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-12">Ils nous font confiance</h2>
//             <div className="grid md:grid-cols-3 gap-8">
//               {[
//                 {
//                   name: "Sophie M.",
//                   role: "Organisatrice de concerts",
//                   text: "Evenn a révolutionné la gestion de mes concerts. Les billets QR et la simplicité d'utilisation m'ont fait gagner un temps précieux.",
//                   rating: 5,
//                 },
//                 {
//                   name: "Thomas L.",
//                   role: "Festivalier",
//                   text: "J'ai réservé plusieurs événements sur Evenn et l'expérience est toujours fluide. Les notifications et rappels sont très utiles.",
//                   rating: 5,
//                 },
//                 {
//                   name: "Amélie D.",
//                   role: "Responsable d'association",
//                   text: "Nous utilisons Evenn pour nos soirées caritatives. La plateforme est intuitive et le support est réactif.",
//                   rating: 4.5,
//                 },
//               ].map((testimonial, idx) => (
//                 <div key={idx} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
//                   <div className="flex items-center gap-1 text-yellow-400 mb-3">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar key={i} className={i < Math.floor(testimonial.rating) ? "text-yellow-400" : "text-gray-300"} />
//                     ))}
//                     {testimonial.rating % 1 !== 0 && <span className="text-yellow-400">½</span>}
//                   </div>
//                   <p className="text-gray-600 text-sm italic">&quot;{testimonial.text}&quot;</p>
//                   <div className="mt-4">
//                     <p className="font-semibold">{testimonial.name}</p>
//                     <p className="text-xs text-gray-400">{testimonial.role}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ========== CTA FINAL (existante) ========== */}
//         <section className="py-20 px-6 bg-indigo-50 text-center">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-3xl font-bold mb-4">Vous êtes organisateur ?</h2>
//             <p className="text-gray-700 text-lg mb-6">
//               Publiez vos événements sur Evenn, touchez un large public et gérez vos réservations en toute simplicité.
//             </p>
//             <Link
//               href="/pricing"
//               className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
//             >
//               Créer un événement
//             </Link>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </>
//   );
// }






// app/page.js
import Link from 'next/link';
import {
  CalendarDays,
  Users,
  Ticket,
  BarChart3,
  Shield,
  CalendarPlus,
  CreditCard,
  QrCode,
  Scan,
  TrendingUp,
  Smartphone,
  PenTool,
  Share2,
  Phone,
  LayoutDashboard,
  PieChart,
  User,
  ThumbsUp,
  Star,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Award,
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="font-sans antialiased bg-white text-gray-900">

      {/* ===== HEADER ===== */}
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

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#0EA5E9]/5 via-[#2563EB]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="flex bg-[#0EA5E9]/10 text-[#0EA5E9] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide flex items-center gap-2 w-fit">
                <Award size={14} /> Plateforme tout-en-un
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
                Créez, gérez et remplissez vos événements en quelques clics.
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg leading-relaxed">
                Evenza vous libère de la gestion manuelle. Billets digitaux, QR Code, statistiques en temps réel et contrôle d’accès simplifié. Tout est pensé pour les organisateurs.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="#" className="bg-[#2563EB] text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-xl shadow-[#2563EB]/30 hover:shadow-[#2563EB]/50 hover:bg-[#1d4ed8] transition-all flex items-center gap-2">
                  Créer mon événement
                  <ArrowRight size={20} />
                </Link>
                <Link href="#fonctionnement" className="text-[#2563EB] font-medium px-5 py-4 rounded-xl hover:bg-[#2563EB]/5 transition flex items-center gap-1">
                  Découvrir la plateforme
                  <span className="text-sm">↓</span>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1"><CheckCircle size={16} className="text-[#2563EB]" /> Sans engagement</span>
                <span className="flex items-center gap-1"><CheckCircle size={16} className="text-[#2563EB]" /> Paiement sécurisé</span>
                <span className="flex items-center gap-1"><CheckCircle size={16} className="text-[#2563EB]" /> 100% mobile</span>
              </div>
            </div>

            {/* Visuel : Dashboard / Billet QR / Stats */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl shadow-[#2563EB]/10 border border-gray-100 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 bg-gradient-to-br from-[#0EA5E9]/10 to-[#2563EB]/10 rounded-2xl p-4 border border-[#2563EB]/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2563EB] flex items-center gap-1"><LayoutDashboard size={14} /> TABLEAU DE BORD</span>
                      <span className="text-xs bg-white px-2 py-0.5 rounded-full shadow-sm">+23%</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <div className="w-1/3 h-2 bg-[#2563EB]/20 rounded-full"><div className="w-3/4 h-full bg-[#2563EB] rounded-full" /></div>
                      <div className="w-1/3 h-2 bg-[#2563EB]/20 rounded-full"><div className="w-1/2 h-full bg-[#0EA5E9] rounded-full" /></div>
                      <div className="w-1/3 h-2 bg-[#2563EB]/20 rounded-full"><div className="w-1/4 h-full bg-gray-300 rounded-full" /></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                      <span>Ventes: 1 284</span>
                      <span>Entrées: 987</span>
                    </div>
                  </div>
                  {/* Billet QR */}
                  <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Ticket size={12} /> Billet</span>
                    <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center mt-1">
                      <QrCode size={28} className="text-[#2563EB]" />
                    </div>
                    <div className="w-full h-1 bg-gray-200 my-1" />
                    <span className="text-[8px] font-mono text-gray-500">#EV-2026-08</span>
                    <span className="text-[9px] font-bold text-[#2563EB] flex items-center gap-0.5"><CheckCircle size={10} /> QR Code</span>
                  </div>
                  {/* Stats */}
                  <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><PieChart size={12} /> Statistiques</span>
                    <div className="mt-1 text-lg font-extrabold text-[#2563EB]">89%</div>
                    <span className="text-[9px] text-gray-500">de remplissage</span>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1"><div className="w-[89%] h-full bg-[#0EA5E9] rounded-full" /></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-2 flex items-center gap-3">
                <Ticket size={24} className="text-[#2563EB]" />
                <div>
                  <p className="text-xs font-bold">Billets vendus</p>
                  <p className="text-sm font-extrabold text-[#2563EB]">+1 284</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION PROBLÈME ===== */}
      <section id="probleme" className="py-20 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#0EA5E9] font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2">📌 Le constat</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-900">Organiser un événement ne devrait pas être compliqué</h2>
            <p className="mt-4 text-gray-500 text-lg">Pourtant, la plupart des organisateurs perdent un temps précieux à cause d’outils obsolètes et de process manuels.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Gestion manuelle des participants', desc: 'Fichiers Excel, mails à la chaîne, double saisie… Une perte de temps et de fiabilité.' },
              { icon: Ticket, title: 'Billets papier', desc: 'Impression, distribution, risque de perte. Un cauchemar logistique et écologique.' },
              { icon: BarChart3, title: 'Difficulté à suivre les ventes', desc: 'Aucune vision en temps réel. Vous pilotez à l’aveugle jusqu’au jour J.' },
              { icon: Shield, title: 'Contrôle d’accès compliqué', desc: 'Scanners obsolètes, listes interminables, files d’attente frustrantes.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition hover:border-[#0EA5E9]/20 group">
                <item.icon size={36} className="text-[#2563EB] mb-3" strokeWidth={1.5} />
                <h3 className="font-bold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION SOLUTION ===== */}
      <section id="solution" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#2563EB] font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2">✅ La réponse</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-900">Evenza transforme votre organisation</h2>
            <p className="mt-4 text-gray-500 text-lg">Une plateforme complète, intuitive et sécurisée pour vous faire gagner du temps et augmenter vos ventes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: CalendarPlus, title: "Création d'événement", desc: 'En 5 min, créez votre page personnalisée avec toutes les informations (date, lieu, prix, visuel).' },
              { icon: CreditCard, title: 'Vente de billets', desc: 'Intégrez un système de paiement sécurisé. Vos participants achètent en ligne instantanément.' },
              { icon: QrCode, title: 'QR Code sécurisé', desc: "Chaque billet génère un QR Code unique, infalsifiable et scannable depuis n'importe quel smartphone." },
              { icon: Scan, title: 'Contrôle entrée', desc: "Application de scan ultra-rapide. Validez les entrées en 1 seconde, même hors connexion." },
              { icon: TrendingUp, title: 'Statistiques en direct', desc: "Suivez les ventes, le taux de remplissage, les heures d'affluence, et bien plus." },
              { icon: Smartphone, title: '100% mobile', desc: 'Organisez et contrôlez tout depuis votre téléphone. Vos participants aussi.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50/80 p-7 rounded-2xl border border-gray-100 hover:border-[#2563EB]/20 hover:shadow-lg transition group">
                <item.icon size={34} className="text-[#0EA5E9] mb-3" strokeWidth={1.5} />
                <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 bg-gradient-to-r from-[#0EA5E9]/10 to-[#2563EB]/10 rounded-3xl p-8 text-center border border-[#2563EB]/10">
            <p className="text-lg font-medium text-gray-700 flex items-center justify-center gap-2 flex-wrap">
              <Award size={24} className="text-[#2563EB]" />
              <span><span className="text-[#2563EB] font-bold">+ 2 500</span> organisateurs nous font déjà confiance pour plus de <span className="text-[#2563EB] font-bold">12 000</span> événements.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ===== SECTION FONCTIONNEMENT (3 étapes) ===== */}
      <section id="fonctionnement" className="py-20 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#0EA5E9] font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2">⚡ En 3 étapes</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-900">Comme un jeu d’enfant</h2>
            <p className="mt-4 text-gray-500 text-lg">De la création à la réalisation, Evenza vous accompagne à chaque phase.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0EA5E9] via-[#2563EB] to-[#0EA5E9] opacity-30" />
            {[
              { step: '1', icon: PenTool, title: 'Créer son événement', desc: "Remplissez le formulaire : nom, date, lieu, capacité, prix. Ajoutez une image et une description. C'est prêt en 5 minutes." },
              { step: '2', icon: Share2, title: 'Partager le lien', desc: "Recevez une page événement unique. Partagez-la par email, réseaux sociaux, ou intégrez-la sur votre site. Les inscriptions affluent." },
              { step: '3', icon: Phone, title: 'Scanner les billets', desc: "Le jour J, ouvrez l'app Evenza, scannez les QR Codes des participants. Entrée validée en un clin d'œil. Fini les listes papier." },
            ].map((item, i) => (
              <div key={i} className="relative bg-white p-8 rounded-3xl shadow-xl shadow-[#2563EB]/5 border border-gray-100 text-center group hover:shadow-2xl transition z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-black shadow-lg shadow-[#2563EB]/30">
                  {item.step}
                </div>
                <div className="mt-4 flex justify-center">
                  <item.icon size={48} className="text-[#0EA5E9]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mt-4 text-gray-800">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="#" className="flex bg-[#2563EB] text-white px-10 py-4 rounded-2xl text-base font-semibold shadow-xl shadow-[#2563EB]/25 hover:shadow-[#2563EB]/50 hover:bg-[#1d4ed8] transition flex items-center gap-2 w-fit mx-auto">
              Commencer maintenant
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION STATS ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '12 000+', label: 'Événements créés', icon: CalendarDays },
              { value: '250 000+', label: 'Billets vendus', icon: Ticket },
              { value: '98%', label: 'Taux de satisfaction', icon: ThumbsUp },
              { value: '4.9 ★', label: 'Note moyenne', icon: Star },
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <stat.icon size={28} className="text-[#0EA5E9] mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-3xl font-extrabold text-[#2563EB]">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION TÉMOIGNAGES ===== */}
      <section className="py-20 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[#0EA5E9] font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2">💬 Ils parlent d’Evenza</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-900">Des organisateurs conquis</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sophie M.', role: 'Festival “Les Éclats”', quote: 'Grâce à Evenza, nous avons vendu 1 500 billets en 3 jours. Le scan des QR Codes à l’entrée nous a fait gagner un temps fou !' },
              { name: 'Thomas R.', role: 'Conférence Tech+', quote: 'La simplicité de création et les statistiques en direct m’ont permis d’ajuster ma communication en temps réel. Un outil indispensable.' },
              { name: 'Claire D.', role: 'Ateliers Bien-être', quote: 'Mes participants adorent recevoir leur billet par mail avec le QR Code. Plus de perte, plus de stress. Evenza a changé ma vie d’organisatrice.' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                    <User size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{t.name}</p>
                    <p className="text-xs text-[#0EA5E9] font-medium">{t.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 text-sm italic leading-relaxed">“{t.quote}”</p>
                <div className="mt-3 text-[#2563EB] text-xs flex items-center gap-1">★★★★★ 5.0</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION FAQ ===== */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#0EA5E9] font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2"><HelpCircle size={16} /> FAQ</span>
            <h2 className="text-3xl font-bold mt-3 text-gray-900">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Est-ce que je peux vendre des billets payants ?', r: 'Oui, Evenza intègre un système de paiement sécurisé (Stripe). Vous pouvez fixer le prix de vos billets et encaisser directement.' },
              { q: 'Mes participants ont-ils besoin de l’app Evenza ?', r: 'Non, ils reçoivent leur billet par email avec un QR Code. Ils peuvent le présenter sur leur smartphone ou le imprimer.' },
              { q: 'Puis-je importer des participants existants ?', r: 'Absolument. Vous pouvez importer une liste CSV ou synchroniser vos contacts depuis Google/Outlook.' },
              { q: 'Que se passe-t-il en cas de problème technique le jour J ?', r: "Notre application de scan fonctionne hors connexion. Et notre support est disponible 7j/7 par chat et email." },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#2563EB]/20 transition">
                <h4 className="font-bold text-gray-800 text-lg flex items-start gap-3">
                  <HelpCircle size={20} className="text-[#2563EB] flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h4>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed pl-9">{faq.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-20 bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="flex bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 w-fit mx-auto">
            <Award size={16} /> Prêt à lancer votre événement ?
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-6">Rejoignez des milliers d’organisateurs</h2>
          <p className="text-lg text-white/80 mt-4 max-w-2xl mx-auto">Créez votre premier événement sur Evenza en 5 minutes. Aucune carte bancaire requise pour l’essai.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="#" className="bg-white text-[#2563EB] px-10 py-4 rounded-2xl text-base font-bold shadow-xl shadow-black/20 hover:shadow-black/30 hover:scale-105 transition flex items-center gap-2">
              Créer mon événement
              <ArrowRight size={20} />
            </Link>
            <Link href="#fonctionnement" className="bg-[#2563EB]/30 backdrop-blur-sm text-white border border-white/30 px-10 py-4 rounded-2xl text-base font-medium hover:bg-[#2563EB]/50 transition flex items-center gap-2">
              Découvrir la plateforme
              <span>↓</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-extrabold text-white flex items-center gap-2">
              <CalendarDays size={24} className="text-[#0EA5E9]" /> Evenza
            </span>
            <p className="text-sm text-gray-400 mt-2">La plateforme événementielle nouvelle génération.</p>
            <p className="text-xs text-gray-500 mt-4">© 2026 Evenza. Tous droits réservés.</p>
          </div>
          <div>
            <h5 className="font-semibold text-white">Produit</h5>
            <ul className="mt-2 space-y-1 text-sm">
              <li><a href="#" className="hover:text-white">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-white">Intégrations</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white">Ressources</h5>
            <ul className="mt-2 space-y-1 text-sm">
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Aide</a></li>
              <li><a href="#" className="hover:text-white">API</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white">Légal</h5>
            <ul className="mt-2 space-y-1 text-sm">
              <li><a href="#" className="hover:text-white">Confidentialité</a></li>
              <li><a href="#" className="hover:text-white">CGU</a></li>
              <li><a href="#" className="hover:text-white">Cookies</a></li>
            </ul>
          </div>
        </div>
      </footer>

    </main>
  );
}