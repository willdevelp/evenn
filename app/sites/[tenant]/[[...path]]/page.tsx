import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gift,
  Mail,
  MapPin,
  Music4,
  PenLine,
  Sparkles,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";

import { getPublishedSite, type PublishedSite, type SiteSection } from "@/lib/sites";
import type { SiteTemplateLayout } from "@/lib/sites/catalog";

export const dynamic = "force-dynamic"; // le contenu dépend du site demandé

type Props = { params: Promise<{ tenant: string; path?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant } = await params;
  const site = await getPublishedSite(decodeURIComponent(tenant));
  if (!site) return {};

  const title = site.seo.title ?? site.name;
  const description = site.seo.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: site.seo.image ? [site.seo.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: site.seo.image ? [site.seo.image] : undefined,
    },
  };
}

type Theme = {
  primary: string;
  accent: string;
  background: string;
  text: string;
  layout: SiteTemplateLayout;
};

function resolveTheme(site: PublishedSite): Theme {
  const templatePalette = site.template.schema.palette;
  return {
    primary: site.theme.primaryColor ?? templatePalette?.primaryColor ?? "#1d4ed8",
    accent: site.theme.accentColor ?? templatePalette?.accentColor ?? "#f59e0b",
    background: site.theme.backgroundColor ?? templatePalette?.backgroundColor ?? "#f8fafc",
    text: site.theme.textColor ?? templatePalette?.textColor ?? "#0f172a",
    layout: site.theme.layout ?? site.template.schema.layout ?? "centered",
  };
}

function alpha(hex: string, opacity: number): string {
  const value = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return `rgba(15, 23, 42, ${opacity})`;
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function text(section: SiteSection, key: string): string {
  const value = section.content[key];
  return typeof value === "string" ? value.trim() : "";
}

function safeHref(value: string): string {
  if (!value) return "#";
  if (/^https?:\/\//i.test(value) || /^mailto:/i.test(value) || /^tel:/i.test(value)) {
    return value;
  }
  if (value.startsWith("/") || value.startsWith("#")) return value;
  return "#";
}

function safeImage(value: string): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  return null;
}

function cssImage(url: string): string {
  return `url("${url.replace(/["\\]/g, "\\$&")}")`;
}

function formatBody(value: string): string[] {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

const NAV_LABELS: Record<string, string> = {
  story: "Notre histoire",
  details: "Informations",
  program: "Programme",
  gallery: "Galerie",
  tickets: "Billetterie",
  contest: "Candidats",
  rsvp: "Confirmation",
  guestbook: "Livre d'or",
  quote: "Hommage",
  cta: "Nous rejoindre",
};

function CtaButton({
  href,
  label,
  theme,
  variant = "solid",
}: {
  href: string;
  label: string;
  theme: Theme;
  variant?: "solid" | "light" | "outline";
}) {
  if (!label) return null;
  const style =
    variant === "light"
      ? { backgroundColor: "#ffffff", color: theme.primary }
      : variant === "outline"
        ? { border: `1px solid ${alpha(theme.text, 0.22)}`, color: theme.text }
        : { backgroundColor: theme.primary, color: "#ffffff" };

  return (
    <a
      href={safeHref(href)}
      className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      style={style}
    >
      {label} <ArrowRight size={16} />
    </a>
  );
}

function SectionHeading({
  eyebrow,
  heading,
  theme,
  align = "left",
}: {
  eyebrow?: string;
  heading: string;
  theme: Theme;
  align?: "left" | "center";
}) {
  if (!heading && !eyebrow) return null;
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow ? (
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
          style={{ backgroundColor: alpha(theme.accent, 0.16), color: theme.primary }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
          {eyebrow}
        </span>
      ) : null}
      <h2
        className="mt-3 text-2xl font-black tracking-tight sm:text-3xl"
        style={{ color: theme.primary }}
      >
        {heading}
      </h2>
    </div>
  );
}

