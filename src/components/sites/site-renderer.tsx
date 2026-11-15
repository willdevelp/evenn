import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Compass,
  Heart,
  Mail,
  MapPin,
  PenLine,
  Sparkles,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";

import type { SiteSection } from "@/lib/sites";
import { EVENT_TYPE_META, SITE_INTRO, type SiteEventType } from "@/lib/sites/catalog";
import {
  alpha,
  cssImage,
  findPrimaryAction,
  formatBody,
  readableOn,
  safeHref,
  safeImage,
  sectionStringList,
  sectionText,
  type ResolvedTheme,
} from "@/lib/sites/design";

export type SiteRendererOrganizer = {
  name: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  socialLinks: Record<string, string>;
};

export type SiteRendererContext = {
  name: string;
  eventType: SiteEventType | null;
  eventTypeLabel: string;
  organizer?: SiteRendererOrganizer;
  appUrl?: string;
};

type Props = {
  sections: SiteSection[];
  theme: ResolvedTheme;
  context: SiteRendererContext;
  /** Rendu réduit pour l'aperçu du constructeur (pas de navigation, tailles compactes). */
  compact?: boolean;
  /** Affiche l'en-tête et le pied de page du site. */
  chrome?: boolean;
};

const NAV_LABELS: Record<string, string> = {
  story: "Notre histoire",
  details: "Informations",
  custom_details: "Détails",
  program: "Programme",
  gallery: "Galerie",
  tickets: "Billetterie",
  contest: "Candidats",
  rsvp: "Confirmation",
  guestbook: "Livre d'or",
  quote: "Hommage",
  faq: "FAQ",
  venue: "Accès",
  cta: "Nous rejoindre",
};

const DEFAULT_APP_URL = "https://evenn.app";

function container(compact: boolean): string {
  return compact
    ? "mx-auto w-full px-4"
    : "mx-auto w-full max-w-6xl px-5 sm:px-8";
}

function sectionPadding(compact: boolean): string {
  return compact ? "py-8" : "py-16 sm:py-24";
}

function initial(value: string): string {
  return value.trim().slice(0, 1).toUpperCase() || "E";
}

function Cta({
  href,
  label,
  theme,
  compact,
  variant = "solid",
}: {
  href: string;
  label: string;
  theme: ResolvedTheme;
  compact: boolean;
  variant?: "solid" | "light" | "ghost";
}) {
  if (!label) return null;

  const style =
    variant === "light"
      ? { backgroundColor: "#ffffff", color: theme.primary }
      : variant === "ghost"
        ? { border: `1px solid ${alpha(theme.text, 0.24)}`, color: theme.text }
        : { backgroundColor: theme.primary, color: readableOn(theme.primary) };

  const className = `inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${
    compact ? "px-4 py-2 text-xs" : "px-6 py-3 text-sm"
  } ${variant === "ghost" ? "" : "shadow-sm"}`;

  const content = (
    <>
      {label}
      <ArrowRight size={compact ? 13 : 15} />
    </>
  );

  if (compact) {
    return (
      <span className={className} style={style}>
        {content}
      </span>
    );
  }

  return (
    <a href={safeHref(href)} className={className} style={style}>
      {content}
    </a>
  );
}

function Ornament({ theme, compact }: { theme: ResolvedTheme; compact: boolean }) {
  const line = compact ? "w-6" : "w-12";
  return (
    <span className="inline-flex items-center gap-3" aria-hidden="true">
      <span className={`h-px ${line}`} style={{ backgroundColor: alpha(theme.accent, 0.65) }} />
      <Sparkles size={compact ? 12 : 15} style={{ color: theme.accent }} />
      <span className={`h-px ${line}`} style={{ backgroundColor: alpha(theme.accent, 0.65) }} />
    </span>
  );
}

