"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaUsers,
  FaRocket,
  FaHeart,
  FaSearch,
  FaTicketAlt,
  FaCheckCircle,
  FaQuoteLeft,
  FaChevronDown,
} from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="overflow-hidden bg-white text-slate-900">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-slate-950 px-6 py-20 text-center text-white sm:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.42),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(14,165,233,0.18),_transparent_45%)]" />
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Notre mission</span>
          <h1 className="mb-4 mt-5 text-4xl font-black tracking-tight md:text-6xl">À propos d’Evenn</h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            La plateforme qui réunit les organisateurs et les participants autour d’expériences inoubliables.
          </p>
        </div>
      </section>

      {/* DESCRIPTION PRINCIPALE */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 text-base leading-8 text-slate-600 shadow-sm sm:p-10 sm:text-lg">
          <p>
            <strong>Evenn</strong> est une plateforme dédiée à la découverte, la gestion et la réservation d’événements uniques.
          </p>
          <p>
            Que vous soyez amateur de musique, passionné de culture ou professionnel à la recherche d’un salon ou d’une conférence,
            Evenn vous permet de trouver des événements adaptés à vos envies, partout en France.
          </p>
          <p>
            Notre mission est de connecter les organisateurs d’événements à leur public à travers une expérience fluide,
            moderne et immersive. Grâce à une interface intuitive, la réservation n’a jamais été aussi simple.
          </p>
          <p>
            Merci de faire partie de l’aventure Evenn. Ensemble, rendons chaque moment inoubliable.
          </p>
        </div>
      </section>

      {/* CHIFFRES CLÉS */}
      <section className="border-y border-slate-200 bg-slate-50 px-6 py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 text-center md:grid-cols-4 md:gap-8">
          <div>
            <div className="text-3xl font-black tracking-tight text-blue-700 sm:text-4xl">150+</div>
            <div className="mt-1 text-sm text-slate-500">Événements organisés</div>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight text-blue-700 sm:text-4xl">2 500</div>
            <div className="mt-1 text-sm text-slate-500">Participants</div>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight text-blue-700 sm:text-4xl">98%</div>
            <div className="mt-1 text-sm text-slate-500">Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-black tracking-tight text-blue-700 sm:text-4xl">50+</div>
            <div className="mt-1 text-sm text-slate-500">Organisateurs actifs</div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Comment ça marche</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Trois étapes suffisent pour trouver votre prochain événement ou vendre vos premiers billets.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch />
            </div>
            <h3 className="text-xl font-semibold mb-2">Découvrez</h3>
            <p className="text-gray-600">
              Parcourez les événements près de chez vous : concerts, conférences, soirées, ateliers et bien plus.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTicketAlt />
            </div>
            <h3 className="text-xl font-semibold mb-2">Réservez</h3>
            <p className="text-gray-600">
              Achetez votre billet en quelques clics, recevez-le directement sur votre téléphone avec son QR code.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle />
            </div>
            <h3 className="text-xl font-semibold mb-2">Profitez</h3>
            <p className="text-gray-600">
              Présentez votre billet à l’entrée et vivez l’événement l’esprit tranquille, sans papier ni file d’attente.
            </p>
          </div>
        </div>
      </section>

      {/* NOS VALEURS */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-[#0EA5E9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeart className="text-[#0EA5E9] text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Passion</h3>
            <p className="text-gray-600">Nous mettons notre énergie à créer des expériences uniques pour chaque événement.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-[#0EA5E9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRocket className="text-[#0EA5E9] text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-gray-600">Nous repoussons les limites avec une technologie de pointe pour faciliter la gestion.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-[#0EA5E9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-[#0EA5E9] text-xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Communauté</h3>
            <p className="text-gray-600">Nous créons des liens forts entre organisateurs et participants pour des moments partagés.</p>
          </div>
        </div>
      </section>

      {/* NOTRE HISTOIRE */}
      <section className="bg-slate-50 px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Notre histoire</h2>
          <div className="space-y-8">
            <TimelineItem
              year="2024"
              title="L’idée"
              text="Evenn est né d’un constat simple : organiser un événement et vendre des billets restait compliqué pour la plupart des organisateurs indépendants."
            />
            <TimelineItem
              year="2025"
              title="Le lancement"
              text="La plateforme ouvre ses portes aux premiers organisateurs pilotes, avec une billetterie en ligne simple et un tableau de bord clair."
            />
            <TimelineItem
              year="Aujourd’hui"
              title="La croissance"
              text="Evenn accompagne des dizaines d’organisateurs et des milliers de participants, et continue de s’enrichir avec de nouvelles fonctionnalités chaque mois."
            />
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">L’équipe derrière Evenn</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Julien Martin", role: "CEO & Co-fondateur" },
              { name: "Sophie Lefèvre", role: "CTO & Co-fondatrice" },
              { name: "Alexandre Dupont", role: "Responsable Produit" },
              { name: "Élise Bernard", role: "Lead Design" },
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
                  <Image
                    src="/vercel.svg" // Placeholder (remplacez par vraies photos)
                    alt={member.name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Ce qu’ils en disent</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial
              quote="J’ai mis en ligne mon premier événement en dix minutes et vendu mes billets dès le lendemain."
              name="Camille R."
              role="Organisatrice, soirées culturelles"
            />
            <Testimonial
              quote="Le tableau de bord me permet de suivre mes ventes en temps réel, c’est un vrai gain de temps."
              name="Thomas B."
              role="Organisateur, conférences pro"
            />
            <Testimonial
              quote="Trouver des événements près de chez moi n’a jamais été aussi simple. J’utilise Evenn chaque semaine."
              name="Nina F."
              role="Participante"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
        <div className="space-y-3">
          <FaqItem
            question="Evenn est-il gratuit pour les organisateurs ?"
            answer="La création d’un compte et la mise en ligne d’un événement sont gratuites. Une commission n’est prélevée que sur les billets effectivement vendus."
          />
          <FaqItem
            question="Comment reçoit-on son billet après l’achat ?"
            answer="Votre billet est envoyé immédiatement par email et reste accessible dans votre espace personnel, avec un QR code à présenter à l’entrée."
          />
          <FaqItem
            question="Puis-je me faire rembourser un billet ?"
            answer="Les conditions de remboursement dépendent de chaque organisateur. Elles sont indiquées sur la page de l’événement avant l’achat."
          />
          <FaqItem
            question="Comment un organisateur reçoit-il ses revenus ?"
            answer="Les revenus des ventes sont reversés directement sur le compte de l’organisateur selon la fréquence choisie lors de la création de l’événement."
          />
        </div>
      </section>

      {/* APPEL À L'ACTION */}
      <section className="bg-blue-50/70 px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Prêt à vivre des expériences uniques ?</h2>
          <p className="text-gray-700 text-lg mb-6">
            Rejoignez Evenn dès maintenant et découvrez des événements qui vous correspondent.
          </p>
          <Link
            href="/events"
            className="inline-block bg-[#2563EB] text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-[#2563EB]/25 hover:bg-[#1D4ED8] hover:shadow-[#2563EB]/40 transition-all"
          >
            Explorer les événements
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ---------- SOUS-COMPOSANTS ---------- */

function TimelineItem({ year, title, text }: { year: string; title: string; text: string }) {
  return (
    <div className="flex gap-6">
      <div className="w-20 shrink-0 text-right">
        <span className="text-[#2563EB] font-bold">{year}</span>
      </div>
      <div className="border-l-2 border-[#2563EB]/20 pl-6 pb-2">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}

function Testimonial({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <FaQuoteLeft className="text-[#0EA5E9] mb-4" />
      <p className="text-gray-700 mb-4">{quote}</p>
      <div className="text-sm">
        <span className="font-semibold">{name}</span>
        <span className="text-gray-500"> — {role}</span>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-medium"
      >
        {question}
        <FaChevronDown
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-5 pb-4 text-gray-600">{answer}</div>}
    </div>
  );
}



// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   FaUsers,
//   FaRocket,
//   FaHeart,
//   FaSearch,
//   FaTicketAlt,
//   FaCheckCircle,
//   FaQuoteLeft,
//   FaChevronDown,
//   FaMusic,
//   FaMicrophone,
//   FaDumbbell,
//   FaPalette,
//   FaGraduationCap,
//   FaGlassCheers,
//   FaBolt,
//   FaShieldAlt,
//   FaChartLine,
//   FaMobileAlt,
// } from "react-icons/fa";

// export default function AboutPage() {
//   return (
//     <div className="bg-white">
//       {/* HERO */}
//       <section className="bg-gradient-to-br from-[#0EA5E9] to-[#2563EB] text-white py-20 px-6 text-center">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-4xl md:text-5xl font-extrabold mb-4">À propos d’Evenn</h1>
//           <p className="text-lg md:text-xl text-white/80">
//             La plateforme qui réunit les organisateurs et les participants autour d’expériences inoubliables.
//           </p>
//         </div>
//       </section>

//       {/* DESCRIPTION PRINCIPALE */}
//       <section className="py-16 px-6 max-w-4xl mx-auto">
//         <div className="prose prose-lg text-gray-700">
//           <p>
//             <strong>Evenn</strong> est une plateforme dédiée à la découverte, la gestion et la réservation d’événements uniques.
//           </p>
//           <p>
//             Que vous soyez amateur de musique, passionné de culture ou professionnel à la recherche d’un salon ou d’une conférence,
//             Evenn vous permet de trouver des événements adaptés à vos envies, partout en France.
//           </p>
//           <p>
//             Notre mission est de connecter les organisateurs d’événements à leur public à travers une expérience fluide,
//             moderne et immersive. Grâce à une interface intuitive, la réservation n’a jamais été aussi simple.
//           </p>
//           <p>
//             Merci de faire partie de l’aventure Evenn. Ensemble, rendons chaque moment inoubliable.
//           </p>
//         </div>
//       </section>

//       {/* CHIFFRES CLÉS */}
//       <section className="bg-gray-50 py-16 px-6">
//         <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//           <div>
//             <div className="text-4xl font-bold text-[#2563EB]">150+</div>
//             <div className="text-gray-500 text-sm">Événements organisés</div>
//           </div>
//           <div>
//             <div className="text-4xl font-bold text-[#2563EB]">2 500</div>
//             <div className="text-gray-500 text-sm">Participants</div>
//           </div>
//           <div>
//             <div className="text-4xl font-bold text-[#2563EB]">98%</div>
//             <div className="text-gray-500 text-sm">Satisfaction</div>
//           </div>
//           <div>
//             <div className="text-4xl font-bold text-[#2563EB]">50+</div>
//             <div className="text-gray-500 text-sm">Organisateurs actifs</div>
//           </div>
//         </div>
//       </section>

//       {/* COMMENT ÇA MARCHE */}
//       <section className="py-16 px-6 max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-4">Comment ça marche</h2>
//         <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
//           Trois étapes suffisent pour trouver votre prochain événement ou vendre vos premiers billets.
//         </p>
//         <div className="grid md:grid-cols-3 gap-8">
//           <div className="text-center">
//             <div className="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaSearch />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Découvrez</h3>
//             <p className="text-gray-600">
//               Parcourez les événements près de chez vous : concerts, conférences, soirées, ateliers et bien plus.
//             </p>
//           </div>
//           <div className="text-center">
//             <div className="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaTicketAlt />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Réservez</h3>
//             <p className="text-gray-600">
//               Achetez votre billet en quelques clics, recevez-le directement sur votre téléphone avec son QR code.
//             </p>
//           </div>
//           <div className="text-center">
//             <div className="w-14 h-14 bg-[#2563EB] text-white rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaCheckCircle />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Profitez</h3>
//             <p className="text-gray-600">
//               Présentez votre billet à l’entrée et vivez l’événement l’esprit tranquille, sans papier ni file d’attente.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* CATÉGORIES D'ÉVÉNEMENTS */}
//       <section className="bg-gray-50 py-16 px-6">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-4">Un événement pour chaque envie</h2>
//           <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
//             Des concerts aux ateliers créatifs, explorez des expériences organisées par une communauté passionnée.
//           </p>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             <CategoryCard icon={<FaMusic />} label="Concerts" />
//             <CategoryCard icon={<FaMicrophone />} label="Conférences" />
//             <CategoryCard icon={<FaGlassCheers />} label="Soirées" />
//             <CategoryCard icon={<FaDumbbell />} label="Sport" />
//             <CategoryCard icon={<FaPalette />} label="Ateliers" />
//             <CategoryCard icon={<FaGraduationCap />} label="Formations" />
//           </div>
//         </div>
//       </section>

//       {/* NOS VALEURS */}
//       <section className="py-16 px-6 max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
//         <div className="grid md:grid-cols-3 gap-8">
//           <div className="bg-white p-6 rounded-xl shadow-md text-center">
//             <div className="w-12 h-12 bg-[#0EA5E9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaHeart className="text-[#0EA5E9] text-xl" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Passion</h3>
//             <p className="text-gray-600">Nous mettons notre énergie à créer des expériences uniques pour chaque événement.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-md text-center">
//             <div className="w-12 h-12 bg-[#0EA5E9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaRocket className="text-[#0EA5E9] text-xl" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Innovation</h3>
//             <p className="text-gray-600">Nous repoussons les limites avec une technologie de pointe pour faciliter la gestion.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-md text-center">
//             <div className="w-12 h-12 bg-[#0EA5E9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaUsers className="text-[#0EA5E9] text-xl" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Communauté</h3>
//             <p className="text-gray-600">Nous créons des liens forts entre organisateurs et participants pour des moments partagés.</p>
//           </div>
//         </div>
//       </section>

//       {/* POURQUOI CHOISIR EVENN */}
//       <section className="bg-gray-50 py-16 px-6">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Evenn</h2>
//           <div className="grid md:grid-cols-2 gap-12">
//             <div>
//               <h3 className="text-lg font-semibold text-[#2563EB] mb-6">Pour les organisateurs</h3>
//               <ul className="space-y-5">
//                 <BenefitItem
//                   icon={<FaBolt />}
//                   title="Mise en ligne en quelques minutes"
//                   text="Créez votre page événement et ouvrez la billetterie sans compétence technique."
//                 />
//                 <BenefitItem
//                   icon={<FaChartLine />}
//                   title="Suivi des ventes en temps réel"
//                   text="Un tableau de bord clair pour suivre les billets vendus et vos revenus à tout moment."
//                 />
//                 <BenefitItem
//                   icon={<FaShieldAlt />}
//                   title="Paiements sécurisés"
//                   text="Les fonds sont reversés directement sur votre compte, en toute confiance."
//                 />
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-[#2563EB] mb-6">Pour les participants</h3>
//               <ul className="space-y-5">
//                 <BenefitItem
//                   icon={<FaSearch />}
//                   title="Des événements qui vous ressemblent"
//                   text="Filtrez par ville, date ou catégorie pour trouver rapidement ce qui vous plaît."
//                 />
//                 <BenefitItem
//                   icon={<FaMobileAlt />}
//                   title="Billet toujours à portée de main"
//                   text="Votre billet et son QR code restent accessibles depuis votre espace personnel."
//                 />
//                 <BenefitItem
//                   icon={<FaCheckCircle />}
//                   title="Entrée simplifiée"
//                   text="Un scan à l’entrée suffit, sans impression ni justificatif papier."
//                 />
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* NOTRE HISTOIRE */}
//       <section className="py-16 px-6">
//         <div className="max-w-4xl mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-12">Notre histoire</h2>
//           <div className="space-y-8">
//             <TimelineItem
//               year="2024"
//               title="L’idée"
//               text="Evenn est né d’un constat simple : organiser un événement et vendre des billets restait compliqué pour la plupart des organisateurs indépendants."
//             />
//             <TimelineItem
//               year="2025"
//               title="Le lancement"
//               text="La plateforme ouvre ses portes aux premiers organisateurs pilotes, avec une billetterie en ligne simple et un tableau de bord clair."
//             />
//             <TimelineItem
//               year="Aujourd’hui"
//               title="La croissance"
//               text="Evenn accompagne des dizaines d’organisateurs et des milliers de participants, et continue de s’enrichir avec de nouvelles fonctionnalités chaque mois."
//             />
//           </div>
//         </div>
//       </section>

//       {/* ÉQUIPE */}
//       <section className="bg-gray-50 py-16 px-6">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-12">L’équipe derrière Evenn</h2>
//           <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
//             {[
//               { name: "Julien Martin", role: "CEO & Co-fondateur" },
//               { name: "Sophie Lefèvre", role: "CTO & Co-fondatrice" },
//               { name: "Alexandre Dupont", role: "Responsable Produit" },
//               { name: "Élise Bernard", role: "Lead Design" },
//             ].map((member) => (
//               <div key={member.name} className="text-center">
//                 <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
//                   <Image
//                     src="/vercel.svg" // Placeholder (remplacez par vraies photos)
//                     alt={member.name}
//                     width={128}
//                     height={128}
//                     className="object-cover"
//                   />
//                 </div>
//                 <h3 className="font-semibold text-lg">{member.name}</h3>
//                 <p className="text-gray-500 text-sm">{member.role}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* TÉMOIGNAGES */}
//       <section className="py-16 px-6">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-12">Ce qu’ils en disent</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <Testimonial
//               quote="J’ai mis en ligne mon premier événement en dix minutes et vendu mes billets dès le lendemain."
//               name="Camille R."
//               role="Organisatrice, soirées culturelles"
//             />
//             <Testimonial
//               quote="Le tableau de bord me permet de suivre mes ventes en temps réel, c’est un vrai gain de temps."
//               name="Thomas B."
//               role="Organisateur, conférences pro"
//             />
//             <Testimonial
//               quote="Trouver des événements près de chez moi n’a jamais été aussi simple. J’utilise Evenn chaque semaine."
//               name="Nina F."
//               role="Participante"
//             />
//           </div>
//         </div>
//       </section>

//       {/* PRESSE / ILS PARLENT DE NOUS */}
//       <section className="bg-gray-50 py-12 px-6">
//         <div className="max-w-5xl mx-auto text-center">
//           <p className="text-sm uppercase tracking-wide text-gray-400 mb-6">Ils parlent de nous</p>
//           <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
//             <span className="text-xl font-serif font-semibold text-gray-500">Le Monde Événementiel</span>
//             <span className="text-xl font-semibold text-gray-500">StartUp Mag</span>
//             <span className="text-xl font-semibold italic text-gray-500">La Tribune Culture</span>
//             <span className="text-xl font-semibold text-gray-500">Sortir.fr</span>
//           </div>
//         </div>
//       </section>

//       {/* FAQ */}
//       <section className="py-16 px-6 max-w-3xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
//         <div className="space-y-3">
//           <FaqItem
//             question="Evenn est-il gratuit pour les organisateurs ?"
//             answer="La création d’un compte et la mise en ligne d’un événement sont gratuites. Une commission n’est prélevée que sur les billets effectivement vendus."
//           />
//           <FaqItem
//             question="Comment reçoit-on son billet après l’achat ?"
//             answer="Votre billet est envoyé immédiatement par email et reste accessible dans votre espace personnel, avec un QR code à présenter à l’entrée."
//           />
//           <FaqItem
//             question="Puis-je me faire rembourser un billet ?"
//             answer="Les conditions de remboursement dépendent de chaque organisateur. Elles sont indiquées sur la page de l’événement avant l’achat."
//           />
//           <FaqItem
//             question="Comment un organisateur reçoit-il ses revenus ?"
//             answer="Les revenus des ventes sont reversés directement sur le compte de l’organisateur selon la fréquence choisie lors de la création de l’événement."
//           />
//           <FaqItem
//             question="Evenn propose-t-il une application mobile ?"
//             answer="Le site est entièrement utilisable depuis un mobile. Une application dédiée est en cours de développement."
//           />
//           <FaqItem
//             question="Puis-je organiser un événement gratuit ?"
//             answer="Oui, la billetterie gratuite est disponible sans aucune commission, pour encourager la découverte de nouveaux organisateurs."
//           />
//         </div>
//       </section>

//       {/* NEWSLETTER */}
//       <section className="py-16 px-6 bg-gray-50">
//         <div className="max-w-2xl mx-auto text-center">
//           <h2 className="text-2xl font-bold mb-3">Ne manquez aucun événement</h2>
//           <p className="text-gray-600 mb-6">
//             Recevez une sélection d’événements près de chez vous chaque semaine, directement par email.
//           </p>
//           <form
//             onSubmit={(e) => e.preventDefault()}
//             className="flex flex-col sm:flex-row gap-3 justify-center"
//           >
//             <input
//               type="email"
//               required
//               placeholder="Votre adresse email"
//               className="w-full sm:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
//             />
//             <button
//               type="submit"
//               className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1D4ED8] transition-all"
//             >
//               S’inscrire
//             </button>
//           </form>
//         </div>
//       </section>

//       {/* APPEL À L'ACTION */}
//       <section className="py-20 px-6 bg-[#0EA5E9]/5 text-center">
//         <div className="max-w-3xl mx-auto">
//           <h2 className="text-3xl font-bold mb-4">Prêt à vivre des expériences uniques ?</h2>
//           <p className="text-gray-700 text-lg mb-6">
//             Rejoignez Evenn dès maintenant et découvrez des événements qui vous correspondent.
//           </p>
//           <Link
//             href="/events"
//             className="inline-block bg-[#2563EB] text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-[#2563EB]/25 hover:bg-[#1D4ED8] hover:shadow-[#2563EB]/40 transition-all"
//           >
//             Explorer les événements
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }

// /* ---------- SOUS-COMPOSANTS ---------- */

// function CategoryCard({ icon, label }: { icon: React.ReactNode; label: string }) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col items-center gap-3 text-center">
//       <div className="w-10 h-10 text-[#2563EB] flex items-center justify-center text-xl">{icon}</div>
//       <span className="font-medium text-gray-700 text-sm">{label}</span>
//     </div>
//   );
// }

// function BenefitItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
//   return (
//     <li className="flex gap-4">
//       <div className="w-10 h-10 shrink-0 bg-[#2563EB]/10 text-[#2563EB] rounded-full flex items-center justify-center">
//         {icon}
//       </div>
//       <div>
//         <h4 className="font-semibold mb-1">{title}</h4>
//         <p className="text-gray-600 text-sm">{text}</p>
//       </div>
//     </li>
//   );
// }

// function TimelineItem({ year, title, text }: { year: string; title: string; text: string }) {
//   return (
//     <div className="flex gap-6">
//       <div className="w-20 shrink-0 text-right">
//         <span className="text-[#2563EB] font-bold">{year}</span>
//       </div>
//       <div className="border-l-2 border-[#2563EB]/20 pl-6 pb-2">
//         <h3 className="font-semibold text-lg mb-1">{title}</h3>
//         <p className="text-gray-600">{text}</p>
//       </div>
//     </div>
//   );
// }

// function Testimonial({ quote, name, role }: { quote: string; name: string; role: string }) {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md">
//       <FaQuoteLeft className="text-[#0EA5E9] mb-4" />
//       <p className="text-gray-700 mb-4">{quote}</p>
//       <div className="text-sm">
//         <span className="font-semibold">{name}</span>
//         <span className="text-gray-500"> — {role}</span>
//       </div>
//     </div>
//   );
// }

// function FaqItem({ question, answer }: { question: string; answer: string }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="border border-gray-200 rounded-xl overflow-hidden">
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full flex items-center justify-between px-5 py-4 text-left font-medium"
//       >
//         {question}
//         <FaChevronDown
//           className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
//         />
//       </button>
//       {open && <div className="px-5 pb-4 text-gray-600">{answer}</div>}
//     </div>
//   );
// }