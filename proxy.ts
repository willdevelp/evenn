import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_BASE_URL = "http://masturi.netlify.app"; // fallback pour le développement local, si NEXT_PUBLIC_BASE_URL n'est pas défini

const PLATFORM_HOSTS = [
  ".vercel.app",
  ".netlify.app",
  ".onrender.com",
  ".railway.app",
  ".fly.dev",
  ".pages.dev",
  ".workers.dev",
  ".ngrok-free.app",
];

function getBaseHostname(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim() || DEFAULT_BASE_URL;
  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return url.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "localhost";
  }
}

function isPlatformHost(hostname: string): boolean {
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".local")) {
    return true;
  }
  if (process.env.VERCEL_URL?.toLowerCase() === hostname) return true;
  return PLATFORM_HOSTS.some((suffix) => hostname.endsWith(suffix));
}

/**
 * Détermine la clé du site à servir :
 *   - `awa.evenn.cm`       -> "awa"      (sous-domaine)
 *   - `monmariage.cm`      -> domaine complet (domaine personnalisé)
 *   - `evenn.cm` / `www`   -> null       (application principale)
 */
function resolveTenant(hostname: string, baseHostname: string): string | null {
  const host = hostname.toLowerCase();

  if (host === baseHostname || host === `www.${baseHostname}`) return null;
  if (host === "localhost" || host === "127.0.0.1") return null;

  if (host.endsWith(`.${baseHostname}`)) {
    const prefix = host.slice(0, -(baseHostname.length + 1));
    if (!prefix || prefix.includes(".") || prefix === "www") return null;
    return prefix;
  }

  // Domaine personnalisé : on évite les domaines de prévisualisation des
  // plateformes d'hébergement, qui ne doivent pas être réécrits.
  if (host.includes(".") && !isPlatformHost(host)) {
    return host;
  }

  return null;
}

export function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/sites") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  const baseHostname = getBaseHostname();
  const tenant = resolveTenant(hostname, baseHostname);
  if (!tenant) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/sites/${encodeURIComponent(tenant)}${pathname === "/" ? "" : pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
