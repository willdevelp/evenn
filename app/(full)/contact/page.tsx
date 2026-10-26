"use client";

import { useState } from "react";
import { FiMail, FiUser, FiMessageCircle, FiPhone, FiMapPin } from "react-icons/fi";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* En-tête */}
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">À votre écoute</span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Contactez-nous
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Une question, une demande particulière ou juste un bonjour ? Nous sommes là pour vous répondre dans les plus brefs délais.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Colonne gauche : infos de contact */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-slate-900">Nos coordonnées</h2>
              <ul className="space-y-5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <FiMail className="h-6 w-6 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <a href="mailto:contact@evenn.com" className="hover:text-[#2563EB] transition">
                      contact@evenn.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FiPhone className="h-6 w-6 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Téléphone</p>
                    <a href="tel:+33123456789" className="hover:text-[#2563EB] transition">
                      +33 1 23 45 67 89
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FiMapPin className="h-6 w-6 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Adresse</p>
                    <p>10 rue de la Paix, 75002 Paris, France</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Carte (mockup) */}
            <div className="flex h-48 items-center justify-center rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-5 text-slate-500">
              <div className="text-center">
                <FiMapPin className="h-8 w-8 mx-auto text-[#0EA5E9]" />
                <p className="mt-2 text-sm font-semibold text-slate-700">Un projet en tête ?</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Décrivez-nous votre besoin dans le formulaire, notre équipe vous répondra.</p>
              </div>
            </div>
          </div>

          {/* Colonne droite : formulaire */}
          <div className="md:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-950">Envoyez-nous un message</h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl text-center">
                  <p className="text-lg font-medium">✅ Merci pour votre message !</p>
                  <p className="mt-2 text-sm text-green-700">Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#2563EB] text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse email *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3.5 text-[#0EA5E9]" />
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#2563EB] text-sm transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <div className="relative">
                      <FiMessageCircle className="absolute left-3 top-3.5 text-[#0EA5E9]" />
                      <textarea
                        name="message"
                        id="message"
                        rows={5}
                        required
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Décrivez votre besoin ou votre question..."
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#2563EB] text-sm resize-none transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1D4ED8] shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/40 transition-all"
                  >
                    <FiMail className="h-5 w-5" />
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}