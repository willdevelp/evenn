"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { registerSchema, authErrorMessage, type RegisterInput } from "@/lib/validations/auth";
import { toE164, DEFAULT_COUNTRY_CODE } from "@/lib/phone";
import { GoogleSignInButton } from "@/src/components/ui/google-sign-in-button";

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
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-14 sm:px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(37,99,235,0.08),_transparent_45%),radial-gradient(ellipse_at_bottom_right,_rgba(14,165,233,0.08),_transparent_45%)]" />
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-9">
          <div className="text-center">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-black text-blue-700">E</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Rejoignez Evenn</h1>
            <p className="mt-2 text-sm text-slate-500">Créez votre compte et donnez vie à votre prochain événement.</p>
          </div>

          <GoogleSignInButton
            label="S’inscrire avec Google"
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-[#2563EB]/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-200" />
            <span className="px-4 text-xs text-gray-400 font-medium">OU</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Votre nom"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition aria-invalid:border-red-400"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition aria-invalid:border-red-400"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+237 6 XX XX XX XX"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition aria-invalid:border-red-400"
                  aria-invalid={!!errors.phoneNumber}
                  {...register("phoneNumber")}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition aria-invalid:border-red-400"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/50 hover:bg-[#1d4ed8] transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Création…" : "Créer mon compte"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/login" className="text-[#2563EB] font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
    </section>
  );
}
