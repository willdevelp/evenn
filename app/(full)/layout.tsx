import type { ReactNode } from "react";

/**
 * Périmètre de la direction artistique publique.
 *
 * Les variables de `full-theme` (globals.css) redéfinissent toute la palette
 * pour les routes de ce groupe. Le dashboard et le reste de l'application
 * conservent leurs styles existants.
 */
export default function FullLayout({ children }: { children: ReactNode }) {
  return (
    <div className="full-theme min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
