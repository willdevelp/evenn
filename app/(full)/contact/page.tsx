import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/src/components/ui/container";
import { getPublicSettings } from "@/lib/actions/settings/get-public-settings";
import { cn } from "@/lib/utils";
import ContactForm from "./ContactForm";

import Header from "@/src/components/ui/header";
import Footer from "@/src/components/ui/footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact | Masturi",
  description:
    "Une question sur Masturi ? Écrivez-nous : notre équipe vous répond dans les plus brefs délais.",
};

export default async function ContactPage() {
  const settings = await getPublicSettings();

  const channels: {
    icon: typeof Mail;
    label: string;
    content: React.ReactNode;
  }[] = [];

  if (settings.contactEmail) {
    channels.push({
      icon: Mail,
      label: "Email",
      content: (
        <a
          href={`mailto:${settings.contactEmail}`}
          className="break-all font-semibold text-slate-900 transition hover:text-brand-600"
        >
          {settings.contactEmail}
        </a>
      ),
    });
  }

  if (settings.contactPhone) {
    channels.push({
      icon: Phone,
      label: "Téléphone",
      content: (
        <a
          href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
          className="font-semibold text-slate-900 transition hover:text-brand-600"
        >
          {settings.contactPhone}
        </a>
      ),
    });
  }

  if (settings.contactAddress) {
    channels.push({
      icon: MapPin,
      label: "Adresse",
      content: <p className="font-semibold text-slate-900">{settings.contactAddress}</p>,
    });
  }

  return (
    <>
    <Header />
    <main className="min-h-screen bg-surface pb-20 text-slate-700">
      {/* ===== EN-TÊTE ===== */}
      <section className="relative isolate overflow-hidden bg-brand-600 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-40 size-[480px] rounded-full bg-brand-500/60 blur-3xl"
        />

        <Container className="relative pb-28 pt-14 sm:pb-32 sm:pt-20">
          <div className="max-w-2xl motion-safe:animate-fade-up">
            <h1 className="text-balance text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              Contactez-nous.
            </h1>
            <p className="mt-5 text-base leading-7 text-brand-50/90 sm:text-lg sm:leading-8">
              Une question, une demande particulière ou juste un bonjour ? Nous sommes là pour
              vous répondre dans les plus brefs délais.
            </p>
          </div>
        </Container>
      </section>

      {/* ===== COORDONNÉES + FORMULAIRE ===== */}
      <Container className="relative z-10 -mt-14 sm:-mt-16">
        <div
          className={cn(
            "grid gap-6",
            channels.length > 0 ? "md:grid-cols-[1fr_2fr]" : "mx-auto max-w-2xl",
          )}
        >
          {/* Uniquement les canaux réellement configurés */}
          {channels.length > 0 && (
            <aside className="space-y-5 motion-safe:animate-fade-up [animation-delay:120ms]">
              <section className="rounded-3xl border border-slate-200/80 bg-white shadow-card">
                <h2 className="px-6 pb-4 pt-6 text-lg font-bold text-slate-950">
                  Nos coordonnées
                </h2>
                <ul>
                  {channels.map(({ icon: Icon, label, content }) => (
                    <li
                      key={label}
                      className="flex items-start gap-3.5 border-t-2 border-dashed border-brand-200 px-6 py-5 text-sm"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                        <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">{label}</p>
                        <div className="mt-0.5 text-slate-600">{content}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="relative overflow-hidden rounded-3xl bg-brand-600 p-6 text-white">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px]"
                />
                <div className="relative">
                  <h2 className="text-base font-bold">Un projet en tête ?</h2>
                  <p className="mt-2 text-sm leading-6 text-brand-50/90">
                    Décrivez-nous votre besoin dans le formulaire, notre équipe vous répondra
                    dans les meilleurs délais.
                  </p>
                  <Link
                    href="/pricing"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:-translate-y-0.5 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/50"
                  >
                    Voir nos tarifs <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </div>
              </section>
            </aside>
          )}

          <div className="motion-safe:animate-fade-up [animation-delay:200ms]">
            <ContactForm />
          </div>
        </div>
      </Container>
    </main>
    <Footer />
    </>
  );
}