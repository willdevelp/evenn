import { requireUser } from "@/lib/session";

/**
 * Layout protégé du tableau de bord : redirige vers la connexion
 * si aucune session valide n'est trouvée.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("/dashboard");
  return <>{children}</>;
}
