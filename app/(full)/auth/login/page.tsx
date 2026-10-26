"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { loginSchema, authErrorMessage, type LoginInput } from "@/lib/validations/auth";
import { GoogleSignInButton } from "@/src/components/ui/google-sign-in-button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  async function onSubmit(values: LoginInput) {
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
      callbackURL: redirectTo,
    });

    if (error) {
      toast.error(authErrorMessage(error));
      setLoading(false);
      return;
    }

    toast.success("Connexion réussie. Bienvenue !");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <section className="relative flex min-h-[70vh] flex-1 items-center justify-center overflow-hidden px-4 py-14 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(37,99,235,0.08),_transparent_45%),radial-gradient(ellipse_at_bottom_right,_rgba(14,165,233,0.08),_transparent_45%)]" />
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-9">
        <div className="text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-black text-blue-700">E</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Ravi de vous revoir</h1>
          <p className="mt-2 text-sm text-slate-500">
            Connectez-vous pour gérer vos événements ou réserver des billets.
          </p>
        </div>

        <GoogleSignInButton
          label="Se connecter avec Google"
          callbackURL={redirectTo}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:border-[#2563EB]/30 hover:shadow-md transition rounded-xl py-3 px-4 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-200" />
          <span className="px-4 text-xs text-gray-400 font-medium">OU</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded text-[#2563EB] focus:ring-[#2563EB]/20"
                {...register("rememberMe")}
              />
              Se souvenir de moi
            </label>
            <Link href="#" className="text-[#2563EB] hover:underline font-medium">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/50 hover:bg-[#1d4ed8] transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-[#2563EB] font-semibold hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense
        fallback={
          <section className="flex min-h-[70vh] items-center justify-center px-4 py-14">
            <div className="h-96 w-full max-w-md animate-pulse rounded-3xl bg-slate-200" />
          </section>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
