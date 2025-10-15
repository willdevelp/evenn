"use client";

import { useState } from "react";
import { FiMail, FiUser, FiMessageCircle } from "react-icons/fi";

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
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 sm:p-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
            Contactez-nous
          </h1>
          <p className="text-gray-600 text-center mb-8 text-lg">
            Une question, une demande particulière ou juste un bonjour ? Nous
            sommes là pour vous répondre.
          </p>

          {submitted ? (
            <div className="bg-green-100 text-green-800 p-4 rounded-md text-center text-lg font-medium shadow-sm">
              ✅ Merci pour votre message ! Nous reviendrons vers vous rapidement.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom
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
                    placeholder="Votre nom complet"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <div className="relative">
                  <FiMessageCircle className="absolute left-3 top-3.5 text-gray-400" />
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre besoin ou votre question..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                  />
                </div>
              </div>

              {/* Bouton */}
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold text-sm rounded-md hover:bg-indigo-700 shadow-lg transition"
                >
                  Envoyer le message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}