function Hero({ section, theme }: { section: SiteSection; theme: Theme }) {
  const eyebrow = text(section, "eyebrow");
  const title = text(section, "title");
  const subtitle = text(section, "subtitle");
  const date = text(section, "date");
  const time = text(section, "time");
  const location = text(section, "location");
  const image = safeImage(text(section, "image"));
  const ctaLabel = text(section, "ctaLabel");
  const ctaHref = text(section, "ctaHref");

  const facts = [date, time, location].filter(Boolean);
  const isOverlay = theme.layout === "overlay";
  const isSplit = theme.layout === "split";
  const isMinimal = theme.layout === "minimal";

  const content = (
    <div className={isOverlay ? "text-white" : ""}>
      {eyebrow ? (
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={
            isOverlay
              ? { backgroundColor: "rgba(255,255,255,0.16)", color: "#fff" }
              : { backgroundColor: alpha(theme.accent, 0.16), color: theme.primary }
          }
        >
          <Sparkles size={13} />
          {eyebrow}
        </span>
      ) : null}

      <h1
        className={`mt-4 font-black tracking-tight ${
          isMinimal ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl lg:text-6xl"
        }`}
        style={isOverlay ? undefined : { color: theme.primary }}
      >
        {title}
      </h1>

      {subtitle ? (
        <p
          className={`mt-4 max-w-2xl text-base leading-7 sm:text-lg ${
            isOverlay ? "text-white/85" : ""
          }`}
          style={isOverlay ? undefined : { color: alpha(theme.text, 0.75) }}
        >
          {subtitle}
        </p>
      ) : null}

      {facts.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {facts.map((fact) => (
            <span
              key={fact}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={
                isOverlay
                  ? { backgroundColor: "rgba(255,255,255,0.16)", color: "#fff" }
                  : { backgroundColor: alpha(theme.primary, 0.08), color: theme.primary }
              }
            >
              <CheckCircle2 size={13} /> {fact}
            </span>
          ))}
        </div>
      ) : null}

      {ctaLabel ? (
        <div className="mt-7">
          <CtaButton
            href={ctaHref}
            label={ctaLabel}
            theme={theme}
            variant={isOverlay ? "light" : "solid"}
          />
        </div>
      ) : null}
    </div>
  );

  if (isOverlay) {
    return (
      <section
        className="relative flex min-h-[78vh] items-end overflow-hidden"
        style={{ backgroundColor: theme.primary }}
      >
        {image ? (
          <div
            className="absolute inset-0"
            role="img"
            aria-label={title}
            style={{
              backgroundImage: cssImage(image),
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">{content}</div>
      </section>
    );
  }

  return (
    <section
      className={isSplit ? "relative overflow-hidden" : "relative overflow-hidden"}
      style={{
        backgroundColor: isMinimal ? theme.background : alpha(theme.primary, 0.04),
      }}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: alpha(theme.accent, 0.22) }}
      />
      <div
        className={`relative mx-auto w-full max-w-6xl px-5 sm:px-8 ${
          isMinimal ? "py-14 sm:py-20" : "py-16 sm:py-24"
        } ${isSplit ? "grid gap-10 lg:grid-cols-2 lg:items-center" : ""}`}
      >
        <div className={isSplit ? "order-2 lg:order-1" : isMinimal ? "" : "mx-auto max-w-3xl text-center"}>
          {content}
          <div className={isMinimal || !image ? "hidden" : "mt-8 flex justify-center"}>
            <div
              className="h-1 w-16 rounded-full"
              style={{ backgroundColor: theme.accent }}
            />
          </div>
        </div>

        {isSplit && image ? (
          <div
            className="order-1 h-64 rounded-[2rem] shadow-2xl lg:order-2 lg:h-[420px]"
            role="img"
            aria-label={title}
            style={{
              backgroundImage: cssImage(image),
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: `6px solid ${theme.background}`,
            }}
          />
        ) : null}

        {!isSplit && image ? (
          <div
            className="mt-10 h-56 rounded-[2rem] shadow-xl sm:h-80"
            role="img"
            aria-label={title}
            style={{
              backgroundImage: cssImage(image),
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: `6px solid ${theme.background}`,
            }}
          />
        ) : null}
      </div>
    </section>
  );
}

function StorySection({ section, theme }: { section: SiteSection; theme: Theme }) {
  const heading = text(section, "heading");
  const body = formatBody(text(section, "body"));
  if (!heading && body.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <SectionHeading eyebrow="À propos" heading={heading} theme={theme} align="center" />
      <div className="mt-6 space-y-4 text-base leading-8" style={{ color: alpha(theme.text, 0.78) }}>
        {body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="mx-auto mt-8 h-1 w-16 rounded-full" style={{ backgroundColor: theme.accent }} />
    </section>
  );
}

function DetailsSection({ section, theme }: { section: SiteSection; theme: Theme }) {
  const heading = text(section, "heading");
  const date = text(section, "date");
  const time = text(section, "time");
  const venue = text(section, "venue");
  const address = text(section, "address");
  const city = text(section, "city");

  const cards = [
    { label: "Date", value: date, icon: CalendarDays },
    { label: "Heure", value: time, icon: Clock3 },
    { label: "Lieu", value: venue, icon: MapPin },
    { label: "Adresse", value: [address, city].filter(Boolean).join(", "), icon: MapPin },
  ].filter((item) => item.value);

  if (cards.length === 0) return null;

  return (
    <section
      className="w-full py-14 sm:py-20"
      style={{ backgroundColor: alpha(theme.primary, 0.05) }}
    >
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <SectionHeading eyebrow="Pratique" heading={heading} theme={theme} align="center" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl p-5 shadow-sm"
              style={{ backgroundColor: theme.background }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: alpha(theme.accent, 0.18), color: theme.primary }}
              >
                <Icon size={18} />
              </span>
              <p
                className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em]"
                style={{ color: alpha(theme.text, 0.45) }}
              >
                {label}
              </p>
              <p className="mt-1 text-sm font-semibold leading-6" style={{ color: theme.text }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ section, theme }: { section: SiteSection; theme: Theme }) {
  const heading = text(section, "heading") || "Galerie";
  const raw = section.content.images;
  const images: string[] = Array.isArray(raw)
    ? raw.filter((item): item is string => typeof item === "string")
    : [];
  const single = safeImage(text(section, "image"));
  if (single) images.unshift(single);
  const unique = Array.from(new Set(images.filter((image) => safeImage(image))));
  if (unique.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <SectionHeading eyebrow="Souvenirs" heading={heading} theme={theme} align="center" />
      <div className={`mt-8 grid gap-3 ${unique.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {unique.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="h-64 rounded-[1.75rem] shadow-lg sm:h-80"
            role="img"
            aria-label={`Photo ${index + 1}`}
            style={{
              backgroundImage: cssImage(image),
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: `5px solid ${theme.background}`,
            }}
          />
        ))}
      </div>
    </section>
  );
}

function ActionCard({
  section,
  theme,
  eyebrow,
  icon: Icon,
}: {
  section: SiteSection;
  theme: Theme;
  eyebrow: string;
  icon: typeof Ticket;
}) {
  const heading = text(section, "heading");
  const body = text(section, "body");
  const ctaLabel = text(section, "ctaLabel");
  const ctaHref = text(section, "ctaHref");
  if (!heading && !body) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <div
        className="overflow-hidden rounded-[2rem] p-7 shadow-xl sm:p-10"
        style={{
          backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${alpha(theme.primary, 0.86)})`,
          color: "#fff",
        }}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]">
              <Icon size={14} /> {eyebrow}
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">{heading}</h2>
            {body ? <p className="mt-2 text-sm leading-7 text-white/80 sm:text-base">{body}</p> : null}
          </div>
          {ctaLabel ? <CtaButton href={ctaHref} label={ctaLabel} theme={theme} variant="light" /> : null}
        </div>
      </div>
    </section>
  );
}

