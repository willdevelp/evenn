"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { registerSchema, authErrorMessage, type RegisterInput } from "@/lib/validations/auth";
import { toE164, DEFAULT_COUNTRY_CODE } from "@/lib/phone";
import { GoogleSignInButton } from "@/src/components/ui/google-sign-in-button";
import AuthShell, {
  AuthHeader,
  AuthDivider,
  AuthSwitch,
  authFieldError,
  authFieldIcon,
  authInputClass,
  authLabelClass,
} from "@/src/components/auth/auth-shell";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      countryCode: DEFAULT_COUNTRY_CODE,
    },
  });

  async function onSubmit(values: RegisterInput) {
    setLoading(true);

    // Le numéro est normalisé en E.164 avant enregistrement (colonne "phoneNumber").
    const phone = values.phoneNumber.trim() ? toE164(values.phoneNumber, values.countryCode) : null;

    if (values.phoneNumber.trim() && !phone) {
      toast.error("Numéro de téléphone invalide.");
      setLoading(false);
      return;
    }

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      ...(phone ? { phoneNumber: phone } : {}),
    });

    if (error) {
      toast.error(authErrorMessage(error));
      setLoading(false);
      return;
    }

    // Champs applicatifs supplémentaires (colonne "countryCode").
    if (values.countryCode && values.countryCode !== DEFAULT_COUNTRY_CODE) {
      await authClient.updateUser({ countryCode: values.countryCode });
    }

    // Un numéro a été saisi : envoi du code de vérification.
    if (phone) {
      const { error: otpError } = await authClient.phoneNumber.sendOtp({ phoneNumber: phone });
      setLoading(false);

      if (otpError) {
        toast.error(
          "Compte créé, mais l'envoi du code SMS a échoué. Vous pourrez le renvoyer plus tard.",
        );
      } else {
        toast.success("Compte créé. Saisissez le code reçu par SMS pour vérifier votre numéro.");
      }
      router.push(`/auth/verify-phone?phone=${encodeURIComponent(phone)}`);
      return;
    }

    setLoading(false);
    toast.success("Compte créé. Bienvenue sur Evenn !");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell maxWidth="lg">
      <AuthHeader
        title="Rejoignez Evenn"
        subtitle="Créez votre compte et donnez vie à votre prochain événement."
      />

      <GoogleSignInButton
        label="S’inscrire avec Google"
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:bg-brand-50/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <AuthDivider />

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="name" className={authLabelClass}>
            Nom complet
          </label>
          <div className="relative mt-1.5">
            <User aria-hidden className={authFieldIcon} />
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Votre nom"
              className={authInputClass}
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </div>
          {errors.name && <p className={authFieldError}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className={authLabelClass}>
            Email
          </label>
          <div className="relative mt-1.5">
            <Mail aria-hidden className={authFieldIcon} />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="votre@email.com"
              className={authInputClass}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
          {errors.email && <p className={authFieldError}>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phoneNumber" className={authLabelClass}>
            Téléphone <span className="font-normal text-slate-400">(optionnel)</span>
          </label>
          <div className="relative mt-1.5">
            <Phone aria-hidden className={authFieldIcon} />
            <input
              id="phoneNumber"
              type="tel"
              autoComplete="tel"
              placeholder="+237 6 XX XX XX XX"
              className={authInputClass}
              aria-invalid={!!errors.phoneNumber}
              {...register("phoneNumber")}
            />
          </div>
          {errors.phoneNumber && <p className={authFieldError}>{errors.phoneNumber.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className={authLabelClass}>
            Mot de passe
          </label>
          <div className="relative mt-1.5">
            <Lock aria-hidden className={authFieldIcon} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className={`${authInputClass} pr-12`}
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          {errors.password && <p className={authFieldError}>{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="!mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" /> Création du compte…
            </>
          ) : (
            <>
              Créer mon compte <ArrowRight aria-hidden size={16} />
            </>
          )}
        </button>
      </form>

      <AuthSwitch
        question="Vous avez déjà un compte ?"
        href="/auth/login"
        linkLabel="Se connecter"
      />
    </AuthShell>
  );
}
