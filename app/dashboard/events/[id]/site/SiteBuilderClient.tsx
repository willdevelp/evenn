"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Loader2,
  Mail,
  MessageCircle,
  Palette,
  PenLine,
  Sparkles,
  Wand2,
} from "lucide-react";

import CopyLinkButton from "@/src/components/dashboard/CopyLinkButton";
import SiteRenderer from "@/src/components/sites/site-renderer";
import { createEventSite } from "@/lib/actions/sites/create-event-site";
import {
  SITE_PALETTES,
  SITE_EVENT_FIELDS,
  EVENT_TYPE_META,
  type SitePalette,
  type SiteTemplateLayout,
} from "@/lib/sites/catalog";
import { resolvePreviewTheme } from "@/lib/sites/design";
import { buildTemplatePreview } from "@/lib/sites/preview";
import { getSiteUrl } from "@/lib/sites/url";
import type {
  CreatedEventSite,
  EventSiteContext,
  SiteEventSummary,
  SiteTemplateOption,
} from "@/lib/sites/types";

const LAYOUT_LABELS: Record<SiteTemplateLayout, string> = {
  centered: "Centré",
  split: "Deux colonnes",
  overlay: "Immersif",
  minimal: "Épuré",
};

const COLOR_FIELDS: Array<{ key: keyof SitePalette; label: string }> = [
  { key: "primaryColor", label: "Couleur principale" },
  { key: "accentColor", label: "Couleur d'accent" },
  { key: "backgroundColor", label: "Arrière-plan" },
  { key: "textColor", label: "Texte" },
];

function normalizeSubdomain(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63)
    .replace(/-+$/g, "");
}

function defaultSubdomain(slug: string, title: string): string {
  const candidate = normalizeSubdomain(slug || title) || "mon-evenement";
  return candidate.length >= 3 ? candidate : "mon-evenement";
}

function samePalette(a: SitePalette, b: SitePalette): boolean {
  return (
    a.primaryColor.toLowerCase() === b.primaryColor.toLowerCase() &&
    a.accentColor.toLowerCase() === b.accentColor.toLowerCase() &&
    a.backgroundColor.toLowerCase() === b.backgroundColor.toLowerCase() &&
    a.textColor.toLowerCase() === b.textColor.toLowerCase()
  );
}

