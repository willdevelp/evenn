"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { loginSchema, authErrorMessage, type LoginInput } from "@/lib/validations/auth";
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
    <AuthShell>
      <AuthHeader
        title="Ravi de vous revoir"
        subtitle="Connectez-vous pour gérer vos événements ou réserver des billets."
      />

      <GoogleSignInButton
        label="Se connecter avec Google"
        callbackURL={redirectTo}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:bg-brand-50/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/20 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <AuthDivider />

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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
          <label htmlFor="password" className={authLabelClass}>
            Mot de passe
          </label>
          <div className="relative mt-1.5">
            <Lock aria-hidden className={authFieldIcon} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              className="size-4 rounded accent-brand-600"
              {...register("rememberMe")}
            />
            Se souvenir de moi
          </label>
          <Link
            href="/contact"
            className="font-medium text-brand-600 underline-offset-4 hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" /> Connexion…
            </>
          ) : (
            <>
              Se connecter <ArrowRight aria-hidden size={16} />
            </>
          )}
        </button>
      </form>

      <AuthSwitch
        question="Pas encore de compte ?"
        href="/auth/register"
        linkLabel="S’inscrire"
      />
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Suspense
        fallback={
          <section className="flex min-h-[70vh] items-center justify-center bg-surface px-4 py-14">
            <div className="h-96 w-full max-w-md rounded-2xl bg-white shadow-card" />
          </section>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
