"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Building2,
  Globe,
  Image as ImageIcon,
  Loader2,
  BadgeCheck,
  Clock,
  ShieldAlert,
  Save,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import { getOrganization, type OrganizationProfile } from "@/lib/actions/organizations/get-organization";
import { isSlugAvailable, updateOrganization } from "@/lib/actions/organizations/update-organization";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const COUNTRIES = [
  { code: "CM", label: "Cameroun" },
  { code: "CI", label: "Côte d'Ivoire" },
  { code: "SN", label: "Sénégal" },
  { code: "GA", label: "Gabon" },
  { code: "CD", label: "Congo (RDC)" },
  { code: "TD", label: "Tchad" },
  { code: "FR", label: "France" },
  { code: "BE", label: "Belgique" },
  { code: "CA", label: "Canada" },
  { code: "US", label: "États-Unis" },
];

const SOCIAL_FIELDS = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/votre-page" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/votre-compte" },
  { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/votre-compte" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/vous" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@votre-chaine" },
] as const;

type SocialKey = (typeof SOCIAL_FIELDS)[number]["key"];

type FormState = {
  name: string;
  slug: string;
  description: string;
  website_url: string;
  country_code: string;
  logo_url: string;
  social_links: Record<SocialKey, string>;
};

const EMPTY_SOCIAL: Record<SocialKey, string> = {
  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
  youtube: "",
};