function TemplateThumb({
  template,
  event,
}: {
  template: SiteTemplateOption;
  event: SiteEventSummary;
}) {
  const { sections, summary } = useMemo(
    () => buildTemplatePreview(template, event),
    [template, event],
  );
  const theme = useMemo(
    () => resolvePreviewTheme(template.palette, template.layout, template.key, template.eventType),
    [template],
  );

  return (
    <div className="relative h-40 overflow-hidden bg-slate-100">
      <div
        className="pointer-events-none absolute left-0 top-0 w-[720px] origin-top-left"
        style={{ transform: "scale(0.3)" }}
        aria-hidden="true"
      >
        <SiteRenderer
          compact
          sections={sections}
          theme={theme}
          context={{
            name: summary.title,
            eventType: template.eventType,
            eventTypeLabel: EVENT_TYPE_META[template.eventType].label,
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/60 to-transparent" />
    </div>
  );
}

function LivePreview({
  template,
  event,
  eventDetails,
  subdomain,
  palette,
  domainSuffix,
}: {
  template: SiteTemplateOption | null;
  event: SiteEventSummary;
  eventDetails: Record<string, string>;
  subdomain: string;
  palette: SitePalette;
  domainSuffix: string;
}) {
  const preview = useMemo(
    () => (template ? buildTemplatePreview(template, event, eventDetails) : null),
    [template, event, eventDetails],
  );
  const theme = useMemo(
    () =>
      resolvePreviewTheme(
        palette,
        template?.layout ?? "centered",
        template?.key ?? "event-centered",
        template?.eventType ?? null,
      ),
    [palette, template],
  );

  const url =
    subdomain.length >= 3
      ? getSiteUrl(subdomain).replace(/^https?:\/\//, "")
      : `${subdomain || "votre-site"}.${domainSuffix}`;

  if (!preview) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-500">
        Choisissez un modèle pour afficher l&apos;aperçu du site.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 flex-1 truncate rounded-md bg-white px-2 py-1 text-[11px] text-slate-500 ring-1 ring-slate-200">
          {url}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
        </span>
      </div>

      <div className="h-[540px] overflow-y-auto overscroll-contain bg-white">
        <SiteRenderer
          compact
          sections={preview.sections}
          theme={theme}
          context={{
            name: preview.summary.title,
            eventType: template?.eventType ?? null,
            eventTypeLabel: template ? EVENT_TYPE_META[template.eventType].label : "",
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-2.5 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Palette size={12} /> {template?.name ?? "Modèle"}
        </span>
        <span>{LAYOUT_LABELS[template?.layout ?? "centered"]}</span>
      </div>
    </div>
  );
}

export default function SiteBuilderClient({ context }: { context: EventSiteContext }) {
  const router = useRouter();
  const initialTemplate = context.templates[0];
  const [templateId, setTemplateId] = useState(initialTemplate?.id ?? "");
  const [palette, setPalette] = useState<SitePalette>(
    initialTemplate?.palette ?? SITE_PALETTES[0].palette,
  );
  const [subdomain, setSubdomain] = useState(() =>
    defaultSubdomain(context.event.slug, context.event.title),
  );
  const [eventDetails, setEventDetails] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedEventSite | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedTemplate = useMemo(
    () => context.templates.find((template) => template.id === templateId) ?? null,
    [context.templates, templateId],
  );

  const subdomainError = useMemo(() => {
    if (subdomain.length < 3) return "Le sous-domaine doit contenir au moins 3 caractères.";
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain)) {
      return "Utilisez uniquement des lettres minuscules, des chiffres et des tirets.";
    }
    return null;
  }, [subdomain]);

  const handleTemplateChange = (id: string) => {
    setTemplateId(id);
    setError(null);
    const template = context.templates.find((item) => item.id === id);
    if (template) setPalette(template.palette);
  };

  const handleSubmit = () => {
    if (!selectedTemplate || subdomainError) return;
    setError(null);

    startTransition(async () => {
      try {
        const result = await createEventSite({
          eventId: context.event.id,
          templateId: selectedTemplate.id,
          subdomain,
          theme: palette,
          eventDetails,
        });
        setCreated(result);
      } catch (submitError) {
        setError(
          submitError instanceof Error && submitError.message
            ? submitError.message
            : "Impossible de créer le site pour le moment. Réessayez.",
        );
      }
    });
  };

  if (created) {
    const emailBody = [
      "Bonjour,",
      "",
      `Découvrez le site de l'événement « ${context.event.title} » :`,
      created.url,
      "",
      "À très vite !",
    ].join("\n");
    const mailto = `mailto:?subject=${encodeURIComponent(`Site de ${context.event.title}`)}&body=${encodeURIComponent(emailBody)}`;
    const whatsapp = `https://wa.me/?text=${encodeURIComponent(`Découvrez le site de ${context.event.title} : ${created.url}`)}`;

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
            <CheckCircle2 size={32} />
          </span>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-emerald-950">
            Votre site est en ligne !
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-emerald-800">
            Le site « {created.templateName} » de {context.event.title} est publié. Partagez son
            adresse avec vos invités.
          </p>
          <a
            href={created.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <ExternalLink size={16} /> Ouvrir {created.subdomain}
          </a>
        </section>

        {context.eventType ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <PenLine size={19} />
              </span>
              <div>
                <h2 className="font-semibold text-slate-900">
                  Informations spécifiques — {context.eventTypeLabel}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ces détails facultatifs seront visibles sur le site public de l&apos;événement.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {SITE_EVENT_FIELDS[context.eventType].map((field) => (
                <label key={field.key} className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">{field.label}</span>
                  {field.multiline ? (
                    <textarea
                      value={eventDetails[field.key] ?? ""}
                      onChange={(event) =>
                        setEventDetails((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      placeholder={field.placeholder}
                      maxLength={1000}
                      rows={3}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                    />
                  ) : (
                    <input
                      value={eventDetails[field.key] ?? ""}
                      onChange={(event) =>
                        setEventDetails((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      placeholder={field.placeholder}
                      maxLength={1000}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                <Mail size={18} className="text-[#2563EB]" /> Envoyer le lien
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Partagez l&apos;adresse du site par email ou sur WhatsApp.
              </p>
            </div>
            <CopyLinkButton url={created.url} />
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {created.url}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={mailto}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
            >
              <Mail size={16} /> Envoyer par email
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <MessageCircle size={16} /> Partager sur WhatsApp
            </a>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Gérer le site <ArrowRight size={16} />
          </button>
          <Link
            href="/dashboard/sites"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Tous mes sites
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
              <Sparkles size={19} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Choisissez un modèle</h2>
              <p className="mt-1 text-sm text-slate-500">
                Trois modèles sont disponibles pour {context.eventTypeLabel?.toLowerCase()}.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {context.templates.map((template) => {
              const isSelected = template.id === templateId;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateChange(template.id)}
                  className={`overflow-hidden rounded-2xl border text-left transition ${
                    isSelected
                      ? "border-[#2563EB] ring-2 ring-[#2563EB]/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <TemplateThumb template={template} event={context.event} />
                  <div className="space-y-1 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900">{template.name}</span>
                      {isSelected ? <CheckCircle2 size={15} className="text-[#2563EB]" /> : null}
                    </div>
                    <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                      {template.description}
                    </p>
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                      {LAYOUT_LABELS[template.layout]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Wand2 size={19} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Personnalisez les couleurs</h2>
              <p className="mt-1 text-sm text-slate-500">
                Partez d&apos;une palette ou réglez chaque couleur précisément.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-4">
            {SITE_PALETTES.map((preset) => {
              const isSelected = samePalette(preset.palette, palette);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setPalette(preset.palette)}
                  className={`rounded-xl border p-2.5 text-left transition ${
                    isSelected
                      ? "border-[#2563EB] ring-2 ring-[#2563EB]/15"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  aria-label={preset.label}
                >
                  <span className="flex gap-1">
                    {[
                      preset.palette.primaryColor,
                      preset.palette.accentColor,
                      preset.palette.backgroundColor,
                      preset.palette.textColor,
                    ].map((color) => (
                      <span
                        key={color}
                        className="h-5 w-5 rounded-full border border-black/5"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                  <span className="mt-2 block text-xs font-medium text-slate-600">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {COLOR_FIELDS.map((field) => (
              <label
                key={field.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5"
              >
                <span className="text-sm font-medium text-slate-700">{field.label}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-slate-500">
                    {palette[field.key]}
                  </span>
                  <input
                    type="color"
                    value={palette[field.key]}
                    onChange={(event) =>
                      setPalette((current) => ({ ...current, [field.key]: event.target.value }))
                    }
                    className="h-8 w-8 cursor-pointer rounded-lg border border-slate-200 bg-white p-0.5"
                    aria-label={field.label}
                  />
                </span>
              </label>
            ))}
          </div>

          {selectedTemplate ? (
            <button
              type="button"
              onClick={() => setPalette(selectedTemplate.palette)}
              className="mt-4 text-xs font-semibold text-[#2563EB] hover:text-[#1d4ed8]"
            >
              Rétablir les couleurs du modèle {selectedTemplate.name}
            </button>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Globe2 size={19} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Réservez votre adresse</h2>
              <p className="mt-1 text-sm text-slate-500">
                Le site sera accessible sur ce sous-domaine, immédiatement après la création.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="subdomain" className="text-sm font-medium text-slate-700">
              Sous-domaine
            </label>
            <div
              className={`mt-2 flex overflow-hidden rounded-xl border bg-white ${
                subdomainError ? "border-red-300" : "border-slate-300"
              }`}
            >
              <input
                id="subdomain"
                value={subdomain}
                onChange={(event) => setSubdomain(normalizeSubdomain(event.target.value))}
                placeholder="mon-evenement"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 px-3 py-2.5 text-sm text-slate-900 outline-none"
              />
              <span className="flex items-center border-l border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
                .{context.domainSuffix}
              </span>
            </div>
            {subdomainError ? (
              <p className="mt-2 text-xs font-medium text-red-600">{subdomainError}</p>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Choisissez un nom court et facile à retenir, par exemple le prénom des mariés ou le
                nom du festival.
              </p>
            )}
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-sm text-slate-500">
            Un seul site par événement. Vous pourrez partager le lien dès sa création.
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedTemplate || Boolean(subdomainError) || isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
            {isPending ? "Création du site..." : "Publier mon site"}
          </button>
        </div>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
            Aperçu en direct
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Le design réel de votre site, rempli avec les informations de l&apos;événement.
            Les champs vides sont complétés par un contenu d&apos;exemple.
          </p>
        </div>
        <LivePreview
          template={selectedTemplate}
          event={context.event}
          eventDetails={eventDetails}
          subdomain={subdomain}
          palette={palette}
          domainSuffix={context.domainSuffix}
        />
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          Aperçu de démonstration : les informations non renseignées (description, lieu, visuel)
          sont remplacées par un exemple. Le site publié n&apos;affichera que vos vraies données.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          <p className="flex items-center gap-2 font-semibold text-slate-800">
            <Globe2 size={16} className="text-[#2563EB]" /> Adresse publique
          </p>
          <p className="mt-2 break-all text-xs text-slate-500">
            {subdomain.length >= 3 ? getSiteUrl(subdomain) : `https://${context.domainSuffix}`}
          </p>
          <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
            Le site contient vos informations, votre programme, la billetterie et les modules de
            confirmation adaptés à votre type d&apos;événement.
          </p>
        </div>
      </aside>
    </div>
  );
}
