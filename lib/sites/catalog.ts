/**
 * Catalogue des modèles de sites événementiels.
 *
 * Le schéma Supabase ne possède que quelques valeurs dans l'enum
 * `template_kind` (event, wedding, association...). Les sept types
 * d'événements pris en charge par les sites personnalisés sont donc portés
 * par `schema.eventType`, tandis que `kind` reste compatible avec l'enum :
 *   - mariage                         -> wedding
 *   - concours, baptême, deuil, ...   -> event
 *
 * Chaque type possède exactement trois modèles dans ce catalogue.
 */

export const SITE_EVENT_TYPES = [
  "wedding",
  "contest",
  "baptism",
  "funeral",
  "birthday",
  "training",
  "festival",
] as const;

export type SiteEventType = (typeof SITE_EVENT_TYPES)[number];

export type SitePalette = {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
};

export type SiteTemplateLayout = "centered" | "split" | "overlay" | "minimal";

export type SiteSectionTemplate = {
  type: string;
  content: Record<string, unknown>;
};

export type SiteTemplateDefinition = {
  key: string;
  name: string;
  eventType: SiteEventType;
  kind: "event" | "wedding";
  description: string;
  variant: string;
  layout: SiteTemplateLayout;
  palette: SitePalette;
  sections: SiteSectionTemplate[];
};

type EventTypeMeta = {
  label: string;
  categorySlugs: string[];
  tagline: string;
  storyHeading: string;
  detailsHeading: string;
  ctaLabel: string;
  ctaHeading: string;
  ctaBody: string;
  program?: string;
  quote?: string;
};

