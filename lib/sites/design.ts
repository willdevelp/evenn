import type { SiteSection, SiteTheme } from "@/lib/sites";
import {
  SITE_EVENT_TYPES,
  type SiteEventType,
  type SitePalette,
  type SiteTemplateLayout,
} from "./catalog";

export type ResolvedTheme = {
  primary: string;
  accent: string;
  background: string;
  text: string;
  layout: SiteTemplateLayout;
  variant: string;
  eventType: SiteEventType | null;
};

type ThemeSource = {
  theme: SiteTheme;
  template: {
    key: string;
    schema: {
      palette?: SitePalette;
      layout?: SiteTemplateLayout;
      variant?: string;
      eventType?: string;
    };
  };
};

const DEFAULT_PRIMARY = "#1d4ed8";
const DEFAULT_ACCENT = "#f59e0b";
const DEFAULT_BACKGROUND = "#f8fafc";
const DEFAULT_TEXT = "#0f172a";

/** Convertit une couleur #RRGGBB en rgba pour les surfaces translucides. */
export function alpha(hex: string, opacity: number): string {
  const value = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return `rgba(15, 23, 42, ${opacity})`;
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/** Choisit un texte lisible (clair ou sombre) sur un fond donné. */
export function readableOn(hex: string): string {
  const value = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return "#ffffff";
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#0f172a" : "#ffffff";
}

export function safeHref(value: string): string {
  if (!value) return "#";
  if (/^https?:\/\//i.test(value) || /^mailto:/i.test(value) || /^tel:/i.test(value)) {
    return value;
  }
  if (value.startsWith("/") || value.startsWith("#")) return value;
  return "#";
}

export function safeImage(value: string): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  return null;
}

export function cssImage(url: string): string {
  return `url("${url.replace(/["\\]/g, "\\$&")}")`;
}

export function formatBody(value: string): string[] {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function sectionText(section: SiteSection, key: string): string {
  const value = section.content[key];
  return typeof value === "string" ? value.trim() : "";
}

export function sectionStringList(section: SiteSection, key: string): string[] {
  const raw = section.content[key];
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function asEventType(value: string | null | undefined): SiteEventType | null {
  if (!value) return null;
  return (SITE_EVENT_TYPES as readonly string[]).includes(value)
    ? (value as SiteEventType)
    : null;
}

/** `mariage-elegance` -> `elegance` (clé de modèle -> variante). */
export function variantFromKey(key: string): string {
  const parts = key.split("-");
  return parts.length > 1 ? parts.slice(1).join("-") : key;
}

function isLayout(value: string | null | undefined): value is SiteTemplateLayout {
  return value === "centered" || value === "split" || value === "overlay" || value === "minimal";
}

export function resolveSiteTheme({ theme, template }: ThemeSource): ResolvedTheme {
  const palette = template.schema.palette;
  return {
    primary: theme.primaryColor ?? palette?.primaryColor ?? DEFAULT_PRIMARY,
    accent: theme.accentColor ?? palette?.accentColor ?? DEFAULT_ACCENT,
    background: theme.backgroundColor ?? palette?.backgroundColor ?? DEFAULT_BACKGROUND,
    text: theme.textColor ?? palette?.textColor ?? DEFAULT_TEXT,
    layout: isLayout(theme.layout) ? theme.layout : isLayout(template.schema.layout) ? template.schema.layout : "centered",
    variant: theme.variant ?? template.schema.variant ?? variantFromKey(template.key),
    eventType: asEventType(theme.eventType) ?? asEventType(template.schema.eventType),
  };
}

/** Thème utilisé par l'aperçu du constructeur (palette + modèle choisis). */
export function resolvePreviewTheme(
  palette: SitePalette,
  layout: SiteTemplateLayout,
  templateKey: string,
  eventType: SiteEventType | null,
): ResolvedTheme {
  return {
    primary: palette.primaryColor,
    accent: palette.accentColor,
    background: palette.backgroundColor,
    text: palette.textColor,
    layout,
    variant: variantFromKey(templateKey),
    eventType,
  };
}

/** Le premier module d'action trouvé, utilisé pour le bouton d'en-tête. */
export function findPrimaryAction(
  sections: SiteSection[],
): { href: string; label: string; type: string } | null {
  const candidates = ["tickets", "rsvp", "contest", "guestbook", "cta"];
  for (const type of candidates) {
    const section = sections.find((item) => item.type === type);
    if (!section) continue;
    const label = sectionText(section, "ctaLabel");
    if (!label) continue;
    return { href: sectionText(section, "ctaHref"), label, type };
  }
  return null;
}