/** Badge de vérification : statut piloté par la plateforme, jamais éditable. */
function VerificationBadge({ status }: { status: OrganizationProfile["verification_status"] }) {
  const config = {
    verified: {
      icon: BadgeCheck,
      label: "Organisation vérifiée",
      className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    },
    pending: {
      icon: Clock,
      label: "Vérification en attente",
      className: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    },
    rejected: {
      icon: ShieldAlert,
      label: "Vérification refusée",
      className: "bg-red-50 text-red-700 ring-1 ring-red-100",
    },
    unverified: {
      icon: ShieldAlert,
      label: "Non vérifiée",
      className: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

export default function SettingsPage() {
  const [organization, setOrganization] = useState<OrganizationProfile | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    description: "",
    website_url: "",
    country_code: "CM",
    logo_url: "",
    social_links: { ...EMPTY_SOCIAL },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [slugState, setSlugState] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [error, setError] = useState<string | null>(null);

  // Évite qu'une vérification de slug obsolète écrase un résultat plus récent.
  const slugRequestId = useRef(0);

  useEffect(() => {
    let active = true;

    getOrganization()
      .then((data) => {
        if (!active) return;
        setOrganization(data);
        setForm({
          name: data.name,
          slug: data.slug,
          description: data.description ?? "",
          website_url: data.website_url ?? "",
          country_code: data.country_code || "CM",
          logo_url: data.logo_url ?? "",
          social_links: { ...EMPTY_SOCIAL, ...data.social_links },
        });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Impossible de charger l'organisation.";
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const canEdit = organization?.can_edit ?? false;

  /** Vérifie la disponibilité du slug, avec un léger debounce. */
  const checkSlug = useCallback(
    (value: string) => {
      const requestId = ++slugRequestId.current;
      const candidate = value.trim().toLowerCase();

      if (!candidate || candidate === organization?.slug) {
        setSlugState("idle");
        return;
      }

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate)) {
        setSlugState("taken");
        return;
      }

      setSlugState("checking");
      const timer = setTimeout(async () => {
        try {
          const available = await isSlugAvailable(candidate);
          if (slugRequestId.current === requestId) {
            setSlugState(available ? "available" : "taken");
          }
        } catch {
          if (slugRequestId.current === requestId) setSlugState("idle");
        }
      }, 400);

      return () => clearTimeout(timer);
    },
    [organization?.slug],
  );

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setForm((current) => ({ ...current, logo_url: url }));
      toast.success("Logo téléversé.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec du téléchargement du logo.");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canEdit) {
      toast.error("Vous n'avez pas les droits pour modifier cette organisation.");
      return;
    }
    if (slugState === "taken") {
      toast.error("Cet identifiant n'est pas disponible.");
      return;
    }

    setSaving(true);
    try {
      await updateOrganization({
        name: form.name,
        slug: form.slug,
        description: form.description,
        logo_url: form.logo_url,
        website_url: form.website_url,
        country_code: form.country_code,
        social_links: form.social_links,
      });

      // On resynchronise l'affichage avec ce qui a réellement été enregistré.
      setForm((current) => ({
        ...current,
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
      }));
      setSlugState("idle");
      toast.success("Informations de l'organisation enregistrées !");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10 disabled:cursor-not-allowed disabled:opacity-60";

  if (loading) {
    return (
      <DashboardShell title="Paramètres" description="Informations de votre organisation.">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-16 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" />
          Chargement de l&apos;organisation…
        </div>
      </DashboardShell>
    );
  }

  if (error || !organization) {
    return (
      <DashboardShell title="Paramètres" description="Informations de votre organisation.">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
          {error ?? "Organisation introuvable."}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Paramètres"
      description="Informations publiques de votre organisation."
    >
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl space-y-5">
        {/* En-tête : logo + nom + statut de vérification */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-7">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2563EB] via-indigo-500 to-violet-500" />
          <div className="flex flex-wrap items-center gap-5 pt-1">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 ring-4 ring-blue-50/70">
                {form.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.logo_url} alt="Logo de l'organisation" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-[#2563EB]">
                    {form.name.charAt(0).toUpperCase() || "O"}
                  </span>
                )}
                {uploadingLogo && (
                  <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" />
                  </span>
                )}
              </div>
              {canEdit && (
                <label
                  aria-label="Modifier le logo de l'organisation"
                  className="absolute -bottom-1 -right-1 cursor-pointer rounded-xl border-2 border-white bg-[#2563EB] p-2 text-white shadow-sm transition hover:bg-[#1d4ed8]"
                >
                  <ImageIcon className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={handleLogoChange}
                  />
                </label>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold text-slate-900">
                {form.name || "Organisation sans nom"}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Globe className="h-3.5 w-3.5" />
                <span className="truncate">/organizer/{form.slug || "…"}</span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <VerificationBadge status={organization.verification_status} />
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#2563EB]">
                {organization.role.toUpperCase()}
              </span>
            </div>
          </div>
        </section>

        {!canEdit && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            Votre rôle ({organization.role}) ne permet pas de modifier les informations de
            l&apos;organisation. Seuls les propriétaires et administrateurs peuvent le faire.
          </div>
        )}

        {/* Informations générales */}
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-7">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-[#2563EB]">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Informations générales</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ces informations apparaissent publiquement sur vos événements.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Nom de l&apos;organisation <span className="text-[#2563EB]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              required
              disabled={!canEdit}
              maxLength={120}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="Ex. : Evenza Productions"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Identifiant public <span className="text-[#2563EB]">*</span>
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.slug}
                  required
                  disabled={!canEdit}
                  maxLength={60}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    setForm({ ...form, slug: value });
                    checkSlug(value);
                  }}
                  className={`${inputClass} pl-10`}
                  placeholder="evenza-productions"
                />
              </div>
              <p className="mt-1.5 text-xs">
                {slugState === "checking" && <span className="text-slate-500">Vérification…</span>}
                {slugState === "available" && (
                  <span className="text-emerald-600">Identifiant disponible.</span>
                )}
                {slugState === "taken" && (
                  <span className="text-red-600">Identifiant invalide ou déjà utilisé.</span>
                )}
                {slugState === "idle" && (
                  <span className="text-slate-500">
                    Utilisé dans l&apos;adresse de votre page : /organizer/{form.slug || "…"}
                  </span>
                )}
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Pays</label>
              <select
                value={form.country_code}
                disabled={!canEdit}
                onChange={(e) => setForm({ ...form, country_code: e.target.value })}
                className={inputClass}
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={form.description}
              disabled={!canEdit}
              maxLength={2000}
              rows={4}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputClass} resize-y`}
              placeholder="Présentez votre organisation en quelques phrases."
            />
            <p className="mt-1.5 text-right text-xs text-slate-400">
              {form.description.length}/2000
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Site web</label>
            <input
              type="url"
              value={form.website_url}
              disabled={!canEdit}
              onChange={(e) => setForm({ ...form, website_url: e.target.value })}
              className={inputClass}
              placeholder="https://www.votre-site.com"
            />
          </div>
        </section>

        {/* Réseaux sociaux */}
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:p-7">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-[#2563EB]">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Réseaux sociaux</h2>
              <p className="mt-1 text-sm text-slate-500">
                Laissez vide les réseaux que vous n&apos;utilisez pas.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {SOCIAL_FIELDS.map((social) => (
              <div key={social.key}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {social.label}
                </label>
                <input
                  type="url"
                  value={form.social_links[social.key]}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      social_links: { ...form.social_links, [social.key]: e.target.value },
                    })
                  }
                  className={inputClass}
                  placeholder={social.placeholder}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Bouton */}
        {canEdit && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || uploadingLogo}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
          </div>
        )}
      </form>
    </DashboardShell>
  );
}