export const EVENT_TYPE_META: Record<SiteEventType, EventTypeMeta> = {
  wedding: {
    label: "Mariage",
    categorySlugs: ["mariage", "wedding"],
    tagline: "Deux cœurs, une histoire, un jour inoubliable.",
    storyHeading: "Notre histoire",
    detailsHeading: "Informations pratiques",
    ctaLabel: "Réserver ma place",
    ctaHeading: "Nous avons hâte de célébrer avec vous",
    ctaBody: "Retrouvez toutes les informations et réservez votre place en ligne.",
  },
  contest: {
    label: "Concours",
    categorySlugs: ["concours", "contest"],
    tagline: "Le talent mérite une scène. Le public choisit son champion.",
    storyHeading: "À propos du concours",
    detailsHeading: "Infos pratiques",
    ctaLabel: "Voir le concours",
    ctaHeading: "Soutenez votre candidat favori",
    ctaBody: "Découvrez les candidats, votez et suivez le classement en direct.",
  },
  baptism: {
    label: "Baptême",
    categorySlugs: ["bapteme", "baptême", "baptism"],
    tagline: "Un nouveau départ à célébrer entouré de ceux que l'on aime.",
    storyHeading: "Une journée bénie",
    detailsHeading: "Informations pratiques",
    ctaLabel: "Confirmer ma présence",
    ctaHeading: "Merci de partager ce moment avec nous",
    ctaBody: "Confirmez votre présence et retrouvez le lieu, l'heure et les détails de la cérémonie.",
  },
  funeral: {
    label: "Deuil",
    categorySlugs: ["deuil", "funeral", "obseques", "obsèques"],
    tagline: "Un espace de recueillement et de souvenirs partagés.",
    storyHeading: "En sa mémoire",
    detailsHeading: "Cérémonie",
    ctaLabel: "Laisser un message",
    ctaHeading: "Votre soutien nous touche",
    ctaBody: "Consultez les informations de la cérémonie et partagez un message de soutien.",
  },
  birthday: {
    label: "Anniversaire",
    categorySlugs: ["anniversaire", "birthday"],
    tagline: "Une année de plus, une fête de plus, des souvenirs pour longtemps.",
    storyHeading: "La fête se prépare",
    detailsHeading: "Quand et où ?",
    ctaLabel: "Réviser mon invitation",
    ctaHeading: "Venez nombreux faire la fête",
    ctaBody: "Confirmez votre présence et retrouvez le programme de la journée.",
  },
  training: {
    label: "Formation",
    categorySlugs: ["formation", "training"],
    tagline: "Apprendre, pratiquer et repartir avec des compétences concrètes.",
    storyHeading: "À propos de la formation",
    detailsHeading: "Infos pratiques",
    ctaLabel: "S'inscrire à la formation",
    ctaHeading: "Prêt à monter en compétences ?",
    ctaBody: "Réservez votre place et retrouvez le programme détaillé de la formation.",
    program:
      "Accueil et présentation — Ateliers pratiques — Études de cas — Questions / réponses — Remise des attestations.",
  },
  festival: {
    label: "Festival",
    categorySlugs: ["festival"],
    tagline: "Des sons, des rencontres et une énergie qui vous transporte.",
    storyHeading: "Le festival",
    detailsHeading: "Infos pratiques",
    ctaLabel: "Prendre mes billets",
    ctaHeading: "La scène vous attend",
    ctaBody: "Découvrez la programmation et réservez votre pass pour vivre l'expérience en entier.",
    program:
      "Ouverture des portes — Premières parties — Scène principale — DJ set de clôture.",
  },
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Déduit le type de site à partir du slug ou du nom de la catégorie de
 * l'événement. Seuls les sept types du catalogue sont reconnus.
 */
export function resolveSiteEventType(
  ...values: Array<string | null | undefined>
): SiteEventType | null {
  const mapping: Record<string, SiteEventType> = {
    mariage: "wedding",
    wedding: "wedding",
    concours: "contest",
    contest: "contest",
    bapteme: "baptism",
    baptism: "baptism",
    deuil: "funeral",
    funeral: "funeral",
    obseques: "funeral",
    anniversaire: "birthday",
    birthday: "birthday",
    formation: "training",
    training: "training",
    festival: "festival",
  };

  for (const value of values) {
    if (!value) continue;
    const normalized = normalize(value);
    if (!normalized) continue;
    if (mapping[normalized]) return mapping[normalized];

    for (const [needle, type] of Object.entries(mapping)) {
      if (normalized.includes(needle)) return type;
    }
  }

  return null;
}

export const SITE_PALETTES: Array<{ id: string; label: string; palette: SitePalette }> = [
  {
    id: "royal",
    label: "Bleu royal",
    palette: {
      primaryColor: "#1d4ed8",
      accentColor: "#f59e0b",
      backgroundColor: "#f8fafc",
      textColor: "#0f172a",
    },
  },
  {
    id: "ivoire",
    label: "Ivoire & or",
    palette: {
      primaryColor: "#8a6a2f",
      accentColor: "#d4af37",
      backgroundColor: "#fffaf0",
      textColor: "#2f2415",
    },
  },
  {
    id: "rose",
    label: "Rose poudré",
    palette: {
      primaryColor: "#be185d",
      accentColor: "#f9a8d4",
      backgroundColor: "#fff7fb",
      textColor: "#3f1728",
    },
  },
  {
    id: "emeraude",
    label: "Émeraude",
    palette: {
      primaryColor: "#047857",
      accentColor: "#fbbf24",
      backgroundColor: "#f3fbf6",
      textColor: "#052e22",
    },
  },
  {
    id: "ocean",
    label: "Océan",
    palette: {
      primaryColor: "#0e7490",
      accentColor: "#22d3ee",
      backgroundColor: "#f0fdfa",
      textColor: "#083344",
    },
  },
  {
    id: "sunset",
    label: "Coucher de soleil",
    palette: {
      primaryColor: "#c2410c",
      accentColor: "#fb923c",
      backgroundColor: "#fff7ed",
      textColor: "#431407",
    },
  },
  {
    id: "nuit",
    label: "Nuit profonde",
    palette: {
      primaryColor: "#7c3aed",
      accentColor: "#facc15",
      backgroundColor: "#0f0b1e",
      textColor: "#f8fafc",
    },
  },
  {
    id: "lavande",
    label: "Lavande",
    palette: {
      primaryColor: "#6d28d9",
      accentColor: "#c4b5fd",
      backgroundColor: "#faf5ff",
      textColor: "#2e1065",
    },
  },
];

type VariantDefinition = {
  key: string;
  name: string;
  description: string;
  layout: SiteTemplateLayout;
  palette: SitePalette;
};

const VARIANTS: Record<SiteEventType, VariantDefinition[]> = {
  wedding: [
    {
      key: "elegance",
      name: "Élégance",
      description: "Une mise en page raffinée, centrée et intemporelle.",
      layout: "centered",
      palette: SITE_PALETTES[1].palette,
    },
    {
      key: "boheme",
      name: "Bohème",
      description: "Des tons chaleureux et une présentation en pleine largeur.",
      layout: "split",
      palette: SITE_PALETTES[2].palette,
    },
    {
      key: "royal",
      name: "Royal",
      description: "Un hero immersif avec une ambiance nocturne et dorée.",
      layout: "overlay",
      palette: SITE_PALETTES[6].palette,
    },
  ],
  contest: [
    {
      key: "scene",
      name: "Scène",
      description: "Un modèle énergique qui met les candidats en avant.",
      layout: "overlay",
      palette: SITE_PALETTES[6].palette,
    },
    {
      key: "podium",
      name: "Podium",
      description: "Une présentation dynamique pour les concours et votes.",
      layout: "split",
      palette: SITE_PALETTES[0].palette,
    },
    {
      key: "studio",
      name: "Studio",
      description: "Un design moderne et épuré pour les concours créatifs.",
      layout: "minimal",
      palette: SITE_PALETTES[4].palette,
    },
  ],
  baptism: [
    {
      key: "celeste",
      name: "Céleste",
      description: "Une ambiance douce et lumineuse pour un jour béni.",
      layout: "centered",
      palette: SITE_PALETTES[4].palette,
    },
    {
      key: "pastel",
      name: "Pastel",
      description: "Des couleurs tendres et une présentation aérée.",
      layout: "split",
      palette: SITE_PALETTES[7].palette,
    },
    {
      key: "lumiere",
      name: "Lumière",
      description: "Un rendu chaleureux et intime, centré sur l'émotion.",
      layout: "minimal",
      palette: SITE_PALETTES[1].palette,
    },
  ],
  funeral: [
    {
      key: "hommage",
      name: "Hommage",
      description: "Un espace sobre et digne pour recueillir les souvenirs.",
      layout: "centered",
      palette: SITE_PALETTES[5].palette,
    },
    {
      key: "serenite",
      name: "Sérénité",
      description: "Une présentation calme, douce et respectueuse.",
      layout: "minimal",
      palette: SITE_PALETTES[4].palette,
    },
    {
      key: "souvenir",
      name: "Souvenir",
      description: "Un modèle sombre et apaisant pour un dernier hommage.",
      layout: "overlay",
      palette: SITE_PALETTES[6].palette,
    },
  ],
  birthday: [
    {
      key: "confettis",
      name: "Confettis",
      description: "Des couleurs pétillantes pour une fête mémorable.",
      layout: "split",
      palette: SITE_PALETTES[2].palette,
    },
    {
      key: "neon",
      name: "Néon",
      description: "Une ambiance lumineuse et festive, parfaite pour la nuit.",
      layout: "overlay",
      palette: SITE_PALETTES[6].palette,
    },
    {
      key: "douceur",
      name: "Douceur",
      description: "Un modèle tendre et chaleureux pour un anniversaire intime.",
      layout: "centered",
      palette: SITE_PALETTES[5].palette,
    },
  ],
  training: [
    {
      key: "academie",
      name: "Académie",
      description: "Un site structuré pour présenter un programme de formation.",
      layout: "split",
      palette: SITE_PALETTES[0].palette,
    },
    {
      key: "atelier",
      name: "Atelier",
      description: "Un rendu pratique et chaleureux, centré sur l'apprentissage.",
      layout: "minimal",
      palette: SITE_PALETTES[3].palette,
    },
    {
      key: "masterclass",
      name: "Masterclass",
      description: "Une présentation premium pour les formations d'exception.",
      layout: "centered",
      palette: SITE_PALETTES[7].palette,
    },
  ],
  festival: [
    {
      key: "afrobeat",
      name: "Afrobeat",
      description: "Des couleurs solaires et une énergie communicative.",
      layout: "overlay",
      palette: SITE_PALETTES[5].palette,
    },
    {
      key: "sunset",
      name: "Sunset",
      description: "Une ambiance chaleureuse pour les festivals en plein air.",
      layout: "split",
      palette: SITE_PALETTES[2].palette,
    },
    {
      key: "underground",
      name: "Underground",
      description: "Un design sombre et intense pour les scènes alternatives.",
      layout: "minimal",
      palette: SITE_PALETTES[6].palette,
    },
  ],
};

function buildSections(eventType: SiteEventType): SiteSectionTemplate[] {
  const meta = EVENT_TYPE_META[eventType];

  const hero: SiteSectionTemplate = {
    type: "hero",
    content: {
      eyebrow: "{{event.typeLabel}}",
      title: "{{event.title}}",
      subtitle: meta.tagline,
      date: "{{event.date}}",
      time: "{{event.time}}",
      location: "{{event.location}}",
      image: "{{event.coverUrl}}",
      ctaLabel: meta.ctaLabel,
      ctaHref: "{{event.publicUrl}}",
    },
  };

  const story: SiteSectionTemplate = {
    type: "story",
    content: {
      heading: meta.storyHeading,
      body: "{{event.description}}",
    },
  };

  const details: SiteSectionTemplate = {
    type: "details",
    content: {
      heading: meta.detailsHeading,
      date: "{{event.date}}",
      time: "{{event.time}}",
      venue: "{{event.venue}}",
      address: "{{event.address}}",
      city: "{{event.city}}",
    },
  };

  const gallery: SiteSectionTemplate = {
    type: "gallery",
    content: {
      heading: "Galerie",
      image: "{{event.coverUrl}}",
    },
  };

  const tickets: SiteSectionTemplate = {
    type: "tickets",
    content: {
      heading: "Billetterie",
      body: "Réservez votre place en quelques clics, directement en ligne.",
      ctaLabel: "Voir les billets",
      ctaHref: "{{event.publicUrl}}",
    },
  };

  const cta: SiteSectionTemplate = {
    type: "cta",
    content: {
      heading: meta.ctaHeading,
      body: meta.ctaBody,
      ctaLabel: meta.ctaLabel,
      ctaHref: "{{event.publicUrl}}",
    },
  };

  const program: SiteSectionTemplate = {
    type: "program",
    content: {
      heading: "Programme",
      body: meta.program ?? "",
    },
  };

  const quote: SiteSectionTemplate = {
    type: "quote",
    content: {
      text: "Ceux que nous aimons ne nous quittent jamais vraiment.",
      author: "En leur mémoire",
    },
  };

  const guestbook: SiteSectionTemplate = {
    type: "guestbook",
    content: {
      heading: "Livre d'or",
      body: "Partagez un message, un souvenir ou un mot de soutien.",
      ctaLabel: "Laisser un message",
      ctaHref: "{{event.publicUrl}}",
    },
  };

  const contest: SiteSectionTemplate = {
    type: "contest",
    content: {
      heading: "Les candidats",
      body: "Découvrez les talents en compétition et votez pour votre favori.",
      ctaLabel: "Voir les candidats",
      ctaHref: "{{event.publicUrl}}",
    },
  };

  const rsvp: SiteSectionTemplate = {
    type: "rsvp",
    content: {
      heading: "Confirmer ma présence",
      body: "Votre présence compte pour nous. Merci de confirmer votre venue.",
      ctaLabel: "Je confirme",
      ctaHref: "{{event.publicUrl}}",
    },
  };

  switch (eventType) {
    case "wedding":
      return [hero, story, details, gallery, rsvp, cta];
    case "contest":
      return [hero, story, contest, details, gallery, tickets, cta];
    case "baptism":
      return [hero, story, details, gallery, guestbook, cta];
    case "funeral":
      return [hero, quote, story, details, gallery, guestbook, cta];
    case "birthday":
      return [hero, story, details, gallery, tickets, cta];
    case "training":
      return [hero, story, program, details, tickets, cta];
    case "festival":
      return [hero, story, program, details, gallery, tickets, cta];
  }
}

export const SITE_TEMPLATES: SiteTemplateDefinition[] = SITE_EVENT_TYPES.flatMap((eventType) =>
  VARIANTS[eventType].map((variant) => ({
    key: `${eventType}-${variant.key}`,
    name: variant.name,
    eventType,
    kind: eventType === "wedding" ? "wedding" : "event",
    description: variant.description,
    variant: variant.key,
    layout: variant.layout,
    palette: variant.palette,
    sections: buildSections(eventType),
  })),
);

export const SITE_TEMPLATE_BY_KEY = new Map(SITE_TEMPLATES.map((template) => [template.key, template]));

export function getEventTypeMeta(eventType: SiteEventType): EventTypeMeta {
  return EVENT_TYPE_META[eventType];
}
