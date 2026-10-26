"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Phone, ShieldCheck, ArrowRight, RotateCcw } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/validations/auth";

function VerifyPhoneForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get("phone") ?? "";

  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      toast.error("Le code doit contenir 6 chiffres.");
      return;
    }

    setLoading(true);
    const { error } = await authClient.phoneNumber.verify({ phoneNumber, code });

    if (error) {
      toast.error(authErrorMessage(error));
      setLoading(false);
      return;
    }

    toast.success("Numéro vérifié. Bienvenue !");
    router.push("/dashboard");
    router.refresh();
  }

  async function onResend() {
    if (!phoneNumber) {
      toast.error("Renseignez votre numéro de téléphone.");
      return;
    }

    setResending(true);
    const { error } = await authClient.phoneNumber.sendOtp({ phoneNumber });
    setResending(false);

    if (error) {
      toast.error(authErrorMessage(error));
      return;
    }
    toast.success("Un nouveau code vient d'être envoyé.");
  }

  return (
    <section className="relative flex min-h-[70vh] flex-1 items-center justify-center overflow-hidden px-4 py-14 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(37,99,235,0.08),_transparent_45%),radial-gradient(ellipse_at_bottom_right,_rgba(14,165,233,0.08),_transparent_45%)]" />
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-9">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]">
            <ShieldCheck size={22} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Vérifiez votre numéro</h1>
          <p className="mt-2 text-sm text-slate-500">
            Saisissez le code à 6 chiffres reçu par SMS.
          </p>
        </div>

        <form className="space-y-5 mt-6" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="+237 6 XX XX XX XX"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Code de vérification
            </label>
            <input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full py-3 text-center text-2xl tracking-[0.5em] border border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/50 hover:bg-[#1d4ed8] transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Vérification…" : "Vérifier"}
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={onResend}
            disabled={resending}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-[#2563EB] hover:underline disabled:opacity-60"
          >
            <RotateCcw size={16} />
            {resending ? "Envoi…" : "Renvoyer le code"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/auth/login" className="text-[#2563EB] font-semibold hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function VerifyPhonePage() {
  return (
      <Suspense
        fallback={
          <section className="flex min-h-[70vh] items-center justify-center px-4 py-14">
            <div className="h-96 w-full max-w-md animate-pulse rounded-3xl bg-slate-200" />
          </section>
        }
      >
        <VerifyPhoneForm />
      </Suspense>

  );
}
