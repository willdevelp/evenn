"use client";

import { useActionState, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Loader2,
  Mail,
  Send,
  User,
} from "lucide-react";

import {
  sendContactMessage,
  type ContactFormState,
} from "@/lib/actions/contact/send-contact-message";
import { cn } from "@/lib/utils";

const inputWrap =
  "relative flex items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-600/10";

const inputIcon = "pointer-events-none absolute left-3.5 size-4 text-slate-400";

const inputClass =
  "w-full rounded-xl border-0 bg-transparent py-3 pl-10 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400";

const initialState: ContactFormState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const [dismissed, setDismissed] = useState(false);

  const showSuccess = state.status === "success" && !dismissed;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-9">
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">
        Envoyez-nous un message
      </h2>

      {showSuccess ? (
        <div className="mt-8 flex flex-col items-center rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 aria-hidden className="size-6" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-emerald-900">
            Merci, votre message est bien enregistré.
          </h3>
          <p className="mt-1.5 text-sm text-emerald-800/90">
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-emerald-600/20"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form action={formAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Nom complet <span className="text-rose-500">*</span>
            </label>
            <div className={cn(inputWrap, "mt-1.5")}>
              <User aria-hidden className={inputIcon} />
              <input
                type="text"
                name="name"
                id="name"
                required
                minLength={2}
                placeholder="Votre nom"
                autoComplete="name"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Adresse email <span className="text-rose-500">*</span>
            </label>
            <div className={cn(inputWrap, "mt-1.5")}>
              <Mail aria-hidden className={inputIcon} />
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="vous@email.com"
                autoComplete="email"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700">
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="message"
              id="message"
              required
              minLength={10}
              rows={5}
              placeholder="Comment pouvons-nous vous aider ?"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
            />
          </div>

          {state.status === "error" && state.message && (
            <p
              role="alert"
              className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700"
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" /> Envoi en cours…
              </>
            ) : (
              <>
                <Send aria-hidden className="size-4" /> Envoyer le message
              </>
            )}
          </button>

          <p className="flex items-start gap-2 text-xs leading-5 text-slate-400">
            <CircleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            Les champs marqués d’un astérisque sont requis. Vos données ne sont utilisées que
            pour vous répondre.
          </p>
        </form>
      )}
    </section>
  );
}
