/** Construction des liens publics des sites d'événements. */

const DEFAULT_BASE_URL = "http://localhost:3000";

function readBaseUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim() || DEFAULT_BASE_URL;
  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    return new URL(DEFAULT_BASE_URL);
  }
}

/** Domaine racine utilisé pour les sous-domaines (sans protocole). */
export function getSiteDomainSuffix(): string {
  const url = readBaseUrl();
  const hostname = url.hostname.replace(/^www\./i, "");
  return url.port ? `${hostname}:${url.port}` : hostname;
}

/** URL publique d'un site à partir de son sous-domaine. */
export function getSiteUrl(subdomain: string): string {
  const url = readBaseUrl();
  const hostname = url.hostname.replace(/^www\./i, "") || "localhost";
  const port = url.port ? `:${url.port}` : "";
  return `${url.protocol}//${subdomain}.${hostname}${port}`;
}

/** URL de la page publique de l'événement (billetterie, vote, RSVP...). */
export function getEventPublicUrl(eventId: string): string {
  const url = readBaseUrl();
  return `${url.origin.replace(/\/$/, "")}/events/${eventId}`;
}
