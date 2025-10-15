"use client";

import { Plan } from "@/lib/definition";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";

// const plans = [
//   {
//     name: "Free",
//     price: "0 FCFA",
//     description: "Idéal pour tester Evenn ou gérer un petit évènement.",
//     features: [
//       "1 évènement actif",
//       "Jusqu’à 50 billets",
//       "QR codes générés automatiquement",
//       "Page de téléchargement unique et sécurisée",
//       "Support par email (48h)"
//     ],
//     cta: "Commencer gratuitement",
//     highlighted: false,
//   },
//   {
//     name: "Pro",
//     price: "15 000 FCFA / mois",
//     description: "Pour les organisateurs réguliers qui veulent plus de flexibilité.",
//     features: [
//       "Évènements illimités",
//       "Jusqu’à 5 000 billets par mois",
//       "Export PDF des billets + envoi par email",
//       "Accès API pour automatiser vos évènements",
//       "Support prioritaire (24h)"
//     ],
//     cta: "Passer en Pro",
//     highlighted: true,
//   },
//   {
//     name: "Entreprise",
//     price: "Sur mesure",
//     description: "Pour les grandes organisations et festivals.",
//     features: [
//       "Évènements illimités",
//       "Billets illimités",
//       "Gestion multi-organisateurs",
//       "Intégration sur mesure (API, branding)",
//       "Support dédié & SLA"
//     ],
//     cta: "Nous contacter",
//     highlighted: false,
//   },
// ];



export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/plans");
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des plans :", error);
      }
    };

    fetchPlans();
  }, []);

  if (plans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Chargement des plans...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Tarifs Evenn
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Choisissez le plan adapté à vos évènements et simplifiez la gestion de vos billets.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-2xl shadow-lg p-6 border ${
              plan.highlighted ? "border-indigo-600 bg-white" : "border-gray-200 bg-white"
            }`}
          >
            <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
            <p className="mt-2 text-gray-600">{plan.description}</p>
            <p className="mt-4 text-3xl font-bold text-gray-900">{plan.price}</p>

            <ul className="mt-6 space-y-3 flex-1">
              {plan.features.map((features, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <Check className="h-5 w-5 text-indigo-600" />
                  {features}
                </li>
              ))}
            </ul>

            <button
              className={`mt-6 w-full rounded-xl px-4 py-2 font-medium ${
                plan.highlighted
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}