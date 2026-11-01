"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2, Phone, RotateCcw, ShieldCheck } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/validations/auth";
import AuthShell, {
  AuthHeader,
  authFieldIcon,
  authInputClass,
  authLabelClass,
} from "@/src/components/auth/auth-shell";

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
    <AuthShell>
      <AuthHeader
        title="Vérifiez votre numéro"
        subtitle="Saisissez le code à 6 chiffres reçu par SMS."
        icon={<ShieldCheck aria-hidden className="size-6" />}
      />

      <form className="mt-7 space-y-5" onSubmit={onSubmit} noValidate>
        <div>
          <label htmlFor="phoneNumber" className={authLabelClass}>
            Numéro de téléphone
          </label>
          <div className="relative mt-1.5">
            <Phone aria-hidden className={authFieldIcon} />
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+237 6 XX XX XX XX"
              className={authInputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="code" className={authLabelClass}>
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
            aria-describedby="code-hint"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white py-3 text-center text-2xl font-semibold tracking-[0.5em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
          />
          <p id="code-hint" className="mt-1.5 text-xs text-slate-400">
            Pensez à désactiver la saisie automatique si le code est recollé avec des espaces.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" /> Vérification…
            </>
          ) : (
            <>
              Vérifier <ArrowRight aria-hidden size={16} />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={resending}
          className="flex w-full items-center justify-center gap-2 text-sm font-medium text-brand-600 transition hover:underline disabled:opacity-60"
        >
          <RotateCcw aria-hidden size={15} />
          {resending ? "Envoi…" : "Renvoyer le code"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/auth/login" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </AuthShell>
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[70vh] items-center justify-center bg-surface px-4 py-14">
          <div className="h-96 w-full max-w-md rounded-2xl bg-white shadow-card" />
        </section>
      }
    >
      <VerifyPhoneForm />
    </Suspense>
  );
}