function Kicker({
  children,
  theme,
  compact,
  tone = "tinted",
}: {
  children: string;
  theme: ResolvedTheme;
  compact: boolean;
  tone?: "tinted" | "light" | "plain";
}) {
  if (!children) return null;
  const style =
    tone === "light"
      ? { backgroundColor: "rgba(255,255,255,0.14)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.22)" }
      : tone === "plain"
        ? { color: theme.primary }
        : { backgroundColor: alpha(theme.accent, 0.16), color: theme.primary };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-bold uppercase ${
        compact ? "px-2.5 py-1 text-[9px] tracking-[0.16em]" : "px-3 py-1.5 text-[11px] tracking-[0.18em]"
      }`}
      style={style}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone === "light" ? "#fff" : theme.accent }} />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  heading,
  body,
  theme,
  compact,
  align = "left",
}: {
  eyebrow?: string;
  heading: string;
  body?: string;
  theme: ResolvedTheme;
  compact: boolean;
  align?: "left" | "center";
}) {
  if (!heading && !eyebrow && !body) return null;
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <Kicker theme={theme} compact={compact}>{eyebrow}</Kicker> : null}
      {heading ? (
        <h2
          className={`mt-3 font-display font-semibold leading-tight tracking-tight ${
            compact ? "text-xl" : "text-3xl sm:text-4xl"
          }`}
          style={{ color: theme.primary }}
        >
          {heading}
        </h2>
      ) : null}
      {body ? (
        <p
          className={`mt-3 leading-7 ${compact ? "text-xs" : "text-sm sm:text-base"}`}
          style={{ color: alpha(theme.text, 0.7) }}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

function Facts({
  facts,
  theme,
  compact,
  tone = "tinted",
}: {
  facts: Array<{ label: string; value: string; icon: typeof CalendarDays }>;
  theme: ResolvedTheme;
  compact: boolean;
  tone?: "tinted" | "light" | "plain";
}) {
  if (facts.length === 0) return null;
  return (
    <div className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}>
      {facts.map(({ label, value, icon: Icon }, index) => (
        <span
          key={`${label}-${value}-${index}`}
          className={`inline-flex items-center gap-2 rounded-full font-semibold ${
            compact ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-xs"
          }`}
          style={
            tone === "light"
              ? { backgroundColor: "rgba(255,255,255,0.14)", color: "#ffffff" }
              : tone === "plain"
                ? { color: alpha(theme.text, 0.72) }
                : { backgroundColor: alpha(theme.primary, 0.09), color: theme.primary }
          }
        >
          <Icon size={compact ? 11 : 13} />
          {value}
        </span>
      ))}
    </div>
  );
}

function CoverVisual({
  image,
  label,
  theme,
  compact,
  className,
}: {
  image: string | null;
  label: string;
  theme: ResolvedTheme;
  compact: boolean;
  className: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label={label}
      style={{
        backgroundImage: image
          ? cssImage(image)
          : `radial-gradient(circle at 25% 20%, ${alpha(theme.accent, 0.85)}, transparent 58%), linear-gradient(150deg, ${theme.primary}, ${alpha(theme.text, 0.92)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!image ? (
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
            <Sparkles size={11} /> {label}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
            {compact ? "Votre visuel apparaîtra ici" : "Visuel de l'événement"}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------------------------- Hero ---------------------------------- */

function Hero({ section, theme, context, compact }: { section: SiteSection; theme: ResolvedTheme; context: SiteRendererContext; compact: boolean }) {
  const title = sectionText(section, "title") || context.name;
  const subtitle = sectionText(section, "subtitle");
  const eyebrow = sectionText(section, "eyebrow") || context.eventTypeLabel;
  const date = sectionText(section, "date");
  const time = sectionText(section, "time");
  const location = sectionText(section, "location");
  const image = safeImage(sectionText(section, "image"));
  const ctaLabel = sectionText(section, "ctaLabel");
  const ctaHref = sectionText(section, "ctaHref");

  const facts = [
    date ? { label: "Date", value: date, icon: CalendarDays } : null,
    time ? { label: "Heure", value: time, icon: Clock3 } : null,
    location ? { label: "Lieu", value: location, icon: MapPin } : null,
  ].filter((fact): fact is { label: string; value: string; icon: typeof CalendarDays } => fact !== null);

  if (theme.layout === "overlay") {
    return (
      <section className="relative isolate overflow-hidden" style={{ backgroundColor: theme.primary }}>
        {image ? (
          <div
            className="absolute inset-0"
            style={{ backgroundImage: cssImage(image), backgroundSize: "cover", backgroundPosition: "center" }}
            role="img"
            aria-label={title}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 22% 18%, ${alpha(theme.accent, 0.85)}, transparent 55%), linear-gradient(155deg, ${theme.primary}, ${alpha(theme.text, 0.95)})`,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 42%, rgba(0,0,0,0.12) 100%)",
          }}
        />
        <div
          className={`relative flex w-full flex-col justify-end ${
            compact ? "min-h-[300px] px-4 pb-6 pt-16" : "min-h-[88vh] px-5 pb-16 pt-28 sm:px-8"
          }`}
        >
          <div className={`mx-auto w-full ${compact ? "" : "max-w-6xl"}`}>
            <div className="max-w-3xl text-white">
              <span
                className={`inline-flex items-center gap-2 font-bold uppercase text-white/80 ${
                  compact ? "text-[9px] tracking-[0.2em]" : "text-[11px] tracking-[0.22em]"
                }`}
              >
                <span className="h-px w-8 bg-white/50" />
                {eyebrow}
              </span>
              <h1
                className={`mt-4 font-display font-semibold leading-[1.02] tracking-tight ${
                  compact ? "text-3xl" : "text-4xl sm:text-6xl lg:text-7xl"
                }`}
              >
                {title}
              </h1>
              {subtitle ? (
                <p className={`mt-4 max-w-2xl leading-7 text-white/80 ${compact ? "text-xs" : "text-base sm:text-lg"}`}>
                  {subtitle}
                </p>
              ) : null}
              {facts.length > 0 ? (
                <div className={compact ? "mt-4" : "mt-6"}>
                  <Facts facts={facts} theme={theme} compact={compact} tone="light" />
                </div>
              ) : null}
              {ctaLabel ? (
                <div className={compact ? "mt-5" : "mt-8"}>
                  <Cta href={ctaHref} label={ctaLabel} theme={theme} compact={compact} variant="light" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (theme.layout === "split") {
    return (
      <section style={{ backgroundColor: theme.background }}>
        <div
          className={`${container(compact)} grid items-center gap-8 ${
            compact ? "py-8" : "py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14"
          }`}
        >
          <div>
            <Kicker theme={theme} compact={compact}>{eyebrow}</Kicker>
            <h1
              className={`mt-4 font-display font-semibold leading-[1.05] tracking-tight ${
                compact ? "text-3xl" : "text-4xl sm:text-5xl lg:text-6xl"
              }`}
              style={{ color: theme.primary }}
            >
              {title}
            </h1>
            {subtitle ? (
              <p className={`mt-4 max-w-xl leading-7 ${compact ? "text-xs" : "text-base sm:text-lg"}`} style={{ color: alpha(theme.text, 0.72) }}>
                {subtitle}
              </p>
            ) : null}
            {facts.length > 0 ? (
              <div className={compact ? "mt-4" : "mt-6"}>
                <Facts facts={facts} theme={theme} compact={compact} />
              </div>
            ) : null}
            {ctaLabel ? (
              <div className={compact ? "mt-5" : "mt-8"}>
                <Cta href={ctaHref} label={ctaLabel} theme={theme} compact={compact} />
              </div>
            ) : null}
          </div>

          <div className="relative">
            <div
              className={`absolute rounded-[2.5rem] ${compact ? "-inset-1.5" : "-inset-3"}`}
              style={{ border: `1px solid ${alpha(theme.accent, 0.45)}`, transform: "rotate(2deg)" }}
              aria-hidden="true"
            />
            <CoverVisual
              image={image}
              label={context.eventTypeLabel || "Événement"}
              theme={theme}
              compact={compact}
              className={`relative rounded-[2rem] shadow-2xl ${compact ? "aspect-[4/3]" : "aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]"}`}
            />
            {date ? (
              <div
                className={`absolute rounded-2xl bg-white shadow-xl ${compact ? "-bottom-3 left-2 px-3 py-2" : "-bottom-5 -left-3 px-4 py-3"}`}
                style={{ color: theme.text }}
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">Rendez-vous</p>
                <p className={`mt-0.5 font-display font-semibold ${compact ? "text-xs" : "text-sm"}`}>{date}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (theme.layout === "minimal") {
    return (
      <section style={{ backgroundColor: theme.background }}>
        <div className={`${container(compact)} ${compact ? "py-9" : "py-20 sm:py-28"}`}>
          <div className="flex items-center gap-3">
            <span className="h-px w-10" style={{ backgroundColor: theme.accent }} />
            <span className={`font-bold uppercase ${compact ? "text-[9px] tracking-[0.18em]" : "text-[11px] tracking-[0.22em]"}`} style={{ color: theme.primary }}>
              {eyebrow}
            </span>
          </div>
          <h1
            className={`mt-4 max-w-4xl font-display font-semibold leading-[1.02] tracking-tight ${
              compact ? "text-3xl" : "text-4xl sm:text-6xl lg:text-7xl"
            }`}
            style={{ color: theme.primary }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className={`mt-4 max-w-2xl leading-7 ${compact ? "text-xs" : "text-base sm:text-lg"}`} style={{ color: alpha(theme.text, 0.72) }}>
              {subtitle}
            </p>
          ) : null}
          {facts.length > 0 ? (
            <dl
              className={`mt-7 grid gap-4 border-t pt-5 ${compact ? "grid-cols-3 gap-2" : "max-w-3xl sm:grid-cols-3"} `}
              style={{ borderColor: alpha(theme.text, 0.12) }}
            >
              {facts.map(({ label, value, icon: Icon }) => (
                <div key={label}>
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: alpha(theme.text, 0.45) }}>
                    <Icon size={11} /> {label}
                  </dt>
                  <dd className={`mt-1 font-semibold ${compact ? "text-[11px]" : "text-sm"}`}>{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {ctaLabel ? (
            <div className={compact ? "mt-5" : "mt-8"}>
              <Cta href={ctaHref} label={ctaLabel} theme={theme} compact={compact} />
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  // Layout « centered » : classique, éditorial, avec visuel sous le titre.
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: alpha(theme.primary, 0.045) }}>
      <div
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: alpha(theme.accent, 0.24) }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: alpha(theme.primary, 0.14) }}
        aria-hidden="true"
      />
      <div className={`relative ${container(compact)} flex flex-col items-center text-center ${compact ? "py-9" : "py-16 sm:py-24"}`}>
        <Ornament theme={theme} compact={compact} />
        <div className="mt-4">
          <Kicker theme={theme} compact={compact}>{eyebrow}</Kicker>
        </div>
        <h1
          className={`mx-auto mt-4 max-w-4xl font-display font-semibold leading-[1.03] tracking-tight ${
            compact ? "text-3xl" : "text-4xl sm:text-6xl lg:text-7xl"
          }`}
          style={{ color: theme.primary }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className={`mx-auto mt-4 max-w-2xl leading-7 ${compact ? "text-xs" : "text-base sm:text-lg"}`} style={{ color: alpha(theme.text, 0.72) }}>
            {subtitle}
          </p>
        ) : null}
        {facts.length > 0 ? (
          <div className={`flex justify-center ${compact ? "mt-4" : "mt-6"}`}>
            <Facts facts={facts} theme={theme} compact={compact} />
          </div>
        ) : null}
        {ctaLabel ? (
          <div className={compact ? "mt-5" : "mt-8"}>
            <Cta href={ctaHref} label={ctaLabel} theme={theme} compact={compact} />
          </div>
        ) : null}
        {image || compact ? (
          <CoverVisual
            image={image}
            label={context.eventTypeLabel || "Événement"}
            theme={theme}
            compact={compact}
            className={`w-full rounded-[2.5rem] shadow-xl ${
              compact ? "mt-8 aspect-[16/9]" : "mt-12 aspect-[16/9] sm:aspect-[21/9]"
            }`}
          />
        ) : null}
      </div>
    </section>
  );
}

/* -------------------------------- Sections -------------------------------- */

function StorySection({ section, theme, compact }: { section: SiteSection; theme: ResolvedTheme; compact: boolean }) {
  const heading = sectionText(section, "heading");
  const paragraphs = formatBody(sectionText(section, "body"));
  if (!heading && paragraphs.length === 0) return null;

  return (
    <section className={sectionPadding(compact)} style={{ backgroundColor: theme.background }}>
      <div className={`${container(compact)} grid gap-6 ${compact ? "" : "lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"}`}>
        <div>
          <SectionHeading eyebrow="À propos" heading={heading} theme={theme} compact={compact} />
          <div className={`${compact ? "mt-4 w-10" : "mt-6 w-16"} h-1 rounded-full`} style={{ backgroundColor: theme.accent }} />
        </div>
        <div className={`space-y-4 ${compact ? "text-xs leading-6" : "text-base leading-8"}`} style={{ color: alpha(theme.text, 0.78) }}>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              style={
                index === 0 && !compact
                  ? { color: alpha(theme.text, 0.85) }
                  : undefined
              }
              className={index === 0 && !compact ? "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-current" : undefined}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailsSection({ section, theme, compact }: { section: SiteSection; theme: ResolvedTheme; compact: boolean }) {
  const heading = sectionText(section, "heading");
  const cards = [
    { label: "Date", value: sectionText(section, "date"), icon: CalendarDays },
    { label: "Heure", value: sectionText(section, "time"), icon: Clock3 },
    { label: "Lieu", value: sectionText(section, "venue"), icon: MapPin },
    {
      label: "Adresse",
      value: [sectionText(section, "address"), sectionText(section, "city")].filter(Boolean).join(", "),
      icon: Compass,
    },
  ].filter((card) => card.value);

  if (cards.length === 0) return null;

  return (
    <section className={sectionPadding(compact)} style={{ backgroundColor: alpha(theme.text, 0.035) }}>
      <div className={container(compact)}>
        <SectionHeading eyebrow="Pratique" heading={heading} theme={theme} compact={compact} align="center" />
        <div className={`grid gap-3 ${compact ? "mt-5 grid-cols-2" : "mt-10 sm:grid-cols-2 lg:grid-cols-4"}`}>
          {cards.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className={`rounded-2xl border transition hover:-translate-y-0.5 ${compact ? "p-3" : "p-5"}`}
              style={{ backgroundColor: theme.background, borderColor: alpha(theme.text, 0.08), boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
            >
              <span
                className={`flex items-center justify-center rounded-xl ${compact ? "h-8 w-8" : "h-10 w-10"}`}
                style={{ backgroundColor: alpha(theme.accent, 0.18), color: theme.primary }}
              >
                <Icon size={compact ? 14 : 18} />
              </span>
              <p className={`font-bold uppercase ${compact ? "mt-3 text-[8px] tracking-[0.12em]" : "mt-4 text-[10px] tracking-[0.16em]"}`} style={{ color: alpha(theme.text, 0.45) }}>
                {label}
              </p>
              <p className={`mt-1 font-semibold ${compact ? "text-[11px] leading-4" : "text-sm leading-6"}`} style={{ color: theme.text }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VenueSection({ section, theme, compact }: { section: SiteSection; theme: ResolvedTheme; compact: boolean }) {
  const heading = sectionText(section, "heading");
  const body = sectionText(section, "body");
  const venue = sectionText(section, "venue");
  const address = [sectionText(section, "address"), sectionText(section, "city")].filter(Boolean).join(", ");
  const note = sectionText(section, "note");
  if (!heading && !venue && !address) return null;

  return (
    <section className={sectionPadding(compact)} style={{ backgroundColor: theme.background }}>
      <div className={`${container(compact)} grid items-center gap-8 ${compact ? "" : "lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"}`}>
        <div>
          <SectionHeading eyebrow="Accès" heading={heading} body={body} theme={theme} compact={compact} />
          {venue || address ? (
            <div className={`flex items-start gap-3 ${compact ? "mt-4" : "mt-6"}`}>
              <span
                className={`mt-0.5 flex shrink-0 items-center justify-center rounded-xl ${compact ? "h-8 w-8" : "h-10 w-10"}`}
                style={{ backgroundColor: alpha(theme.primary, 0.1), color: theme.primary }}
              >
                <MapPin size={compact ? 14 : 18} />
              </span>
              <div>
                {venue ? <p className={`font-semibold ${compact ? "text-xs" : "text-base"}`}>{venue}</p> : null}
                {address ? <p className={`mt-0.5 ${compact ? "text-[11px]" : "text-sm"}`} style={{ color: alpha(theme.text, 0.62) }}>{address}</p> : null}
              </div>
            </div>
          ) : null}
          {note ? (
            <p
              className={`mt-5 rounded-2xl border-l-2 px-4 py-3 leading-6 ${compact ? "text-[11px]" : "text-sm"}`}
              style={{ borderColor: theme.accent, backgroundColor: alpha(theme.accent, 0.1), color: alpha(theme.text, 0.75) }}
            >
              {note}
            </p>
          ) : null}
        </div>

        <div
          className={`relative overflow-hidden rounded-[2rem] border ${compact ? "aspect-[16/10]" : "aspect-[5/4]"}`}
          style={{
            borderColor: alpha(theme.text, 0.1),
            backgroundImage: `linear-gradient(140deg, ${alpha(theme.primary, 0.12)}, ${alpha(theme.accent, 0.22)})`,
          }}
        >
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, ${alpha(theme.text, 0.08)} 0 1px, transparent 1px 44px), repeating-linear-gradient(90deg, ${alpha(theme.text, 0.08)} 0 1px, transparent 1px 44px)`,
            }}
            aria-hidden="true"
          />
          <div className="absolute -left-10 top-1/2 h-5 w-[130%] -rotate-12" style={{ backgroundColor: alpha(theme.background, 0.75) }} aria-hidden="true" />
          <div className="absolute -top-10 left-1/3 h-[130%] w-3 rotate-6" style={{ backgroundColor: alpha(theme.background, 0.6) }} aria-hidden="true" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span
              className="absolute -inset-5 animate-pulse rounded-full"
              style={{ backgroundColor: alpha(theme.primary, 0.2) }}
              aria-hidden="true"
            />
            <span
              className={`relative flex items-center justify-center rounded-full shadow-lg ${compact ? "h-9 w-9" : "h-12 w-12"}`}
              style={{ backgroundColor: theme.primary, color: readableOn(theme.primary) }}
            >
              <MapPin size={compact ? 16 : 22} />
            </span>
          </div>
          {venue || address ? (
            <div
              className={`absolute inset-x-3 bottom-3 rounded-xl px-3 py-2 backdrop-blur ${compact ? "text-[9px]" : "text-xs"}`}
              style={{ backgroundColor: alpha(theme.background, 0.86) }}
            >
              {venue ? <p className="font-semibold">{venue}</p> : null}
              {address ? <p className="mt-0.5" style={{ color: alpha(theme.text, 0.6) }}>{address}</p> : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ section, theme, compact }: { section: SiteSection; theme: ResolvedTheme; compact: boolean }) {
  const heading = sectionText(section, "heading") || "Galerie";
  const images = sectionStringList(section, "images")
    .map((image) => safeImage(image))
    .filter((image): image is string => Boolean(image));
  const single = safeImage(sectionText(section, "image"));
  if (single) images.unshift(single);
  const unique = Array.from(new Set(images));

  const tiles: Array<string | null> = unique.length > 0 ? unique : compact ? [null, null, null] : [];
  if (tiles.length === 0) return null;

  return (
    <section className={sectionPadding(compact)} style={{ backgroundColor: theme.background }}>
      <div className={container(compact)}>
        <SectionHeading eyebrow="Souvenirs" heading={heading} theme={theme} compact={compact} align="center" />
        <div className={`grid gap-3 ${compact ? "mt-5 grid-cols-3" : "mt-10 sm:grid-cols-2 lg:grid-cols-3"}`}>
          {tiles.map((image, index) => (
            <CoverVisual
              key={`${image ?? "placeholder"}-${index}`}
              image={image}
              label={`Photo ${index + 1}`}
              theme={theme}
              compact={compact}
              className={`rounded-2xl ${compact ? "aspect-square" : "aspect-[4/3] shadow-sm"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramSection({ section, theme, compact }: { section: SiteSection; theme: ResolvedTheme; compact: boolean }) {
  const heading = sectionText(section, "heading") || "Programme";
  const steps = sectionText(section, "body")
    .split(/\s+—\s+|\n+/)
    .map((step) => step.trim())
    .filter(Boolean);
  if (steps.length === 0) return null;

  return (
    <section className={sectionPadding(compact)} style={{ backgroundColor: theme.background }}>
      <div className={`${container(compact)} mx-auto max-w-3xl`}>
        <SectionHeading eyebrow="Déroulé" heading={heading} theme={theme} compact={compact} align="center" />
        <ol className={`relative mt-6 space-y-3 border-l pl-5 ${compact ? "" : "mt-10 space-y-4 pl-8"}`} style={{ borderColor: alpha(theme.accent, 0.4) }}>
          {steps.map((step, index) => (
            <li key={`${step}-${index}`} className="relative">
              <span
                className={`absolute rounded-full ${compact ? "-left-[25px] top-4 h-2 w-2" : "-left-[38px] top-5 h-3 w-3"}`}
                style={{ backgroundColor: theme.accent, boxShadow: `0 0 0 4px ${alpha(theme.accent, 0.18)}` }}
                aria-hidden="true"
              />
              <div
                className={`rounded-2xl border ${compact ? "px-3 py-2.5" : "px-5 py-4"}`}
                style={{ borderColor: alpha(theme.text, 0.08), backgroundColor: alpha(theme.primary, 0.04) }}
              >
                <p className={`font-bold uppercase ${compact ? "text-[8px] tracking-[0.14em]" : "text-[10px] tracking-[0.16em]"}`} style={{ color: alpha(theme.text, 0.4) }}>
                  Étape {index + 1}
                </p>
                <p className={`mt-1 font-semibold ${compact ? "text-[11px] leading-4" : "text-sm leading-6"}`} style={{ color: theme.text }}>
                  {step}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FaqSection({ section, theme, compact }: { section: SiteSection; theme: ResolvedTheme; compact: boolean }) {
  const heading = sectionText(section, "heading") || "Questions fréquentes";
  const body = sectionText(section, "body");
  const raw = section.content.items;
  const items = Array.isArray(raw)
    ? raw.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const { question, answer } = item as Record<string, unknown>;
        return typeof question === "string" && typeof answer === "string" && question.trim()
          ? [{ question, answer }]
          : [];
      })
    : [];
  if (items.length === 0) return null;

  return (
    <section className={sectionPadding(compact)} style={{ backgroundColor: alpha(theme.text, 0.03) }}>
      <div className={`${container(compact)} mx-auto max-w-3xl`}>
        <SectionHeading eyebrow="Bon à savoir" heading={heading} body={body} theme={theme} compact={compact} align="center" />
        <div
          className={`mt-5 overflow-hidden rounded-2xl border ${compact ? "" : "mt-9"}`}
          style={{ borderColor: alpha(theme.text, 0.1), backgroundColor: theme.background }}
        >
          {items.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className="group"
              style={{ borderTop: index > 0 ? `1px solid ${alpha(theme.text, 0.08)}` : undefined }}
            >
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-4 font-semibold ${compact ? "px-3 py-2.5 text-[11px]" : "px-5 py-4 text-sm"}`}
                style={{ color: theme.text }}
              >
                {item.question}
                <ChevronDown size={compact ? 14 : 18} className="shrink-0 transition group-open:rotate-180" style={{ color: theme.primary }} />
              </summary>
              <p className={`leading-6 ${compact ? "px-3 pb-3 text-[10px]" : "px-5 pb-4 text-sm leading-7"}`} style={{ color: alpha(theme.text, 0.68) }}>
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteSection({ section, theme, compact }: { section: SiteSection; theme: ResolvedTheme; compact: boolean }) {
  const quote = sectionText(section, "text");
  const author = sectionText(section, "author");
  if (!quote) return null;

  return (
    <section className={sectionPadding(compact)} style={{ backgroundColor: alpha(theme.primary, 0.05) }}>
      <figure className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <span className="font-display leading-none" style={{ color: theme.accent, fontSize: compact ? 40 : 64 }} aria-hidden="true">
          “
        </span>
        <blockquote
          className={`font-display font-medium leading-snug ${compact ? "text-lg" : "text-2xl sm:text-3xl"}`}
          style={{ color: theme.primary }}
        >
          {quote}
        </blockquote>
        {author ? (
          <figcaption className={`mt-4 font-bold uppercase ${compact ? "text-[9px] tracking-[0.16em]" : "text-[11px] tracking-[0.2em]"}`} style={{ color: alpha(theme.text, 0.5) }}>
            {author}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}

function ActionSection({ section, theme, compact }: { section: SiteSection; theme: ResolvedTheme; compact: boolean }) {
  const heading = sectionText(section, "heading");
  const body = sectionText(section, "body");
  const ctaLabel = sectionText(section, "ctaLabel");
  const ctaHref = sectionText(section, "ctaHref");
  if (!heading && !body) return null;

  const meta =
    section.type === "tickets"
      ? { label: "Billetterie", icon: Ticket }
      : section.type === "contest"
        ? { label: "Concours", icon: Trophy }
        : section.type === "rsvp"
          ? { label: "Présence", icon: Users }
          : section.type === "guestbook"
            ? { label: "Livre d'or", icon: PenLine }
            : { label: "Participer", icon: Heart };
  const Icon = meta.icon;

  return (
    <section className={compact ? "py-5" : "py-10 sm:py-14"}>
      <div className={container(compact)}>
        <div
          className={`relative overflow-hidden rounded-[2rem] ${compact ? "px-4 py-5" : "px-6 py-8 sm:px-10 sm:py-12"}`}
          style={{ backgroundImage: `linear-gradient(120deg, ${theme.primary}, ${alpha(theme.primary, 0.82)})`, color: readableOn(theme.primary) }}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-2xl"
            style={{ backgroundColor: alpha(theme.accent, 0.45) }}
            aria-hidden="true"
          />
          <div className={`relative flex flex-col gap-5 ${compact ? "" : "sm:flex-row sm:items-center sm:justify-between"}`}>
            <div className="max-w-2xl">
              <span
                className={`inline-flex items-center gap-2 rounded-full font-bold uppercase ${
                  compact ? "px-2.5 py-1 text-[9px] tracking-[0.14em]" : "px-3 py-1.5 text-[11px] tracking-[0.16em]"
                }`}
                style={{ backgroundColor: "rgba(255,255,255,0.16)", color: "#ffffff" }}
              >
                <Icon size={compact ? 11 : 14} /> {meta.label}
              </span>
              <h2 className={`mt-3 font-display font-semibold leading-tight ${compact ? "text-lg" : "text-2xl sm:text-3xl"}`} style={{ color: "#ffffff" }}>
                {heading}
              </h2>
              {body ? (
                <p className={`mt-2 leading-6 text-white/80 ${compact ? "text-[11px]" : "text-sm sm:text-base sm:leading-7"}`}>{body}</p>
              ) : null}
            </div>
            {ctaLabel ? <Cta href={ctaHref} label={ctaLabel} theme={theme} compact={compact} variant="light" /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomDetailsSection({ section, theme, compact }: { section: SiteSection; theme: ResolvedTheme; compact: boolean }) {
  const heading = sectionText(section, "heading");
  const raw = section.content.fields;
  const fields = Array.isArray(raw)
    ? raw.flatMap((field) => {
        if (!field || typeof field !== "object") return [];
        const { label, value } = field as Record<string, unknown>;
        return typeof label === "string" && typeof value === "string" && value.trim() ? [{ label, value }] : [];
      })
    : [];
  if (fields.length === 0) return null;

  return (
    <section className={sectionPadding(compact)} style={{ backgroundColor: theme.background }}>
      <div className={`${container(compact)} mx-auto max-w-5xl`}>
        <SectionHeading eyebrow="À retenir" heading={heading} theme={theme} compact={compact} align="center" />
        <dl className={`grid gap-3 ${compact ? "mt-5" : "mt-9 sm:grid-cols-2"}`}>
          {fields.map((field) => (
            <div
              key={field.label}
              className={`rounded-2xl border ${compact ? "p-3" : "p-5"}`}
              style={{ borderColor: alpha(theme.text, 0.1), backgroundColor: alpha(theme.primary, 0.04) }}
            >
              <span className="block h-1 w-8 rounded-full" style={{ backgroundColor: theme.accent }} aria-hidden="true" />
              <dt className={`mt-3 font-bold uppercase ${compact ? "text-[8px] tracking-[0.12em]" : "text-[11px] tracking-[0.14em]"}`} style={{ color: theme.primary }}>
                {field.label}
              </dt>
              <dd className={`mt-1.5 whitespace-pre-line ${compact ? "text-[11px] leading-5" : "text-sm leading-7"}`} style={{ color: alpha(theme.text, 0.78) }}>
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function TextSection({ section, theme, compact }: { section: SiteSection; theme: ResolvedTheme; compact: boolean }) {
  const heading = sectionText(section, "heading");
  const paragraphs = formatBody(sectionText(section, "body"));
  if (!heading && paragraphs.length === 0) return null;

  return (
    <section className={sectionPadding(compact)} style={{ backgroundColor: theme.background }}>
      <div className={`${container(compact)} mx-auto max-w-3xl`}>
        <SectionHeading heading={heading} theme={theme} compact={compact} />
        <div className={`mt-4 space-y-4 ${compact ? "text-xs leading-6" : "text-base leading-8"}`} style={{ color: alpha(theme.text, 0.78) }}>
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ section, theme, compact }: { section: SiteSection; theme: ResolvedTheme; compact: boolean }) {
  const heading = sectionText(section, "heading");
  const body = sectionText(section, "body");
  const ctaLabel = sectionText(section, "ctaLabel");
  const ctaHref = sectionText(section, "ctaHref");
  if (!heading && !body) return null;

  const ink = readableOn(theme.accent);
  return (
    <section className={sectionPadding(compact)} style={{ backgroundColor: theme.background }}>
      <div className={`${container(compact)} mx-auto max-w-4xl`}>
        <div
          className={`relative overflow-hidden rounded-[2.5rem] text-center ${compact ? "px-4 py-7" : "px-6 py-12 sm:px-12 sm:py-16"}`}
          style={{ backgroundColor: theme.accent }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 15% 15%, rgba(255,255,255,0.45), transparent 55%), radial-gradient(circle at 85% 90%, ${alpha(theme.primary, 0.22)}, transparent 55%)`,
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <Ornament theme={theme} compact={compact} />
            <h2 className={`mx-auto mt-3 max-w-2xl font-display font-semibold leading-tight ${compact ? "text-xl" : "text-3xl sm:text-4xl"}`} style={{ color: ink }}>
              {heading}
            </h2>
            {body ? (
              <p className={`mx-auto mt-3 max-w-2xl leading-6 ${compact ? "text-[11px]" : "text-sm sm:text-base sm:leading-7"}`} style={{ color: alpha(ink, 0.78) }}>
                {body}
              </p>
            ) : null}
            {ctaLabel ? (
              <div className={`flex justify-center ${compact ? "mt-4" : "mt-7"}`}>
                <Cta href={ctaHref} label={ctaLabel} theme={theme} compact={compact} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Header / Footer ---------------------------- */

function SiteHeader({
  sections,
  theme,
  context,
  compact,
}: {
  sections: SiteSection[];
  theme: ResolvedTheme;
  context: SiteRendererContext;
  compact: boolean;
}) {
  const nav = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => section.type !== "hero" && NAV_LABELS[section.type])
    .slice(0, 4);
  const action = findPrimaryAction(sections);

  return (
    <header
      className={compact ? "border-b" : "sticky top-0 z-40 border-b backdrop-blur-xl"}
      style={{
        borderColor: alpha(theme.text, 0.1),
        backgroundColor: alpha(theme.background, compact ? 1 : 0.88),
      }}
    >
      <div
        className={`mx-auto flex w-full items-center justify-between gap-3 ${
          compact ? "px-4 py-2.5" : "max-w-6xl px-5 py-3 sm:px-8"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`flex shrink-0 items-center justify-center rounded-xl font-black shadow-sm ${
              compact ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-sm"
            }`}
            style={{ backgroundColor: theme.primary, color: readableOn(theme.primary) }}
          >
            {initial(context.name)}
          </span>
          <span className={`truncate font-display font-semibold ${compact ? "text-xs" : "text-sm"}`} style={{ color: theme.primary }}>
            {context.name}
          </span>
        </div>

        {!compact && nav.length > 0 ? (
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map(({ section, index }) => (
              <a
                key={`${section.type}-${index}`}
                href={`#section-${index}`}
                className="rounded-full px-3 py-1.5 text-xs font-semibold transition hover:bg-black/5"
                style={{ color: alpha(theme.text, 0.65) }}
              >
                {NAV_LABELS[section.type]}
              </a>
            ))}
          </nav>
        ) : null}

        {action ? (
          <Cta href={action.href} label={action.label} theme={theme} compact={compact} />
        ) : null}
      </div>
    </header>
  );
}

function SiteFooter({
  sections,
  theme,
  context,
  compact,
}: {
  sections: SiteSection[];
  theme: ResolvedTheme;
  context: SiteRendererContext;
  compact: boolean;
}) {
  const action = findPrimaryAction(sections);
  const appUrl = context.appUrl || DEFAULT_APP_URL;
  const organizer = context.organizer;
  const logo = safeImage(organizer?.logoUrl ?? "");
  const socialLinks = Object.entries(organizer?.socialLinks ?? {}).filter(([, href]) => safeHref(href) !== "#");

  return (
    <footer
      style={{ backgroundColor: alpha(theme.text, 0.05), borderTop: `1px solid ${alpha(theme.text, 0.08)}` }}
    >
      <div className={`${container(compact)} ${compact ? "py-6" : "py-10"}`}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className={`font-display font-semibold ${compact ? "text-xs" : "text-sm"}`} style={{ color: theme.primary }}>
              {context.name}
            </p>
            <p className={`mt-1 ${compact ? "text-[10px]" : "text-xs"}`} style={{ color: alpha(theme.text, 0.55) }}>
              Site officiel de l&apos;événement, créé avec Evenn.
            </p>
          </div>

          {organizer?.name ? (
            <div className="flex max-w-xl items-start gap-3">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={`Logo de ${organizer.name}`}
                  className="size-10 shrink-0 rounded-lg object-cover"
                />
              ) : null}
              <div className="min-w-0 sm:text-right">
                <p className={`font-semibold ${compact ? "text-[11px]" : "text-sm"}`} style={{ color: theme.text }}>
                  Organisé par {organizer.name}
                </p>
                {organizer.description ? (
                  <p className={`mt-1 whitespace-pre-line leading-5 ${compact ? "text-[10px]" : "text-xs"}`} style={{ color: alpha(theme.text, 0.68) }}>
                    {organizer.description}
                  </p>
                ) : null}
                {!compact ? (
                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold sm:justify-end">
                    {safeHref(organizer.websiteUrl ?? "") !== "#" ? (
                      <a
                        href={safeHref(organizer.websiteUrl ?? "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                        style={{ color: theme.primary }}
                      >
                        Site de l&apos;organisateur
                      </a>
                    ) : null}
                    {socialLinks.map(([name, href]) => (
                      <a
                        key={name}
                        href={safeHref(href)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="capitalize underline underline-offset-2"
                        style={{ color: theme.primary }}
                      >
                        {name}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div
          className={`flex flex-wrap items-center justify-between gap-3 border-t ${compact ? "mt-4 pt-4" : "mt-6 pt-5"}`}
          style={{ borderColor: alpha(theme.text, 0.08) }}
        >
          {action ? (
            compact ? (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold"
                style={{ backgroundColor: alpha(theme.primary, 0.12), color: theme.primary }}
              >
                {action.label}
              </span>
            ) : (
              <a
                href={safeHref(action.href)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold"
                style={{ backgroundColor: alpha(theme.primary, 0.1), color: theme.primary }}
              >
                {action.label}
              </a>
            )
          ) : (
            <span />
          )}

          {compact ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: alpha(theme.text, 0.55) }}>
              <Mail size={11} /> Créé avec Evenn
            </span>
          ) : (
            <a
              href={appUrl}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold"
              style={{ backgroundColor: theme.primary, color: readableOn(theme.primary) }}
            >
              <Mail size={13} /> Découvrir Evenn
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

/* --------------------------------- Render -------------------------------- */

function RenderSection({
  section,
  theme,
  context,
  compact,
}: {
  section: SiteSection;
  theme: ResolvedTheme;
  context: SiteRendererContext;
  compact: boolean;
}) {
  switch (section.type) {
    case "hero":
      return <Hero section={section} theme={theme} context={context} compact={compact} />;
    case "story":
      return <StorySection section={section} theme={theme} compact={compact} />;
    case "details":
      return <DetailsSection section={section} theme={theme} compact={compact} />;
    case "venue":
      return <VenueSection section={section} theme={theme} compact={compact} />;
    case "gallery":
      return <GallerySection section={section} theme={theme} compact={compact} />;
    case "program":
      return <ProgramSection section={section} theme={theme} compact={compact} />;
    case "faq":
      return <FaqSection section={section} theme={theme} compact={compact} />;
    case "quote":
      return <QuoteSection section={section} theme={theme} compact={compact} />;
    case "tickets":
    case "contest":
    case "rsvp":
    case "guestbook":
    case "cta":
      return <ActionSection section={section} theme={theme} compact={compact} />;
    case "custom_details":
      return <CustomDetailsSection section={section} theme={theme} compact={compact} />;
    case "text":
      return <TextSection section={section} theme={theme} compact={compact} />;
    default:
      return null;
  }
}

/**
 * Garantit un texte d'introduction : si l'organisateur n'a pas encore rédigé
 * d'histoire, on affiche une introduction chaleureuse propre au type
 * d'événement (sans inventer de faits) plutôt qu'un site vide.
 */
function withStoryFallback(sections: SiteSection[], context: SiteRendererContext): SiteSection[] {
  if (!context.eventType) return sections;
  const story = sections.find((section) => section.type === "story");
  if (story && (sectionText(story, "heading") || sectionText(story, "body"))) return sections;

  const intro = SITE_INTRO[context.eventType];
  if (!intro) return sections;

  const fallback: SiteSection = {
    type: "story",
    content: { heading: EVENT_TYPE_META[context.eventType].storyHeading, body: intro },
    isVisible: true,
  };

  const rest = story ? sections.filter((section) => section !== story) : [...sections];
  const heroIndex = rest.findIndex((section) => section.type === "hero");
  rest.splice(heroIndex === -1 ? 0 : heroIndex + 1, 0, fallback);
  return rest;
}

/**
 * Rendu unique d'un site événementiel. Le site public l'utilise en pleine page
 * et le constructeur en version `compact` : le design de l'aperçu est donc
 * exactement celui qui sera publié.
 */
export default function SiteRenderer({ sections, theme, context, compact = false, chrome = true }: Props) {
  const visible = sections.filter((section) => section.isVisible !== false);
  const hasHero = visible.some((section) => section.type === "hero");
  const withHero = hasHero
    ? visible
    : [{ type: "hero", content: { title: context.name }, isVisible: true } as SiteSection, ...visible];
  const content = withStoryFallback(withHero, context);

  return (
    <div id={compact ? undefined : "top"} style={{ backgroundColor: theme.background, color: theme.text }}>
      {chrome ? <SiteHeader sections={content} theme={theme} context={context} compact={compact} /> : null}

      {content.map((section, index) => (
        <div
          key={`${section.type}-${index}`}
          id={compact || section.type === "hero" ? undefined : `section-${index}`}
          className={compact || section.type === "hero" ? undefined : "scroll-mt-20"}
        >
          <RenderSection section={section} theme={theme} context={context} compact={compact} />
        </div>
      ))}

      {chrome ? <SiteFooter sections={content} theme={theme} context={context} compact={compact} /> : null}
    </div>
  );
}
