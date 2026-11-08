import type { SiteSection } from "@/lib/sites";
import { EVENT_TYPE_META, type SiteTemplateDefinition } from "@/lib/sites/catalog";
import type { SiteEventSummary, SiteTemplateOption } from "@/lib/sites/types";

const TOKEN_PATTERN = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;

function replaceTokens(value: unknown, variables: Record<string, string>): unknown {
  if (typeof value === "string") {
    return value.replace(TOKEN_PATTERN, (_, key: string) => variables[key] ?? "");
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceTokens(item, variables));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        replaceTokens(item, variables),
      ]),
    );
  }
  return value;
}

/** Remplace les jetons `{{event.*}}` du modèle par les données de l'événement. */
export function buildSiteSections(
  template: SiteTemplateOption | SiteTemplateDefinition,
  event: SiteEventSummary,
): SiteSection[] {
  const meta = EVENT_TYPE_META[template.eventType];
  const variables: Record<string, string> = {
    "event.id": event.id,
    "event.title": event.title,
    "event.slug": event.slug,
    "event.description": event.description,
    "event.typeLabel": meta.label,
    "event.category": event.category ?? "",
    "event.date": event.dateLabel,
    "event.time": event.timeLabel,
    "event.location": event.location,
    "event.venue": event.venueName ?? "",
    "event.address": event.address ?? "",
    "event.city": event.city ?? "",
    "event.coverUrl": event.coverUrl ?? "",
    "event.publicUrl": event.publicUrl,
  };

  return template.sections
    .map((section) => ({
      type: section.type,
      content: replaceTokens(section.content, variables) as Record<string, unknown>,
      isVisible: true,
    }))
    .filter((section) => {
      // Une section galerie sans image ou une section texte vide n'apporte rien.
      if (section.type === "gallery" && !section.content.image) return false;
      if (section.type === "story" && !section.content.body) return false;
      return true;
    });
}
