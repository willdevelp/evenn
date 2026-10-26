"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/validations/auth";

type GoogleSignInButtonProps = {
  label: string;
  className?: string;
  /** Page vers laquelle rediriger après connexion (défaut : /dashboard). */
  callbackURL?: string;
};

export function GoogleSignInButton({
  label,
  className,
  callbackURL = "/dashboard",
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);

    try {
      const { error } = await signIn.social({ provider: "google", callbackURL });
      if (error) {
        toast.error(authErrorMessage(error));
        setLoading(false);
      }
      // En cas de succès, le navigateur est redirigé vers Google : on laisse le bouton en état "chargement".
    } catch {
      setLoading(false);
      toast.error("Impossible de démarrer la connexion avec Google.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={loading}
      className={className}
    >
      <FcGoogle aria-hidden="true" size={20} />
      <span>{loading ? "Redirection vers Google…" : label}</span>
    </button>
  );
}