function ProgramSection({ section, theme }: { section: SiteSection; theme: Theme }) {
  const heading = text(section, "heading") || "Programme";
  const body = text(section, "body");
  const steps = body
    .split(/\s+—\s+|\n+/)
    .map((step) => step.trim())
    .filter(Boolean);
  if (steps.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <SectionHeading eyebrow="Déroulé" heading={heading} theme={theme} align="center" />
      <ol className="mt-8 space-y-3">
        {steps.map((step, index) => (
          <li
            key={`${step}-${index}`}
            className="flex items-start gap-4 rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: alpha(theme.primary, 0.05) }}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
              style={{ backgroundColor: theme.accent }}
            >
              {index + 1}
            </span>
            <p className="pt-1.5 text-sm font-semibold leading-6" style={{ color: theme.text }}>
              {step}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function QuoteSection({ section, theme }: { section: SiteSection; theme: Theme }) {
  const quote = text(section, "text");
  const author = text(section, "author");
  if (!quote) return null;

  return (
    <section
      className="w-full py-14 sm:py-20"
      style={{ backgroundColor: alpha(theme.primary, 0.06) }}
    >
      <figure className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <span className="text-5xl font-black leading-none" style={{ color: theme.accent }}>
          “
        </span>
        <blockquote
          className="mt-2 text-2xl font-semibold leading-9 sm:text-3xl sm:leading-10"
          style={{ color: theme.primary }}
        >
          {quote}
        </blockquote>
        {author ? (
          <figcaption
            className="mt-4 text-xs font-bold uppercase tracking-[0.18em]"
            style={{ color: alpha(theme.text, 0.5) }}
          >
            {author}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}

function GenericTextSection({ section, theme }: { section: SiteSection; theme: Theme }) {
  const heading = text(section, "heading");
  const body = formatBody(text(section, "body"));
  if (!heading && body.length === 0) return null;
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
      <SectionHeading heading={heading} theme={theme} />
      <div className="mt-4 space-y-3 text-base leading-8" style={{ color: alpha(theme.text, 0.78) }}>
        {body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function FinalCta({ section, theme }: { section: SiteSection; theme: Theme }) {
  const heading = text(section, "heading");
  const body = text(section, "body");
  const ctaLabel = text(section, "ctaLabel");
  const ctaHref = text(section, "ctaHref");
  if (!heading && !body) return null;

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <div
        className="rounded-[2rem] p-8 text-center shadow-xl sm:p-12"
        style={{
          backgroundColor: theme.accent,
          color: theme.text,
          backgroundImage: `radial-gradient(circle at 20% 20%, ${alpha("#ffffff", 0.35)}, transparent 55%)`,
        }}
      >
        <h2 className="text-2xl font-black tracking-tight sm:text-4xl" style={{ color: theme.text }}>
          {heading}
        </h2>
        {body ? (
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 sm:text-base" style={{ color: alpha(theme.text, 0.8) }}>
            {body}
          </p>
        ) : null}
        {ctaLabel ? (
          <div className="mt-6 flex justify-center">
            <a
              href={safeHref(ctaHref)}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-lg transition hover:-translate-y-0.5"
              style={{ backgroundColor: theme.primary, color: "#ffffff" }}
            >
              {ctaLabel} <ArrowRight size={16} />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function RenderSection({ section, theme }: { section: SiteSection; theme: Theme }) {
  switch (section.type) {
    case "hero":
      return <Hero section={section} theme={theme} />;
    case "story":
      return <StorySection section={section} theme={theme} />;
    case "details":
      return <DetailsSection section={section} theme={theme} />;
    case "gallery":
      return <GallerySection section={section} theme={theme} />;
    case "tickets":
      return <ActionCard section={section} theme={theme} eyebrow="Billetterie" icon={Ticket} />;
    case "contest":
      return <ActionCard section={section} theme={theme} eyebrow="Concours" icon={Trophy} />;
    case "rsvp":
      return <ActionCard section={section} theme={theme} eyebrow="Présence" icon={Users} />;
    case "guestbook":
      return <ActionCard section={section} theme={theme} eyebrow="Livre d'or" icon={PenLine} />;
    case "program":
      return <ProgramSection section={section} theme={theme} />;
    case "quote":
      return <QuoteSection section={section} theme={theme} />;
    case "cta":
      return <FinalCta section={section} theme={theme} />;
    case "text":
      return <GenericTextSection section={section} theme={theme} />;
    default:
      return null;
  }
}

function SectionIcon({ type }: { type: string }) {
  if (type === "tickets") return <Ticket size={13} />;
  if (type === "contest") return <Trophy size={13} />;
  if (type === "rsvp") return <Users size={13} />;
  if (type === "guestbook") return <PenLine size={13} />;
  if (type === "program") return <Music4 size={13} />;
  if (type === "gallery") return <Gift size={13} />;
  return <Sparkles size={13} />;
}

export default async function SitePage({ params }: Props) {
  const { tenant, path } = await params;
  const site = await getPublishedSite(decodeURIComponent(tenant));
  if (!site) notFound();

  const pathname = "/" + (path ?? []).join("/");
  const page = site.snapshot.pages.find((p) => p.path === pathname);
  if (!page) notFound();

  const theme = resolveTheme(site);
  const visibleSections = page.sections.filter((section) => section.isVisible !== false);
  const navSections = visibleSections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => section.type !== "hero" && NAV_LABELS[section.type])
    .slice(0, 4);
  const appUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const contactSection = visibleSections.find(
    (section) => section.type === "rsvp" || section.type === "tickets" || section.type === "cta",
  );
  const contactHref = contactSection ? text(contactSection, "ctaHref") : "";
  const contactLabel = contactSection ? text(contactSection, "ctaLabel") : "";

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <header
        className="sticky top-0 z-30 border-b backdrop-blur"
        style={{
          borderColor: alpha(theme.text, 0.08),
          backgroundColor: alpha(theme.background, 0.86),
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-sm"
              style={{ backgroundColor: theme.primary }}
            >
              {site.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate text-sm font-bold" style={{ color: theme.primary }}>
              {site.name}
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {navSections.map(({ section, index }) => (
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

          {contactLabel ? (
            <a
              href={safeHref(contactHref)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: theme.primary }}
            >
              {contactLabel} <ArrowRight size={14} />
            </a>
          ) : null}
        </div>
      </header>

      <div id="top">
        {visibleSections.map((section, index) => {
          if (section.type === "hero") {
            return <RenderSection key={`${section.type}-${index}`} section={section} theme={theme} />;
          }
          return (
            <div key={`${section.type}-${index}`} id={`section-${index}`} className="scroll-mt-16">
              <RenderSection section={section} theme={theme} />
            </div>
          );
        })}
      </div>

      <footer style={{ backgroundColor: alpha(theme.text, 0.04) }}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm font-bold" style={{ color: theme.primary }}>
              {site.name}
            </p>
            <p className="mt-1 text-xs" style={{ color: alpha(theme.text, 0.5) }}>
              Site officiel de l&apos;événement, créé avec Evenn.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {contactSection ? (
              <a
                href={safeHref(contactHref)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold"
                style={{ backgroundColor: alpha(theme.primary, 0.1), color: theme.primary }}
              >
                <SectionIcon type={contactSection.type} />
                {contactLabel || "Participer"}
              </a>
            ) : null}
            <a
              href={appUrl}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold"
              style={{ backgroundColor: theme.primary, color: "#ffffff" }}
            >
              <Mail size={13} /> Découvrir Evenn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
